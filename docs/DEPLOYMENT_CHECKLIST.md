# 🚀 Deployment Checklist

## Quick Deployment Steps

### Step 1: Deploy Backend (5 minutes)

1. Go to **Railway.app** → Sign up/Login
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Configure:
   - Root Directory: `backend`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   ```
   ENVIRONMENT=production
   DEBUG=False
   SECRET_KEY=<run: openssl rand -hex 32>
   CORS_ORIGINS=["*"]  (update after frontend deployment)
   ```
6. Click **Deploy**
7. Copy your backend URL: `https://your-app.railway.app`

### Step 2: Deploy Frontend (3 minutes)

1. Go to **Vercel.com** → Sign up/Login
2. Click **"Add New Project"**
3. Import your GitHub repository
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add Environment Variable:
   ```
   VITE_API_URL=https://your-app.railway.app
   ```
6. Click **Deploy**
7. Wait 2-3 minutes
8. Your app is live! 🎉

### Step 3: Update CORS (1 minute)

1. Go back to Railway
2. Update Environment Variable:
   ```
   CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
   ```
3. Redeploy backend

### Step 4: Test (2 minutes)

1. Visit your Vercel URL
2. Test drug dropdown (should load 6 drugs)
3. Try "Run Demo" button
4. Verify analysis works

---

## ✅ Pre-Deployment Checklist

### Code Ready
- [ ] All changes committed to GitHub
- [ ] No console errors locally
- [ ] Backend runs locally (`python -m uvicorn app.main:app`)
- [ ] Frontend runs locally (`npm run dev`)
- [ ] All tests pass

### Files Created
- [ ] `vercel.json` exists
- [ ] `.vercelignore` exists
- [ ] `backend/requirements.txt` up to date
- [ ] Environment variables documented

### Accounts Ready
- [ ] GitHub account with repository
- [ ] Vercel account created
- [ ] Railway account created (or Render/Heroku)

---

## 🔧 Configuration Files

### vercel.json ✅
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### .vercelignore ✅
```
backend/
*.db
*.py
__pycache__/
```

### backend/requirements.txt ✅
Should include all dependencies

---

## 🌐 Your Deployment URLs

After deployment, you'll have:

- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-app.railway.app`
- **API Docs**: `https://your-app.railway.app/docs`

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to fetch drugs"
**Solution**: 
1. Check VITE_API_URL in Vercel environment variables
2. Verify backend is running on Railway
3. Check CORS settings in backend

### Issue: "Build failed on Vercel"
**Solution**:
1. Check build logs in Vercel dashboard
2. Verify all dependencies in package.json
3. Try building locally: `npm run build`

### Issue: "Backend not responding"
**Solution**:
1. Check Railway logs
2. Verify environment variables are set
3. Test health endpoint: `https://your-app.railway.app/health`

### Issue: "CORS error"
**Solution**:
Update backend CORS_ORIGINS to include your Vercel URL:
```python
CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
```

---

## 📊 Deployment Status

### Backend (Railway)
- [ ] Deployed successfully
- [ ] Environment variables set
- [ ] Health check working (`/health`)
- [ ] API docs accessible (`/docs`)
- [ ] CORS configured

### Frontend (Vercel)
- [ ] Deployed successfully
- [ ] VITE_API_URL set
- [ ] Site loads correctly
- [ ] Drug dropdown works
- [ ] Analysis works
- [ ] No console errors

---

## 💰 Cost

### Free Tier (Perfect for Testing)
- **Vercel**: Free forever
- **Railway**: $5 credit (free trial)
- **Total**: $0-5/month

### Production
- **Vercel Pro**: $20/month (optional)
- **Railway**: ~$10-20/month
- **Total**: $10-40/month

---

## 🎯 Success Criteria

Your deployment is successful when:

✅ Frontend loads at Vercel URL  
✅ Backend responds at Railway URL  
✅ Drug dropdown loads (6 drugs)  
✅ File upload works  
✅ Analysis completes  
✅ Results display correctly  
✅ No CORS errors  
✅ No console errors  

---

## 📞 Need Help?

1. **Check Logs**:
   - Vercel: Dashboard → Deployments → Logs
   - Railway: Dashboard → Deployments → Logs

2. **Test Endpoints**:
   ```bash
   # Backend health
   curl https://your-app.railway.app/health
   
   # Drugs endpoint
   curl https://your-app.railway.app/api/v1/drugs
   ```

3. **Documentation**:
   - [Vercel Docs](https://vercel.com/docs)
   - [Railway Docs](https://docs.railway.app)
   - [Full Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md)

---

## 🚀 Quick Commands

### Deploy to Vercel (CLI)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Deploy to Railway (CLI)
```bash
npm install -g @railway/cli
railway login
cd backend
railway init
railway up
```

---

## ⏱️ Estimated Time

- Backend deployment: **5 minutes**
- Frontend deployment: **3 minutes**
- CORS configuration: **1 minute**
- Testing: **2 minutes**
- **Total: ~11 minutes**

---

## 🎉 After Deployment

1. **Share your URL** with team/users
2. **Monitor performance** in dashboards
3. **Set up custom domain** (optional)
4. **Enable analytics** (optional)
5. **Configure monitoring** (optional)

---

**Ready to deploy? Follow the steps above!** 🚀

If you encounter any issues, check the [Full Deployment Guide](VERCEL_DEPLOYMENT_GUIDE.md) for detailed troubleshooting.
