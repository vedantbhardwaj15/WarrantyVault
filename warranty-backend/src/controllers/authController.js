import { createExpressSupabaseClient } from '../utils/supabaseServer.js';

export const setSession = async (req, res) => {
  const { access_token, refresh_token } = req.body;

  if (!access_token || !refresh_token) {
    return res.status(400).json({ error: 'Missing tokens' });
  }

  const supabase = createExpressSupabaseClient(req, res);

  const { error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  return res.json({ ok: true });
};

export const refreshSession = async (req, res) => {
  // This might be redundant if we rely on getUser to refresh, 
  // but keeping it for explicit refresh calls if needed.
  // Note: createServerClient handles cookie reading automatically.
  
  const supabase = createExpressSupabaseClient(req, res);
  
  // We can't easily get the refresh token string directly from the cookie here 
  // without parsing it manually again, but we can just call getUser 
  // which triggers a refresh if the access token is expired.
  // Alternatively, we can use supabase.auth.refreshSession() but it needs a token.
  
  // Best practice with SSR client: just calling getUser handles the refresh logic internally
  // and updates the cookies via the response headers.
  
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return res.status(401).json({ error: 'Failed to refresh session' });
  }

  return res.json({ ok: true, user });
};

export const logout = async (req, res) => {
  const supabase = createExpressSupabaseClient(req, res);
  const { error } = await supabase.auth.signOut();
  
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ ok: true });
};

export const getUser = async (req, res) => {
  const supabase = createExpressSupabaseClient(req, res);
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return res.json({ ok: true, user });
};
