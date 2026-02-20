# 🚀 DRUGIFY Deployment Guide

Complete step-by-step guide to deploy DRUGIFY to production.

---

## 📋 Table of Contents

1. [Deployment Architecture](#deployment-architecture)
2. [Prerequisites](#prerequisites)
3. [Option 1: Vercel (Frontend) + Railway (Backend)](#option-1-vercel-frontend--railway-backend) ⭐ RECOMMENDED
4. [Option 2: Vercel (Frontend) + Render (Backend)](#option-2-vercel-frontend--render-backend)
5. [Option 3: Full Stack on Render](#option-3-full-stack-on-render)
6. [Environment Variables](#environment-variables)
7. [Post-Deployment Checklist](#post-deployment-checklist)
8. [Troubleshooting](#troubleshooting)

---

## 🏗️ Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    DRUGIFY Architecture                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (React + Vite)          Backend (FastAPI)         │
│  ┌──────────────────┐            ┌──────────────────┐      │
│  │   Vercel CDN     │────────────│   Railway/Render │      │
│  │  Port: 443       │   HTTPS    │   Port: 8000     │      │
│  │  (Static Files)  │            │   (REST API)     │      │
│  └──────────────────┘            └──────────────────┘      │
│         │                                 │                 │
│         │                                 │                 │
│         ▼                                 ▼                 │
│  ┌──────────────────┐            ┌──────────────────┐      │
│  │  Supabase Auth   │            │  SQLite Database │      │
│  │  (Google OAuth)  │            │  (Persistent)    │      │
│  └──────────────────┘            └──────────────────┘      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Why Separate Deployments?**
- Frontend: Static files served via CDN (fast, global)
- Backend: Python API with database (needs compute resources)
- Better scalability and performance
- Independent scaling and updates

---

## ✅ Prerequisites

### 1. Accounts Required
- [ ] GitHub account (for code repository)
- [ ] Vercel account (for frontend) - https://vercel.com
- [ ] Railway account (for backend) - https://railway.app OR
- [ ] Render account (for backend) - https://render.com
- [ ] Supabase account (already have: ewhntptpsfqwuetrgyxy)

### 2. Prepare Your Code
```bash
# Make sure all changes are committed
cd pharmaguard-clinical-insights-main
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Update .gitignore
Ensure sensitive files are not committed:
```
# Already in .gitignore
.env
*.db
__pycache__/
node_modules/
dist/
```

---

## ⭐ Option 1: Vercel (Frontend) + Railway (Backend)

### STEP 1: Deploy Backend to Railway

#### 1.1 Create Railway Project
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select repository: `pharmaguard-clinical-insights-main`
6. Railway will auto-detect Python

#### 1.2 Configure Railway Settings
1. Click on your project
2. Go to "Settings" tab
3. Set **Root Directory**: `backend`
4. Set **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### 1.3 Add Environment Variables
Go to "Variables" tab and add:

```env
# Python Environment
PYTHONUNBUFFERED=1

# Application Settings
ENVIRONMENT=production
DEBUG=False
LOG_LEVEL=INFO

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
ALLOWED_HOSTS=*

# CORS - Will update after Vercel deployment
CORS_ORIGINS=https://your-app.vercel.app

# Database (SQLite - will be created automatically)
DATABASE_URL=sqlite:///./pharmaguard.db

# Rate Limiting
RATE_LIMIT_PER_MINUTE=10
MAX_UPLOAD_SIZE=5242880
```

**Important Notes:**
- Generate a secure SECRET_KEY: Use a password generator (32+ characters)
- CORS_ORIGINS: Update this after deploying frontend to Vercel
- Railway provides automatic HTTPS

#### 1.4 Deploy
1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Railway will provide a URL like: `https://your-app.railway.app`
4. **Save this URL** - you'll need it for frontend

#### 1.5 Verify Backend
1. Visit: `https://your-app.railway.app/health`
2. Should see: `{"status":"healthy","service":"drugify",...}`
3. Visit: `https://your-app.railway.app/docs` (if DEBUG=True)

---

### STEP 2: Deploy Frontend to Vercel

#### 2.1 Create Vercel Project
1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Select `pharmaguard-clinical-insights-main`

#### 2.2 Configure Build Settings
Vercel should auto-detect Vite, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

#### 2.3 Add Environment Variables
Click "Environment Variables" and add:

```env
# Supabase Configuration (Your existing credentials)
VITE_SUPABASE_PROJECT_ID=ewhntptpsfqwuetrgyxy
VITE_SUPABASE_URL=https://ewhntptpsfqwuetrgyxy.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aG50cHRwc2Zxd3VldHJneXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODY0ODksImV4cCI6MjA4NzA2MjQ4OX0.dvsXMrrZ6HJ54GZ4U2JoaVd6whQdingbXo0MB6fC2rw

# Backend API URL (from Railway deployment)
VITE_API_URL=https://your-app.railway.app
```

**Important:**
- Replace `https://your-app.railway.app` with your actual Railway URL
- Make sure there's NO trailing slash in VITE_API_URL

#### 2.4 Deploy
1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Vercel will provide a URL like: `https://your-app.vercel.app`

#### 2.5 Update Backend CORS
1. Go back to Railway
2. Update `CORS_ORIGINS` environment variable:
   ```
   CORS_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
   ```
3. Railway will auto-redeploy

---

## 🔄 Option 2: Vercel (Frontend) + Render (Backend)

### STEP 1: Deploy Backend to Render

#### 1.1 Create Render Web Service
1. Go to https://render.com
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Select `pharmaguard-clinical-insights-main`

#### 1.2 Configure Service
- **Name**: `drugify-backend`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: `Python 3`
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

#### 1.3 Add Environment Variables
Same as Railway (see Option 1, Step 1.3)

#### 1.4 Select Plan
- **Free Plan**: Good for testing (spins down after inactivity)
- **Starter Plan ($7/mo)**: Recommended for production (always on)

#### 1.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment (3-5 minutes)
3. Render provides URL: `https://drugify-backend.onrender.com`

### STEP 2: Deploy Frontend to Vercel
Follow same steps as Option 1, Step 2

---

## 🔧 Option 3: Full Stack on Render

**Note:** This deploys both frontend and backend on Render (not recommended for production due to performance)

### STEP 1: Create render.yaml
Already exists in your project root. Verify content:

```yaml
services:
  # Backend Service
  - type: web
    name: drugify-backend
    runtime: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: ENVIRONMENT
        value: production
      - key: PYTHONUNBUFFERED
        value: 1
      # Add other env vars from Option 1

  # Frontend Service
  - type: web
    name: drugify-frontend
    runtime: node
    buildCommand: cd frontend && npm install && npm run build
    startCommand: cd frontend && npm run preview -- --host 0.0.0.0 --port $PORT
    envVars:
      - key: VITE_API_URL
        sync: false  # Set manually after backend deployment
      # Add other VITE_ env vars
```

### STEP 2: Deploy
1. Go to Render Dashboard
2. Click "New" → "Blueprint"
3. Connect repository
4. Render will detect `render.yaml`
5. Configure environment variables
6. Deploy both services

---

## 🔐 Environment Variables Reference

### Backend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `ENVIRONMENT` | Deployment environment | `production` | Yes |
| `DEBUG` | Debug mode | `False` | Yes |
| `SECRET_KEY` | JWT secret key (32+ chars) | `your-secret-key` | Yes |
| `CORS_ORIGINS` | Allowed frontend URLs | `https://app.vercel.app` | Yes |
| `DATABASE_URL` | Database connection | `sqlite:///./pharmaguard.db` | Yes |
| `LOG_LEVEL` | Logging level | `INFO` | No |
| `RATE_LIMIT_PER_MINUTE` | API rate limit | `10` | No |
| `MAX_UPLOAD_SIZE` | Max file size (bytes) | `5242880` | No |

### Frontend Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API URL | `https://api.railway.app` | Yes |
| `VITE_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` | Yes |
| `VITE_SUPABASE_PROJECT_ID` | Supabase project ID | `ewhntptpsfqwuetrgyxy` | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Supabase anon key | `eyJhbGc...` | Yes |

---

## ✅ Post-Deployment Checklist

### 1. Test Backend
```bash
# Health check
curl https://your-backend-url.railway.app/health

# API docs (if enabled)
curl https://your-backend-url.railway.app/docs

# Test drugs endpoint
curl https://your-backend-url.railway.app/api/v1/drugs
```

### 2. Test Frontend
- [ ] Visit your Vercel URL
- [ ] Test login with Google OAuth
- [ ] Upload a sample VCF file
- [ ] Select drugs and analyze
- [ ] Generate AI insights
- [ ] Check all pages (Home, About, Dashboard, Profile)

### 3. Configure Custom Domain (Optional)

#### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain: `www.drugify.com`
3. Update DNS records as instructed
4. Vercel auto-provisions SSL

#### For Railway (Backend):
1. Go to Settings → Domains
2. Add custom domain: `api.drugify.com`
3. Update DNS CNAME record
4. Railway auto-provisions SSL

#### Update CORS:
After adding custom domains, update backend CORS:
```env
CORS_ORIGINS=https://www.drugify.com,https://drugify.com,https://your-app.vercel.app
```

### 4. Set Up Monitoring

#### Railway:
- Built-in metrics dashboard
- View logs in real-time
- Set up usage alerts

#### Render:
- Metrics tab shows CPU/Memory
- Logs available in dashboard
- Email alerts for downtime

#### Vercel:
- Analytics dashboard
- Performance insights
- Error tracking

### 5. Database Backup (Important!)

**For SQLite on Railway/Render:**

Create a backup script:
```python
# backend/backup_db.py
import shutil
from datetime import datetime

def backup_database():
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    shutil.copy('pharmaguard.db', f'backups/pharmaguard_{timestamp}.db')
```

**Better Option:** Migrate to PostgreSQL for production
- Railway: Add PostgreSQL plugin (automatic backups)
- Render: Add PostgreSQL database (automatic backups)

---

## 🐛 Troubleshooting

### Frontend Issues

#### Build Fails on Vercel
**Error:** `Module not found` or `Cannot find module`
```bash
# Solution: Check package.json in frontend folder
cd frontend
npm install
npm run build  # Test locally first
```

#### API Calls Failing (CORS Error)
**Error:** `Access to fetch blocked by CORS policy`
```bash
# Solution 1: Check VITE_API_URL has no trailing slash
VITE_API_URL=https://api.railway.app  # ✅ Correct
VITE_API_URL=https://api.railway.app/ # ❌ Wrong

# Solution 2: Update backend CORS_ORIGINS
CORS_ORIGINS=https://your-app.vercel.app,https://your-app-*.vercel.app
```

#### Environment Variables Not Working
**Error:** `import.meta.env.VITE_API_URL is undefined`
```bash
# Solution: Redeploy after adding env vars
# Vercel: Settings → Environment Variables → Redeploy
```

### Backend Issues

#### Build Fails on Railway/Render
**Error:** `Could not find a version that satisfies the requirement`
```bash
# Solution: Check Python version compatibility
# Update requirements.txt with compatible versions
pydantic==2.5.0
fastapi==0.104.1
```

#### Database Not Persisting
**Error:** Data lost after restart
```bash
# Solution: Use persistent volume
# Railway: Automatically provided
# Render: Enable persistent disk in settings
```

#### High Memory Usage
**Error:** Service crashes or restarts
```bash
# Solution 1: Optimize database queries
# Solution 2: Upgrade to higher tier plan
# Solution 3: Add pagination to API endpoints
```

### Common Deployment Errors

#### 1. Port Binding Error
```
Error: Address already in use
```
**Solution:** Use `$PORT` environment variable
```python
# Correct
uvicorn app.main:app --host 0.0.0.0 --port $PORT

# Wrong
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### 2. Module Import Error
```
ModuleNotFoundError: No module named 'app'
```
**Solution:** Check root directory setting
- Railway/Render: Set root directory to `backend`
- Or update start command: `cd backend && uvicorn app.main:app`

#### 3. Static Files Not Found
```
404 Not Found: /assets/index.js
```
**Solution:** Check Vercel build output directory
- Should be: `frontend/dist`
- Verify: `npm run build` creates `dist` folder

---

## 🔄 Continuous Deployment

### Automatic Deployments

Both Vercel and Railway/Render support automatic deployments:

1. **Push to GitHub** → Automatic deployment
2. **Pull Request** → Preview deployment
3. **Merge to main** → Production deployment

### Manual Deployment

#### Vercel:
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

#### Railway:
```bash
# Install Railway CLI
npm i -g @railway/cli

# Deploy
railway up
```

---

## 📊 Cost Estimate

### Free Tier (Testing)
- **Vercel**: Free (100GB bandwidth/month)
- **Railway**: $5 free credit/month
- **Render**: Free (spins down after 15min inactivity)
- **Supabase**: Free (50,000 monthly active users)
- **Total**: ~$0-5/month

### Production Tier
- **Vercel Pro**: $20/month (1TB bandwidth)
- **Railway Starter**: $5/month (500 hours)
- **Render Starter**: $7/month (always on)
- **Supabase Pro**: $25/month (100,000 MAU)
- **Total**: ~$32-50/month

---

## 🎯 Quick Start Commands

### Deploy Backend to Railway
```bash
# 1. Push code to GitHub
git push origin main

# 2. Go to railway.app
# 3. New Project → Deploy from GitHub
# 4. Select repo → Set root: backend
# 5. Add environment variables
# 6. Deploy
```

### Deploy Frontend to Vercel
```bash
# 1. Go to vercel.com
# 2. New Project → Import from GitHub
# 3. Select repo → Set root: frontend
# 4. Add environment variables
# 5. Deploy
```

---

## 📞 Support Resources

- **Railway Docs**: https://docs.railway.app
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy

---

## 🎉 Success!

Once deployed, your DRUGIFY application will be:
- ✅ Accessible globally via HTTPS
- ✅ Automatically scaled based on traffic
- ✅ Backed up and monitored
- ✅ Ready for production use

**Your URLs:**
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-app.railway.app`
- API Docs: `https://your-app.railway.app/docs`

---

**Need Help?** Check the troubleshooting section or contact support.
