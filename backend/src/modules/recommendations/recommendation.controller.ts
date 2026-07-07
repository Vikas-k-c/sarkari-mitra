import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from './recommendation.service';

export class RecommendationController {
  static async getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const recommendations = await RecommendationService.getRecommendationsForUser(userId);
      res.status(200).json({ success: true, data: recommendations });
    } catch (error: any) {
      if (error.message.includes('Profile not found')) {
        res.status(400).json({ success: false, message: error.message });
        return;
      }
      next(error);
    }
  }

  static async logInteraction(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { schemeId, type } = req.body;
      
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const interaction = await RecommendationService.logInteraction(userId, schemeId, type);
      res.status(201).json({ success: true, data: interaction });
    } catch (error) {
      next(error);
    }
  }
}
