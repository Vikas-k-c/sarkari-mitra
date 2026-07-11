import { Request, Response } from 'express';
import { prisma } from '../../config/db';
import { elasticClient } from '../../elastic/client';
import { env } from '../../config/env';

export const checkHealth = async (req: Request, res: Response) => {
  let dbStatus = 'disconnected';
  let esStatus = 'disconnected';
  let qdrantStatus = 'disconnected';

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'failed';
  }

  try {
    const esPing = await elasticClient.ping();
    if (esPing) esStatus = 'connected';
  } catch (e) {
    esStatus = 'failed';
  }

  try {
    const qdrantRes = await fetch(`${env.QDRANT_URL}/collections`, {
      headers: env.QDRANT_API_KEY ? { 'api-key': env.QDRANT_API_KEY } : {}
    });
    if (qdrantRes.ok) qdrantStatus = 'connected';
    else qdrantStatus = 'failed';
  } catch (e) {
    qdrantStatus = 'failed';
  }

  res.status(200).json({
    status: 'healthy',
    version: '1.0.0', // from package.json or hardcoded for now
    environment: env.NODE_ENV,
    database: dbStatus,
    elasticsearch: esStatus,
    qdrant: qdrantStatus,
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString()
  });
};
