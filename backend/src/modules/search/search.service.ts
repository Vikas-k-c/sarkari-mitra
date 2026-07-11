import { elasticClient } from '../../elastic/client';

export class SearchService {
  static async searchSchemes(
    query: string, 
    categoryId?: string, 
    state?: string, 
    mode: 'full' | 'autocomplete' = 'full', 
    governmentLevel?: string, 
    ministry?: string
  ) {
    const filter: any[] = [];
    const should: any[] = [];

    if (query) {
      if (mode === 'autocomplete') {
        should.push({
          match: {
            'title.autocomplete': {
              query,
              boost: 70
            }
          }
        });
      } else {
        // Single optimized multi_match approach using exact boosts
        should.push({ match: { 'title.keyword': { query, boost: 100 } } });
        should.push({ match_phrase_prefix: { 'title.prefix': { query, boost: 80 } } });
        should.push({ match: { 'title.autocomplete': { query, boost: 70 } } });
        // Tuned fuzzy search
        should.push({ 
          match: { 
            title: { 
              query, 
              fuzziness: 'AUTO', 
              prefix_length: 2, 
              max_expansions: 50, 
              boost: 60 
            } 
          } 
        });
        should.push({ match: { keywords: { query, boost: 50 } } });
        should.push({ match: { categoryName: { query, boost: 40 } } });
        
        // Nested eligibility matching
        should.push({
          nested: {
            path: 'eligibility',
            query: {
              match: { 'eligibility.value': { query, boost: 30 } }
            }
          }
        });

        should.push({ match: { benefits: { query, boost: 20 } } });
        should.push({ match: { description: { query, boost: 10 } } });
      }
    } else {
      should.push({ match_all: {} });
    }

    if (categoryId) filter.push({ term: { categoryId } });
    if (state) filter.push({ term: { state } });
    if (governmentLevel) filter.push({ term: { governmentLevel } });

    const searchParams: any = {
      index: 'schemes',
      query: {
        bool: {
          filter,
          should,
          minimum_should_match: should.length > 0 && query ? 1 : 0
        }
      },
      sort: [
        { _score: { order: 'desc' } },
        { createdAt: { order: 'desc' } }
      ]
    };

    if (mode === 'autocomplete') {
      searchParams._source = ['id', 'title', 'categoryName', 'governmentLevel'];
      searchParams.size = 5;
    } else {
      searchParams._source = ['id', 'title', 'description', 'shortDescription', 'categoryName', 'category', 'governmentLevel', 'state', 'verificationStatus', 'benefits'];
      searchParams.size = 20;
    }

    const tEsStart = performance.now();
    let response = await elasticClient.search(searchParams);
    const tEsEnd = performance.now();
    let esExecutionTime = tEsEnd - tEsStart;

    let didYouMean = null;

    // Conditionally invoke suggest API only if results are 0
    if (response.hits.hits.length === 0 && query && mode === 'full') {
      const tSuggestStart = performance.now();
      const suggestResponse = await elasticClient.search({
        index: 'schemes',
        suggest: {
          title_suggestion: {
            text: query,
            term: {
              field: 'title',
              suggest_mode: 'popular'
            }
          }
        },
        size: 0
      });
      const tSuggestEnd = performance.now();
      esExecutionTime += (tSuggestEnd - tSuggestStart);

      const titleSuggestion = suggestResponse.suggest?.title_suggestion as any[];
      if (titleSuggestion && titleSuggestion.length > 0) {
        const options = titleSuggestion[0].options;
        if (options && options.length > 0) {
          didYouMean = options[0].text;
        }
      }
    }

    const tDtoStart = performance.now();
    const results = response.hits.hits.map((hit: any) => {
      const source = hit._source;
      if (mode === 'autocomplete') {
        return {
          id: source.id,
          title: source.title,
          categoryName: source.categoryName,
          governmentLevel: source.governmentLevel
        };
      } else {
        return {
          id: source.id,
          title: source.title,
          description: source.description,
          shortDescription: source.shortDescription,
          categoryName: source.categoryName,
          category: source.category,
          governmentLevel: source.governmentLevel,
          state: source.state,
          verificationStatus: source.verificationStatus,
          benefits: source.benefits,
          score: hit._score
        };
      }
    });
    const tDtoEnd = performance.now();
    const dtoMappingTime = tDtoEnd - tDtoStart;

    return { 
      results, 
      didYouMean,
      timings: {
        esExecutionTime,
        dtoMappingTime
      }
    };
  }
}
