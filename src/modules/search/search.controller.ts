import { Request, Response, NextFunction } from 'express';
import { SearchService } from './search.service';

export class SearchController {
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { q, categoryId, state, fuzzy } = req.query;
      
      const results = await SearchService.searchSchemes(
        q as string,
        categoryId as string,
        state as string,
        fuzzy === 'true'
      );

      res.status(200).json({ success: true, data: results });
    } catch (error) {
      next(error);
    }
  }
}
