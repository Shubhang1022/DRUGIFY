# 🧹 Remove Old node_modules

## Quick Fix (Choose One Method)

### Method 1: Run Cleanup Script (Easiest) ⭐

**Windows - Double-click this file:**
```
cleanup.bat
```

**Or run in PowerShell:**
```powershell
.\cleanup.ps1
```

**Mac/Linux:**
```bash
chmod +x cleanup.sh
./cleanup.sh
```

---

### Method 2: Manual Steps

#### Step 1: Stop All Processes
- Press `Ctrl+C` in all terminals running npm/node
- Close VS Code or your editor
- Wait 5 seconds

#### Step 2: Delete Folders

**Windows (File Explorer):**
1. Open File Explorer
2. Navigate to `pharmaguard-clinical-insights-main`
3. Delete these folders:
   - `node_modules`
   - `dist`
   - `.vite`

**Windows (PowerShell):**
```powershell
# Run as Administrator if needed
Remove-Item -Path "node_modules" -Recurse -Force
Remove-Item -Path "dist" -Recurse -Force
Remove-Item -Path ".vite" -Recurse -Force
```

**Mac/Linux:**
```bash
rm -rf node_modules dist .vite
```

---

### Method 3: If Still Locked

If you get "file in use" errors:

1. **Restart your computer** (easiest)
2. Or use this tool:
   - Download: https://learn.microsoft.com/en-us/sysinternals/downloads/handle
   - Run: `handle.exe node_modules`
   - Kill the processes shown

---

## After Cleanup

### Install in Correct Location:
```bash
cd frontend
npm install
```

### Verify:
```bash
# This should NOT exist
ls node_modules  # Should error

# This SHOULD exist
ls frontend/node_modules  # Should show folders
```

---

## Why This Happens

The old `node_modules` was created before restructuring. Now it needs to be in `frontend/node_modules/` instead.

---

## Quick Checklist

- [ ] Stop all running processes (Ctrl+C)
- [ ] Close VS Code/editor
- [ ] Run cleanup script OR delete manually
- [ ] `cd frontend && npm install`
- [ ] Test: `npm run dev`

---

**If you're still having issues, just restart your computer and try again!**
