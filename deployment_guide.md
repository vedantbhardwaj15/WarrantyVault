# Deployment Guide for WarrantyVault

## 1. Prerequisites
- **GitHub Account**: Push your code to a GitHub repository.
- **Vercel Account**: For Frontend (and optional Backend).
- **Render Account**: For Backend (Alternative).
- **Supabase Project**: You already have this.

## 2. Database Setup (Supabase)
1. Go to your Supabase Dashboard -> SQL Editor.
2. Copy the content of `warranty-backend/src/db/schema.sql`.
3. Run the SQL to create the `warranties` table and RLS policies.
4. Go to Storage -> Create a new bucket named `warranties`.
   - Toggle "Public bucket" to OFF (we use signed URLs).
   - Ensure RLS policies from `schema.sql` are applied.

## 3. Backend Deployment

### Option A: Render (Free Web Service)
1. Create a new **Web Service** on Render.
2. Connect your GitHub repo.
3. **Root Directory**: `warranty-backend`
4. **Build Command**: `pnpm install`
5. **Start Command**: `node src/server.js`
6. **Environment Variables**:
   - `SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Service Role Key
   - `GEMINI_API_KEY`: Your Gemini API Key
   - `PORT`: `10000` (Render default)

### Option B: Vercel (Serverless)
1. Create a `vercel.json` in `warranty-backend`:
   ```json
   {
     "version": 2,
     "builds": [{ "src": "src/server.js", "use": "@vercel/node" }],
     "routes": [{ "src": "/(.*)", "dest": "src/server.js" }]
   }
   ```
2. Deploy using Vercel CLI or Dashboard.

## 4. Frontend Deployment (Vercel)
1. Go to Vercel Dashboard -> Add New Project.
2. Import your GitHub repo.
3. **Root Directory**: `warranty-frontend`
4. **Framework Preset**: Vite
5. **Environment Variables**:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Anon Key
   - `VITE_API_URL`: The URL of your deployed backend (e.g., `https://warranty-backend.onrender.com`)
6. Click **Deploy**.

## 5. Final Checks
- Ensure CORS in Backend (`src/server.js`) allows your Frontend domain.
  - Currently `app.use(cors())` allows all, which is fine for testing but restrict it for production.
