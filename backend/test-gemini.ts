import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from './src/config/env';

async function testGemini() {
  try {
    console.log("Using API Key starting with:", (env.GEMINI_API_KEY || 'DUMMY_KEY').substring(0, 5));
    const gemini = new GoogleGenerativeAI(env.GEMINI_API_KEY || 'DUMMY_KEY');
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent("Say hello");
    console.log("Success:", result.response.text());
  } catch (error: any) {
    console.error("Gemini Error:", error.message || error);
  }
}

testGemini();
