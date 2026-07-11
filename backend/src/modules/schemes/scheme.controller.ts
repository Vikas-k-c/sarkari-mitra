import { Request, Response, NextFunction } from 'express';
import { SchemeService } from './scheme.service';

export class SchemeController {
  static async createScheme(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.create(req.body);
      res.status(201).json({ success: true, data: scheme });
    } catch (error) {
      next(error);
    }
  }

  static async getSchemes(req: Request, res: Response, next: NextFunction) {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const categoryName = req.query.categoryName as string | undefined;
      const lang = req.query.lang as string | undefined;
      const governmentLevel = req.query.governmentLevel as string | undefined;
      const ministry = req.query.ministry as string | undefined;
      const sort = req.query.sort as string | undefined;
      const page = req.query.page ? parseInt(req.query.page as string) : undefined;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;

      const schemes = await SchemeService.findAll({ categoryId, categoryName, lang, governmentLevel, ministry, sort, page, limit });
      res.status(200).json({ success: true, data: schemes });
    } catch (error) {
      next(error);
    }
  }

  static async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await SchemeService.getCategories();
      res.status(200).json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  static async getMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await SchemeService.getMetrics();
      res.status(200).json({ success: true, data: metrics });
    } catch (error) {
      next(error);
    }
  }

  static async getSchemeById(req: Request, res: Response, next: NextFunction) {
    try {
      const scheme = await SchemeService.findById(req.params.id as string);
      if (!scheme) {
        res.status(404).json({ success: false, message: 'Scheme not found' });
        return;
      }
      res.status(200).json({ success: true, data: scheme });
    } catch (error) {
      next(error);
    }
  }
}
