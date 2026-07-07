import { Router } from 'express';
import { RecommendationController } from './recommendation.controller';
import { authenticate } from '../../middleware/auth.middleware';

const recommendationRouter = Router();

// Protect routes with auth middleware to ensure req.user exists
recommendationRouter.get('/', authenticate, RecommendationController.getRecommendations);
recommendationRouter.post('/interact', authenticate, RecommendationController.logInteraction);

export default recommendationRouter;
