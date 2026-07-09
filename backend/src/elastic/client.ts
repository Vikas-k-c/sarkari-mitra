import { Client } from '@elastic/elasticsearch';
import { env } from '../config/env';

export const elasticClient = new Client({
  node: process.env.ELASTIC_URL || 'http://localhost:9200',
});

const SCHEME_INDEX = 'schemes';

export const initializeElasticsearch = async () => {
  try {
    const indexExists = await elasticClient.indices.exists({ index: SCHEME_INDEX });
    
    if (!indexExists) {
      await elasticClient.indices.create({
        index: SCHEME_INDEX,
        mappings: {
          properties: {
            id: { type: 'keyword' },
            title: { type: 'text', analyzer: 'standard' },
            description: { type: 'text', analyzer: 'standard' },
            benefits: { type: 'text' },
            categoryId: { type: 'keyword' },
            categoryName: { type: 'keyword' },
            secondaryCategories: { type: 'keyword' },
            state: { type: 'keyword' },
            governmentLevel: { type: 'keyword' },
            verificationStatus: { type: 'keyword' },
            applicationProcess: { type: 'text' },
            keywords: { type: 'keyword' },
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
      console.log(`Elasticsearch index '${SCHEME_INDEX}' created.`);
    } else {
      console.log(`Elasticsearch index '${SCHEME_INDEX}' already exists.`);
    }
  } catch (error) {
    console.error('Elasticsearch initialization failed:', error);
  }
};
