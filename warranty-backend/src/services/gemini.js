import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeWarrantySlip(imageUrl, mimeType = 'image/jpeg') {
  try {
    // Fetch and convert image to base64 in one go
    const imageResp = await fetch(imageUrl);
    if (!imageResp.ok) throw new Error(`Failed to fetch image: ${imageResp.statusText}`);
    const imageBuffer = Buffer.from(await imageResp.arrayBuffer()).toString('base64');

    // Configure model with JSON Schema (Guarantees valid JSON output)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            product_name: { type: SchemaType.STRING, nullable: true },
            purchase_date: { type: SchemaType.STRING, nullable: true, description: "Format: YYYY-MM-DD" },
            expiry_date: { type: SchemaType.STRING, nullable: true, description: "Format: YYYY-MM-DD" },
            serial_number: { type: SchemaType.STRING, nullable: true },
            confidence_score: { type: SchemaType.NUMBER, description: "0-1 score of visibility" }
          },
          required: ["product_name", "purchase_date"],
        },
      },
    });

    const prompt = `
      Analyze this receipt/warranty slip.
      
      DATE EXTRACTION RULES:
      1. Return all dates in ISO 8601 format (YYYY-MM-DD).
      2. If the locale is ambiguous (e.g. 02/03/2024), infer the format (DD/MM or MM/DD) based on currency symbols or shop location visible.
      3. **Crucial:** If 'Expiry Date' is not explicitly written, CALCULATE it based on the 'Purchase Date' + the warranty period found in the text.
      4. If no warranty period is found, assume a standard 1-year warranty for the calculation.
      
      DATA RULES:
      - Product Name: Be specific (e.g., "iPhone 15 Pro Max" instead of just "Phone").
      - Serial Number: Look for labels like S/N, IMEI, or long alphanumeric strings.
    `;

    const result = await model.generateContent([
      prompt,
      { inlineData: { data: imageBuffer, mimeType } }
    ]);

    const data = JSON.parse(result.response.text());
    
    console.log("Extracted Data:", data);
    return data;

  } catch (error) {
    console.error("OCR Failed:", error.message);
    return {
      product_name: null,
      purchase_date: null,
      expiry_date: null,
      serial_number: null,
      confidence_score: 0
    };
  }
}