# 🚀 Deploy Frontend to Vercel - Step by Step

Your backend is already deployed and working! ✅
**Backend URL**: https://drugify-qxee.onrender.com

Now let's deploy the frontend to Vercel.

---

## ✅ Backend Status

Your backend is live and healthy:
- ✅ Health check: https://drugify-qxee.onrender.com/health
- ✅ Drugs API: https://drugify-qxee.onrender.com/api/v1/drugs
- ✅ API Docs: https://drugify-qxee.onrender.com/docs

---

## 🎯 Deploy Frontend (5 minutes)

### Step 1: Go to Vercel

1. Open your browser and go to: **https://vercel.com**
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel to access your GitHub

### Step 2: Create New Project

1. Click **"Add New..."** button (top right)
2. Select **"Project"**
3. Click **"Import Git Repository"**
4. Find and select your repository: `pharmaguard-clinical-insights-main`
5. Click **"Import"**

### Step 3: Configure Build Settings

Vercel should auto-detect Vite, but verify these settings:

**Framework Preset**: `Vite`
**Root Directory**: Click "Edit" and enter: `frontend`
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

### Step 4: Add Environment Variables

This is the MOST IMPORTANT step! Click **"Environment Variables"** and add these:

#### Variable 1:
- **Name**: `VITE_API_URL`
- **Value**: `https://drugify-qxee.onrender.com`
- Click "Add"

#### Variable 2:
- **Name**: `VITE_SUPABASE_URL`
- **Value**: `https://ewhntptpsfqwuetrgyxy.supabase.co`
- Click "Add"

#### Variable 3:
- **Name**: `VITE_SUPABASE_PROJECT_ID`
- **Value**: `ewhntptpsfqwuetrgyxy`
- Click "Add"

#### Variable 4:
- **Name**: `VITE_SUPABASE_PUBLISHABLE_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aG50cHRwc2Zxd3VldHJneXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODY0ODksImV4cCI6MjA4NzA2MjQ4OX0.dvsXMrrZ6HJ54GZ4U2JoaVd6whQdingbXo0MB6fC2rw`
- Click "Add"

**IMPORTANT**: Make sure there's NO trailing slash in `VITE_API_URL`
- ✅ Correct: `https://drugify-qxee.onrender.com`
- ❌ Wrong: `https://drugify-qxee.onrender.com/`

### Step 5: Deploy

1. Click **"Deploy"** button
2. Wait 2-3 minutes for the build to complete
3. You'll see a success screen with confetti! 🎉
4. Vercel will show your deployment URL (e.g., `https://your-app.vercel.app`)

**SAVE THIS URL** - you'll need it for the next step!

---

## 🔄 Update Backend CORS (IMPORTANT!)

After frontend is deployed, you MUST update the backend CORS settings:

### Step 1: Go to Render Dashboard

1. Go to: https://dashboard.render.com
2. Find your service: `drugify-qxee`
3. Click on it

### Step 2: Update Environment Variables

1. Click **"Environment"** tab on the left
2. Find the variable: `CORS_ORIGINS`
3. Click **"Edit"**
4. Update the value to include your Vercel URL:

```
https://your-app.vercel.app,https://your-app-*.vercel.app
```

**Example** (replace with your actual Vercel URL):
```
https://drugify-abc123.vercel.app,https://drugify-abc123-*.vercel.app
```

5. Click **"Save Changes"**
6. Render will automatically redeploy (takes 1-2 minutes)

---

## ✅ Test Your Deployment

### 1. Test Frontend

Visit your Vercel URL: `https://your-app.vercel.app`

You should see:
- ✅ Homepage loads
- ✅ No console errors (press F12 to check)
- ✅ Navigation works

### 2. Test Authentication

1. Click **"Login"** or **"Get Started"**
2. Click **"Continue with Google"**
3. Sign in with your Google account
4. You should be redirected to the Dashboard

### 3. Test Core Features

1. Go to **"Analyzer"** page
2. Upload a VCF file (or use the sample)
3. Select drugs from the dropdown
4. Click **"Analyze"**
5. Results should appear
6. Click **"Generate AI Insights"**
7. AI analysis should stream in

### 4. Check for Errors

Open browser console (F12):
- ✅ No red errors
- ✅ API calls returning 200 status
- ✅ No CORS errors

---

## 🐛 Troubleshooting

### Issue 1: CORS Error in Console

**Error**: `Access to fetch at 'https://drugify-qxee.onrender.com/api/v1/...' from origin 'https://your-app.vercel.app' has been blocked by CORS policy`

**Solution**:
1. Go to Render dashboard
2. Update `CORS_ORIGINS` environment variable
3. Make sure it includes your Vercel URL
4. Wait for Render to redeploy

