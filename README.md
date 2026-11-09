# LIZA UGC — Portfolio website

React + Vite frontend with a Supabase backend (Auth, Postgres, and one Edge Function).
Originally exported from Figma Make: https://www.figma.com/design/c4lFwvjRESeN0WInbGokEb/Portfolio-website-for-influencer

## 1. Connect your Supabase project

Use the [Supabase CLI](https://supabase.com/docs/guides/cli) through `npx` (a global `npm i -g supabase` is not supported):

```bash
npx supabase login
npx supabase link --project-ref YOUR-PROJECT-REF
npx supabase db push                                   # creates the kv_store_675548e5 table
npx supabase functions deploy make-server-675548e5     # deploys the API
npx supabase secrets set ADMIN_EMAILS=you@example.com  # who may use /admin (comma-separated)
```

Then create your admin login in the Supabase dashboard:
**Authentication → Users → Add user → Create new user** (use the same email as `ADMIN_EMAILS`, tick "Auto Confirm User").
Public sign-up is intentionally disabled in this app.

## 2. Run locally

```bash
cp .env.example .env.local   # then fill in the values from Project Settings → API
npm install
npm run dev
```

## 3. Deploy the frontend

Works on Vercel or Netlify out of the box (`vercel.json` / `netlify.toml` are included; both handle SPA routing).

1. Push this folder to a GitHub repo and import it in Vercel/Netlify.
2. Set the environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Build command `npm run build`, output directory `dist`.

The anon key is safe to expose in the browser. Never put the `service_role` key in the frontend.
