# Drug Input Feature - Quick Start Guide

## 🚀 Quick Start (2 Minutes)

### Step 1: Start Services
```bash
# Terminal 1 - Backend
cd pharmaguard-clinical-insights-main/backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend
cd pharmaguard-clinical-insights-main
npm run dev
```

### Step 2: Access Application
- Frontend: http://localhost:8081
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Step 3: Use Drug Feature
1. Upload a VCF file
2. Enter Patient ID
3. **Click the drug dropdown** (new!)
4. **Select one or more drugs** (searchable)
5. See drug→gene mapping preview
6. Click "Analyze Pharmacogenomics"

## 📋 Supported Drugs

| Drug | Gene | Description |
|------|------|-------------|
| CODEINE | CYP2D6 | Pain relief opioid |
| WARFARIN | CYP2C9 | Blood thinner anticoagulant |
| CLOPIDOGREL | CYP2C19 | Antiplatelet therapy |
| SIMVASTATIN | SLCO1B1 | Cholesterol statin |
| AZATHIOPRINE | TPMT | Immunosuppressant |
| FLUOROURACIL | DPYD | Chemotherapy |

## 🧪 Quick Test

### Test 1: List Drugs
```bash
curl http://localhost:8000/api/v1/drugs
```

Expected: JSON with 6 drugs

### Test 2: Get Drug Info
```bash
curl http://localhost:8000/api/v1/drugs/warfarin
```

Expected: WARFARIN details with CYP2C9 gene

### Test 3: Validate Drugs
```bash
curl -X POST http://localhost:8000/api/v1/drugs/validate \
  -H "Content-Type: application/json" \
  -d '["CODEINE", "WARFARIN"]'
```

Expected: Valid response with mappings

### Test 4: Frontend UI
1. Open http://localhost:8081
2. Click drug dropdown
3. Type "war" to search
4. Select WARFARIN
5. See "WARFARIN → CYP2C9" badge appear

## ✅ What's New

### Frontend
- ✨ Searchable drug dropdown (multi-select)
- ✨ Drug descriptions in dropdown
- ✨ Drug→Gene mapping preview
- ✨ Visual badges for selected drugs
- ✨ Form validation for drug selection

### Backend
- ✨ GET `/api/v1/drugs` - List all drugs
- ✨ GET `/api/v1/drugs/{name}` - Get drug info
- ✨ POST `/api/v1/drugs/validate` - Validate drugs
- ✨ POST `/api/v1/analyze` - Now requires drugs field
- ✨ Drug filtering in analysis results

## 🔧 Troubleshooting

### Drug dropdown is empty
```bash
# Check backend is running
curl http://localhost:8000/health

# Check drugs endpoint
curl http://localhost:8000/api/v1/drugs
```

### "Unsupported drug" error
- Only 6 drugs are supported (see table above)
- Drug names are case-insensitive
- Check spelling

### No recommendations in report
- VCF must contain variants for selected drug's gene
- Example: WARFARIN requires CYP2C9 variants

## 📚 Full Documentation

- Feature Guide: `DRUG_INPUT_FEATURE.md`
- Implementation Details: `IMPLEMENTATION_SUMMARY.md`
- API Docs: http://localhost:8000/docs

## 🎯 Key Features

✅ Professional searchable UI
✅ Multi-drug selection (1-10 drugs)
✅ Real-time drug→gene mapping
✅ Strict validation
✅ Clear error messages
✅ Filtered analysis results
✅ Production-ready

## 💡 Tips

1. **Search**: Type in dropdown to filter drugs
2. **Multi-select**: Click multiple drugs for combined analysis
3. **Preview**: Check drug→gene mapping before submitting
4. **Demo**: Use "Run Demo" button to see it in action
5. **Validation**: Form won't submit without drug selection

## 🔐 Security

- ✅ Input validation (whitelist only)
- ✅ Rate limiting (10 req/min)
- ✅ CORS configured
- ✅ Security headers
- ✅ Request logging

## 📊 Example Request

```json
POST /api/v1/analyze
{
  "patient_id": "PT-2024-001",
  "vcf_content": "##fileformat=VCFv4.2\n...",
  "drugs": ["WARFARIN", "CLOPIDOGREL"],
  "notes": "Patient on anticoagulation"
}
```

## 📊 Example Response

```json
{
  "report_id": "RPT-67B2A3F4",
  "patient_id": "PT-2024-001",
  "summary": {
    "total_variants": 150,
    "clinically_relevant": 2,
    "high_risk_drugs": 1,
    "moderate_risk_drugs": 1
  },
  "recommendations": [
    {
      "drug": "Warfarin",
      "gene": "CYP2C9",
      "phenotype": "Intermediate Metabolizer",
      "risk_level": "moderate",
      "recommendation": "Reduced warfarin dose required..."
    }
  ]
}
```

## 🎉 Success!

You now have a fully functional drug input feature that:
- Lets users select specific drugs for analysis
- Validates drug selections
- Filters recommendations by selected drugs
- Provides clear drug→gene mapping
- Handles errors gracefully

Ready to use in production! 🚀
