import { Request, Response, NextFunction } from 'express';
import { ChatService } from './chat.service';
import { createSessionSchema, sendMessageSchema } from './chat.validation';

export class ChatController {
  static async createSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { language } = createSessionSchema.parse(req.body);
      const session = await ChatService.createSession(req.userId!, language);

      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSessions(req: Request, res: Response, next: NextFunction) {
    try {
      const sessions = await ChatService.getSessions(req.userId!);

      res.status(200).json({
        success: true,
        data: sessions,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getSessionMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const messages = await ChatService.getSessionMessages(req.userId!, sessionId);

      res.status(200).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const { message, language } = sendMessageSchema.parse(req.body);

      const aiResponse = await ChatService.sendMessage(req.userId!, sessionId, message, language);

      res.status(200).json({
        success: true,
        data: aiResponse,
      });
    } catch (error) {
      next(error);
    }
  }
}
