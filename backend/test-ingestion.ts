import { IngestionService } from './src/modules/ingestion/ingestion.service';
import { env } from './src/config/env';

async function main() {
  const service = new IngestionService();
  const result = await service.runPipeline();
  console.log('Ingestion Result:', result);
}

main().catch(console.error);
