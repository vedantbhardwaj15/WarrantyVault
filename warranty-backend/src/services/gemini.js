import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeWarrantySlip(imageUrl) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Fetch the image from the URL
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const prompt = `
      Analyze this warranty slip/invoice image and extract the following details in JSON format:
      - product_name (string)
      - purchase_date (YYYY-MM-DD)
      - warranty_period (string, e.g., "1 year", "24 months")
      - expiry_date (YYYY-MM-DD, calculate if not explicitly stated based on purchase date and warranty period)
      - serial_number (string, if available)
      
      Return ONLY the JSON object, no code blocks.
    `;

    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: "image/jpeg", // Assuming JPEG for now, ideally detect mime type
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text();
    
    // Clean up markdown code blocks if present
    const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error analyzing warranty slip:", error);
    throw error;
  }
}
