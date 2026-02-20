# 🔄 DRUGIFY Deployment Flow

Visual guide showing the complete deployment process.

---

## 📊 Deployment Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT PROCESS                          │
└─────────────────────────────────────────────────────────────────┘

STEP 1: PREPARE CODE
┌──────────────────────────────────────────────────────────────┐
│  Local Development                                           │
│  ┌────────────┐                                              │
│  │   Code     │  → Test locally                              │
│  │  Changes   │  → Commit to Git                             │
│  │            │  → Push to GitHub                            │
│  └────────────┘                                              │
└──────────────────────────────────────────────────────────────┘
                            ↓
                            
STEP 2: DEPLOY BACKEND
┌──────────────────────────────────────────────────────────────┐
│  Railway / Render                                            │
│  ┌────────────┐    ┌──────────────┐    ┌────────────┐      │
│  │  Connect   │ → │  Configure   │ → │   Deploy   │      │
│  │  GitHub    │    │  Settings    │    │  Backend   │      │
│  └────────────┘    └──────────────┘    └────────────┘      │
│                                                              │
│  Configuration:                                              │
│  • Root: backend/                                            │
│  • Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT │
│  • Env vars: SECRET_KEY, CORS_ORIGINS, etc.                │
│                                                              │
│  Output: https://your-app.railway.app ✅                    │
└──────────────────────────────────────────────────────────────┘
                            ↓
                            
STEP 3: DEPLOY FRONTEND
┌──────────────────────────────────────────────────────────────┐
│  Vercel                                                      │
│  ┌────────────┐    ┌──────────────┐    ┌────────────┐      │
│  │  Import    │ → │  Configure   │ → │   Deploy   │      │
│  │  GitHub    │    │  Settings    │    │  Frontend  │      │
│  └────────────┘    └──────────────┘    └────────────┘      │
│                                                              │
│  Configuration:                                              │
│  • Root: frontend/                                           │
│  • Framework: Vite                                           │
│  • Env vars: VITE_API_URL (from Step 2), VITE_SUPABASE_*   │
│                                                              │
│  Output: https://your-app.vercel.app ✅                     │
└──────────────────────────────────────────────────────────────┘
                            ↓
                            
STEP 4: UPDATE CORS
┌──────────────────────────────────────────────────────────────┐
│  Railway / Render                                            │
│  ┌────────────┐    ┌──────────────┐    ┌────────────┐      │
│  │  Update    │ → │  Add Vercel  │ → │   Auto     │      │
│  │  Env Vars  │    │  URL to CORS │    │  Redeploy  │      │
│  └────────────┘    └──────────────┘    └────────────┘      │
│                                                              │
│  CORS_ORIGINS=https://your-app.vercel.app                   │
└──────────────────────────────────────────────────────────────┘
                            ↓
                            
STEP 5: TEST & VERIFY
┌──────────────────────────────────────────────────────────────┐
│  Testing                                                     │
│  ┌────────────┐    ┌──────────────┐    ┌────────────┐      │
│  │  Backend   │ → │   Frontend   │ → │  End-to-   │      │
│  │  Health    │    │   Loading    │    │  End Test  │      │
│  └────────────┘    └──────────────┘    └────────────┘      │
│                                                              │
│  ✅ /health returns 200                                     │
│  ✅ Frontend loads                                           │
│  ✅ Login works                                              │
│  ✅ VCF upload works                                         │
│  ✅ AI insights work                                         │
└──────────────────────────────────────────────────────────────┘
                            ↓
                            
                    🎉 DEPLOYMENT COMPLETE! 🎉
```

---

## 🎯 Quick Reference

### Time Estimates
- **Backend Deployment**: 5 minutes
- **Frontend Deployment**: 5 minutes
- **CORS Update**: 2 minutes
- **Testing**: 3 minutes
- **Total**: ~15 minutes

### Required Information
```
Before starting, have ready:
✓ GitHub repository URL
✓ Supabase credentials
✓ Strong SECRET_KEY (32+ characters)
```

### URLs You'll Get
```
Backend:  https://drugify-backend.railway.app
Frontend: https://drugify.vercel.app
API Docs: https://drugify-backend.railway.app/docs
```

---

## 🔀 Alternative Deployment Paths

### Path A: Vercel + Railway (Recommended)
```
GitHub → Railway (Backend) → Vercel (Frontend) → Production
         ↓                    ↓
         SQLite              Supabase Auth
         
Pros: Fast, free tier, auto-scaling
Cost: Free - $5/month
```

### Path B: Vercel + Render
```
GitHub → Render (Backend) → Vercel (Frontend) → Production
         ↓                   ↓
         SQLite             Supabase Auth
         
Pros: Reliable, good free tier
Cost: Free - $7/month
```

### Path C: Full Render
```
GitHub → Render (Backend + Frontend) → Production
         ↓
         PostgreSQL + Supabase Auth
         
Pros: Single platform, PostgreSQL included
Cost: Free - $14/month
```

### Path D: Docker Self-Hosted
```
GitHub → Docker Build → Your Server → Production
         ↓
         PostgreSQL + Redis + Nginx
         
