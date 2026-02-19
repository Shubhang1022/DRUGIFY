# ✅ Final Steps - Clean Up Old Files

## 🧹 Remove Old node_modules

The old `node_modules` folder in the root directory needs to be removed. The new one is in `frontend/node_modules/`.

### Windows (PowerShell):
```powershell
# Stop any running processes first (Ctrl+C)
# Then run:
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".vite" -Recurse -Force -ErrorAction SilentlyContinue
```

### Mac/Linux (Terminal):
```bash
# Stop any running processes first (Ctrl+C)
# Then run:
rm -rf node_modules dist .vite
```

---

## 🔧 Install Dependencies in Frontend

After cleanup, install dependencies in the correct location:

```bash
cd frontend
npm install
```

This creates `frontend/node_modules/` with all dependencies.

---

## ✅ Verify Structure

Your project should now look like:

```
pharmaguard-clinical-insights-main/
├── frontend/
│   ├── node_modules/     ✅ New location
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── app/
│   └── requirements.txt
├── docs/
└── README.md
```

**No `node_modules/` in root!** ✅

---

## 🧪 Test Everything

### Test Frontend:
```bash
cd frontend
npm run dev
```
Should open on: http://localhost:8080

### Test Backend:
```bash
cd backend
uvicorn app.main:app --reload
```
Should run on: http://localhost:8000

---

## 🚀 Ready to Deploy!

Once tests pass, you're ready to deploy:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Restructured project for deployment"
   git push origin main
   ```

2. **Deploy Frontend to Vercel:**
   - Go to https://vercel.com
   - Import repository
   - Root Directory: `frontend`
   - Deploy!

3. **Deploy Backend to Render:**
   - Go to https://render.com
   - New Web Service
   - Root Directory: `backend`
   - Deploy!

---

## 📋 Quick Checklist

- [ ] Stopped all running processes
- [ ] Removed old `node_modules/` from root
- [ ] Removed old `dist/` from root
- [ ] Installed dependencies: `cd frontend && npm install`
- [ ] Frontend runs: `npm run dev`
- [ ] Backend runs: `cd backend && uvicorn app.main:app --reload`
- [ ] Pushed to GitHub
- [ ] Ready to deploy!

---

**Time Required:** 5 minutes
**Status:** Almost done! Just cleanup and deploy! 🎉
