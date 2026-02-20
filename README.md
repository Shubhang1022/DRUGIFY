<div align="center">

# 💊 DRUGIFY

### Pharmacogenomic Clinical Decision Support System

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![Node](https://img.shields.io/badge/node-24.11.0-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.3+-61DAFB.svg)](https://reactjs.org/)
[![Security](https://img.shields.io/badge/security-82%2F100-green.svg)](SECURITY_AUDIT_REPORT.md)
[![Status](https://img.shields.io/badge/status-production%20ready-brightgreen.svg)]()

*Empowering healthcare providers with AI-powered pharmacogenomic analysis for personalized medicine*

[🌐 Live Demo](https://drugify.netlify.app) • [📹 Video Demo](https://www.linkedin.com/feed/update/urn:li:activity:7430438129402068992/) • [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [What's New](#-whats-new-v300)
- [Features](#-features)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Security](#-security)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

---

## 🔬 Overview

DRUGIFY is a comprehensive pharmacogenomic clinical decision support system that analyzes patient genetic data (VCF files) to provide evidence-based drug recommendations. Built on CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines, it helps healthcare providers make informed prescribing decisions based on individual patient genetics.

**Version 3.0** introduces a complete multi-page web application with user authentication, dashboard, and enhanced user experience.

### Key Capabilities

- **Multi-Page Web Application**: Professional website with home, about, analyzer, dashboard, and profile pages
- **User Authentication**: Secure login/signup with Google OAuth and email/password via Supabase
- **User Dashboard**: Track analysis history and view statistics (protected route)
- **Drug-Specific Analysis**: Select specific drugs for targeted pharmacogenomic analysis
- **VCF File Analysis**: Process genomic variant data in VCF v4.2 format
- **CPIC-Based Recommendations**: Evidence-based drug-gene interaction analysis
- **5 Risk Categories**: Detailed risk assessment (Toxicity, Ineffective, Adjust Dosage, Safe, Unknown)
- **Dosage Guidance**: Specific dosing recommendations for each drug
- **AI-Powered Insights**: Enhanced clinical interpretation with AI assistance
- **Real-Time Processing**: Fast analysis with results in seconds
- **Secure & Compliant**: Built with HIPAA/GDPR considerations

---

## 🆕 What's New (v3.0.0)

### Multi-Page Web Application 🌐

**Complete Website Redesign**
- Professional landing page with hero section, features, and statistics
- Dedicated About page with mission, values, and team information
- Separate Detection Analyzer page (formerly the main page)
- Responsive header with navigation and mobile menu
- Comprehensive footer with links and social media

### User Authentication & Accounts 🔐

**Secure Authentication System**
- Google OAuth integration via Supabase
- Email/Password signup and login
- Protected routes for authenticated users
- User session management with auto-refresh
- Secure logout functionality

### User Dashboard 📊

**Personal Analysis Hub**
- View analysis statistics and history
- Track total analyses and monthly activity
- Quick access to start new analysis
- Analysis history with detailed records (coming soon)
- User profile management

### Enhanced User Experience ✨

**Improved Navigation & Layout**
- Multi-page routing with React Router
- Layout wrapper with consistent header/footer
- User dropdown menu with profile access
- Mobile-responsive design throughout
- Smooth page transitions with Framer Motion

### Previous Features (v2.0.0)

### Drug Selection Interface 💊

✨ **Drug Selection Interface**
- Searchable dropdown with autocomplete
- Multi-drug selection (1-10 drugs)
- Real-time drug→gene mapping preview
- Only selected drugs analyzed and shown in results

✨ **Enhanced Risk Assessment**
- 5 detailed risk categories (vs 3 generic levels)
  - 🔴 **Toxicity** - Avoid, severe side effects
  - 🟠 **Ineffective** - Won't work, use alternative
  - 🟡 **Adjust Dosage** - Specific dose modifications
  - 🟢 **Safe** - Standard dosing OK
  - ⚪ **Unknown** - No variant found, monitor

✨ **Dosage Guidance**
- Specific dosing instructions for each drug
- Examples: "Reduce dose by 25-50%", "Start 2.5-3.75mg daily"
- Monitoring requirements included

✨ **Unknown Status Handling**
- Clear feedback when no genetic variant detected
- Standard dosing recommendations
- Prevents false negatives

### Bug Fixes

🐛 **Fixed**: Drug filtering - Only selected drugs now shown in results  
🐛 **Fixed**: CORS errors - OPTIONS requests now working  
🐛 **Fixed**: Frontend crash - API response format corrected  
🐛 **Fixed**: Field naming - Consistent camelCase throughout

### Supported Drugs

| Drug | Gene | Category | Use Case |
|------|------|----------|----------|
| CODEINE | CYP2D6 | Analgesic | Pain relief |
| WARFARIN | CYP2C9 | Anticoagulant | Blood thinner |
| CLOPIDOGREL | CYP2C19 | Antiplatelet | Antiplatelet therapy |
| SIMVASTATIN | SLCO1B1 | Statin | Cholesterol management |
| AZATHIOPRINE | TPMT | Immunosuppressant | Immune suppression |
| FLUOROURACIL | DPYD | Chemotherapy | Cancer treatment |

---

## ✨ Features

### Core Functionality

- 🧬 **Genomic Analysis**
  - VCF v4.2 file parsing and validation
  - Support for up to 100,000 variants per file
  - Automated variant annotation and interpretation
  - Real-time processing (< 2 seconds)

- 💊 **Drug-Specific Analysis** ⭐ NEW
  - Select 1-10 specific drugs for analysis
  - Searchable dropdown with autocomplete
  - Drug→gene mapping preview
  - Only selected drugs shown in results
  - Dynamic drug list from API

- 🎯 **Enhanced Risk Assessment** ⭐ NEW
  - **5 Detailed Risk Categories**:
    - 🔴 Toxicity - High risk of severe side effects
    - 🟠 Ineffective - Drug won't work due to genetics
    - 🟡 Adjust Dosage - Modified dosing required
    - 🟢 Safe - Standard dosing recommended
    - ⚪ Unknown - No variant detected, monitor patient
  - Color-coded visual indicators
  - Sorted by risk level (highest first)

- 💉 **Dosage Guidance** ⭐ NEW
  - Specific dosing instructions for each drug
  - Percentage adjustments (e.g., "Reduce by 25-50%")
  - Starting dose recommendations
  - Monitoring requirements
  - Clinical decision support

- 📊 **Comprehensive Reporting**
  - Detailed pharmacogenomic reports
  - Summary statistics by risk category
  - Drugs analyzed count
  - Exportable results (JSON)
  - Audit trail for compliance

- 🤖 **AI Clinical Insights**
  - Natural language interpretation of results
  - Highlighted medical terms and risk factors
  - Color-coded recommendations for quick scanning
  - Evidence-based guidelines referenced

### User Interface

- 🎨 **Modern Design**
  - Clean, intuitive interface
  - Responsive design (mobile-friendly)
  - Dark mode support
  - Accessibility compliant
  - Professional medical aesthetic

- 🔍 **Enhanced Visualization**
  - Color-coded risk categories
  - Expandable drug cards
  - Summary statistics dashboard
  - Variant table view
  - Raw JSON export

- ⚡ **Performance**
  - Fast analysis (< 2 seconds)
  - Real-time validation
  - Optimized file handling
  - Efficient API calls
  - Hot module reloading (dev)

### Security Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication framework
  - Role-based access control (ready for implementation)
  - Secure password hashing with bcrypt

- 🛡️ **Data Protection**
  - Input validation and sanitization
  - Rate limiting (10 requests/minute)
  - Patient ID anonymization in logs
  - File size limits (5MB)
  - SQL injection prevention

- 🔒 **Security Headers**
  - Content Security Policy (CSP)
  - X-Frame-Options, X-XSS-Protection
  - HSTS, Referrer-Policy
  - CORS configuration

---

## 🏗️ Architecture

### Technology Stack

#### Backend
- **Framework**: FastAPI 0.115+
- **Language**: Python 3.11+
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy 2.0+ with async support
- **Authentication**: JWT (python-jose)
- **Security**: Passlib, Bleach

#### Frontend
- **Framework**: React 18.3+
- **Language**: TypeScript 5.8+
- **Build Tool**: Vite 5.4+
- **UI Library**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS 3.4+
- **State Management**: TanStack Query
- **Routing**: React Router 6.30+

#### Infrastructure
- **Web Server**: Uvicorn (ASGI)
- **Reverse Proxy**: Nginx (recommended)
- **Containerization**: Docker support
- **CI/CD**: GitHub Actions ready

### System Architecture

```
┌─────────────────┐
│   Web Browser   │
└────────┬────────┘
         │ HTTPS
         ▼
┌─────────────────┐
│  React Frontend │ (Port 8081)
│   + Vite Dev    │
└────────┬────────┘
         │ REST API
         ▼
┌─────────────────┐
│  FastAPI Backend│ (Port 8000)
│  + Security     │
│  + Rate Limit   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
└─────────────────┘
```

---

## 📁 Project Structure

```
pharmaguard-clinical-insights-main/
├── frontend/              # React + Vite frontend
│   ├── src/              # Source code
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   └── requirements.txt # Python dependencies
├── docs/                # Documentation
└── README.md           # This file
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- Node.js 24.11.0 or higher
- npm or yarn package manager
- Git
- Supabase account (free tier available at [supabase.com](https://supabase.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/drugify.git
cd pharmaguard-clinical-insights-main

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
cd backend
pip install -r requirements.txt
cd ..
```

### Configuration

#### 1. Supabase Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. (Optional) Enable Google OAuth in Authentication > Providers

#### 2. Environment Files

```bash
# Create environment files from templates
cp .env.example .env
cp backend/.env.example backend/.env

# Edit .env and add your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
# VITE_API_URL=http://localhost:8000

# Generate a secret key for backend
openssl rand -hex 32

# Edit backend/.env and add:
# SECRET_KEY=<your-generated-key>
```

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)

### Running the Application

```bash
# Terminal 1: Start Backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Frontend
cd frontend
npm run dev
```

### First Steps

1. Open http://localhost:8080 in your browser
2. Click "Sign up" to create an account
3. Log in with Google OAuth or email/password
4. Navigate to "Detection Analyzer" from the header
5. Upload a VCF file and select drugs to analyze
6. View your analysis history in the Dashboard

Access the application:
- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/api/docs (development only)

---

## ⚙️ Configuration

### Backend Environment Variables

```bash
# Environment
ENVIRONMENT=development          # development | production
DEBUG=True                       # True | False

# Database
DATABASE_URL=sqlite+aiosqlite:///./pharmaguard.db

# Security (REQUIRED in production)
SECRET_KEY=your-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=["http://localhost:5173","http://localhost:8081"]

# Rate Limiting
RATE_LIMIT_REQUESTS=10
RATE_LIMIT_WINDOW=60

# File Upload
MAX_UPLOAD_SIZE=5242880          # 5MB in bytes

# Logging
LOG_LEVEL=INFO                   # DEBUG | INFO | WARNING | ERROR
```

### Frontend Environment Variables

```bash
# API Configuration
VITE_API_URL=http://localhost:8000

# Supabase (if using)
VITE_SUPABASE_PROJECT_ID=your-project-id
VITE_SUPABASE_PUBLISHABLE_KEY=your-key
VITE_SUPABASE_URL=https://your-project.supabase.co
```

---

## 📖 Usage

### Analyzing a VCF File

1. **Upload VCF File**
   - Click "Upload VCF File" or drag and drop
   - File must be in VCF v4.2 format
   - Maximum size: 5MB
   - Maximum variants: 100,000
   - Only .vcf extension accepted

2. **Enter Patient Information**
   - Patient ID (required): Alphanumeric identifier
   - Clinical Notes (optional): Additional context

3. **Select Drugs** ⭐ NEW
   - Click drug selection dropdown
   - Search for specific drugs
   - Select 1-10 drugs to analyze
   - View drug→gene mapping preview
   - Only selected drugs will be analyzed

4. **Run Analysis**
   - Click "Analyze Pharmacogenomics"
   - Processing typically takes 1-3 seconds
   - Results filtered by selected drugs

5. **Review Results**
   - View drug recommendations sorted by risk category
   - Check dosage guidance for each drug
   - Review alternative medications
   - See AI-powered clinical insights
   - Export report for medical records

### Understanding Results

#### Risk Categories

| Category | Color | Meaning | Action |
|----------|-------|---------|--------|
| **Toxicity** | 🔴 Red | High risk of severe side effects | **AVOID** - Do not use |
| **Ineffective** | 🟠 Orange | Drug won't work due to genetics | **SWITCH** - Use alternative |
| **Adjust Dosage** | 🟡 Yellow | Need to modify dose | **ADJUST** - Follow guidance |
| **Safe** | 🟢 Green | No genetic concerns | **STANDARD** - Use normally |
| **Unknown** | ⚪ Gray | No variant detected | **MONITOR** - Watch closely |

#### Dosage Guidance Examples

- **WARFARIN**: "Reduce initial dose by 25-50% (start 2.5-3.75mg daily). Monitor INR closely."
- **SIMVASTATIN**: "Reduce dose to 20mg daily (max 40mg). Monitor for muscle pain/weakness."
- **CODEINE**: "Do not use. Codeine will not be converted to morphine (active form)."

### Demo Mode

Click "Run Demo" to test the system with sample data:
- Pre-loaded VCF file with 8 clinically relevant variants
- Pre-selected drug (CODEINE)
- Demonstrates all major features
- Safe for testing and training
- Shows both "found" and "unknown" statuses

### Best Practices

1. **Drug Selection**
   - Select only drugs the patient is taking or considering
   - Don't select all drugs - be specific
   - Review drug→gene mapping before analysis

2. **Result Interpretation**
   - Always review with clinical context
   - Check evidence level (Strong/Moderate)
   - Consider alternative medications
   - Follow dosage guidance carefully

3. **Unknown Status**
   - Means no genetic variant was detected
   - Standard dosing may be appropriate
   - Still requires clinical judgment
   - Monitor patient response

4. **Documentation**
   - Export reports for medical records
   - Document clinical decisions
   - Track patient outcomes
   - Update as needed

---

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication
Currently in development mode. JWT authentication framework ready for implementation.

---

### Endpoints

#### 1. Health Check

```bash
GET /health

Response:
{
  "status": "healthy",
  "service": "drugify",
  "environment": "development",
  "database": "connected"
}
```

---

#### 2. List Supported Drugs ⭐ NEW

```bash
GET /api/v1/drugs

Response:
{
  "supported_drugs": [
    {
      "drug": "CODEINE",
      "primary_gene": "CYP2D6",
      "description": "Pain relief opioid",
      "category": "Analgesic"
    },
    {
      "drug": "WARFARIN",
      "primary_gene": "CYP2C9",
      "description": "Blood thinner anticoagulant",
      "category": "Anticoagulant"
    },
    ...
  ]
}
```

---

#### 3. Get Drug Information ⭐ NEW

```bash
GET /api/v1/drugs/{drug_name}

Example: GET /api/v1/drugs/warfarin

Response:
{
  "drug": "WARFARIN",
  "primary_gene": "CYP2C9",
  "description": "Blood thinner anticoagulant",
  "category": "Anticoagulant"
}

Error (404):
{
  "detail": {
    "error": "Unsupported drug",
    "drug": "aspirin",
    "supported_drugs": ["CODEINE", "WARFARIN", ...]
  }
}
```

---

#### 4. Validate Drugs ⭐ NEW

```bash
POST /api/v1/drugs/validate
Content-Type: application/json

Request:
["CODEINE", "WARFARIN", "ASPIRIN"]

Response:
{
  "valid": false,
  "valid_drugs": ["CODEINE", "WARFARIN"],
  "invalid_drugs": ["ASPIRIN"],
  "mappings": {
    "CODEINE": {
      "drug": "CODEINE",
      "primary_gene": "CYP2D6",
      "description": "Pain relief opioid",
      "category": "Analgesic"
    },
    ...
  }
}
```

---

#### 5. Analyze VCF (Enhanced) ⭐ UPDATED

```bash
POST /api/v1/analyze
Content-Type: application/json

Request:
{
  "patient_id": "PT-2024-001",
  "vcf_content": "##fileformat=VCFv4.2\n...",
  "drugs": ["WARFARIN", "CODEINE"],  // NEW: Required field
  "notes": "Optional clinical notes"
}

Response:
{
  "reportId": "RPT-ABC123",
  "patientId": "PT-2024-001",
  "generatedAt": "2026-02-20T12:00:00Z",
  "selectedDrugs": ["WARFARIN", "CODEINE"],  // NEW
  "summary": {
    "totalVariants": 150,
    "drugsAnalyzed": 2,  // NEW
    "clinicallyRelevant": 2,
    "toxicityRisk": 0,  // NEW
    "ineffectiveRisk": 0,  // NEW
    "dosageAdjustment": 1,  // NEW
    "safe": 0,  // NEW
    "unknown": 1,  // NEW
    "highRiskDrugs": 0,  // Legacy
    "moderateRiskDrugs": 1  // Legacy
  },
  "recommendations": [
    {
      "drug": "WARFARIN",
      "gene": "CYP2C9",
      "diplotype": "C/T",
      "phenotype": "Intermediate Metabolizer",
      "riskCategory": "adjust_dosage",  // NEW
      "riskLevel": "moderate",
      "recommendation": "Reduced warfarin dose required...",
      "dosageGuidance": "Reduce initial dose by 25-50% (start 2.5-3.75mg daily). Monitor INR closely.",  // NEW
      "guideline": "CPIC Guideline for CYP2C9/VKORC1...",
      "evidence": "Strong",
      "alternatives": ["Direct oral anticoagulants (DOACs)"]
    },
    {
      "drug": "CODEINE",
      "gene": "CYP2D6",
      "diplotype": "Not detected",  // NEW
      "phenotype": "Normal Metabolizer (presumed)",
      "riskCategory": "unknown",  // NEW
      "riskLevel": "unknown",
      "recommendation": "No genetic variants detected for CYP2D6. Standard dosing may be appropriate, but clinical judgment required.",
      "dosageGuidance": "Standard dosing recommended. Monitor patient response and adjust as needed.",  // NEW
      "guideline": "No specific guideline - variant not detected",
      "evidence": "N/A",
      "alternatives": []
    }
  ],
  "variants": [...],
  "disclaimer": "This report is for clinical decision support only..."
}

Error (422):
{
  "detail": [
    {
      "loc": ["body", "drugs"],
      "msg": "Unsupported drug(s): ASPIRIN. Supported drugs: CODEINE, WARFARIN, ...",
      "type": "value_error"
    }
  ]
}
```

---

### Rate Limits

- **Analysis Endpoint**: 10 requests per minute per IP address
- **Other Endpoints**: No rate limit (development)

### Response Format

All responses use **camelCase** for field names (e.g., `riskCategory`, `dosageGuidance`).

### Error Handling

Standard HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `404` - Not Found
- `413` - Payload Too Large (> 5MB)
- `422` - Unprocessable Entity (invalid data)
- `429` - Too Many Requests (rate limit)
- `500` - Internal Server Error

For complete interactive API documentation, visit `/docs` in development mode.

---

## 🔒 Security

### Security Features

- ✅ JWT Authentication Framework
- ✅ Rate Limiting (10 req/min)
- ✅ Input Validation & Sanitization
- ✅ Security Headers (CSP, HSTS, etc.)
- ✅ Patient ID Anonymization
- ✅ SQL Injection Prevention
- ✅ XSS Protection
- ✅ CSRF Protection Ready
- ✅ File Size & Type Validation
- ✅ Error Handling (no internal exposure)

### Security Score: 82/100 🟢

For detailed security information, see:
- [Security Audit Report](SECURITY_AUDIT_REPORT.md)
- [Security Summary](SECURITY_SUMMARY.md)

### Reporting Security Issues

Please report security vulnerabilities to: security@yourdomain.com

**Do not** create public GitHub issues for security vulnerabilities.

---

## 🧪 Testing

### Running Tests

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd ..
npm test

# Run with coverage
npm run test:coverage
```

### Load Testing

```bash
# Install locust
pip install locust

# Run load test
locust -f tests/load_test.py --host=http://localhost:8000
```

---

## 🚢 Deployment

DRUGIFY is designed for easy deployment with separate frontend and backend services.

### 🎯 Quick Deploy (15 minutes)

**Recommended Stack:**
- **Frontend**: Vercel (Free tier available)
- **Backend**: Railway (Free $5 credit) or Render (Free tier)

**Quick Start:**
```bash
# 1. Push code to GitHub
git push origin main

# 2. Deploy Backend to Railway
# - Go to railway.app → New Project → Deploy from GitHub
# - Root: backend | Start: uvicorn app.main:app --host 0.0.0.0 --port $PORT
# - Add environment variables (see QUICK_DEPLOY.md)

# 3. Deploy Frontend to Vercel
# - Go to vercel.com → New Project → Import from GitHub
# - Root: frontend | Framework: Vite
# - Add environment variables with Railway backend URL

# 4. Update CORS in Railway with Vercel URL
```

**See**: [QUICK_DEPLOY.md](QUICK_DEPLOY.md) for step-by-step instructions

### 📖 Deployment Guides

Choose your deployment guide:

1. **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - ⚡ 15-minute quick start
2. **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - 📚 Complete guide with all options
3. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - ✅ Step-by-step checklist

### 🏗️ Deployment Architecture

```
Frontend (Vercel)  →  Backend (Railway/Render)  →  Database (SQLite/PostgreSQL)
     ↓                        ↓
Supabase Auth          AI Insights API
```

### 🔧 Deployment Options

| Option | Frontend | Backend | Difficulty | Cost |
|--------|----------|---------|------------|------|
| **Recommended** | Vercel | Railway | Easy | Free-$5/mo |
| Alternative 1 | Vercel | Render | Easy | Free-$7/mo |
| Alternative 2 | Render | Render | Medium | Free-$14/mo |
| Docker | Self-hosted | Self-hosted | Advanced | Variable |

### ⚙️ Environment Variables

**Backend (Railway/Render):**
```env
ENVIRONMENT=production
DEBUG=False
SECRET_KEY=<generate-32-char-key>
CORS_ORIGINS=https://your-app.vercel.app
DATABASE_URL=sqlite:///./pharmaguard.db
```

**Frontend (Vercel):**
```env
VITE_API_URL=https://your-backend.railway.app
VITE_SUPABASE_URL=https://ewhntptpsfqwuetrgyxy.supabase.co
VITE_SUPABASE_PROJECT_ID=ewhntptpsfqwuetrgyxy
VITE_SUPABASE_PUBLISHABLE_KEY=<your-key>
```

### ✅ Production Checklist

Before going live:
- [ ] Backend deployed and health check passing
- [ ] Frontend deployed and accessible
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Supabase authentication working
- [ ] Database persisting data
- [ ] All features tested end-to-end
- [ ] Monitoring enabled
- [ ] Backup strategy in place

**Full checklist**: [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

### 🐛 Common Issues

**CORS Error**: Update `CORS_ORIGINS` in backend with frontend URL
**API Not Found**: Check `VITE_API_URL` has no trailing slash
**Build Failed**: Verify root directory settings (backend/frontend)

**See**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) troubleshooting section

---

## 📚 Documentation

### User Guides
- [Quick Reference](QUICK_REFERENCE.md) - Quick commands and troubleshooting
- [Quick Reference Card](QUICK_REFERENCE_CARD.md) - Printable reference card
- [Drug Feature Quick Start](DRUG_FEATURE_QUICK_START.md) - Drug selection guide
- [Drug Feature UI Guide](DRUG_FEATURE_UI_GUIDE.md) - UI walkthrough

### Technical Documentation
- [Drug Input Feature](DRUG_INPUT_FEATURE.md) - Complete feature documentation
- [Implementation Summary](IMPLEMENTATION_SUMMARY.md) - Implementation details
- [Bug Fix and Enhancements](BUG_FIX_AND_ENHANCEMENTS.md) - Recent fixes
- [Before/After Comparison](BEFORE_AFTER_COMPARISON.md) - Visual comparison
- [All Errors Fixed](ALL_ERRORS_FIXED.md) - Error resolution guide

### Deployment
- **[QUICK_DEPLOY.md](QUICK_DEPLOY.md)** - ⚡ 15-minute deployment guide
- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - 📚 Complete deployment documentation
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - ✅ Step-by-step checklist
- [Production Deployment](PRODUCTION_DEPLOYMENT.md) - Legacy deployment guide
- [Production Readiness Checklist](PRODUCTION_READY_CHECKLIST.md) - Pre-launch checklist
- [Production Ready Summary](PRODUCTION_READY_SUMMARY.md) - Deployment summary

### Security
- [Security Audit Report](SECURITY_AUDIT_REPORT.md) - Detailed security analysis
- [Security Summary](SECURITY_SUMMARY.md) - Security overview
- [File Validation Guide](FILE_VALIDATION_GUIDE.md) - File validation details

### Development
- [Startup Guide](STARTUP_GUIDE.md) - Getting started guide
- [Error Fix](ERROR_FIX.md) - Common error solutions
- [Final Summary](FINAL_SUMMARY.md) - Project summary

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use TypeScript for all new frontend code
- Write tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 👥 Team

This project was developed by:

- **Shubhang Mishra** - Team Lead & Full Stack Developer
- **Dev Tiwari** - Backend Developer & API Design
- **Vishal Verma** - Frontend Developer & UI/UX Design

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 💬 Support

### Getting Help

- 📖 Check the [Documentation](#-documentation)
- 🐛 Report bugs via [GitHub Issues](https://github.com/yourusername/drugify/issues)
- 💡 Request features via [GitHub Discussions](https://github.com/yourusername/drugify/discussions)
- 📧 Email: support@yourdomain.com

### Community

- [Discord Server](https://discord.gg/your-server)
- [Twitter](https://twitter.com/drugify)
- [LinkedIn](https://linkedin.com/company/drugify)

---

## 🙏 Acknowledgments

- **CPIC**: Clinical Pharmacogenetics Implementation Consortium for guidelines
- **FastAPI**: For the excellent web framework
- **React**: For the powerful UI library
- **shadcn/ui**: For beautiful UI components
- **Contributors**: Thank you to all our contributors!

---

## 📊 Project Status

- **Version**: 2.0.1
- **Status**: 🟢 Production-Ready
- **Last Updated**: February 20, 2026
- **Maintained**: ✅ Actively maintained

### Recent Updates (v2.0.0 → v2.0.1)

✅ **Drug Selection Feature** - Select specific drugs for analysis  
✅ **Enhanced Risk Categories** - 5 detailed categories with colors  
✅ **Dosage Guidance** - Specific dosing recommendations  
✅ **Unknown Status** - Clear feedback when no variant found  
✅ **Bug Fixes** - Drug filtering, CORS, field naming  
✅ **API Enhancements** - New drug endpoints, camelCase responses  
✅ **UI Improvements** - Better visualization, color coding  

### Roadmap

#### v2.1.0 (Q2 2026)
- [ ] User authentication implementation
- [ ] Role-based access control
- [ ] Audit logging enhancement
- [ ] Report templates

#### v2.2.0 (Q3 2026)
- [ ] Multi-language support
- [ ] Batch VCF processing
- [ ] Advanced analytics dashboard
- [ ] Export to PDF

#### v3.0.0 (Q4 2026)
- [ ] Integration with EHR systems (HL7 FHIR)
- [ ] Mobile application (iOS/Android)
- [ ] Machine learning predictions
- [ ] Real-time collaboration

---

## 📝 Changelog

### v2.0.1 (2026-02-20)

**Features**
- ✨ Drug selection interface with searchable dropdown
- ✨ 5 detailed risk categories (Toxicity, Ineffective, Adjust Dosage, Safe, Unknown)
- ✨ Specific dosage guidance for each drug
- ✨ Unknown status handling for drugs with no variants
- ✨ Drug→gene mapping preview
- ✨ Multi-drug selection (1-10 drugs)
- ✨ New API endpoints: `/api/v1/drugs`, `/api/v1/drugs/{name}`, `/api/v1/drugs/validate`

**Bug Fixes**
- 🐛 Fixed drug filtering - only selected drugs shown
- 🐛 Fixed CORS errors - OPTIONS requests working
- 🐛 Fixed frontend crash - API response format corrected
- 🐛 Fixed field naming - consistent camelCase

**Improvements**
- 🎨 Enhanced UI with color-coded risk categories
- 🎨 Improved drug recommendation cards
- 🎨 Better summary statistics display
- ⚡ Optimized API response format
- 📚 Comprehensive documentation added

**Technical**
- Backend: Pydantic Config for camelCase serialization
- Frontend: Fallback handling for field names
- Middleware: Fixed CORS order and configuration
- API: Enhanced error messages and validation

### v1.0.0 (2026-02-19)

**Initial Release**
- 🎉 VCF file analysis
- 🎉 CPIC-based recommendations
- 🎉 Security framework
- 🎉 AI insights
- 🎉 Production-ready deployment

---

<div align="center">

**Built with ❤️ for better healthcare outcomes**

[⬆ Back to Top](#-drugify)

</div>
