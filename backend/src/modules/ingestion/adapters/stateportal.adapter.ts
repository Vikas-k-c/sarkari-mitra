import { ISourceAdapter } from './base.adapter';
import { NormalizedScheme } from '../types';

export class StatePortalAdapter implements ISourceAdapter {
  sourceName = 'State Government Portals';

  async fetchSchemes(): Promise<NormalizedScheme[]> {
    // TODO: Replace with actual API integration later
    return [
      {
        externalId: 'SP-301',
        sourceSystem: this.sourceName,
        title: 'Mock UP Farmers Support',
        description: 'A state-specific agricultural scheme.',
        benefits: 'Fertilizer subsidies.',
        // Deliberately omit category to test default "Uncategorized" logic if we want,
        // but TypeScript requires it based on Zod, so we just let Zod handle defaults if omitted.
        categoryName: undefined as any, 
        eligibility: [
          { attribute: 'state', operator: '==', value: 'UP' }
        ]
      }
    ];
  }
}
