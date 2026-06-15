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
  const { initializeElasticsearch } = await import('./elastic/client');
  await initializeElasticsearch();
  
  const { startIngestionScheduler } = await import('./modules/ingestion/scheduler');
  startIngestionScheduler();

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
