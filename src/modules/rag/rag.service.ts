import { gemini } from '../../lib/gemini';
import { qdrant } from '../../lib/qdrant';
import { logger } from '../../utils/logger';

const COLLECTION_NAME = 'schemes';
const EMBEDDING_MODEL = 'gemini-embedding-2'; // Updated Gemini's embedding model

export class RagService {
  static async initializeCollection() {
    try {
      const collections = await qdrant.getCollections();
      const exists = collections.collections.some((c) => c.name === COLLECTION_NAME);

      if (!exists) {
        await qdrant.createCollection(COLLECTION_NAME, {
          vectors: {
            size: 768, // Gemini embedding dimension
            distance: 'Cosine',
          },
        });
        logger.info(`Qdrant collection '${COLLECTION_NAME}' created.`);
      }
    } catch (error: any) {
      logger.error('Failed to initialize Qdrant collection:', { error: error.message || error });
    }
  }

  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const model = gemini.getGenerativeModel({ model: EMBEDDING_MODEL });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error: any) {
      logger.error('Failed to generate embedding via Gemini:', { error: error.message || error });
      throw error;
    }
  }

  static async embedAndStoreScheme(scheme: any) {
    try {
      // Build a comprehensive string representation of the scheme for embedding
      const schemeText = `
        Title: ${scheme.title}
        Category: ${scheme.categoryName || scheme.category?.name || 'General'}
        Description: ${scheme.description}
        Benefits: ${scheme.benefits || 'N/A'}
      `.trim();

      const embedding = await this.generateEmbedding(schemeText);

      await qdrant.upsert(COLLECTION_NAME, {
        wait: true,
        points: [
          {
            id: scheme.id, // Qdrant string UUIDs
            vector: embedding,
            payload: {
              id: scheme.id,
              title: scheme.title,
              description: scheme.description,
              categoryId: scheme.categoryId,
            },
          },
        ],
      });

      logger.info(`Successfully embedded and stored scheme in Qdrant: ${scheme.id}`);
    } catch (error: any) {
      logger.error(`Failed to embed/store scheme ${scheme.id}:`, { error: error.message || error });
    }
  }

  static async searchSchemes(query: string, limit: number = 3) {
    try {
      const queryEmbedding = await this.generateEmbedding(query);

      const searchResults = await qdrant.search(COLLECTION_NAME, {
        vector: queryEmbedding,
        limit,
        with_payload: true,
      });

      return searchResults.map((result) => result.payload);
    } catch (error: any) {
      logger.error('Failed to search schemes in Qdrant:', { error: error.message || error });
      return [];
    }
  }
}
