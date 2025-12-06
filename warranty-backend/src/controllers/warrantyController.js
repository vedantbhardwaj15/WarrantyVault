// import { supabase } from '../config/supabase.js'; // Removed global client usage
import { validateWarranty } from '../utils/validation.js';

//ADD MANUAL WARRANTY
export const addWarranty = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body;

    console.log('Adding warranty for user:', user.id);

    // Zod Validation
    const validation = validateWarranty({ ...body, file_path: body.file_path });
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors[0].message });
    }

    if (!body.file_path) {
      return res.status(400).json({ error: 'Missing file_path' });
    }

    const insertObj = {
      user_id: user.id,
      file_path: body.file_path,
      product_name: body.product_name || null,
      purchase_date: body.purchase_date || null,
      warranty_period: body.warranty_period || null, 
      expiry_date: body.expiry_date || null,
      serial_number: body.serial_number || null,
    };

    const { data, error } = await req.supabase
      .from('warranties')
      .insert([insertObj])
      .select()
      .single();

    if (error) {
      console.error('Supabase DB Insert Error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true, warranty: data });
  } catch (err) {
    console.error('Exception in addWarranty:', err);
    return res.status(500).json({ error: err.toString() });
  }
};

//GET ALL WARRANTIES
export const getWarranties = async (req, res) => {
  try {
    const user = req.user;
    const { data, error } = await req.supabase
      .from('warranties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error });
    
    // Generate signed URLs for display
    const warrantiesWithUrls = await Promise.all(data.map(async (item) => {
        if (item.file_path) {
            const { data: signedData } = await req.supabase.storage
                .from('warranties')
                .createSignedUrl(item.file_path, 3600); // 1 hour
            return { ...item, card_url: signedData?.signedUrl };
        }
        return item;
    }));

    return res.json({ ok: true, warranties: warrantiesWithUrls });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.toString() });
  }
};

//GET SINGLE WARRANTY
export const getWarrantyById = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    const { data, error } = await req.supabase
      .from('warranties')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) return res.status(404).json({ error: 'Not found' });

    if (data.file_path) {
        const { data: signedData } = await supabase.storage
            .from('warranties')
            .createSignedUrl(data.file_path, 3600);
        data.card_url = signedData?.signedUrl;
    }

    return res.json({ ok: true, warranty: data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.toString() });
  }
};

//DELETE WARRANTY
export const deleteWarranty = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    // 1. Get the warranty to find the file path
    const { data: warranty, error: fetchError } = await supabase
      .from('warranties')
      .select('file_path')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError) return res.status(404).json({ error: 'Warranty not found' });

    // 2. Delete file from storage if it exists
    if (warranty.file_path) {
      const { error: storageError } = await req.supabase.storage
        .from('warranties')
        .remove([warranty.file_path]);
      
      if (storageError) console.error('Error deleting file:', storageError);
    }

    // 3. Delete record from DB
    const { error: deleteError } = await supabase
      .from('warranties')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) throw deleteError;

    return res.json({ ok: true });
  } catch (err) {
    console.error('Error deleting warranty:', err);
    return res.status(500).json({ error: err.toString() });
  }
};

//UPDATE WARRANTY
export const updateWarranty = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const body = req.body;

    console.log(`Updating warranty ${id} for user ${user.id}`, body);

    // Zod Validation
    const validation = validateWarranty(body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors[0].message });
    }

    const updateObj = {
      product_name: body.product_name,
      purchase_date: body.purchase_date,
      expiry_date: body.expiry_date,
      serial_number: body.serial_number,
      warranty_period: body.warranty_period
    };

    // Remove undefined keys
    Object.keys(updateObj).forEach(key => updateObj[key] === undefined && delete updateObj[key]);

    const { data, error } = await req.supabase
      .from('warranties')
      .update(updateObj)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase DB Update Error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.json({ ok: true, warranty: data });
  } catch (err) {
    console.error('Exception in updateWarranty:', err);
    return res.status(500).json({ error: err.toString() });
  }
};

//UPLOAD WARRANTY
export const uploadWarranty = async (req, res) => {
  try {
    console.log('Upload endpoint hit');
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const userId = req.user.id;
    const file = req.file;
    
    // 1. Upload file to Supabase Storage
    const fileExt = file.originalname.split('.').pop();
    const timestamp = Date.now();
    const filePath = `${userId}/${timestamp}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await req.supabase.storage
      .from('warranties')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false
      });
    
    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      return res.status(500).json({ error: 'Storage upload failed', details: uploadError.message });
    }
    
    // 2. Generate signed URL for OCR analysis
    const { data: signedUrlData } = await req.supabase.storage
      .from('warranties')
      .createSignedUrl(filePath, 3600);
    
    if (!signedUrlData || !signedUrlData.signedUrl) {
      return res.status(500).json({ error: 'Failed to generate image URL for analysis' });
    }
    
    // 3. Analyze with Gemini OCR
    console.log('Analyzing receipt with Gemini OCR...');
    const { analyzeWarrantySlip } = await import('../services/gemini.js');
    
    let extractedData = {};
    try {
      extractedData = await analyzeWarrantySlip(signedUrlData.signedUrl, file.mimetype);
      console.log('OCR Extraction successful:', extractedData);
    } catch (ocrError) {
      console.error('OCR analysis failed:', ocrError);
      // Continue even if OCR fails, so the file is saved, but data will be null
    }
    
    // 4. Logic: Handle Dates (The Critical Fix)
    // If OCR fails or returns null, we KEEP it null. We do NOT use new Date().
    const purchaseDate = extractedData.purchase_date || null;
    let expiryDate = extractedData.expiry_date || null;
    
    // Default warranty period (1 year)
    let warrantyPeriodDays = 365; 

    // Only attempt to calculate expiry if we actually have a valid purchase date
    if (purchaseDate && !expiryDate) {
      const purchase = new Date(purchaseDate);
      const calculatedExpiry = new Date(purchase);
      calculatedExpiry.setDate(calculatedExpiry.getDate() + warrantyPeriodDays);
      
      // Validate the calculated date
      if (!isNaN(calculatedExpiry.getTime())) {
        expiryDate = calculatedExpiry.toISOString().split('T')[0];
      }
    }
    
    // 5. Prepare Database Record
    const warrantyData = {
      user_id: userId,
      file_path: filePath,
      product_name: extractedData.product_name || "Unknown Item",
      
      // These will be NULL if OCR failed, allowing the Frontend to handle "Missing Date" state
      purchase_date: purchaseDate,
      warranty_period: warrantyPeriodDays, 
      expiry_date: expiryDate,
      serial_number: extractedData.serial_number || null
    };
    
    console.log('Creating warranty record:', warrantyData);
    
    // 6. Save to Database
    const { data: warrantyRecord, error: dbError } = await supabase
      .from('warranties')
      .insert([warrantyData])
      .select()
      .single();
    
    if (dbError) {
      console.error('Database insert error:', dbError);
      // Clean up the uploaded file if DB insert fails to prevent orphans
      await req.supabase.storage.from('warranties').remove([filePath]);
      return res.status(500).json({ error: 'Database insert failed', details: dbError.message });
    }
    
    return res.json({ 
      success: true, 
      message: 'Warranty uploaded successfully',
      warranty: warrantyRecord,
      extracted_data: extractedData
    });

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Upload failed', details: error.message });
  }
};