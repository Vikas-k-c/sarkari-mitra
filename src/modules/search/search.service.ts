import { elasticClient } from '../../elastic/client';

export class SearchService {
  static async searchSchemes(query: string, categoryId?: string, state?: string, fuzzy: boolean = false) {
    const must: any[] = [];
    const should: any[] = [];

    if (query) {
      if (fuzzy) {
        should.push({
          multi_match: {
            query,
            fields: ['title^3', 'description', 'benefits'],
            fuzziness: 'AUTO'
          }
        });
      } else {
        must.push({
          multi_match: {
            query,
            fields: ['title^3', 'description', 'benefits']
          }
        });
      }
    }

    if (categoryId) {
      must.push({ term: { categoryId } });
    }

    if (state) {
      must.push({ term: { state } });
    }

    // Default to matching all if no params
    if (must.length === 0 && should.length === 0) {
      must.push({ match_all: {} });
    }

    const response = await elasticClient.search({
      index: 'schemes',
      query: {
        bool: {
          must,
          should,
          minimum_should_match: should.length > 0 ? 1 : 0
        }
      },
      // Sort by score (ranking) then by newest
      sort: [
        { _score: { order: 'desc' } },
        { createdAt: { order: 'desc' } }
      ]
    });

    return response.hits.hits.map((hit: any) => ({
      score: hit._score,
      ...hit._source
    }));
  }
}
