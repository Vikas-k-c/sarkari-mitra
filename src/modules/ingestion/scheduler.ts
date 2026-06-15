import cron from 'node-cron';
import { IngestionService } from './ingestion.service';
import { logger } from '../../utils/logger';
import { env } from '../../config/env';

export const startIngestionScheduler = () => {
  const schedule = process.env.CRON_SCHEDULE || '0 2 * * *';
  
  // Validate the cron expression
  if (!cron.validate(schedule)) {
    logger.error(`Invalid CRON_SCHEDULE: ${schedule}. Ingestion scheduler not started.`);
    return;
  }

  const ingestionService = new IngestionService();

  logger.info(`Scheduling Ingestion Pipeline with CRON: ${schedule}`);
  
  cron.schedule(schedule, async () => {
    logger.info('Executing scheduled Ingestion Pipeline run...');
    await ingestionService.runPipeline();
  });
};
