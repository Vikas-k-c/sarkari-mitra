import { prisma } from '../../config/db';
import { elasticClient } from '../../elastic/client';
import { normalizedSchemeSchema, NormalizedScheme } from './types';
import { ISourceAdapter } from './adapters/base.adapter';
import { MySchemeAdapter } from './adapters/myscheme.adapter';
import { DataGovAdapter } from './adapters/datagov.adapter';
import { StatePortalAdapter } from './adapters/stateportal.adapter';
import { logger } from '../../utils/logger';
import { RagService } from '../rag/rag.service';

export class IngestionService {
  private adapters: ISourceAdapter[] = [
    new MySchemeAdapter(),
    new DataGovAdapter(),
    new StatePortalAdapter()
  ];

  async runPipeline() {
    logger.info('Starting Ingestion Pipeline');
    let processed = 0;
    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    for (const adapter of this.adapters) {
      try {
        const rawSchemes = await adapter.fetchSchemes();
        
        for (const raw of rawSchemes) {
          processed++;
          
          // Normalize & Validate
          const parseResult = normalizedSchemeSchema.safeParse(raw);
          if (!parseResult.success) {
            logger.error(`Validation failed for scheme from ${adapter.sourceName}:`, parseResult.error.format() as any);
            errors++;
            continue;
          }

          const schemeData = parseResult.data;

          // Duplicate Detection based on externalId + sourceSystem
          const existing = await prisma.scheme.findUnique({
            where: {
              externalId_sourceSystem: {
                externalId: schemeData.externalId,
                sourceSystem: schemeData.sourceSystem
              }
            }
          });

          if (existing) {
            logger.info(`Duplicate scheme detected: ${schemeData.title} from ${schemeData.sourceSystem}. Skipping.`);
            skipped++;
            continue;
          }

          // Ensure category exists
          let category = await prisma.schemeCategory.findUnique({
            where: { name: schemeData.categoryName }
          });
          if (!category) {
            category = await prisma.schemeCategory.create({
              data: { name: schemeData.categoryName, description: 'Auto-created by ingestion pipeline' }
            });
          }

          // PostgreSQL Storage
          const createdScheme = await prisma.scheme.create({
            data: {
              title: schemeData.title,
              description: schemeData.description,
              benefits: schemeData.benefits,
              applicationUrl: schemeData.applicationUrl,
              externalId: schemeData.externalId,
              sourceSystem: schemeData.sourceSystem,
              categoryId: category.id,
              eligibility: {
                create: schemeData.eligibility
              }
            },
            include: { eligibility: true, category: true }
          });

          // Elasticsearch Reindexing
          try {
            await elasticClient.index({
              index: 'schemes',
              id: createdScheme.id,
              document: {
                id: createdScheme.id,
                title: createdScheme.title,
                description: createdScheme.description,
                benefits: createdScheme.benefits,
                categoryId: createdScheme.categoryId,
                categoryName: createdScheme.category.name,
                state: undefined,
                isActive: createdScheme.isActive,
                createdAt: createdScheme.createdAt,
                eligibility: createdScheme.eligibility.map(e => ({
                  attribute: e.attribute,
                  operator: e.operator,
                  value: e.value
                }))
              }
            });
          } catch (esError: any) {
            logger.error(`Failed to reindex scheme ${createdScheme.id} to Elasticsearch:`, { error: esError.message || esError });
          }

          // Qdrant Vectorization & Storage
          await RagService.embedAndStoreScheme(createdScheme);

          inserted++;
        }
      } catch (error: any) {
        logger.error(`Failed to ingest from adapter ${adapter.sourceName}:`, { error: error.message || error });
        errors++;
      }
    }

    logger.info(`Ingestion Pipeline completed. Inserted: ${inserted}, Skipped: ${skipped}, Errors: ${errors}`);
    
    return {
      processed,
      inserted,
      skipped,
      errors
    };
  }
}
