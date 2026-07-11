import { Router } from 'express';
import { InteractionController } from './interaction.controller';
import { authenticate } from '../../middleware/auth.middleware';

const interactionRouter = Router();

interactionRouter.post('/favorite', authenticate, InteractionController.toggleFavorite);
interactionRouter.get('/favorites', authenticate, InteractionController.getFavorites);
interactionRouter.post('/', authenticate, InteractionController.logInteraction);

export default interactionRouter;
