import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';

export const createExpressSupabaseClient = (req, res) => {
  return createServerClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? '');
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.append('Set-Cookie', serializeCookieHeader(name, value, options));
          });
        },
      },
    }
  );
};
