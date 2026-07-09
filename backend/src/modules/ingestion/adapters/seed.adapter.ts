import { ISourceAdapter } from './base.adapter';
import { NormalizedScheme } from '../types';
import { logger } from '../../../utils/logger';
import * as fs from 'fs';
import * as path from 'path';

export class SeedAdapter implements ISourceAdapter {
  sourceName = 'CuratedSeed';

  async fetchSchemes(): Promise<NormalizedScheme[]> {
    const seedFilePath = path.join(__dirname, '../../../../data/seed-schemes.json');
    
    try {
      if (!fs.existsSync(seedFilePath)) {
        logger.info(`[${this.sourceName}] Seed file not found at ${seedFilePath}. Skipping.`);
        return [];
      }

      const fileContent = fs.readFileSync(seedFilePath, 'utf-8');
      const rawData = JSON.parse(fileContent);

      if (!Array.isArray(rawData)) {
        logger.error(`[${this.sourceName}] Seed data must be a JSON array of schemes.`);
        return [];
      }

      // We expect the seed JSON to match NormalizedScheme exactly
      // It will be validated by the Zod schema in ingestion.service.ts
      logger.info(`[${this.sourceName}] Loaded ${rawData.length} schemes from seed file.`);
      return rawData as NormalizedScheme[];

    } catch (error: any) {
      logger.error(`[${this.sourceName}] Failed to read seed file: ${error.message}`);
      return [];
    }
  }
}
