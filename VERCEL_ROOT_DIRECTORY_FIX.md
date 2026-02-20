# 🔧 Vercel Root Directory Fix

## ❌ The Problem

Vercel is looking for files in the wrong location:
```
Looking for: /vercel/path0/frontend/src/lib/utils
Should be:   /vercel/path0/src/lib/utils
```

This happens because the **Root Directory** setting in Vercel is incorrect.

---

## ✅ The Solution

You need to change the Root Directory setting in Vercel.

### Option 1: Set Root Directory to Empty (Recommended)

1. Go to your Vercel project
2. Click **"Settings"**
3. Click **"General"** in the left sidebar
4. Scroll to **"Build & Development Settings"**
5. Find **"Root Directory"**
6. Click **"Edit"**
7. **CLEAR the field** (leave it empty or set to `.`)
8. Click **"Save"**
9. Go to **"Deployments"** tab
10. Click **"Redeploy"**

### Why This Works

Your repository structure is:
```
pharmaguard-clinical-insights-main/
├── frontend/          ← This is where the code is
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
└── backend/
```

When you set Root Directory to `frontend`, Vercel changes to that directory BEFORE building.

So the paths become:
- Working directory: `/vercel/path0/` (root of repo)
- Vercel sees: `frontend/` folder
- Vercel changes to: `frontend/`
- Now paths like `src/lib/utils` work correctly

---

## 🎯 Correct Vercel Settings

### Build & Development Settings

| Setting | Value |
|---------|-------|
| **Framework Preset** | Vite |
| **Root Directory** | `.` or leave empty |
| **Build Command** | `cd frontend && npm install && npm run build` |
| **Output Directory** | `frontend/dist` |
| **Install Command** | `cd frontend && npm install` |

### Environment Variables

Make sure these are set:

```
VITE_API_URL=https://drugify-qxee.onrender.com
VITE_SUPABASE_URL=https://ewhntptpsfqwuetrgyxy.supabase.co
VITE_SUPABASE_PROJECT_ID=ewhntptpsfqwuetrgyxy
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aG50cHRwc2Zxd3VldHJneXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODY0ODksImV4cCI6MjA4NzA2MjQ4OX0.dvsXMrrZ6HJ54GZ4U2JoaVd6whQdingbXo0MB6fC2rw
```

---

## 📋 Step-by-Step Instructions

### Step 1: Update Build Settings

1. **Go to Vercel**: https://vercel.com/dashboard
2. **Click your project** (if it exists)
3. **Click "Settings"** tab
4. **Click "General"** in sidebar

### Step 2: Edit Root Directory

1. Scroll to **"Build & Development Settings"**
2. Find **"Root Directory"**
3. Click **"Edit"** button
4. **Clear the field** or enter `.`
5. Click **"Save"**

### Step 3: Update Build Command

1. Find **"Build Command"**
2. Click **"Override"** checkbox
3. Enter: `cd frontend && npm run build`
4. Click **"Save"**

### Step 4: Update Output Directory

1. Find **"Output Directory"**
2. Click **"Override"** checkbox
3. Enter: `frontend/dist`
4. Click **"Save"**

### Step 5: Update Install Command

1. Find **"Install Command"**
2. Click **"Override"** checkbox
3. Enter: `cd frontend && npm install`
4. Click **"Save"**

### Step 6: Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment
3. Or click **"Deploy"** button to create new deployment

---

## 🎯 Alternative: Use vercel.json

Create a `vercel.json` file in your repository root to configure everything:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "installCommand": "cd frontend && npm install",
  "framework": "vite",
  "devCommand": "cd frontend && npm run dev"
}
```

Then:
1. Commit and push this file
2. Vercel will use these settings automatically
3. Redeploy

---

## ✅ Verification

After redeploying, check the build logs:

**Should see**:
```
✓ 2214 modules transformed
✓ built in ~14s
```

**Should NOT see**:
```
❌ Could not load /vercel/path0/frontend/src/lib/utils
```

---

## 🐛 If Still Not Working

### Option A: Delete and Recreate Project

1. **Delete the project** in Vercel
2. **Create new project**
3. **Import from GitHub**
4. **Leave Root Directory EMPTY**
5. **Set Build Command**: `cd frontend && npm run build`
6. **Set Output Directory**: `frontend/dist`
7. **Add environment variables**
8. **Deploy**

### Option B: Use Monorepo Settings

If Vercel still has issues:

1. Go to Settings → General
2. Enable **"Monorepo"** option
3. Set **Root Directory** to `frontend`
4. Set **Build Command** to `npm run build`
5. Set **Output Directory** to `dist`
6. Redeploy

---

## 📊 Understanding the Issue

### Your Repository Structure
```
pharmaguard-clinical-insights-main/  ← Root
├── frontend/                         ← Frontend code
│   ├── src/
│   │   └── lib/
│   │       └── utils.ts             ← The file Vercel can't find
│   ├── package.json
│   └── vite.config.ts
└── backend/
```

### What Happens with Wrong Settings

**Root Directory = `frontend`**:
```
Vercel working dir: /vercel/path0/
Vercel changes to:  /vercel/path0/frontend/
Import path:        @/lib/utils
Resolves to:        /vercel/path0/frontend/src/lib/utils ❌ WRONG
```

### What Happens with Correct Settings

**Root Directory = `.` (empty)**:
```
Vercel working dir: /vercel/path0/
Build command:      cd frontend && npm run build
Now in:             /vercel/path0/frontend/
Import path:        @/lib/utils
Resolves to:        /vercel/path0/frontend/src/lib/utils ✅ CORRECT
```

---

## 🎉 Summary

**Problem**: Root Directory set to `frontend` causes double-nesting

**Solution**: 
- Set Root Directory to `.` or empty
- Update Build Command to `cd frontend && npm run build`
- Update Output Directory to `frontend/dist`

**Result**: Build will succeed! ✅

---

**Next**: Update settings in Vercel and redeploy!
