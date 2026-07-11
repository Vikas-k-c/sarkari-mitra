import type { Server } from "node:http";
import app from "./app";
import { connectDatabase, disconnectDatabase } from "./config/db";
import { env } from "./config/env";
import { logger } from "./utils/logger";

let server: Server | undefined;
let isShuttingDown = false;

const shutdown = async (signal: string): Promise<void> => {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;
  logger.info("Shutdown started", { signal });

  const forceExitTimer = setTimeout(() => {
    logger.error("Forced shutdown after timeout");
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();

  if (server) {
    await new Promise<void>((resolve) => {
      server?.close(() => resolve());
      server?.closeIdleConnections();
    });
  }

  await disconnectDatabase();
  logger.info("Shutdown complete");
  process.exit(0);
};

const startServer = async (): Promise<void> => {
  await connectDatabase();
  const { initializeElasticsearch, elasticClient } = await import('./elastic/client');
  const { IngestionService } = await import('./modules/ingestion/ingestion.service');
  
  const wasRebuilt = await initializeElasticsearch();
  
  if (wasRebuilt) {
    console.log(`[Index] Running Ingestion...`);
    try {
      const ingestionService = new IngestionService();
      await ingestionService.runPipeline(true);
      
      // Post-Rebuild Verification
      const countRes = await elasticClient.count({ index: 'schemes' });
      console.log(`[Index] Documents Indexed : ${countRes.count}`);
      
      if (countRes.count === 0) {
        throw new Error('Ingestion completed but 0 documents were indexed.');
      }
      
      const sampleRes = await elasticClient.search({ index: 'schemes', size: 1 });
      const sample = sampleRes.hits.hits[0]?._source as any;
      
      if (!sample || !sample.title || !sample.keywords || !sample.categoryName || !sample.governmentLevel || !sample.verificationStatus || !sample.benefits || !sample.description) {
        throw new Error('Sample document failed structural validation (missing required fields).');
      }
      console.log(`[Index] Verification successful.`);
    } catch (e) {
      console.error(`[Index] Startup failed during ingestion/verification:`, e);
      throw e;
    }
  }

  server = app.listen(env.PORT, () => {
    logger.info("Sarkari Mitra API started", {
      environment: env.NODE_ENV,
      port: env.PORT,
    });
  });

  server.requestTimeout = env.SERVER_REQUEST_TIMEOUT_MS;
  server.headersTimeout = env.SERVER_HEADERS_TIMEOUT_MS;
  server.keepAliveTimeout = env.SERVER_KEEP_ALIVE_TIMEOUT_MS;
  server.maxRequestsPerSocket = 1_000;
};

process.on("SIGINT", () => void shutdown("SIGINT"));
process.on("SIGTERM", () => void shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason });
  void shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught exception", { error: error.message, stack: error.stack });
  void shutdown("uncaughtException");
});

void startServer().catch((error: unknown) => {
  logger.error("Failed to start server", {
    error: error instanceof Error ? error.message : String(error),
  });
  process.exit(1);
});
