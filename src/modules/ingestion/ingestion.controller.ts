import { Request, Response, NextFunction } from 'express';
import { IngestionService } from './ingestion.service';

export class IngestionController {
  static async runIngestion(req: Request, res: Response, next: NextFunction) {
    try {
      const ingestionService = new IngestionService();
      
      // In a real production scenario, you would trigger this asynchronously 
      // if it takes too long, but for this requirement we await to return stats.
      const stats = await ingestionService.runPipeline();

      res.status(200).json({
        success: true,
        data: stats,
        message: 'Manual ingestion triggered successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
