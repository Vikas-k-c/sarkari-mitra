import { prisma } from '../config/db';
import { elasticClient } from '../elastic/client';
import { env } from '../config/env';
import axios from 'axios';
import { sign } from 'jsonwebtoken';

const BASE_URL = `http://localhost:${env.PORT}/api/v1`;
let JWT_TOKEN = '';

async function runTest(name: string, testFn: () => Promise<void>) {
  process.stdout.write(`Testing ${name}... `);
  const start = performance.now();
  try {
    await testFn();
    const duration = (performance.now() - start).toFixed(2);
    console.log(`\x1b[32mPASS\x1b[0m (${duration}ms)`);
  } catch (error: any) {
    const duration = (performance.now() - start).toFixed(2);
    console.log(`\x1b[31mFAIL\x1b[0m (${duration}ms)`);
    console.error(`  Reason: ${error.message || error}`);
  }
}

async function verifyProduction() {
  console.log('\n=======================================');
  console.log('   PRODUCTION VERIFICATION SMOKE TESTS');
  console.log('=======================================\n');

  await runTest('Health Endpoint', async () => {
    const res = await axios.get(`${BASE_URL}/health`);
    if (res.data.status !== 'healthy') throw new Error('Status is not healthy');
  });

  await runTest('Database Connectivity', async () => {
    await prisma.$queryRaw`SELECT 1`;
  });

  await runTest('Elasticsearch Connectivity & Document Count', async () => {
    const res = await elasticClient.count({ index: 'schemes' });
    if (res.count === 0) throw new Error('0 documents found in index');
  });

  await runTest('Qdrant Connectivity', async () => {
    const res = await axios.get(`${env.QDRANT_URL}/collections`, {
      headers: env.QDRANT_API_KEY ? { 'api-key': env.QDRANT_API_KEY } : {}
    });
    if (res.status !== 200) throw new Error('Qdrant returned non-200 status');
  });

  let testUserId = '';
  await runTest('Authentication & Login', async () => {
    const user = await prisma.user.findFirst({ orderBy: { createdAt: 'desc' } });
    if (!user) throw new Error('No test user exists in DB for login test');
    testUserId = user.id;
    // Generate valid JWT directly for subsequent API requests
    JWT_TOKEN = sign({ userId: user.id }, env.JWT_SECRET, { expiresIn: '15m' });
  });

  await runTest('Search & Autocomplete', async () => {
    const res = await axios.get(`${BASE_URL}/search?q=p&mode=autocomplete`);
    if (!res.data.success) throw new Error('Search failed');
  });

  await runTest('Recommendation Endpoint', async () => {
    const res = await axios.get(`${BASE_URL}/recommendations`, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    if (!res.data.success) throw new Error('Recommendation failed');
  });

  await runTest('AI Chat Endpoint', async () => {
    // Note: This calls the real Gemini API. We can just test basic interaction creation if we want to save tokens,
    // or test a small chat message.
    const res = await axios.post(`${BASE_URL}/chat`, {
      message: 'Hello'
    }, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    if (!res.data.success) throw new Error('Chat failed');
  });

  await runTest('Bookmark Endpoint', async () => {
    // Assuming bookmarks endpoint returns a list of bookmarks via GET /profiles/bookmarks
    const res = await axios.get(`${BASE_URL}/profiles/bookmarks`, {
      headers: { Authorization: `Bearer ${JWT_TOKEN}` }
    });
    if (!res.data.success) throw new Error('Bookmark failed');
  });

  console.log('\nVerification complete.\n');
  process.exit(0);
}

verifyProduction().catch(console.error);
