// Supabase connection settings, read from Vite env vars at build time.
// Set these in `.env.local` for local dev and in your hosting provider's
// environment settings for production (see `.env.example`).

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  throw new Error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local and fill in your Supabase project values.'
  );
}

// e.g. https://abcdefghijklmnop.supabase.co -> abcdefghijklmnop
export const projectId = new URL(url).hostname.split('.')[0];
export const publicAnonKey = anonKey;
