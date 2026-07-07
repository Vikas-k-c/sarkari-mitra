import { ISourceAdapter } from './base.adapter';
import { NormalizedScheme } from '../types';

export class DataGovAdapter implements ISourceAdapter {
  sourceName = 'Data.gov.in';

  async fetchSchemes(): Promise<NormalizedScheme[]> {
    // TODO: Replace with actual API integration later
    return [
      {
        externalId: 'DG-201',
        sourceSystem: this.sourceName,
        title: 'Mock Data.gov.in Education Subsidy',
        description: 'A mock education subsidy from Data.gov.in.',
        benefits: 'Free tuition for higher education.',
        categoryName: 'Education',
        eligibility: [
          { attribute: 'age', operator: '>=', value: '18' }
        ]
      }
    ];
  }
}
