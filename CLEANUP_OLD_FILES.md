# 🧹 Cleanup Old Files

## Files to Remove from Root

After restructuring, these old files/folders in the root directory are no longer needed:

### 1. Old Build Artifacts
```bash
# Remove old node_modules (frontend now has its own)
rm -rf node_modules

# Remove old dist folder
rm -rf dist

# Remove old .vite cache
rm -rf .vite
```

### 2. For Windows (PowerShell):
```powershell
# Remove old node_modules
Remove-Item -Path "node_modules" -Recurse -Force

# Remove old dist folder
Remove-Item -Path "dist" -Recurse -Force

# Remove old .vite cache
Remove-Item -Path ".vite" -Recurse -Force
```

---

## Why Remove These?

### `node_modules/` in root
- ❌ Old location (before restructure)
- ✅ New location: `frontend/node_modules/`
- **Action:** Delete root `node_modules/`, use `frontend/node_modules/`

### `dist/` in root
- ❌ Old build output
- ✅ New location: `frontend/dist/`
- **Action:** Delete root `dist/`, builds go to `frontend/dist/`

### `.vite/` in root
- ❌ Old Vite cache
- ✅ New location: `frontend/.vite/`
- **Action:** Delete root `.vite/`

---

## After Cleanup

Your root directory should only have:
```
pharmaguard-clinical-insights-main/
├── frontend/          ← Frontend with its own node_modules
├── backend/           ← Backend
├── docs/              ← Documentation
├── .git/              ← Git repository
├── .gitignore
├── README.md
├── render.yaml
└── docker-compose.yml
```

---

## Reinstall Frontend Dependencies

After cleanup, reinstall in the correct location:

```bash
cd frontend
npm install
```

This will create `frontend/node_modules/` with all dependencies.

---

## Quick Cleanup Script

### Windows (PowerShell):
```powershell
# Run from project root
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "dist" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".vite" -Recurse -Force -ErrorAction SilentlyContinue

# Reinstall in frontend
cd frontend
npm install
```

### Mac/Linux (Bash):
```bash
# Run from project root
rm -rf node_modules dist .vite

# Reinstall in frontend
cd frontend
npm install
```

---

## Verify Cleanup

After cleanup, check:
```bash
# Should NOT exist in root
ls node_modules  # Should error
ls dist          # Should error

# Should exist in frontend
ls frontend/node_modules  # Should show folders
```

---

## If You Get Errors

### "Cannot delete node_modules"
**Cause:** Files are in use (dev server running)
**Solution:** 
1. Stop all running processes (Ctrl+C)
2. Close VS Code or your editor
3. Try cleanup again

### "Permission denied"
**Windows:** Run PowerShell as Administrator
**Mac/Linux:** Use `sudo rm -rf node_modules`

---

## After Cleanup Checklist

- [ ] Old `node_modules/` removed from root
- [ ] Old `dist/` removed from root
- [ ] Old `.vite/` removed from root
- [ ] New `frontend/node_modules/` exists
- [ ] Frontend runs: `cd frontend && npm run dev`
- [ ] Backend runs: `cd backend && uvicorn app.main:app --reload`

---

**Time Required:** 2-3 minutes
**Disk Space Saved:** ~200-500 MB (duplicate node_modules)
