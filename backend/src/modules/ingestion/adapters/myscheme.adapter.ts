import { ISourceAdapter } from './base.adapter';
import { NormalizedScheme } from '../types';
import { logger } from '../../../utils/logger';

export class MySchemeAdapter implements ISourceAdapter {
  sourceName = 'MyScheme';

  async fetchSchemes(): Promise<NormalizedScheme[]> {
    /**
     * LIMITATION EXPLANATION:
     * myScheme (myscheme.gov.in) does not currently provide a public, open API
     * for independent developers to pull scheme data directly.
     * 
     * Integration with myScheme requires formal onboarding via API Setu (apisetu.gov.in),
     * the Government of India's official API gateway, which requires verified government
     * or institutional credentials.
     * 
     * This adapter serves as a structurally complete placeholder. Once API Setu credentials
     * are acquired, the HTTP request logic (using the required certificates and headers)
     * should be implemented here to fetch and map the real data.
     */
    logger.info(`[${this.sourceName}] Official API requires API Setu credentials. Returning empty placeholder array until credentials are provided.`);

    return [];
  }
}
