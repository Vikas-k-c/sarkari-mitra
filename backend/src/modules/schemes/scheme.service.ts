import { prisma } from '../../config/db';
import { CreateSchemeDto } from './scheme.validation';
import { elasticClient } from '../../elastic/client';
import { gemini } from '../../lib/gemini';

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

  static async findAll(categoryId?: string, lang?: string) {
    let schemes = await prisma.scheme.findMany({
      where: categoryId ? { categoryId, isActive: true } : { isActive: true },
      include: {
        category: true
      },
      orderBy: {
        applicationDeadline: 'asc'
      }
    });

    if (lang === 'hi' && schemes.length > 0) {
      try {
        const prompt = `Translate the following JSON array of schemes into Hindi. Keep the exact same JSON structure, keys, and non-text values. Only translate the values of 'title', 'description', and 'benefits'. Respond ONLY with the valid JSON array, do not wrap it in markdown.\n\n${JSON.stringify(schemes, null, 2)}`;
        const model = gemini.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        let text = result.response.text().trim();
        if (text.startsWith('\`\`\`json')) {
          text = text.substring(7);
        }
        if (text.startsWith('\`\`\`')) {
          text = text.substring(3);
        }
        if (text.endsWith('\`\`\`')) {
          text = text.substring(0, text.length - 3);
        }
        schemes = JSON.parse(text.trim());
      } catch (error) {
        console.error('Failed to translate schemes:', error);
      }
    }

    return schemes;
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