Pros: Full control, no vendor lock-in
Cost: Server costs only
```

---

## 📋 Deployment Decision Tree

```
START: Where do you want to deploy?
│
├─ I want the EASIEST deployment
│  └─→ Use: Vercel + Railway
│      Time: 15 minutes
│      Cost: Free - $5/month
│      Guide: QUICK_DEPLOY.md
│
├─ I want FREE hosting
│  └─→ Use: Vercel + Render (Free tier)
│      Time: 15 minutes
│      Cost: $0 (with limitations)
│      Note: Backend sleeps after 15min inactivity
│
├─ I want PRODUCTION-GRADE hosting
│  └─→ Use: Vercel Pro + Railway Starter
│      Time: 20 minutes
│      Cost: $25-30/month
│      Features: Always on, better performance
│
├─ I want FULL CONTROL
│  └─→ Use: Docker on your own server
│      Time: 1-2 hours
│      Cost: Server costs
│      Requires: DevOps knowledge
│
└─ I want EVERYTHING on ONE platform
   └─→ Use: Render (Full Stack)
       Time: 25 minutes
       Cost: Free - $14/month
       Note: Simpler but less optimized
```

---

## 🔧 Configuration Matrix

### Backend Configuration

| Platform | Root Dir | Start Command | Port |
|----------|----------|---------------|------|
| Railway | `backend` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` | Auto |
| Render | `backend` | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` | Auto |
| Docker | `/app` | `uvicorn app.main:app --host 0.0.0.0 --port 8000` | 8000 |

### Frontend Configuration

| Platform | Root Dir | Build Command | Output Dir | Framework |
|----------|----------|---------------|------------|-----------|
| Vercel | `frontend` | `npm run build` | `dist` | Vite |
| Render | `frontend` | `npm install && npm run build` | `dist` | Static |
| Docker | `/app` | `npm run build` | `dist` | Vite |

---

## 🌐 Network Flow

### Production Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                         INTERNET                            │
└─────────────────────────────────────────────────────────────┘
                            │
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE CDN                         │
│                    (Vercel Edge Network)                    │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                ↓                       ↓
┌──────────────────────┐    ┌──────────────────────┐
│   FRONTEND (Vercel)  │    │  BACKEND (Railway)   │
│                      │    │                      │
│  • React App         │───→│  • FastAPI           │
│  • Static Files      │    │  • REST API          │
│  • HTTPS Auto        │    │  • WebSocket (AI)    │
│                      │    │  • HTTPS Auto        │
└──────────────────────┘    └──────────────────────┘
         │                           │
         ↓                           ↓
┌──────────────────────┐    ┌──────────────────────┐
│  SUPABASE AUTH       │    │  SQLITE DATABASE     │
│                      │    │                      │
│  • Google OAuth      │    │  • Patient Data      │
│  • JWT Tokens        │    │  • Reports           │
│  • User Management   │    │  • Variants          │
└──────────────────────┘    └──────────────────────┘
```

### Request Flow
```
1. User visits: https://drugify.vercel.app
   ↓
2. Vercel CDN serves static files (HTML, CSS, JS)
   ↓
3. User logs in → Supabase handles authentication
   ↓
4. User uploads VCF → Frontend sends to Backend API
   ↓
5. Backend processes: https://drugify.railway.app/api/v1/analyze
   ↓
6. Backend saves to SQLite database
   ↓
7. Backend returns results to Frontend
   ↓
8. User clicks "Generate AI Insights"
   ↓
9. Backend streams AI analysis via SSE
   ↓
10. Frontend displays results in real-time
```

---

## 🔐 Security Flow

### Authentication Flow
```
┌──────────┐
│  User    │
└────┬─────┘
     │ 1. Click "Login with Google"
     ↓
┌──────────────────┐
│  Frontend        │
│  (Vercel)        │
└────┬─────────────┘
     │ 2. Redirect to Supabase
     ↓
┌──────────────────┐
│  Supabase Auth   │
│                  │
└────┬─────────────┘
     │ 3. Redirect to Google
     ↓
┌──────────────────┐
│  Google OAuth    │
│                  │
└────┬─────────────┘
     │ 4. User approves
     ↓
┌──────────────────┐
│  Supabase Auth   │
│  (Issues JWT)    │
└────┬─────────────┘
     │ 5. Return JWT token
     ↓
┌──────────────────┐
│  Frontend        │
│  (Stores token)  │
└────┬─────────────┘
     │ 6. API calls include JWT
     ↓
┌──────────────────┐
│  Backend         │
│  (Validates JWT) │
└──────────────────┘
```

---

## 📊 Monitoring Flow

### Health Check Flow
```
Every 5 minutes:

┌──────────────┐
│  Monitoring  │
│  Service     │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────────────┐
│  GET /health                         │
│  https://drugify.railway.app/health  │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  Response:                           │
│  {                                   │
│    "status": "healthy",              │
│    "service": "drugify",             │
│    "database": "connected"           │
│  }                                   │
└──────────────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│  If status != "healthy":             │
│  • Send alert                        │
│  • Log incident                      │
│  • Trigger auto-restart              │
└──────────────────────────────────────┘
```

---

## 🎉 Success Criteria

Your deployment is successful when:

✅ **Backend Health Check**
```bash
curl https://your-backend.railway.app/health
# Returns: {"status":"healthy",...}
```

✅ **Frontend Loads**
```
Visit: https://your-app.vercel.app
# Page loads without errors
```

✅ **Authentication Works**
```
1. Click "Login with Google"
2. Authenticate successfully
3. Redirected to dashboard
```

✅ **Core Features Work**
```
1. Upload VCF file
2. Select drugs
3. Generate analysis
4. View results
5. Generate AI insights
```

✅ **No Console Errors**
```
Open browser DevTools
# No red errors in console
```

---

## 📞 Need Help?

### Quick Links
- **Quick Deploy**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Full Guide**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

### Platform Support
- **Railway**: https://railway.app/help
- **Render**: https://render.com/docs/support
- **Vercel**: https://vercel.com/support

---

**Ready to deploy?** Start with [QUICK_DEPLOY.md](QUICK_DEPLOY.md)!
