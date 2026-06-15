import { prisma } from '../../config/db';
import { CreateSchemeDto } from './scheme.validation';
import { elasticClient } from '../../elastic/client';
export class SchemeService {
  static async create(data: CreateSchemeDto) {
    const scheme = await prisma.scheme.create({
      data: {
        title: data.title,
        description: data.description,
        benefits: data.benefits,
        applicationUrl: data.applicationUrl,
        categoryId: data.categoryId,
        sourceId: data.sourceId,
        eligibility: {
          create: data.eligibility
        },
        documents: {
          create: data.documents
        }
      },
      include: {
        category: true,
        eligibility: true,
        documents: true
      }
    });

    try {
      await elasticClient.index({
        index: 'schemes',
        id: scheme.id,
        document: {
          id: scheme.id,
          title: scheme.title,
          description: scheme.description,
          benefits: scheme.benefits,
          categoryId: scheme.categoryId,
          categoryName: scheme.category.name,
          isActive: scheme.isActive,
          createdAt: scheme.createdAt,
          eligibility: scheme.eligibility.map(e => ({
            attribute: e.attribute,
            operator: e.operator,
            value: e.value
          }))
        }
      });
    } catch (error) {
      console.error('Failed to index scheme in Elasticsearch:', error);
    }

    return scheme;
  }

  static async findAll(categoryId?: string) {
    return prisma.scheme.findMany({
      where: categoryId ? { categoryId, isActive: true } : { isActive: true },
      include: {
        category: true
      }
    });
  }

  static async findById(id: string) {
    return prisma.scheme.findUnique({
      where: { id },
      include: {
        category: true,
        eligibility: true,
        documents: true,
        source: true
      }
    });
  }
}
