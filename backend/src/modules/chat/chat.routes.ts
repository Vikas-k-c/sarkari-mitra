import { Router } from 'express';
import { ChatController } from './chat.controller';
import { authenticate } from '../../middleware/auth.middleware';

const chatRouter = Router();

chatRouter.use(authenticate);

chatRouter.post('/sessions', ChatController.createSession);
chatRouter.get('/sessions', ChatController.getSessions);
chatRouter.get('/sessions/:sessionId/messages', ChatController.getSessionMessages);
chatRouter.post('/sessions/:sessionId/message', ChatController.sendMessage);

export default chatRouter;
