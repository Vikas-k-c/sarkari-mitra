import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

// We fall back to a dummy key to avoid initialization errors if not set, 
// though actual calls will fail without a valid key.
export const gemini = new GoogleGenerativeAI(env.GEMINI_API_KEY || 'DUMMY_KEY');
