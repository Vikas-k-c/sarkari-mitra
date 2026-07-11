import { Request, Response, NextFunction } from 'express';
import { InteractionService } from './interaction.service';

export class InteractionController {
  static async toggleFavorite(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      const { schemeId } = req.body;
      
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      if (!schemeId) {
        res.status(400).json({ success: false, message: 'schemeId is required' });
        return;
      }

      const result = await InteractionService.toggleFavorite(userId, schemeId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }

      const favorites = await InteractionService.getFavorites(userId);
      res.status(200).json({ success: true, data: favorites.map(b => b.scheme) });
    } catch (error) {
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

      if (!schemeId || !type) {
        res.status(400).json({ success: false, message: 'schemeId and type are required' });
        return;
      }

      const interaction = await InteractionService.logInteraction(userId, schemeId, type);
      res.status(201).json({ success: true, data: interaction });
    } catch (error) {
      next(error);
    }
  }
}
