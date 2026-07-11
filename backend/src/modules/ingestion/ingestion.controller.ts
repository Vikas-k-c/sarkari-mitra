import { Request, Response, NextFunction } from 'express';
import { IngestionService } from './ingestion.service';

import { env } from '../../config/env';
import { logger } from '../../utils/logger';

export class IngestionController {
  static async runIngestion(req: Request, res: Response, next: NextFunction) {
    try {
      const syncSecret = req.headers['x-sync-secret'];
      
      if (!syncSecret || syncSecret !== env.SYNC_SECRET) {
        logger.warn(`[Sync] Unauthorized sync attempt from IP: ${req.ip}`);
        res.status(401).json({ success: false, message: 'Unauthorized sync attempt' });
        return;
      }
      logger.info(`[Sync] Authentication Successful`);

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
