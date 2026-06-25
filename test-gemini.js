require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function listModels() {
  try {
    const key = process.env.GEMINI_API_KEY || 'DUMMY_KEY';
    console.log("Using API Key starting with:", key.substring(0, 5));
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    console.log("Available models:");
    if (data.models) {
      data.models.forEach(m => console.log(m.name));
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
