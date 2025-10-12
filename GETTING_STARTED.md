# 🎯 Step-by-Step Deployment Guide

## Phase 1: Supabase Database Setup (20 minutes)

### Step 1: Create Supabase Account & Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project" → Sign up with GitHub
3. Click "New Project"
   - **Organization:** Create new or use existing
   - **Name:** `florida-panther` (or any name)
   - **Database Password:** Generate strong password (SAVE THIS!)
   - **Region:** Choose closest to your users (e.g., `East US`)
   - **Pricing:** Free tier is perfect for this project
4. Wait ~2 minutes for database to initialize

### Step 2: Import Your Database Schema
1. In Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click **"+ New query"**
3. Open your local file: `scripts/supabase-functions.sql`
4. Copy the entire contents and paste into Supabase SQL Editor
5. Click **"Run"** (or press Ctrl+Enter)
6. You should see: `Success. No rows returned`

### Step 3: Import Your Data
1. In Supabase, go to **Table Editor** (left sidebar)
2. You should see 3 tables: `panther`, `telemetry`, `mortality` (created by the script)
3. Now import your data from `db/panther_backup.sql`:

**Option A: Use pgAdmin or TablePlus (Recommended for large data)**
- Get connection string from Supabase:
  - Click **Database** → **Connection string** → Copy **URI**
  - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`
- Use pgAdmin/TablePlus to connect and run `panther_backup.sql`

**Option B: Use Supabase SQL Editor (if file < 2MB)**
- Open `db/panther_backup.sql` in text editor
- Copy INSERT statements
- Paste in SQL Editor and run

**Option C: Use CSV Import (Alternative)**
- Export your MySQL data to CSV files
- In Table Editor, click table → Import from CSV

### Step 4: Test Your Database Functions
1. In Supabase SQL Editor, test each function:
```sql
-- Test telemetry query 1 (top locations by sex)
SELECT * FROM telemetry_query_1('Male');

-- Test telemetry query 2 (timeline)
SELECT * FROM telemetry_query_2(0, 10, 'Female');

-- Test mortality query 1 (heatmap)
SELECT * FROM mortality_query_1(0, 10, 'Male', 2000, 2024);

-- Test mortality query 2 (top causes)
SELECT * FROM mortality_query_2(0, 10, 'Female');
```
If you see data returned, ✅ database is ready!

### Step 5: Get Your Supabase Credentials
1. In Supabase, click **Project Settings** (gear icon in sidebar)
2. Go to **API** section
3. Copy these two values:
   - **Project URL** (e.g., `https://xyzabc123.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
4. Keep these handy for next phase!

---

## Phase 2: Local Testing with Supabase (10 minutes)

### Step 1: Create Environment File
```powershell
# In your project root
cd C:\Users\ecomp\Desktop\FloridaPanther

# Copy the example file
Copy-Item .env.example .env

# Edit the .env file
notepad .env
```

Add your Supabase credentials:
```env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-long-key-here
```

### Step 2: Test Locally
```powershell
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start dev server
npm run dev
```

Open http://localhost:5173 and test:
- ✅ Home page loads
- ✅ Click "Telemetry" → Try filters → Should fetch data from Supabase
- ✅ Click "Mortality" → Try filters → Should fetch data from Supabase
- ✅ Maps display correctly with clustering
- ✅ Charts render with data

If everything works locally, ✅ ready for production!

---

## Phase 3: Vercel Deployment (15 minutes)

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" → Choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub repos

### Step 2: Import Your Repository
1. In Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your `FloridaPanther` repository
3. Click **"Import"**

