import { ISourceAdapter } from './base.adapter';
import { NormalizedScheme } from '../types';

export class MySchemeAdapter implements ISourceAdapter {
  sourceName = 'MyScheme';

  async fetchSchemes(): Promise<NormalizedScheme[]> {
    // TODO: Replace with actual API integration later
    return [
      {
        externalId: 'MS-101',
        sourceSystem: this.sourceName,
        title: 'Mock MyScheme Health Plan',
        description: 'A mock health plan from MyScheme API.',
        benefits: 'Up to Rs. 500,000 health cover.',
        categoryName: 'Healthcare',
        eligibility: [
          { attribute: 'income', operator: '<=', value: '500000' }
        ]
      }
    ];
  }
}
