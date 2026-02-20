# 🚨 URGENT: Fix Vercel Root Directory

## The Issue

You still have **Root Directory** set to `frontend` in Vercel settings.

The error shows: `/vercel/path0/frontend/src/lib/utils`

This means Vercel is looking in the WRONG place.

---

## ✅ SOLUTION: Change Root Directory in Vercel

### Step 1: Go to Vercel Settings

1. Open: https://vercel.com/dashboard
2. Click on your project name
3. Click **"Settings"** tab (top navigation)

### Step 2: Find Root Directory Setting

1. In the left sidebar, click **"General"**
2. Scroll down to **"Build & Development Settings"** section
3. You'll see **"Root Directory"** with a value of `frontend`

### Step 3: Clear Root Directory

1. Click the **"Edit"** button next to "Root Directory"
2. **DELETE** the text `frontend`
3. Leave the field **COMPLETELY EMPTY**
4. Click **"Save"**

### Step 4: Verify Other Settings

While you're there, make sure these are set:

**Build Command**: 
- Click "Override" if not already
- Enter: `cd frontend && npm run build`

**Output Directory**:
- Click "Override" if not already  
- Enter: `frontend/dist`

**Install Command**:
- Click "Override" if not already
- Enter: `cd frontend && npm install`

Click **"Save"** after each change.

### Step 5: Redeploy

1. Go to **"Deployments"** tab (top navigation)
2. Find the latest deployment
3. Click the **three dots (•••)** on the right
4. Click **"Redeploy"**
5. Confirm

---

## 🎯 What Should Happen

After you clear the Root Directory and redeploy:

**Before (Wrong)**:
```
Root Directory: frontend
Vercel looks in: /vercel/path0/frontend/src/lib/utils ❌
```

**After (Correct)**:
```
Root Directory: (empty)
Build runs: cd frontend && npm run build
Vercel looks in: /vercel/path0/frontend/src/lib/utils ✅
```

---

## 🔄 Alternative: Delete and Recreate

If changing settings doesn't work:

### Step 1: Delete Project

1. Go to: https://vercel.com/dashboard
2. Click your project
3. Settings → General
4. Scroll to bottom
5. Click **"Delete Project"**
6. Confirm deletion

### Step 2: Create New Project

1. Click **"Add New..."** → **"Project"**
2. Click **"Import Git Repository"**
3. Find: `pharmaguard-clinical-insights-main`
4. Click **"Import"**

### Step 3: Configure (IMPORTANT!)

**Framework Preset**: Vite

**Root Directory**: **LEAVE EMPTY** ← CRITICAL!

**Build Command**: Click "Override" and enter:
```
cd frontend && npm run build
```

**Output Directory**: Click "Override" and enter:
```
frontend/dist
```

**Install Command**: Click "Override" and enter:
```
cd frontend && npm install
```

### Step 4: Add Environment Variables

Click "Environment Variables" and add:

```
VITE_API_URL=https://drugify-qxee.onrender.com
VITE_SUPABASE_URL=https://ewhntptpsfqwuetrgyxy.supabase.co
VITE_SUPABASE_PROJECT_ID=ewhntptpsfqwuetrgyxy
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aG50cHRwc2Zxd3VldHJneXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODY0ODksImV4cCI6MjA4NzA2MjQ4OX0.dvsXMrrZ6HJ54GZ4U2JoaVd6whQdingbXo0MB6fC2rw
```

### Step 5: Deploy

Click **"Deploy"** button.

---

## ✅ Success Indicators

Build will succeed when you see:

```
✓ 2214 modules transformed
✓ built in ~14s
```

**NOT**:
```
❌ Could not load /vercel/path0/frontend/src/lib/utils
```

---

## 📸 Visual Guide

### What You Should See:

**Settings → General → Build & Development Settings**

```
┌─────────────────────────────────────────┐
│ Root Directory                          │
│ ┌─────────────────────────────────────┐ │
│ │ [EMPTY - NO TEXT HERE]              │ │ ← Should be EMPTY!
│ └─────────────────────────────────────┘ │
│                                  [Edit] │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Build Command                    ☑ Override │
│ ┌─────────────────────────────────────┐ │
│ │ cd frontend && npm run build        │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Output Directory                ☑ Override │
│ ┌─────────────────────────────────────┐ │
│ │ frontend/dist                       │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Install Command                 ☑ Override │
│ ┌─────────────────────────────────────┐ │
│ │ cd frontend && npm install          │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🎯 Quick Checklist

Before redeploying, verify:

- [ ] Root Directory is **EMPTY** (no text)
- [ ] Build Command: `cd frontend && npm run build`
- [ ] Output Directory: `frontend/dist`
- [ ] Install Command: `cd frontend && npm install`
- [ ] All 4 environment variables added
- [ ] Clicked "Save" on all changes

---

## 🚨 CRITICAL

**DO NOT** set Root Directory to `frontend`

**DO** leave Root Directory **EMPTY**

The build commands will handle going into the frontend folder.

---

## 💡 Why This Matters

**With Root Directory = `frontend`**:
- Vercel changes to `/vercel/path0/frontend/`
- Then tries to find `frontend/src/lib/utils`
- Looks in `/vercel/path0/frontend/frontend/src/lib/utils` ❌ WRONG

**With Root Directory = empty**:
- Vercel stays in `/vercel/path0/`
- Build command: `cd frontend && npm run build`
- Looks in `/vercel/path0/frontend/src/lib/utils` ✅ CORRECT

---

## 🎉 After Success

Once deployed successfully:

1. **Get your Vercel URL** (e.g., `https://drugify-xyz.vercel.app`)

2. **Update Render CORS**:
   - Go to: https://dashboard.render.com
   - Service: `drugify-qxee`
   - Environment → `CORS_ORIGINS`
   - Add: `https://your-vercel-url.vercel.app`

3. **Update Supabase**:
   - Go to: https://supabase.com/dashboard
   - Project: `ewhntptpsfqwuetrgyxy`
   - Authentication → URL Configuration
   - Add your Vercel URL

4. **Test your app!** 🎊

---

**GO TO VERCEL NOW AND CLEAR THE ROOT DIRECTORY!** 🚀
