import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      flowType: 'pkce',
      // Use sessionStorage for PKCE (code_verifier must persist during redirect)
      // sessionStorage is tab-scoped and clears on close, so it's still secure
      storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
    },
  }
);
