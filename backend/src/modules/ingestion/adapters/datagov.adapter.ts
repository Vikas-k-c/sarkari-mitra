import { ISourceAdapter } from './base.adapter';
import { NormalizedScheme } from '../types';
import { logger } from '../../../utils/logger';
import { env } from '../../../config/env';

export class DataGovAdapter implements ISourceAdapter {
  sourceName = 'Data.gov.in';

  async fetchSchemes(): Promise<NormalizedScheme[]> {
    const apiKey = env.DATAGOV_API_KEY;
    const resourceIds = env.DATAGOV_RESOURCE_IDS; // Now an array of strings

    if (!apiKey || !resourceIds || resourceIds.length === 0) {
      logger.info(`[${this.sourceName}] Official API requires DATAGOV_API_KEY and DATAGOV_RESOURCE_IDS in environment variables. Returning empty placeholder array until configured.`);
      return [];
    }

    const allSchemes: NormalizedScheme[] = [];

    for (const resourceId of resourceIds) {
      const url = `https://api.data.gov.in/resource/${resourceId}?api-key=${apiKey}&format=json&limit=100`;
      
      try {
        logger.info(`[${this.sourceName}] Fetching schemes from dataset: ${resourceId}...`);
        const response = await fetch(url);
        
        if (!response.ok) {
          logger.error(`[${this.sourceName}] HTTP error fetching ${resourceId}! status: ${response.status}`);
          continue; // Skip this dataset and move to the next one
        }

        const data = await response.json();
        
        if (!data.records || !Array.isArray(data.records)) {
          logger.info(`[${this.sourceName}] Invalid data format from dataset: ${resourceId}. Missing 'records' array.`);
          continue;
        }

        // Map the Data.gov.in JSON fields to our NormalizedScheme format
        // Note: Field mapping here is generic. Some datasets may have different column names.
        const normalizedSchemes: NormalizedScheme[] = data.records.map((record: any) => ({
          externalId: `DG-${record.id || Math.random().toString(36).substring(7)}`,
          sourceSystem: this.sourceName,
          sourceUrl: url,
          title: record.scheme_name || record.title || 'Unknown Scheme',
          description: record.scheme_description || record.description || 'No description available.',
          benefits: record.benefits || '',
          ministry: record.ministry_name || record.ministry || 'Various',
          language: 'en',
          categoryName: record.sector || record.category || 'General',
          eligibility: [] 
        }));

        allSchemes.push(...normalizedSchemes);
        logger.info(`[${this.sourceName}] Successfully mapped ${normalizedSchemes.length} schemes from dataset: ${resourceId}.`);

      } catch (error: any) {
        logger.error(`[${this.sourceName}] Failed to fetch from dataset ${resourceId}: ${error.message}`);
        // We catch the error so one failing dataset doesn't crash the whole pipeline
      }
    }

    return allSchemes;
  }
}
