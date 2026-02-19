# 🚀 Render Deployment Guide - DRUGIFY

## ⚠️ Important: Deploy Frontend and Backend Separately

Render works best when you deploy frontend and backend as separate services.

---

## Option 1: Use Vercel + Render (Recommended)

### Frontend → Vercel (Free, Fast)
- Better for React apps
- Automatic deployments
- Free SSL
- Global CDN

### Backend → Render (Free)
- Perfect for Python/FastAPI
- Free tier available
- Easy setup

**Follow this guide:** [DEPLOYMENT.md](DEPLOYMENT.md)

---

## Option 2: Both on Render (If you prefer)

### Step 1: Deploy Backend First

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo

3. **Configure Backend**
   ```
   Name: drugify-backend
   Region: Oregon (or closest to you)
   Branch: main
   Root Directory: backend
   Runtime: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Add Environment Variables**
   ```
   DATABASE_URL=sqlite:///./pharmaguard.db
   SECRET_KEY=your-secret-key-here-generate-random-string
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ALLOWED_ORIGINS=https://drugify-frontend.onrender.com
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Copy your backend URL (e.g., `https://drugify-backend.onrender.com`)

### Step 2: Deploy Frontend

1. **Create Static Site**
   - Click "New +" → "Static Site"
   - Connect same GitHub repository
   - Select your repo

2. **Configure Frontend**
   ```
   Name: drugify-frontend
   Branch: main
   Root Directory: (leave empty or use .)
   Build Command: npm install && npm run build
   Publish Directory: dist
   ```

3. **Add Environment Variables**
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
   VITE_API_URL=https://drugify-backend.onrender.com
   ```
   (Use the backend URL from Step 1)

4. **Deploy**
   - Click "Create Static Site"
   - Wait 3-5 minutes
   - Your site will be live!

### Step 3: Update CORS

1. Go back to backend service
2. Update `ALLOWED_ORIGINS` environment variable
3. Add your frontend URL: `https://drugify-frontend.onrender.com`
4. Redeploy backend

---

## 🐛 Troubleshooting

### Error: "Could not load src/src/lib/supabase.ts"

**Cause:** Wrong root directory setting

**Solution:**
- For backend: Set Root Directory to `backend`
- For frontend: Leave Root Directory empty or set to `.`

### Error: "Build failed"

**Solution:**
1. Check build logs in Render dashboard
2. Verify environment variables are set
3. Make sure Root Directory is correct
4. Test build locally first: `npm run build`

### Error: "Module not found"

**Solution:**
1. Make sure all dependencies are in package.json
2. Clear build cache in Render
3. Redeploy

### Backend not responding

**Solution:**
1. Check backend logs in Render
2. Verify start command is correct
3. Make sure PORT environment variable is used
4. Check ALLOWED_ORIGINS includes frontend URL

---

## 📋 Quick Reference

### Backend Configuration
```yaml
Root Directory: backend
Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### Frontend Configuration
```yaml
Root Directory: (empty)
Build Command: npm install && npm run build
Publish Directory: dist
```

---

## 💰 Pricing

### Free Tier Includes:
- ✅ 750 hours/month (enough for 1 service 24/7)
- ✅ Automatic SSL
- ✅ Custom domains
- ✅ Automatic deployments from GitHub

### Limitations:
- ⚠️ Services spin down after 15 min of inactivity
- ⚠️ Cold start delay (30-60 seconds)
- ⚠️ 512 MB RAM

### Upgrade ($7/month per service):
- ✅ Always on (no spin down)
- ✅ More RAM
- ✅ Faster builds

---

## 🎯 Recommended Approach

For best results:

1. **Frontend → Vercel** (Free, fast, no cold starts)
2. **Backend → Render** (Free, easy Python deployment)
3. **Database → Supabase** (Free, managed PostgreSQL)

This gives you:
- ✅ Best performance
- ✅ No cold starts on frontend
- ✅ Easy management
- ✅ All free tiers

---

## 📞 Need Help?

### Render Support
- Docs: https://render.com/docs
- Community: https://community.render.com
- Status: https://status.render.com

### Common Issues
1. **Build fails** → Check Root Directory setting
2. **Can't connect** → Verify CORS settings
3. **Slow response** → Free tier cold start (upgrade or use Vercel for frontend)

---

## ✅ Success Checklist

After deployment:

- [ ] Backend responds at Render URL
- [ ] Frontend loads at Render URL (or Vercel)
- [ ] Can sign up / log in
- [ ] Can access dashboard
- [ ] Can upload VCF file
- [ ] Can analyze drugs
- [ ] All pages load correctly

---

**Recommendation:** Use Vercel for frontend (faster, no cold starts) and Render for backend (easy Python deployment).

See [DEPLOYMENT.md](DEPLOYMENT.md) for the Vercel + Render approach.
