import { prisma } from '../../config/db';
import { elasticClient } from '../../elastic/client';
import { normalizedSchemeSchema, NormalizedScheme } from './types';
import { ISourceAdapter } from './adapters/base.adapter';
import { MySchemeAdapter } from './adapters/myscheme.adapter';
import { DataGovAdapter } from './adapters/datagov.adapter';
import { KarnatakaAdapter } from './adapters/karnataka.adapter';
import { SeedAdapter } from './adapters/seed.adapter';
import { logger } from '../../utils/logger';
import { RagService } from '../rag/rag.service';
import crypto from 'crypto';

export class IngestionService {
  private adapters: ISourceAdapter[] = [
    new MySchemeAdapter(),
    new DataGovAdapter(),
    new KarnatakaAdapter(),
    new SeedAdapter()
  ];

  private generateChecksum(data: any): string {
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  private generateKeywords(data: NormalizedScheme): string[] {
    const textElements = [
      data.title,
      data.categoryName,
      data.ministry || '',
      data.benefits || '',
      data.state || '',
      ...data.secondaryCategories || [],
      ...data.eligibility.map(e => e.value)
    ];
    
    const combinedText = textElements.join(' ').toLowerCase();
    
    // Split by non-word characters and filter out small words
    const rawWords = combinedText.split(/\W+/);
    const stopWords = ['the', 'and', 'for', 'of', 'to', 'in', 'is', 'a', 'on', 'with', 'by'];
    const keywords = Array.from(new Set(rawWords.filter(word => word.length > 2 && !stopWords.includes(word))));
    
    return keywords;
  }

  async runPipeline() {
    logger.info('Starting Ingestion Pipeline');
    
    const startTime = Date.now();
    let processed = 0;
    let newSchemes = 0;
    let updatedSchemes = 0;
    let skipped = 0;
    let validationErrors = 0;
    let adapterErrors = 0;
    let esUpdates = 0;
    let qdrantUpdates = 0;

    for (const adapter of this.adapters) {
      try {
        const rawSchemes = await adapter.fetchSchemes();
        
        for (const raw of rawSchemes) {
          processed++;
          
          // Normalize & Validate
          const parseResult = normalizedSchemeSchema.safeParse(raw);
          if (!parseResult.success) {
            logger.error(`Validation failed for scheme from ${adapter.sourceName}:`, parseResult.error.format() as any);
            validationErrors++;
            continue;
          }

          const schemeData = parseResult.data;
          
          // Generate checksum and keywords
          const checksum = schemeData.checksum || this.generateChecksum(schemeData);
          const keywords = this.generateKeywords(schemeData);

          // Duplicate Detection based on externalId + sourceSystem
          const existing = await prisma.scheme.findUnique({
            where: {
              externalId_sourceSystem: {
                externalId: schemeData.externalId,
                sourceSystem: schemeData.sourceSystem
              }
            }
          });

          // Ensure category exists
          let category = await prisma.schemeCategory.findUnique({
            where: { name: schemeData.categoryName }
          });
          if (!category) {
            category = await prisma.schemeCategory.create({
              data: { name: schemeData.categoryName, description: 'Auto-created by ingestion pipeline' }
            });
          }

          let savedScheme;

          if (existing) {
            // Check if content actually changed
            if (existing.checksum === checksum) {
              logger.info(`Duplicate scheme detected without changes: ${schemeData.title} from ${schemeData.sourceSystem}. Skipping.`);
              
              // Still update lastFetched timestamp
              await prisma.scheme.update({
                where: { id: existing.id },
                data: { lastFetched: new Date() }
              });
              
              skipped++;
              continue;
            }

            logger.info(`Updated scheme detected: ${schemeData.title}. Updating DB and Vectors.`);
            // Update PostgreSQL
            savedScheme = await prisma.scheme.update({
              where: { id: existing.id },
              data: {
                title: schemeData.title,
                shortDescription: schemeData.shortDescription,
                description: schemeData.description,
                benefits: schemeData.benefits,
                applicationUrl: schemeData.applicationUrl,
                sourceUrl: schemeData.sourceUrl,
                checksum: checksum,
                ministry: schemeData.ministry,
                state: schemeData.state,
                language: schemeData.language,
                categoryId: category.id,
                governmentLevel: schemeData.governmentLevel,
                verificationStatus: schemeData.verificationStatus,
                secondaryCategories: schemeData.secondaryCategories,
                applicationProcess: schemeData.applicationProcess,
                faq: schemeData.faq ? (schemeData.faq as any) : undefined,
                keywords: keywords,
                lastVerified: schemeData.lastVerified,
                lastFetched: new Date(),
                lastUpdated: new Date(),
                eligibility: {
                  deleteMany: {}, // Clear existing and recreate
                  create: schemeData.eligibility
                },
                documents: {
                  deleteMany: {},
                  create: schemeData.requiredDocuments.map(name => ({ name }))
                }
              },
              include: { eligibility: true, documents: true, category: true }
            });
            updatedSchemes++;
          } else {
            logger.info(`New scheme detected: ${schemeData.title}. Inserting into DB and Vectors.`);
            // PostgreSQL Storage
            savedScheme = await prisma.scheme.create({
              data: {
                title: schemeData.title,
                shortDescription: schemeData.shortDescription,
                description: schemeData.description,
                benefits: schemeData.benefits,
                applicationUrl: schemeData.applicationUrl,
                externalId: schemeData.externalId,
                sourceSystem: schemeData.sourceSystem,
                sourceUrl: schemeData.sourceUrl,
                checksum: checksum,
                ministry: schemeData.ministry,
                state: schemeData.state,
                language: schemeData.language,
                categoryId: category.id,
                governmentLevel: schemeData.governmentLevel,
                verificationStatus: schemeData.verificationStatus,
                secondaryCategories: schemeData.secondaryCategories,
                applicationProcess: schemeData.applicationProcess,
                faq: schemeData.faq ? (schemeData.faq as any) : undefined,
                keywords: keywords,
                lastVerified: schemeData.lastVerified,
                lastFetched: new Date(),
                lastUpdated: new Date(),
                eligibility: {
                  create: schemeData.eligibility
                },
                documents: {
                  create: schemeData.requiredDocuments.map(name => ({ name }))
                }
              },
              include: { eligibility: true, documents: true, category: true }
            });
            newSchemes++;
          }

          // Elasticsearch Reindexing
          try {
            await elasticClient.index({
              index: 'schemes',
              id: savedScheme.id,
              document: {
                id: savedScheme.id,
                title: savedScheme.title,
                shortDescription: savedScheme.shortDescription,
                description: savedScheme.description,
                benefits: savedScheme.benefits,
                categoryId: savedScheme.categoryId,
                categoryName: savedScheme.category.name,
                secondaryCategories: savedScheme.secondaryCategories,
                state: savedScheme.state,
                governmentLevel: savedScheme.governmentLevel,
                verificationStatus: savedScheme.verificationStatus,
                applicationProcess: savedScheme.applicationProcess,
                keywords: savedScheme.keywords,
                ministry: savedScheme.ministry,
                language: savedScheme.language,
                isActive: savedScheme.isActive,
                createdAt: savedScheme.createdAt,
                eligibility: savedScheme.eligibility.map(e => ({
                  attribute: e.attribute,
                  operator: e.operator,
                  value: e.value
                }))
              }
            });
            esUpdates++;
          } catch (esError: any) {
            logger.error(`Failed to reindex scheme ${savedScheme.id} to Elasticsearch:`, { error: esError.message || esError });
          }

          // Qdrant Vectorization & Storage (Only happens for new or updated schemes)
          try {
             await RagService.embedAndStoreScheme(savedScheme);
             qdrantUpdates++;
          } catch (qdrantError: any) {
             logger.error(`Failed to vectorize scheme ${savedScheme.id} to Qdrant:`, { error: qdrantError.message || qdrantError });
          }
        }
      } catch (error: any) {
        logger.error(`Failed to ingest from adapter ${adapter.sourceName}:`, { error: error.message || error });
        adapterErrors++;
      }
    }

    const executionTimeMs = Date.now() - startTime;
    logger.info(`Ingestion Pipeline completed in ${executionTimeMs}ms. New: ${newSchemes}, Updated: ${updatedSchemes}, Skipped: ${skipped}`);
    
    return {
      processed,
      newSchemes,
      updatedSchemes,
      skipped,
      validationErrors,
      adapterErrors,
      esUpdates,
      qdrantUpdates,
      executionTimeMs
    };
  }
}
