import dotenv from "dotenv";
dotenv.config();

import { createExpressSupabaseClient } from '../utils/supabaseServer.js';

export const supabaseAuth = async (req, res, next) => {
  try {
    const supabase = createExpressSupabaseClient(req, res);

    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      // console.error("Auth error:", error);
      return res.status(401).json({ error: "Unauthorized" });
    }

    req.user = user;
    req.supabase = supabase;
    next();

  } catch (err) {
    console.error("Auth exception:", err);
    res.status(500).json({ error: "Auth middleware failed" });
  }
};
