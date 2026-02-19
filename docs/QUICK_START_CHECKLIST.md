# 🚀 DRUGIFY v3.0 - Quick Start Checklist

## ✅ Pre-Flight Checklist

Use this checklist to get DRUGIFY up and running quickly.

---

## Step 1: Supabase Setup (5 minutes)

### Create Supabase Project
- [ ] Go to https://supabase.com
- [ ] Sign up or log in
- [ ] Click "New Project"
- [ ] Name: `drugify` (or your choice)
- [ ] Choose a strong database password
- [ ] Select region closest to you
- [ ] Wait 2-3 minutes for project creation

### Get Credentials
- [ ] Go to Settings > API in Supabase dashboard
- [ ] Copy "Project URL" (looks like: `https://xxxxx.supabase.co`)
- [ ] Copy "anon public" key (starts with `eyJ...`)

### Enable Google OAuth (Optional)
- [ ] Go to Authentication > Providers
- [ ] Find "Google" and enable it
- [ ] Follow Google Cloud setup instructions
- [ ] Add Client ID and Secret to Supabase

---

## Step 2: Environment Configuration (2 minutes)

### Frontend .env
- [ ] Copy `.env.example` to `.env`
- [ ] Open `.env` file
- [ ] Replace `VITE_SUPABASE_URL` with your Project URL
- [ ] Replace `VITE_SUPABASE_PUBLISHABLE_KEY` with your anon key
- [ ] Verify `VITE_API_URL=http://localhost:8000`

Example:
```env
VITE_SUPABASE_URL=https://abcdefgh.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_API_URL=http://localhost:8000
```

### Backend .env
- [ ] Navigate to `backend` folder
- [ ] Verify `.env` file exists
- [ ] Check it has `DATABASE_URL`, `SECRET_KEY`, etc.

---

## Step 3: Install Dependencies (3 minutes)

### Frontend
```bash
# In root directory
npm install
```
- [ ] Run command above
- [ ] Wait for installation to complete
- [ ] Check for any errors

### Backend
```bash
# In backend directory
cd backend
pip install -r requirements.txt
```
- [ ] Run commands above
- [ ] Wait for installation to complete
- [ ] Check for any errors

---

## Step 4: Start the Application (1 minute)

### Terminal 1: Backend
```bash
cd backend
uvicorn app.main:app --reload --port 8000
```
- [ ] Open first terminal
- [ ] Run commands above
- [ ] Wait for "Application startup complete"
- [ ] Verify: http://localhost:8000/docs opens

### Terminal 2: Frontend
```bash
# From root directory
npm run dev
```
- [ ] Open second terminal
- [ ] Run command above
- [ ] Wait for "Local: http://localhost:8081"
- [ ] Verify: http://localhost:8081 opens

---

## Step 5: Test the Application (5 minutes)

### Test Authentication
- [ ] Open http://localhost:8081
- [ ] Click "Sign up" button in header
- [ ] Try signing up with email/password
- [ ] Verify redirect to Dashboard
- [ ] Log out from user dropdown
- [ ] Try logging in again
- [ ] (Optional) Test Google OAuth if configured

### Test Navigation
- [ ] Click "Home" in header → Should show landing page
- [ ] Click "About" in header → Should show about page
- [ ] Click "Detection Analyzer" → Should show analyzer
- [ ] Click "Dashboard" in user menu → Should show dashboard
- [ ] Click user avatar → Should show dropdown menu
- [ ] Test mobile menu (resize browser to < 768px)

### Test Analyzer
- [ ] Go to Detection Analyzer page
- [ ] Upload a VCF file (or use sample)
- [ ] Select one or more drugs
- [ ] Click "Analyze" button
- [ ] Verify results appear
- [ ] Check risk categories display correctly

### Test Protected Routes
- [ ] Log out
- [ ] Try to access http://localhost:8081/dashboard
- [ ] Should redirect to login page ✅
- [ ] Try to access http://localhost:8081/profile
- [ ] Should redirect to login page ✅

---

## Step 6: Optional Database Setup (5 minutes)

### Create Analysis History Table
- [ ] Go to Supabase dashboard
- [ ] Click "SQL Editor"
- [ ] Copy SQL from SETUP_GUIDE.md (Step 4.1)
- [ ] Run the SQL
- [ ] Verify table created in "Table Editor"

---

## 🎉 Success Criteria

You're ready to go if:
- ✅ Backend running on http://localhost:8000
- ✅ Frontend running on http://localhost:8081
- ✅ Can sign up and log in
- ✅ Can navigate between pages
- ✅ Can access Dashboard when logged in
- ✅ Can upload and analyze VCF files
- ✅ Protected routes redirect to login

---

## 🐛 Troubleshooting

### Issue: "Invalid API key" error
**Solution:** Double-check Supabase credentials in `.env` file

### Issue: Backend won't start
**Solution:** 
- Check Python version: `python --version` (should be 3.8+)
- Reinstall dependencies: `pip install -r requirements.txt`
- Check port 8000 is not in use

### Issue: Frontend won't start
**Solution:**
- Check Node version: `node --version` (should be 18+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check port 8081 is not in use

### Issue: Can't log in
**Solution:**
- Verify Supabase credentials are correct
- Check browser console for errors
- Try clearing browser cache
- Verify Supabase project is active

### Issue: Google OAuth not working
**Solution:**
- Verify Google OAuth is enabled in Supabase
- Check redirect URIs are configured correctly
- Ensure Google Cloud project is set up properly

### Issue: Protected routes not working
**Solution:**
- Check AuthProvider is wrapping routes in App.tsx
- Verify Supabase session is being stored
- Check browser console for auth errors

---

## 📚 Next Steps

After successful setup:

1. **Read Documentation**
   - [ ] Review SETUP_GUIDE.md for detailed info
   - [ ] Check V3_IMPLEMENTATION_SUMMARY.md for features
   - [ ] Read README.md for project overview

2. **Customize**
   - [ ] Update branding/colors if needed
   - [ ] Add your own content to About page
   - [ ] Configure email templates in Supabase

3. **Deploy**
   - [ ] Follow deployment guides for production
   - [ ] Set up production Supabase project
   - [ ] Configure custom domain

---

## 🆘 Need Help?

- Check SETUP_GUIDE.md for detailed instructions
- Review V3_IMPLEMENTATION_SUMMARY.md for architecture
- Check browser console for errors
- Check backend terminal for API errors
- Review Supabase logs in dashboard

---

**Estimated Total Time:** 15-20 minutes  
**Difficulty:** Easy  
**Status:** Ready to use! 🎉
