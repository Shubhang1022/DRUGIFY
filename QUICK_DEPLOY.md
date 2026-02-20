# ⚡ Quick Deploy Reference

## 🎯 Fastest Deployment Path (15 minutes)

### Prerequisites
- GitHub account with code pushed
- Vercel account (free)
- Railway account (free $5 credit)

---

## Step 1: Deploy Backend (Railway) - 5 minutes

1. **Go to**: https://railway.app
2. **Click**: "Start a New Project" → "Deploy from GitHub repo"
3. **Select**: Your repository
4. **Configure**:
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables**:
```env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=generate-a-random-32-character-string-here
CORS_ORIGINS=https://your-app.vercel.app
DATABASE_URL=sqlite:///./pharmaguard.db
```

6. **Deploy** → Copy the Railway URL (e.g., `https://xxx.railway.app`)

---

## Step 2: Deploy Frontend (Vercel) - 5 minutes

1. **Go to**: https://vercel.com
2. **Click**: "Add New" → "Project" → Import from GitHub
3. **Select**: Your repository
4. **Configure**:
   - Framework: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Add Environment Variables**:
```env
VITE_API_URL=https://xxx.railway.app
VITE_SUPABASE_URL=https://ewhntptpsfqwuetrgyxy.supabase.co
VITE_SUPABASE_PROJECT_ID=ewhntptpsfqwuetrgyxy
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aG50cHRwc2Zxd3VldHJneXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODY0ODksImV4cCI6MjA4NzA2MjQ4OX0.dvsXMrrZ6HJ54GZ4U2JoaVd6whQdingbXo0MB6fC2rw
```

6. **Deploy** → Copy the Vercel URL (e.g., `https://xxx.vercel.app`)

---

## Step 3: Update CORS - 2 minutes

1. **Go back to Railway**
2. **Update** `CORS_ORIGINS` variable:
```env
CORS_ORIGINS=https://xxx.vercel.app,https://xxx-*.vercel.app
```
3. Railway will auto-redeploy

---

## Step 4: Test - 3 minutes

### Test Backend
```bash
curl https://xxx.railway.app/health
# Should return: {"status":"healthy",...}
```

### Test Frontend
1. Visit: `https://xxx.vercel.app`
2. Try login with Google
3. Upload VCF file
4. Generate AI insights

---

## ✅ Done!

Your app is now live:
- **Frontend**: https://xxx.vercel.app
- **Backend**: https://xxx.railway.app
- **API Docs**: https://xxx.railway.app/docs

---

## 🔧 Common Issues

### Issue: CORS Error
**Fix**: Update Railway `CORS_ORIGINS` with your Vercel URL

### Issue: API Not Found
**Fix**: Check `VITE_API_URL` has NO trailing slash

### Issue: Build Failed
**Fix**: Check root directory is set correctly
- Backend: `backend`
- Frontend: `frontend`

---

## 📱 Mobile Access

Your app is automatically mobile-responsive and accessible from any device!

---

## 🎉 Next Steps

1. **Custom Domain**: Add your own domain in Vercel/Railway settings
2. **Monitoring**: Check Railway/Vercel dashboards for metrics
3. **Backups**: Set up database backups (see full guide)
4. **Scaling**: Upgrade plans as traffic grows

---

**Full Documentation**: See `DEPLOYMENT_GUIDE.md` for detailed instructions
