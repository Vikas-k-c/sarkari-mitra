import { EligibilityRule } from '@prisma/client';
import { prisma } from '../../config/db';

export class RecommendationService {
  static async getRecommendationsForUser(userId: string) {
    const profile = await prisma.profile.findUnique({ where: { userId } });
    if (!profile) {
      throw new Error('Profile not found. Please complete your profile to get recommendations.');
    }

    const schemes = await prisma.scheme.findMany({
      where: { isActive: true },
      include: { eligibility: true, category: true }
    });

    const scoredSchemes = schemes.map(scheme => {
      const matchResult = this.calculateMatchScore(profile, scheme.eligibility);
      return {
        id: scheme.id,
        title: scheme.title,
        description: scheme.description,
        benefits: scheme.benefits,
        category: scheme.category.name,
        applicationUrl: scheme.applicationUrl,
        score: matchResult.score,
        explanations: matchResult.explanations
      };
    });

    // Filter out completely unmatched schemes (e.g. strict exclusions)
    // Here we just use score > 0 and sort by score descending
    const recommendations = scoredSchemes
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    return recommendations;
  }

  static calculateMatchScore(profile: any, rules: EligibilityRule[]) {
    if (rules.length === 0) {
      return { score: 100, explanations: ['General scheme applicable to everyone.'] };
    }

    let matches = 0;
    let totalRules = rules.length;
    const explanations: string[] = [];

    for (const rule of rules) {
      const profileValue = profile[rule.attribute];
      if (profileValue === undefined || profileValue === null) {
        continue;
      }

      let isMatch = false;
      switch (rule.operator) {
        case '==':
          isMatch = String(profileValue).toLowerCase() === rule.value.toLowerCase();
          if (isMatch) explanations.push(`Matches your ${rule.attribute} (${profileValue})`);
          break;
        case '>=':
          isMatch = Number(profileValue) >= Number(rule.value);
          if (isMatch) explanations.push(`Meets minimum ${rule.attribute} requirement`);
          break;
        case '<=':
          isMatch = Number(profileValue) <= Number(rule.value);
          if (isMatch) explanations.push(`Meets maximum ${rule.attribute} requirement`);
          break;
        case 'IN':
          const values = rule.value.toLowerCase().split(',').map(v => v.trim());
          isMatch = values.includes(String(profileValue).toLowerCase());
          if (isMatch) explanations.push(`Your ${rule.attribute} is eligible`);
          break;
      }
      
      if (isMatch) {
        matches++;
      } else {
        // Hard exclusion: If we have the data and it explicitly fails the rule,
        // the user is strictly ineligible for this scheme.
        return { score: 0, explanations: [`Failed mandatory requirement: ${rule.attribute} must be ${rule.operator} ${rule.value}`] };
      }
    }

    const score = Math.round((matches / totalRules) * 100);
    return { score, explanations };
  }

  static async logInteraction(userId: string, schemeId: string, type: string) {
    return prisma.userSchemeInteraction.create({
      data: { userId, schemeId, type }
    });
  }
}
