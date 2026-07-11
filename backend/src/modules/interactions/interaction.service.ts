import { prisma } from '../../config/db';

export class InteractionService {
  static async toggleFavorite(userId: string, schemeId: string) {
    const existing = await prisma.userSchemeInteraction.findFirst({
      where: { userId, schemeId, type: 'FAVORITE' }
    });

    if (existing) {
      await prisma.userSchemeInteraction.delete({ where: { id: existing.id } });
      return { status: 'removed' };
    } else {
      await prisma.userSchemeInteraction.create({
        data: { userId, schemeId, type: 'FAVORITE' }
      });
      return { status: 'added' };
    }
  }

  static async getFavorites(userId: string) {
    return prisma.userSchemeInteraction.findMany({
      where: { userId, type: 'FAVORITE' },
      include: {
        scheme: {
          include: { category: true }
        }
      },
      orderBy: { timestamp: 'desc' }
    });
  }

  static async logInteraction(userId: string, schemeId: string, type: string) {
    return prisma.userSchemeInteraction.create({
      data: { userId, schemeId, type }
    });
  }
}
