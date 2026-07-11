import { Client, ClientOptions } from '@elastic/elasticsearch';
import { env } from '../config/env';

const clientOptions: ClientOptions = env.ELASTICSEARCH_CLOUD_ID 
  ? {
      cloud: { id: env.ELASTICSEARCH_CLOUD_ID },
      auth: { apiKey: env.ELASTICSEARCH_API_KEY! }
    }
  : {
      node: env.ELASTICSEARCH_NODE || 'http://localhost:9200'
    };

export const elasticClient = new Client(clientOptions);

const SCHEME_INDEX = 'schemes';
export const SCHEMES_INDEX_VERSION = 1;

export const initializeElasticsearch = async (): Promise<boolean> => {
  try {
    const indexExists = await elasticClient.indices.exists({ index: SCHEME_INDEX });
    
    let isInvalid = false;
    let storedVersion = 0;

    if (indexExists) {
      console.log(`[Index] Checking Version...`);
      const indexInfo = await elasticClient.indices.get({ index: SCHEME_INDEX });
      const indexSettings = indexInfo[SCHEME_INDEX]!;
      const mappings = indexSettings.mappings as any;
      const settings = indexSettings.settings as any;
      
      storedVersion = mappings._meta?.version || 0;
      console.log(`[Index] Current Version : ${SCHEMES_INDEX_VERSION}`);
      console.log(`[Index] Stored Version : ${storedVersion}`);

      if (storedVersion !== SCHEMES_INDEX_VERSION) {
        console.log(`[Index] Version mismatch`);
        isInvalid = true;
      } else {
        // Additional deep validation
        const hasAutocompleteMapping = mappings.properties?.title?.fields?.autocomplete;
        const hasSynonymAnalyzer = settings.index?.analysis?.analyzer?.synonym_analyzer;
        
        const countRes = await elasticClient.count({ index: SCHEME_INDEX });
        const docCount = countRes.count;

        if (!hasAutocompleteMapping || !hasSynonymAnalyzer || docCount === 0) {
          console.log(`[Index] Structural validation failed (missing fields/analyzers or 0 documents).`);
          isInvalid = true;
        } else {
          console.log(`[Index] Health : GREEN`);
          console.log(`[Index] READY`);
        }
      }
    }

    if (!indexExists || isInvalid) {
      if (indexExists && isInvalid) {
        console.log(`[Index] Rebuilding...`);
        await elasticClient.indices.delete({ index: SCHEME_INDEX });
      }

      console.log(`[Index] Applying Settings...`);
      console.log(`[Index] Applying Mappings...`);
      
      await elasticClient.indices.create({
        index: SCHEME_INDEX,
        settings: {
          analysis: {
            filter: {
              autocomplete_filter: {
                type: 'edge_ngram',
                min_gram: 2,
                max_gram: 20
              },
              synonym_filter: {
                type: 'synonym',
                synonyms: [
                  "farmer, kisan, agriculture, farming, crop, cultivation",
                  "student, education, college, engineering, scholarship",
                  "women, mahila, female, girl, mother",
                  "housing, house, home, pmay",
                  "loan, credit, finance, mudra",
                  "employment, jobs, career, work",
                  "health, medical, hospital, insurance, treatment"
                ]
              }
            },
            analyzer: {
              autocomplete: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'autocomplete_filter']
              },
              synonym_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'synonym_filter']
              }
            }
          }
        },
        mappings: {
          _meta: {
            version: SCHEMES_INDEX_VERSION
          },
          properties: {
            id: { type: 'keyword' },
            title: { 
              type: 'text', 
              analyzer: 'synonym_analyzer',
              fields: {
                keyword: { type: 'keyword' },
                autocomplete: { type: 'text', analyzer: 'autocomplete' },
                prefix: { type: 'search_as_you_type' }
              }
            },
            description: { type: 'text', analyzer: 'synonym_analyzer' },
            benefits: { type: 'text', analyzer: 'synonym_analyzer' },
            categoryId: { type: 'keyword' },
            categoryName: { 
              type: 'text', 
              analyzer: 'synonym_analyzer',
              fields: { keyword: { type: 'keyword' } }
            },
            secondaryCategories: { type: 'keyword' },
            state: { type: 'keyword' },
            governmentLevel: { type: 'keyword' },
            verificationStatus: { type: 'keyword' },
            applicationProcess: { type: 'text' },
            keywords: { type: 'text', analyzer: 'synonym_analyzer' },
            isActive: { type: 'boolean' },
            createdAt: { type: 'date' },
            eligibility: {
              type: 'nested',
              properties: {
                attribute: { type: 'keyword' },
                operator: { type: 'keyword' },
                value: { type: 'keyword' }
              }
            }
          }
        }
      });
      return true; // Indicates it was rebuilt
    }
    
    return false; // Indicates it was reused
  } catch (error) {
    console.error('[Index] Elasticsearch initialization failed:', error);
    throw error;
  }
};
