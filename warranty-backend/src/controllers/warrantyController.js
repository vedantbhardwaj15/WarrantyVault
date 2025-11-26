import { supabase } from '../config/supabase.js';

// Add warranty: receives JSON data and inserts into DB
export const addWarranty = async (req, res) => {
  try {
    const user = req.user;
    const body = req.body;

    console.log('Adding warranty for user:', user.id);
    console.log('Request body:', JSON.stringify(body));

    // Validate required fields
    if (!body.file_path) {
      console.error('Missing file_path');
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

    console.log('Insert Object:', insertObj);

    const { data, error } = await supabase
      .from('warranties')
      .insert([insertObj])
      .select()
      .single();

    if (error) {
      console.error('Supabase DB Insert Error:', error);
      return res.status(500).json({ error: error.message, details: error });
    }

    console.log('Warranty saved successfully:', data);
    return res.json({ ok: true, warranty: data });
  } catch (err) {
    console.error('Exception in addWarranty:', err);
    return res.status(500).json({ error: err.toString() });
  }
};

export const getWarranties = async (req, res) => {
  try {
    const user = req.user;
    const { data, error } = await supabase
      .from('warranties')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error });
    
    // Generate signed URLs for display
    const warrantiesWithUrls = await Promise.all(data.map(async (item) => {
        if (item.file_path) {
            const { data: signedData } = await supabase.storage
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

export const getWarrantyById = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;

    const { data, error } = await supabase
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
