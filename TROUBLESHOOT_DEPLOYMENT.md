# 🔧 Deployment Troubleshooting Guide

## Current Issue: "Failed to load drug list: Failed to fetch"

This error means your frontend can't communicate with your backend. Let's fix it step by step.

---

## 🎯 Quick Diagnosis

Your deployment status:
- ✅ **Frontend**: https://drugify.netlify.app (LIVE)
- ✅ **Backend**: https://drugify-qxee.onrender.com (LIVE)
- ❌ **Connection**: NOT WORKING

**Root Cause**: Missing configuration on both frontend and backend

---

## 🚨 CRITICAL FIX #1: Update Frontend Environment Variable

### Problem
Your frontend is trying to connect to `http://localhost:8000` instead of your live backend.

### Solution - Netlify Dashboard

1. **Go to Netlify**: https://app.netlify.com
2. **Select your site**: drugify
3. **Click**: Site settings → Environment variables
4. **Find or Add**: `VITE_API_URL`
5. **Set value to**:
   ```
   https://drugify-qxee.onrender.com
   ```
6. **Click**: Save
7. **Trigger Redeploy**:
   - Go to: Deploys tab
   - Click: Trigger deploy → Deploy site
   - Wait 1-2 minutes

### Verify
After redeployment, check your site:
- Open browser console (F12)
- Go to Network tab
- Refresh page
- API calls should now go to `https://drugify-qxee.onrender.com`

---

## 🚨 CRITICAL FIX #2: Update Backend CORS

### Problem
Your backend doesn't allow requests from `https://drugify.netlify.app`

### Solution - Render Dashboard

1. **Go to Render**: https://dashboard.render.com
2. **Select service**: drugify-qxee
3. **Click**: Environment tab (left sidebar)
4. **Find or Add**: `CORS_ORIGINS`
5. **Set value to**:
   ```
   https://drugify.netlify.app,https://drugify-*.netlify.app
   ```
   
   **Important Notes**:
   - NO spaces between URLs
   - Comma-separated
   - Include wildcard pattern for preview deployments
   - Replace `drugify` with your actual Netlify site name if different

6. **Click**: Save Changes
7. **Wait**: Render will auto-redeploy (1-2 minutes)

### Verify
Check backend logs in Render:
- Click: Logs tab
- Look for: "DRUGIFY API starting up"
- Should see: CORS origins loaded correctly

---

## 🔍 Step-by-Step Testing

### Test 1: Backend Health Check

Open this URL in your browser:
```
https://drugify-qxee.onrender.com/health
```

**Expected Response**:
```json
{
  "status": "healthy",
  "service": "drugify",
  "environment": "production",
  "database": "connected"
}
```

**If you see 504 Gateway Timeout**:
- This is normal for Render free tier
- Backend is "sleeping" after 15 minutes of inactivity
- Wait 30-60 seconds and try again
- Backend will "wake up" and respond

**If you see 503 Service Unavailable**:
- Database connection issue
- Check Render logs for errors
- May need to redeploy

### Test 2: Drugs API Endpoint

Open this URL:
```
https://drugify-qxee.onrender.com/api/v1/drugs
```

**Expected Response**:
```json
{
  "drugs": [
    {
      "name": "CODEINE",
      "category": "Opioid Analgesic",
      "genes": ["CYP2D6"]
    },
    ...
  ]
}
```

**If you see CORS error in browser console**:
- Go back to Fix #2
- Verify CORS_ORIGINS is set correctly
- Wait for Render to finish redeploying

### Test 3: Frontend API Connection

1. Open: https://drugify.netlify.app
2. Press F12 (open Developer Tools)
3. Go to Console tab
4. Refresh page
5. Look for any red errors

**Common Errors**:

**Error**: `Failed to fetch`
- **Cause**: Backend is sleeping or VITE_API_URL not set
- **Fix**: Wait 60 seconds, or check Fix #1

**Error**: `CORS policy: No 'Access-Control-Allow-Origin' header`
- **Cause**: CORS_ORIGINS not configured
- **Fix**: Check Fix #2

**Error**: `net::ERR_NAME_NOT_RESOLVED`
- **Cause**: Wrong API URL
- **Fix**: Check Fix #1, verify URL is correct

### Test 4: Full Flow Test

1. Go to: https://drugify.netlify.app
2. Click: "Get Started" or "Login"
3. Sign in with Google
4. Go to: Analyzer page
5. Try to load drug list

**If drug list loads**: ✅ SUCCESS!
**If still fails**: Continue to Advanced Troubleshooting

---

## 🔬 Advanced Troubleshooting

### Check Render Logs

1. Go to Render dashboard
2. Click your service
3. Click: Logs tab
4. Look for errors

**Common log messages**:

**Good**:
```
DRUGIFY API starting up (Environment: production)
Database initialized
```

**Bad**:
```
SettingsError: error parsing value for field "cors_origins"
```
- **Fix**: CORS_ORIGINS format is wrong
- **Correct format**: `https://url1.com,https://url2.com`
- **Wrong format**: `["https://url1.com"]` or with spaces