### Issue 2: API Not Found (404)

**Error**: `GET https://drugify-qxee.onrender.com/api/v1/drugs 404`

**Solution**:
1. Check `VITE_API_URL` in Vercel environment variables
2. Make sure there's NO trailing slash
3. Redeploy frontend in Vercel

### Issue 3: Environment Variables Not Working

**Error**: `import.meta.env.VITE_API_URL is undefined`

**Solution**:
1. Go to Vercel project settings
2. Click "Environment Variables"
3. Verify all 4 variables are added
4. Click "Redeploy" in Deployments tab

### Issue 4: Build Failed

**Error**: `Module not found` or `Cannot find module`

**Solution**:
1. Check Root Directory is set to: `frontend`
2. Check Build Command is: `npm run build`
3. Try redeploying

### Issue 5: Render Backend Sleeping

**Note**: Render free tier spins down after 15 minutes of inactivity

**Solution**:
- First request may take 30-60 seconds to wake up
- Consider upgrading to Render Starter plan ($7/mo) for always-on
- Or use Railway instead (doesn't sleep)

---

## 🎉 Success Checklist

Your deployment is successful when:

- [ ] Frontend loads at your Vercel URL
- [ ] No console errors (F12)
- [ ] Google login works
- [ ] Can navigate to all pages
- [ ] Can upload VCF file
- [ ] Analysis generates results
- [ ] AI insights work
- [ ] No CORS errors

---

## 📱 Your Live URLs

Once deployed, you'll have:

**Frontend**: `https://your-app.vercel.app`
- User-facing website
- All pages and features

**Backend**: `https://drugify-qxee.onrender.com`
- API endpoints
- Database
- AI insights

**API Documentation**: `https://drugify-qxee.onrender.com/docs`
- Interactive API docs
- Test endpoints

---

## 🔧 Post-Deployment Tasks

### 1. Update Supabase URLs

1. Go to: https://supabase.com/dashboard
2. Select your project: `ewhntptpsfqwuetrgyxy`
3. Go to: **Authentication** → **URL Configuration**
4. Add your Vercel URL to:
   - **Site URL**: `https://your-app.vercel.app`
   - **Redirect URLs**: `https://your-app.vercel.app/**`
5. Click **"Save"**

### 2. Set Up Custom Domain (Optional)

If you have a custom domain (e.g., `drugify.com`):

**For Frontend (Vercel)**:
1. Go to Vercel project settings
2. Click **"Domains"**
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate auto-provisioned

**For Backend (Render)**:
1. Go to Render service settings
2. Click **"Custom Domains"**
3. Add your API subdomain (e.g., `api.drugify.com`)
4. Update DNS CNAME record
5. SSL certificate auto-provisioned

**Then update**:
- Vercel `VITE_API_URL` to your custom API domain
- Render `CORS_ORIGINS` to include custom frontend domain

### 3. Enable Monitoring

**Vercel**:
- Go to **Analytics** tab
- View performance metrics
- Check error rates

**Render**:
- Go to **Metrics** tab
- Monitor CPU/Memory usage
- Check response times
- View logs in **Logs** tab

### 4. Set Up Alerts (Optional)

**Render**:
1. Go to service settings
2. Click **"Notifications"**
3. Add email for downtime alerts

**Vercel**:
1. Go to project settings
2. Click **"Notifications"**
3. Configure deployment notifications

---

## 💰 Cost Summary

**Current Setup**:
- **Vercel**: Free tier (100GB bandwidth/month)
- **Render**: Free tier (750 hours/month, spins down after 15min)
- **Supabase**: Free tier (50,000 MAU)
- **Total**: $0/month

**Recommended for Production**:
- **Vercel Pro**: $20/month (1TB bandwidth, better performance)
- **Render Starter**: $7/month (always on, no spin down)
- **Supabase Pro**: $25/month (100,000 MAU, better support)
- **Total**: $52/month

---

## 🚀 Next Steps

1. **Deploy frontend** following steps above
2. **Update CORS** in Render
3. **Test everything** end-to-end
4. **Update Supabase** URLs
5. **Share your app** with users!

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the troubleshooting section** above
2. **Review deployment logs**:
   - Vercel: Deployments → Click deployment → View logs
   - Render: Logs tab
3. **Check browser console** (F12) for errors
4. **Verify environment variables** are set correctly

---

## 🎊 Congratulations!

Once deployed, your DRUGIFY application will be:
- ✅ Live and accessible worldwide
- ✅ Secured with HTTPS
- ✅ Automatically scaled
- ✅ Backed up and monitored
- ✅ Ready for users!

**Your backend is already live**: https://drugify-qxee.onrender.com ✅

**Now deploy the frontend and you're done!** 🚀
