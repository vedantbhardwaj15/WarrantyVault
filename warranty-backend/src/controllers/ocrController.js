import { analyzeWarrantySlip } from '../services/gemini.js';
// import { supabase } from '../config/supabase.js'; // Removed global client usage

export const ocrExtract = async (req, res) => {
  try {
    const { filePath, userId } = req.body;

    if (!filePath || !userId) {
      return res.status(400).json({ error: 'Missing filePath or userId' });
    }

    // Generate a signed URL for the image so Gemini can access it
    // valid for 60 seconds
    const { data, error } = await req.supabase
      .storage
      .from('warranties')
      .createSignedUrl(filePath, 60);

    if (error || !data?.signedUrl) {
      console.error('Error generating signed URL:', error);
      return res.status(500).json({ error: 'Could not access file' });
    }

    const analysis = await analyzeWarrantySlip(data.signedUrl);

    return res.json({ ok: true, result: analysis });
  } catch (err) {
    console.error('OCR error', err);
    return res.status(500).json({ error: err.toString() });
  }
};
