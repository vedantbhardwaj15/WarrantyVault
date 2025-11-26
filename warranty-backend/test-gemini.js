import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // There isn't a direct listModels on the instance in the node SDK easily exposed without looking at docs, 
    // but the error message suggested calling ListModels.
    // Actually, let's just try to run a simple generation with 'gemini-1.5-flash' to see if it fails here too.
    
    const result = await model.generateContent("Hello");
    console.log("Success:", result.response.text());
  } catch (error) {
    console.error("Error:", error.message);
  }
}

listModels();