### Step 3: Configure Build Settings
Vercel should auto-detect Vite, but verify:
- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`

### Step 4: Add Environment Variables
1. Scroll to **"Environment Variables"** section
2. Add your Supabase credentials:
   ```
   Name: VITE_SUPABASE_URL
   Value: https://xyzabc123.supabase.co

   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGc...your-long-key-here
   ```
3. Make sure they apply to: **Production, Preview, Development**

### Step 5: Deploy!
1. Click **"Deploy"**
2. Wait 2-3 minutes for build to complete
3. You'll get a URL like: `florida-panther-xxxx.vercel.app`
4. Test the deployment:
   - Visit the URL
   - Test telemetry and mortality pages
   - Verify data loads from Supabase

---

## Phase 4: Custom Domain Setup (10 minutes)

### Step 1: Add Domain in Vercel
1. In your Vercel project, go to **Settings** → **Domains**
2. Click **"Add"**
3. Enter: `panther.erikcompanhone.com`
4. Click **"Add"**

### Step 2: Configure DNS
Vercel will show you DNS records to add. You need to add this to your domain provider:

**Option A: CNAME Record (Recommended)**
```
Type: CNAME
Name: panther
Value: cname.vercel-dns.com
TTL: Auto (or 3600)
```

**Option B: A Record (Alternative)**
```
Type: A
Name: panther
Value: 76.76.21.21
TTL: Auto (or 3600)
```

### Step 3: DNS Provider Instructions

**For Namecheap:**
1. Login → Domain List → Manage → Advanced DNS
2. Add New Record → CNAME Record
3. Host: `panther`, Value: `cname.vercel-dns.com`

**For GoDaddy:**
1. My Products → DNS
2. Add → CNAME → Name: `panther`, Value: `cname.vercel-dns.com`

**For Cloudflare:**
1. DNS → Add record → CNAME
2. Name: `panther`, Target: `cname.vercel-dns.com`, Proxy off

### Step 4: Wait for SSL
1. DNS propagation: 5 minutes - 48 hours (usually ~10 mins)
2. Vercel will auto-provision SSL certificate
3. Check status in Vercel → Domains
4. When you see ✅ "Valid Configuration", you're live!

---

## Phase 5: Final Verification (5 minutes)

### Test Everything
Visit `https://panther.erikcompanhone.com` and verify:

**✅ Home Page**
- [ ] Hero section displays
- [ ] Stats show (40k+ telemetry, 600+ mortality)
- [ ] Feature cards link to pages

**✅ Telemetry Page**
- [ ] Select sex → Click "Show Locations"
- [ ] Map loads with clustered markers
- [ ] Zoom in → clusters break apart
- [ ] Timeline query works with filters

**✅ Mortality Page**
- [ ] Heatmap query loads data
- [ ] Map displays correctly
- [ ] Bar chart shows top causes
- [ ] Filters work properly

**✅ Mobile Responsive**
- [ ] Test on phone or use DevTools (F12 → Toggle device toolbar)
- [ ] Navigation works
- [ ] Filters stack vertically
- [ ] Charts resize properly

**✅ Performance**
- [ ] Map handles 40k+ points smoothly
- [ ] No console errors (F12)
- [ ] SSL certificate valid (🔒 in browser)

---

## Troubleshooting

### "Error: Invalid Supabase client options"
- Check `.env` file has correct VITE_ prefix
- Restart dev server after changing .env
- In Vercel, verify environment variables are set

### "Failed to fetch" or CORS errors
- Verify Supabase RPC functions exist (run test queries in SQL Editor)
- Check API functions in `api/` folder are deployed
- Verify `vercel.json` is in root directory

### Map not loading
- Check browser console for errors
- Verify Leaflet CSS is imported in `App.jsx`
- Test with smaller dataset first

### DNS not working
- Use [dnschecker.org](https://dnschecker.org) to verify propagation
- Wait up to 48 hours for full propagation
- Try incognito mode or different browser

### Build fails on Vercel
- Check build logs for specific error
- Verify `frontend/package.json` has all dependencies
- Ensure `vercel.json` specifies correct root directory

---

## Need Help?

**Supabase Docs:** https://supabase.com/docs  
**Vercel Docs:** https://vercel.com/docs  
**Your Deployment Guide:** `DEPLOYMENT.md` in your repo

---

## Time Estimate
- ⏱️ **Phase 1 (Supabase):** 20 minutes
- ⏱️ **Phase 2 (Local Test):** 10 minutes  
- ⏱️ **Phase 3 (Vercel):** 15 minutes
- ⏱️ **Phase 4 (Domain):** 10 minutes
- ⏱️ **Phase 5 (Testing):** 5 minutes

**Total:** ~60 minutes (excluding DNS propagation wait time)

---

## 🎉 Success!
Once everything is working at `https://panther.erikcompanhone.com`, you're done! 

Your app will have:
- ✅ 40k+ telemetry records with map clustering
- ✅ 600+ mortality records with visualizations
- ✅ Mobile-responsive design
- ✅ Serverless architecture (auto-scales)
- ✅ SSL encryption
- ✅ Professional subdomain

**Next commit:** After confirming deployment works, delete the old `backend/` folder! 🧹
