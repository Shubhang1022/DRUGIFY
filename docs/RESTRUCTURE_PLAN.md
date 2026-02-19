# 📁 Project Restructure Plan

## Current Structure (Messy)
```
pharmaguard-clinical-insights-main/
├── src/              ← Frontend source
├── public/           ← Frontend assets
├── backend/          ← Backend
├── package.json      ← Frontend deps
├── vite.config.ts    ← Frontend config
└── ... (mixed files)
```

## New Structure (Clean)
```
pharmaguard-clinical-insights-main/
├── frontend/         ← All frontend files
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── backend/          ← All backend files
│   ├── app/
│   ├── requirements.txt
│   └── ...
├── docs/             ← Documentation
└── README.md
```

## Files to Move to `frontend/`

### Directories:
- src/
- public/
- node_modules/ (will regenerate)
- dist/ (will regenerate)

### Config Files:
- package.json
- package-lock.json
- vite.config.ts
- vitest.config.ts
- tsconfig.json
- tsconfig.app.json
- tsconfig.node.json
- tailwind.config.ts
- postcss.config.js
- eslint.config.js
- components.json
- index.html
- .env
- .env.example

### Deployment Files:
- vercel.json
- .vercelignore
- Dockerfile.frontend

## Files to Keep in Root:
- README.md
- .gitignore
- docker-compose.yml
- render.yaml (updated)
- Documentation files

## Benefits:
✅ Clear separation of frontend/backend
✅ Easy to deploy separately
✅ Each folder is self-contained
✅ No confusion about which files belong where
✅ Professional project structure
