import { prisma } from '../../config/db';
import { gemini } from '../../lib/gemini';
import { RagService } from '../rag/rag.service';
import { logger } from '../../utils/logger';
import { AppError } from '../../errors/AppError';

export class ChatService {
  static async createSession(userId: string, language: string) {
    return prisma.chatSession.create({
      data: {
        userId,
        language,
      },
    });
  }

  static async getSessions(userId: string) {
    return prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  static async getSessionMessages(userId: string, sessionId: string) {
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!session) {
      throw AppError.notFound('Session not found');
    }

    return session.messages;
  }

  static async sendMessage(userId: string, sessionId: string, message: string) {
    // 1. Validate session
    const session = await prisma.chatSession.findFirst({
      where: { id: sessionId, userId },
      include: { messages: { orderBy: { createdAt: 'asc' } } },
    });

    if (!session) {
      throw AppError.notFound('Session not found');
    }

    // 2. Fetch User Profile for context
    const profile = await prisma.profile.findUnique({ where: { userId } });
    const profileContext = profile 
      ? `User Profile: Age: ${profile.age}, Gender: ${profile.gender}, Income: ${profile.income}, Occupation: ${profile.occupation}, Category: ${profile.category}, State: ${profile.state}`
      : `User Profile: Not provided`;

    // 3. Save User Message
    await prisma.chatMessage.create({
      data: {
        sessionId,
        role: 'user',
        content: message,
      },
    });

    // 4. Retrieve Relevant Schemes via RAG
    const relevantSchemes = await RagService.searchSchemes(message, 3);
    const schemesContext = relevantSchemes.length > 0
      ? relevantSchemes.map((s: any) => `- ${s.title}: ${s.description}`).join('\n')
      : 'No specific schemes found in vector database.';

    // 5. Build Chat History for Gemini
    const history = session.messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // 6. Build Contextual Prompt
    const systemInstruction = `
You are Sarkari Mitra, an AI assistant helping rural and semi-literate citizens in India discover and understand government schemes.
Keep your answers very simple, encouraging, and easy to understand.
Do not use complex jargon.

Respond EXCLUSIVELY in the following language code: ${session.language}.

Here is the context about the user:
${profileContext}

Here are some potentially relevant schemes retrieved from the database based on their question:
${schemesContext}

Base your advice primarily on these schemes if relevant, but you can also answer general questions about government processes.
    `.trim();

    // 7. Generate Response via Gemini
    try {
      const model = gemini.getGenerativeModel({
        model: 'gemini-2.5-flash',
        systemInstruction,
      });

      const chat = model.startChat({ history });
      const result = await chat.sendMessage(message);
      const aiResponse = result.response.text();

      // 8. Save Assistant Message
      const savedMessage = await prisma.chatMessage.create({
        data: {
          sessionId,
          role: 'assistant',
          content: aiResponse,
        },
      });

      // Update session timestamp and optionally title
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: {
          updatedAt: new Date(),
          ...(session.messages.length === 0 ? { title: message.substring(0, 50) + '...' } : {}),
        },
      });

      return savedMessage;
    } catch (error: any) {
      logger.error('Error generating AI response:', { error: error.message || error });
      throw new Error('Failed to generate AI response');
    }
  }
}
