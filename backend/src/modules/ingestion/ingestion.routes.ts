import { Router, Request, Response, NextFunction } from 'express';
import { IngestionController } from './ingestion.controller';
import { env } from '../../config/env';
import { AppError } from '../../errors/AppError';

const ingestionRouter = Router();

ingestionRouter.post('/sync', IngestionController.runIngestion);

export default ingestionRouter;
