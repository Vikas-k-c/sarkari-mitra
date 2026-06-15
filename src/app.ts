import cors from "cors";
import express from "express";
import type { RequestHandler } from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import { corsOptions } from "./config/cors";
import { prisma } from "./config/db";
import { env } from "./config/env";
import { apiRateLimiter } from "./config/rate-limit";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";
import { notFoundHandler } from "./middleware/not-found.middleware";
import { requestId } from "./middleware/request-id.middleware";
import apiRouter from "./routes";
import { asyncHandler } from "./utils/async-handler";
import { sendSuccess } from "./utils/response";

const app = express();

const swaggerContentSecurityPolicy: RequestHandler = (_req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'"
  );
  next();
};

app.disable("x-powered-by");

if (env.TRUST_PROXY_HOPS > 0) {
  app.set("trust proxy", env.TRUST_PROXY_HOPS);
}

app.use(requestId);
app.use(helmet());
app.use(cors(corsOptions));
app.use(morgan(env.LOG_FORMAT));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

if (env.SWAGGER_ENABLED) {
  app.get("/api-docs.json", (_req, res) => {
    res.status(200).json(swaggerSpec);
  });

  app.use(
    "/api-docs",
    swaggerContentSecurityPolicy,
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, false, {
      customSiteTitle: "Sarkari Mitra API Documentation",
      customCss: ".swagger-ui .topbar { display: none }",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        tryItOutEnabled: true,
      },
    })
  );
}

app.get("/", (req, res) => {
  sendSuccess(res, {
    data: {
      name: "Sarkari Mitra API",
      version: "v1",
      health: {
        liveness: "/health/live",
        readiness: "/health/ready",
      },
      apiBaseUrl: "/api/v1",
      ...(env.SWAGGER_ENABLED && { documentation: "/api-docs" }),
    },
    requestId: req.id,
  });
});

app.get("/health/live", (req, res) => {
  sendSuccess(res, {
    data: { status: "ok", uptimeSeconds: Math.floor(process.uptime()) },
    requestId: req.id,
  });
});

app.get(
  "/health/ready",
  asyncHandler(async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    sendSuccess(res, {
      data: { status: "ready" },
      requestId: req.id,
    });
  })
);

app.use("/api/v1", apiRateLimiter, apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
