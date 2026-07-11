import { Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service';
import { SearchCache } from './search.cache';

export class SearchController {
  static async search(req: Request, res: Response, next: NextFunction) {
    const tControllerStart = performance.now();
    try {
      const { q, query, categoryId, state, mode, governmentLevel, ministry, page, limit } = req.query;
      
      const searchTerm = (q as string) || (query as string) || '';
      const searchMode = (mode as 'full' | 'autocomplete') || 'full';
      
      const cacheKey = SearchCache.generateKey(req.query);
      const cachedResponse = SearchCache.get(cacheKey);

      if (cachedResponse) {
        const tControllerEnd = performance.now();
        console.log(`[Search API] query="${searchTerm}", mode=${searchMode}, results=${cachedResponse.data.length}, CACHE=HIT, Total API Time=${(tControllerEnd - tControllerStart).toFixed(2)}ms`);
        return res.status(200).json(cachedResponse);
      }

      const tServiceStart = performance.now();
      const { results, didYouMean, timings } = await SearchService.searchSchemes(
        searchTerm,
        categoryId as string,
        state as string,
        searchMode,
        governmentLevel as string,
        ministry as string
      );
      const tServiceEnd = performance.now();

      const responsePayload = {
        success: true,
        data: results,
        didYouMean
      };

      const tSerializationStart = performance.now();
      const serialized = JSON.stringify(responsePayload);
      const tSerializationEnd = performance.now();
      
      SearchCache.set(cacheKey, responsePayload);

      const tControllerEnd = performance.now();
      
      console.log(
        `[Search API] query="${searchTerm}", mode=${searchMode}, results=${results.length}, CACHE=MISS\n` +
        `  ├─ ES Exec Time: ${timings.esExecutionTime.toFixed(2)}ms\n` +
        `  ├─ DTO Map Time: ${timings.dtoMappingTime.toFixed(2)}ms\n` +
        `  ├─ Service Time: ${(tServiceEnd - tServiceStart).toFixed(2)}ms\n` +
        `  ├─ Serializ. Time: ${(tSerializationEnd - tSerializationStart).toFixed(2)}ms\n` +
        `  └─ Total API Time: ${(tControllerEnd - tControllerStart).toFixed(2)}ms`
      );

      res.status(200).type('json').send(serialized);
    } catch (error) {
      next(error);
    }
  }
}
