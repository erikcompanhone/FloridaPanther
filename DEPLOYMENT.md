# Deployment Guide for Florida Panther Tracker

## Pre-Deployment Checklist

### 1. Database Setup (Supabase)
- [ ] Create a new Supabase project
- [ ] Run the SQL schema from `scripts/supabase-functions.sql`
- [ ] Import data from `db/panther_backup.sql` to Supabase
- [ ] Note down the Supabase URL and anon key

### 2. Environment Configuration
- [ ] Create `.env` file in root directory
- [ ] Add your Supabase credentials:
  ```env
  VITE_SUPABASE_URL=your_supabase_project_url
  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
  ```

### 3. Local Testing
- [ ] Run `npm install` in frontend directory
- [ ] Run `npm run dev` to test locally
- [ ] Verify all routes work: `/`, `/telemetry`, `/mortality`
- [ ] Test API endpoints with filters
- [ ] Check map clustering and visualizations

## Vercel Deployment

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### Option 2: Vercel Dashboard

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add `VITE_SUPABASE_URL`
   - Add `VITE_SUPABASE_ANON_KEY`
   - Apply to: Production, Preview, Development

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

### Custom Domain Configuration

1. **Add Domain in Vercel Dashboard**
   - Go to Project Settings → Domains
   - Add `panther.erikcompanhone.com`
   - Follow DNS configuration instructions

2. **Configure DNS (with your domain provider)**
   - Add a CNAME record:
     - Name: `panther`
     - Value: `cname.vercel-dns.com`
     - TTL: Auto or 3600

3. **Verify SSL Certificate**
   - Vercel automatically provisions SSL
   - Wait for DNS propagation (up to 48 hours)
   - Test HTTPS access

## Post-Deployment Verification

- [ ] Visit https://panther.erikcompanhone.com
- [ ] Test home page loads correctly
- [ ] Test telemetry page with filters
- [ ] Test mortality page with filters
- [ ] Verify map clustering works on mobile
- [ ] Check console for errors (F12)
- [ ] Test 404 page by visiting invalid route
- [ ] Verify responsive design on mobile (320px+)

## Troubleshooting

### Build Fails
- Check all dependencies are in `frontend/package.json`
- Verify `vercel.json` is in root directory
- Ensure environment variables are set

### API Errors
- Verify Supabase credentials in environment variables
- Check Supabase RPC functions are created
- Review API function logs in Vercel dashboard

### Map Not Loading
- Check Leaflet CSS imports in `App.jsx`
- Verify coordinate projection in data
- Check browser console for errors

### Styling Issues
- Ensure `variables.css` and `responsive.css` are imported in `App.jsx`
- Clear browser cache
- Check CSS specificity conflicts

## Monitoring

### Vercel Analytics
- Go to Project → Analytics
- Monitor page views and performance
- Track Core Web Vitals

### Error Tracking
- Check Function Logs in Vercel dashboard
- Monitor Runtime Logs for API errors
- Set up Vercel notifications for failed deployments

## Rollback Plan

If deployment fails:
```bash
# List previous deployments
vercel list

# Promote a previous deployment to production
vercel promote [deployment-url]
```

## Performance Optimization

### Already Implemented
✅ Leaflet marker clustering for 40k+ records
✅ Mobile-first responsive design
✅ Serverless functions for API
✅ Code splitting with Vite
✅ CSS variables for consistent theming

### Future Enhancements
- [ ] Add React lazy loading for routes
- [ ] Implement service worker for offline support
- [ ] Add PWA manifest for mobile install
- [ ] Set up CDN caching for static assets
- [ ] Add analytics tracking (Google Analytics/Plausible)

## Support

- **Repository:** https://github.com/erikalmeidah/FloridaPanther
- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **React Router:** https://reactrouter.com/en/main
