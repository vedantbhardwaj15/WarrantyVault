const { GoogleGenAI } = require("@google/genai");

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function extractWarrantyDetails(file) {
  // Ensure you have a valid multer file object
  const base64Data = file.buffer.toString("base64");
  const prompt = `
Extract warranty information as JSON with these fields:
brand, productName, model, serialNumber, purchaseDate (YYYY-MM-DD), warrantyDuration, warrantyExpiryDate (YYYY-MM-DD).
If missing, set value to "N/A". Only output the JSON, no markdown or explanation.
`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash", // or your available vision model
    contents: [
      {
        role: "user",
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: base64Data,
              mimeType: file.mimetype
            }
          }
        ]
      }
    ],
  });

  // Parse JSON from Gemini's response (may need robust cleaning)
  let text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  if (!text) throw new Error("No result from Gemini.");
  const jsonMatch = text.match(/\{[\s\S]+\}/);
  if (!jsonMatch) throw new Error("No JSON in Gemini output.");
  return JSON.parse(jsonMatch[0]);
}

module.exports = { extractWarrantyDetails };