### Check Network Requests

1. Open: https://drugify.netlify.app
2. Press F12
3. Go to: Network tab
4. Refresh page
5. Look for requests to `/api/v1/drugs`

**Click on the request** and check:

**Headers tab**:
- Request URL should be: `https://drugify-qxee.onrender.com/api/v1/drugs`
- If it's `http://localhost:8000`: Fix #1 not applied

**Response tab**:
- If empty: Backend is sleeping, wait and retry
- If CORS error: Fix #2 not applied
- If 404: Wrong API endpoint

### Verify Environment Variables

**Netlify**:
1. Site settings → Environment variables
2. Should have:
   - `VITE_API_URL` = `https://drugify-qxee.onrender.com`
   - `VITE_SUPABASE_URL` = `https://ewhntptpsfqwuetrgyxy.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = (your key)

**Render**:
1. Environment tab
2. Should have:
   - `CORS_ORIGINS` = `https://drugify.netlify.app,https://drugify-*.netlify.app`
   - `SECRET_KEY` = (some random string)
   - `ENVIRONMENT` = `production`
   - `DATABASE_URL` = (auto-set by Render if using database)

---

## 🎯 Complete Checklist

Work through this checklist in order:

### Backend Configuration
- [ ] Render service is running (not suspended)
- [ ] Environment variable `CORS_ORIGINS` is set correctly
- [ ] No spaces in CORS_ORIGINS value
- [ ] Includes your Netlify URL
- [ ] Backend redeployed after CORS change
- [ ] Health check endpoint responds: `/health`
- [ ] Drugs endpoint responds: `/api/v1/drugs`

### Frontend Configuration
- [ ] Netlify site is deployed
- [ ] Environment variable `VITE_API_URL` is set
- [ ] Points to: `https://drugify-qxee.onrender.com`
- [ ] Frontend redeployed after env var change
- [ ] No console errors on page load
- [ ] Network requests go to correct backend URL

### Authentication
- [ ] Supabase project is active
- [ ] Site URL set to: `https://drugify.netlify.app`
- [ ] Redirect URLs include: `https://drugify.netlify.app/**`
- [ ] Google OAuth configured
- [ ] Can sign in successfully

### Testing
- [ ] Homepage loads without errors
- [ ] Can sign in with Google
- [ ] Dashboard page loads
- [ ] Analyzer page loads
- [ ] Drug list loads (may take 60s first time)
- [ ] Can select drugs
- [ ] Can run analysis
- [ ] Results display correctly

---

## 🚀 Expected Timeline

After applying both fixes:

**Immediate** (0-2 minutes):
- Netlify redeploys frontend
- Render redeploys backend

**First Request** (30-60 seconds):
- Backend wakes up from sleep
- Database connection established
- First API call succeeds

**Subsequent Requests** (<1 second):
- Backend stays awake for 15 minutes
- Fast response times
- Smooth user experience

---

## 💡 Pro Tips

### Render Free Tier Limitations
- Spins down after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- Consider upgrading to Starter ($7/mo) for always-on

### Keep Backend Awake
Use a service like UptimeRobot (free):
1. Sign up at: https://uptimerobot.com
2. Add monitor for: `https://drugify-qxee.onrender.com/health`
3. Check every 5 minutes
4. Backend stays awake 24/7

### Debugging Tips
- Always check browser console first (F12)
- Check Network tab to see actual requests
- Check Render logs for backend errors
- Clear browser cache if behavior is weird
- Try incognito mode to rule out cache issues

---

## 📞 Still Not Working?

If you've completed all steps and it's still not working:

### Collect This Information

1. **Frontend URL**: https://drugify.netlify.app
2. **Backend URL**: https://drugify-qxee.onrender.com
3. **Browser Console Errors**: (screenshot or copy text)
4. **Network Tab**: (screenshot of failed request)
5. **Render Logs**: (last 20 lines)

### Common Final Issues

**Issue**: "Mixed Content" error
- **Cause**: Frontend using HTTP instead of HTTPS
- **Fix**: Ensure VITE_API_URL uses `https://` not `http://`

**Issue**: Backend returns 500 error
- **Cause**: Database or code error
- **Fix**: Check Render logs for Python traceback

**Issue**: Infinite loading
- **Cause**: Backend sleeping or crashed
- **Fix**: Check Render dashboard, restart service if needed

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ Homepage loads instantly
2. ✅ No red errors in console
3. ✅ Can sign in with Google
4. ✅ Drug list loads on Analyzer page
5. ✅ Can select drugs from dropdown
6. ✅ Analysis completes successfully
7. ✅ AI insights generate properly
8. ✅ All pages navigate smoothly

---

## 🎊 Next Steps After Success

Once everything works:

1. **Test thoroughly** - Try all features
2. **Update Supabase URLs** - Add your Netlify URL
3. **Share with users** - Your app is live!
4. **Monitor usage** - Check Render/Netlify dashboards
5. **Plan improvements** - Gather user feedback

---

**Remember**: The first request after backend sleep takes 30-60 seconds. This is normal for Render free tier!

Good luck! 🚀
