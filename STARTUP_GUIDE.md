# PharmaGuard Clinical Insights - Startup Guide

## ✅ Services Status

Both frontend and backend are now running successfully!

### Backend API
- **URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Status**: ✅ Running
- **Database**: SQLite (pharmaguard.db)

### Frontend Application
- **URL**: http://localhost:8081
- **Status**: ✅ Running
- **Framework**: React + Vite

## 🔧 What Was Fixed

### Backend Issues Fixed:
1. **Missing Dependencies**: Installed all required Python packages
   - Updated to use pre-built wheels for Windows compatibility
   - Added `aiosqlite` for SQLite database support
   
2. **Database Configuration**: 
   - Changed from PostgreSQL to SQLite (no Docker required)
   - Created `.env` file with proper configuration
   - Updated `config.py` to support SQLite

3. **Dependencies Updated**:
   ```
   fastapi, uvicorn, pydantic, pydantic-settings
   sqlalchemy, asyncpg, aiosqlite, alembic
   python-multipart, greenlet
   ```

### Frontend Issues Fixed:
1. **Port Conflict**: Vite automatically switched from port 8080 to 8081
2. **Dependencies**: All npm packages were already installed

## 🚀 How to Start Services

### Start Backend (Terminal 1):
```bash
cd pharmaguard-clinical-insights-main/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Start Frontend (Terminal 2):
```bash
cd pharmaguard-clinical-insights-main
npm run dev
```

## 📝 Configuration Files

### Backend `.env` (pharmaguard-clinical-insights-main/backend/.env):
```
DATABASE_URL=sqlite+aiosqlite:///./pharmaguard.db
CORS_ORIGINS=["http://localhost:5173","http://localhost:8080"]
```

### Frontend `.env` (pharmaguard-clinical-insights-main/.env):
```
VITE_SUPABASE_PROJECT_ID="ewhntptpsfqwuetrgyxy"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="https://ewhntptpsfqwuetrgyxy.supabase.co"
```

## 🧪 Testing the Application

1. **Open Frontend**: Navigate to http://localhost:8081
2. **Click "Run Demo"**: This will load a sample VCF file
3. **View Results**: The app will analyze the genomic data and show drug recommendations

## 📊 Features

- **VCF File Upload**: Upload patient genomic data in VCF v4.2 format
- **Pharmacogenomic Analysis**: CPIC-style drug-gene interaction analysis
- **Clinical Reports**: Actionable drug recommendations with risk levels
- **Demo Mode**: Pre-loaded sample data for testing

## 🔍 API Endpoints

- `GET /health` - Health check
- `POST /api/v1/analyze` - Analyze VCF file (backend API, not currently used by frontend)
- `GET /api/v1/health` - Analysis router health check

## 💡 Notes

- The frontend currently uses a **client-side engine** for analysis
- The backend API is available but not connected to the frontend
- To use the backend API, you would need to modify `VcfUploader.tsx` to call the API instead of the local engine
- Database file `pharmaguard.db` will be created automatically on first run

## 🛠️ Troubleshooting

### Backend won't start:
- Check if port 8000 is available
- Verify Python dependencies are installed: `pip list`
- Check the backend logs for errors

### Frontend won't start:
- Check if node_modules exists: `npm install`
- Verify Node.js version: `node --version` (should be v24+)
- Check for port conflicts

### Database errors:
- Delete `pharmaguard.db` and restart the backend
- Check file permissions in the backend directory

## 📦 System Requirements

- **Python**: 3.11+ (currently using 3.14)
- **Node.js**: 24.11.0
- **OS**: Windows (bash shell)
- **Database**: SQLite (no external database required)

---

**Status**: ✅ All systems operational
**Last Updated**: 2026-02-19
