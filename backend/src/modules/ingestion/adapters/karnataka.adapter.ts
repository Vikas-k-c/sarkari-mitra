import { ISourceAdapter } from './base.adapter';
import { NormalizedScheme } from '../types';
import { logger } from '../../../utils/logger';

export class KarnatakaAdapter implements ISourceAdapter {
  sourceName = 'Karnataka State Portal';

  async fetchSchemes(): Promise<NormalizedScheme[]> {
    /**
     * LIMITATION EXPLANATION:
     * The Karnataka Government (e.g. sevasindhu.karnataka.gov.in) does not offer a
     * centralized, unified JSON/REST API for all state schemes. 
     * 
     * To synchronize from this source, a web scraping strategy (e.g., Puppeteer/Cheerio)
     * would be required to parse HTML tables, or specific departmental APIs would need to be 
     * individually discovered and reverse-engineered. 
     * 
     * This adapter serves as a structurally complete placeholder. Once a web scraper or
     * official departmental API endpoint is configured, the extraction logic will reside here.
     */
    logger.info(`[${this.sourceName}] Official API is unavailable and web scraping is not configured. Returning empty placeholder array.`);

    return [];
  }
}
