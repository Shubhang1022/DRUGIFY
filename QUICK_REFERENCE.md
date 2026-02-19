# 🚀 Quick Reference Card

## Current Status
✅ **Backend**: Running on http://localhost:8000  
✅ **Frontend**: Running on http://localhost:8081  
🟢 **Security**: Production-ready framework implemented  
🟡 **Auth**: Framework ready, needs user endpoints  

---

## 🔥 Critical Actions Required

### 1. Rotate API Keys (DO THIS FIRST!)
```bash
# 1. Go to Supabase dashboard
# 2. Generate new keys
# 3. Update .env file
# 4. Remove from git history:
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env backend/.env" \
  --prune-empty --tag-name-filter cat -- --all
```

### 2. Generate Secret Key
```bash
openssl rand -hex 32
# Add to backend/.env as SECRET_KEY=<generated-key>
```

### 3. Update NPM Packages
```bash
cd pharmaguard-clinical-insights-main
npm audit fix --force
```

---

## 📝 Environment Setup

### Backend (.env)
```bash
ENVIRONMENT=development
DEBUG=True
DATABASE_URL=sqlite+aiosqlite:///./pharmaguard.db
SECRET_KEY=<generate-with-openssl>
CORS_ORIGINS=["http://localhost:5173","http://localhost:8081"]
```

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_PROJECT_ID=<your-new-id>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-new-key>
VITE_SUPABASE_URL=<your-supabase-url>
```

---

## 🏃 Start Services

### Backend
```bash
cd pharmaguard-clinical-insights-main/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend
```bash
cd pharmaguard-clinical-insights-main
npm run dev
```

---

## 🔒 Security Features Implemented

✅ JWT Authentication Framework  
✅ Rate Limiting (10 req/min)  
✅ Input Validation  
✅ Security Headers  
✅ Request Logging  
✅ Error Handling  
✅ File Size Limits (5MB)  
✅ VCF Format Validation  
✅ Patient ID Sanitization  
✅ CSP Headers  

---

## 📊 API Endpoints

### Health Check
```bash
GET http://localhost:8000/health
```

### Analyze VCF
```bash
POST http://localhost:8000/api/v1/analyze
Content-Type: application/json

{
  "patient_id": "PT-001",
  "vcf_content": "##fileformat=VCFv4.2...",
  "notes": "Optional notes"
}
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Install missing packages
pip install -r requirements.txt
```

### Frontend won't start
```bash
# Install dependencies
npm install

# Clear cache
rm -rf node_modules package-lock.json
npm install
```

### Database errors
```bash
# Delete and recreate database
rm pharmaguard.db
# Restart backend (will recreate tables)
```

---

## 📚 Documentation

- `PRODUCTION_READY_SUMMARY.md` - Overall status
- `SECURITY_AUDIT_REPORT.md` - Detailed security analysis
- `PRODUCTION_DEPLOYMENT.md` - Deployment guide
- `PRODUCTION_READY_CHECKLIST.md` - Complete checklist
- `STARTUP_GUIDE.md` - Getting started

---

## ⚡ Quick Commands

```bash
# Install backend security packages
pip install python-jose[cryptography] passlib[bcrypt] bleach

# Update frontend packages
npm update react-router-dom vite

# Run security audit
npm audit
pip-audit

# Generate secret key
openssl rand -hex 32

# Check running processes
netstat -ano | findstr :8000
netstat -ano | findstr :8081
```

---

## 🎯 Next Steps Priority

1. **Today**: Rotate API keys
2. **This Week**: Implement auth endpoints
3. **Next Week**: Migrate to PostgreSQL
4. **Month 1**: Deploy to staging
5. **Month 2**: Production launch

---

## 📞 Quick Links

- Backend API: http://localhost:8000
- Frontend App: http://localhost:8081
- API Docs: http://localhost:8000/api/docs (dev only)
- Health Check: http://localhost:8000/health

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-19  
**Status**: 🟢 Production-Ready (with conditions)
