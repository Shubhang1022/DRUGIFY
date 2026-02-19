# 🔄 How to Restructure Your Project

## Quick Restructure (5 Minutes)

Follow these commands to reorganize your project properly:

---

## Step 1: Create Frontend Folder

```bash
# Navigate to your project
cd pharmaguard-clinical-insights-main

# Create frontend directory
mkdir frontend

# Move frontend directories
mv src frontend/
mv public frontend/

# Move frontend config files
mv package.json frontend/
mv package-lock.json frontend/
mv vite.config.ts frontend/
mv vitest.config.ts frontend/
mv tsconfig.json frontend/
mv tsconfig.app.json frontend/
mv tsconfig.node.json frontend/
mv tailwind.config.ts frontend/
mv postcss.config.js frontend/
mv eslint.config.js frontend/
mv components.json frontend/
mv index.html frontend/

# Move environment files
mv .env frontend/
mv .env.example frontend/

# Move deployment files
mv vercel.json frontend/
mv .vercelignore frontend/
mv Dockerfile.frontend frontend/

# Optional: Move supabase folder if it's frontend-related
mv supabase frontend/
```

---

## Step 2: Create Docs Folder (Optional)

```bash
# Create docs directory
mkdir docs

# Move documentation files
mv *.md docs/
mv README.md .  # Keep README in root
```

---

## Step 3: Update Configuration Files

After moving files, you need to update some paths:

### A. Update `frontend/vite.config.ts`

No changes needed - paths are relative!

### B. Create Root `render.yaml`

I'll create this for you below.

### C. Update Root `.gitignore`

Add these lines:
```
# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env

# Backend
backend/__pycache__/
backend/*.db
backend/.env
```

---

## Step 4: Test Locally

```bash
# Test Frontend
cd frontend
npm install
npm run dev
# Should run on http://localhost:8080

# Test Backend (in new terminal)
cd ../backend
uvicorn app.main:app --reload
# Should run on http://localhost:8000
```

---

## Step 5: Update Deployment Configs

### For Render (Both Services)

Create `render.yaml` in root:
```yaml
services:
  # Frontend
  - type: web
    name: drugify-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html

  # Backend
  - type: web
    name: drugify-backend
    env: python
    buildCommand: cd backend && pip install -r requirements.txt
    startCommand: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

### For Vercel (Frontend Only)

In `frontend/vercel.json`:
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

---

## Final Structure

```
pharmaguard-clinical-insights-main/
│
├── frontend/                    ← All frontend files
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── lib/
│   │   └── App.tsx
│   ├── public/
│   ├── node_modules/
│   ├── dist/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── index.html
│   ├── .env
│   ├── .env.example
│   ├── vercel.json
│   └── .vercelignore
│
├── backend/                     ← All backend files
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── main.py
│   │   └── ...
│   ├── requirements.txt
│   ├── Procfile
│   ├── railway.json
│   ├── .env
│   └── .gitignore
│
├── docs/                        ← Documentation (optional)
│   ├── SETUP_GUIDE.md
│   ├── DEPLOYMENT.md
│   └── ...
│
├── .git/
├── .gitignore
├── README.md
├── render.yaml
└── docker-compose.yml
```

---

## Deployment After Restructure

### Option 1: Vercel (Frontend) + Render (Backend)

**Frontend to Vercel:**
```bash
cd frontend
vercel
```

Or via dashboard:
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`

**Backend to Render:**
- Root Directory: `backend`
- Build Command: `pip install -r requirements.txt`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### Option 2: Both on Render

Use the `render.yaml` file in root - Render will deploy both automatically!

---

## Benefits of This Structure

✅ **Clear Separation**
- Frontend and backend are completely separate
- No confusion about which files belong where

✅ **Easy Deployment**
- Each service can be deployed independently
- Clear root directories for deployment platforms

✅ **Better Organization**
- Professional project structure
- Easy for other developers to understand

✅ **Scalability**
- Easy to add more services (e.g., mobile app, admin panel)
- Each service has its own dependencies

---

## Quick Commands Summary

```bash
# Restructure
mkdir frontend
mv src public package.json package-lock.json vite.config.ts vitest.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json tailwind.config.ts postcss.config.js eslint.config.js components.json index.html .env .env.example vercel.json .vercelignore Dockerfile.frontend supabase frontend/

# Test
cd frontend && npm install && npm run dev

# Deploy Frontend (Vercel)
cd frontend && vercel

# Deploy Backend (Render)
# Use Render dashboard with root directory: backend
```

---

## Need Help?

If you get stuck:
1. Make sure you're in the right directory
2. Check file paths are correct
3. Test locally before deploying
4. Check the deployment logs

---

**After restructuring, your project will be much cleaner and easier to deploy!**
