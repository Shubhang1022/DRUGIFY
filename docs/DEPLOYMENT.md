# 🚀 DRUGIFY Deployment Guide

## Overview

This guide covers deploying DRUGIFY to production with Vercel (frontend) and Railway/Render (backend).

---

## Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway or Render account (for backend)
- Supabase account (for authentication)
- Domain name (optional)

---

## Part 1: Supabase Production Setup

### 1. Create Production Project

1. Go to https://supabase.com
2. Create a new project for production
3. Choose a strong database password
4. Select production region

### 2. Configure Authentication

1. Go to Authentication > Providers
2. Enable Google OAuth (recommended)
3. Add production URLs to allowed redirect URLs:
   - `https://yourdomain.com/**`
   - `https://yourdomain.vercel.app/**`

### 3. Get Production Credentials

1. Go to Settings > API
2. Copy Project URL
3. Copy anon/public key
4. Save these for deployment

---

## Part 2: Frontend Deployment (Vercel)

### Option A: Deploy via Vercel Dashboard

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Build Settings**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=https://your-production-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-production-anon-key
   VITE_API_URL=https://your-backend-url.railway.app
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your site will be live at `https://your-project.vercel.app`

### Option B: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_PUBLISHABLE_KEY
vercel env add VITE_API_URL

# Deploy to production
vercel --prod
```

---

## Part 3: Backend Deployment (Railway)

### 1. Prepare Backend

Create `railway.json` in backend folder:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

Create `Procfile` in backend folder:
```
web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### 2. Deploy to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository
5. Select the `backend` folder as root

### 3. Configure Environment Variables

Add these in Railway dashboard:
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://yourdomain.com
```

### 4. Get Backend URL

- Railway will provide a URL like: `https://your-app.railway.app`
- Copy this URL
- Update `VITE_API_URL` in Vercel environment variables

---

## Part 4: Backend Deployment (Alternative: Render)

### 1. Create Web Service

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - Name: drugify-backend
   - Root Directory: `backend`
   - Environment: Python 3
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 2. Add Environment Variables

Same as Railway (see above)

### 3. Deploy

- Click "Create Web Service"
- Wait for deployment
- Get your backend URL

---

## Part 5: Database Setup (Production)

### Option A: Use Supabase PostgreSQL

1. In Supabase dashboard, go to SQL Editor
2. Run this SQL:

```sql
-- Create analysis_history table
CREATE TABLE analysis_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  patient_id TEXT,
  drugs_analyzed TEXT[],
  risk_count JSONB,
  report_data JSONB
);

-- Enable Row Level Security
ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own analyses"
  ON analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses"
  ON analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Option B: Use Railway PostgreSQL

1. In Railway, add PostgreSQL plugin
2. Connect to database
3. Run migrations

---

## Part 6: Custom Domain (Optional)

### Vercel Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your domain: `drugify.com`
4. Follow DNS configuration instructions
5. Add DNS records:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21

   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Backend Subdomain

1. Add CNAME record:
   ```
   Type: CNAME
   Name: api
   Value: your-app.railway.app
   ```

---

## Part 7: Post-Deployment Checklist

### Frontend
- [ ] Site loads at production URL
- [ ] All pages accessible
- [ ] Authentication works
- [ ] Google OAuth works
- [ ] API calls succeed
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] Custom domain configured (if applicable)

### Backend
- [ ] API responds at production URL
- [ ] Health check endpoint works
- [ ] CORS configured for frontend domain
- [ ] Database connected
- [ ] Environment variables set
- [ ] Logs accessible

### Supabase
- [ ] Production project created
- [ ] Authentication configured
- [ ] Google OAuth enabled
- [ ] Redirect URLs added
- [ ] Database tables created
- [ ] RLS policies enabled

---

## Part 8: Environment Variables Summary

### Frontend (.env)
```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJxxx...
VITE_API_URL=https://api.yourdomain.com
```

### Backend (.env)
```env
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

---

## Part 9: Monitoring & Maintenance

### Vercel
- Check deployment logs in dashboard
- Monitor analytics
- Set up error tracking

### Railway/Render
- Monitor backend logs
- Check resource usage
- Set up alerts

### Supabase
- Monitor auth logs
- Check database usage
- Review API usage

---

## Part 10: Troubleshooting

### Issue: Frontend can't connect to backend
**Solution:** 
- Check CORS settings in backend
- Verify VITE_API_URL is correct
- Ensure backend is running

### Issue: Authentication not working
**Solution:**
- Verify Supabase credentials
- Check redirect URLs in Supabase
- Ensure Google OAuth is configured

### Issue: Build fails on Vercel
**Solution:**
- Check build logs
- Verify all dependencies in package.json
- Ensure environment variables are set

### Issue: Backend crashes
**Solution:**
- Check Railway/Render logs
- Verify database connection
- Check environment variables

---

## Part 11: Rollback Procedure

### Vercel
1. Go to Deployments
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### Railway/Render
1. Go to Deployments
2. Select previous deployment
3. Click "Redeploy"

---

## Part 12: CI/CD (Optional)

### Automatic Deployments

Vercel automatically deploys on:
- Push to main branch → Production
- Push to other branches → Preview

Railway/Render automatically deploys on:
- Push to main branch → Production

### GitHub Actions (Optional)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Support

For deployment issues:
- Vercel: https://vercel.com/support
- Railway: https://railway.app/help
- Render: https://render.com/docs
- Supabase: https://supabase.com/docs

---

**Estimated Deployment Time:** 30-45 minutes  
**Difficulty:** Intermediate  
**Cost:** Free tier available for all services
