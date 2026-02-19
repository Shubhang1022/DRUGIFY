# Drug Input Feature Documentation

## Overview

The Drug Input feature allows users to select specific drugs for pharmacogenomic analysis. The system validates drug selections and filters recommendations based on the selected drugs.

## Supported Drugs

The system currently supports 6 drugs with their corresponding gene mappings:

| Drug | Primary Gene | Description | Category |
|------|--------------|-------------|----------|
| CODEINE | CYP2D6 | Pain relief opioid | Analgesic |
| WARFARIN | CYP2C9 | Blood thinner anticoagulant | Anticoagulant |
| CLOPIDOGREL | CYP2C19 | Antiplatelet therapy | Antiplatelet |
| SIMVASTATIN | SLCO1B1 | Cholesterol statin | Statin |
| AZATHIOPRINE | TPMT | Immunosuppressant | Immunosuppressant |
| FLUOROURACIL | DPYD | Chemotherapy | Chemotherapy |

## Frontend Features

### Drug Selector Component

The `DrugSelector` component provides:

- **Searchable Dropdown**: Type to filter drugs by name
- **Multi-Select**: Select multiple drugs (1-10 drugs allowed)
- **Drug Descriptions**: View drug descriptions and gene mappings in dropdown
- **Visual Feedback**: Selected drugs shown with badges
- **Drug → Gene Mapping Preview**: Real-time display of selected drug-gene relationships
- **Error Handling**: Clear error messages for validation failures

### User Interface

1. **Drug Selection Field** (Required)
   - Click to open searchable dropdown
   - Search by drug name
   - Select one or multiple drugs
   - View drug descriptions and gene mappings

2. **Selected Drugs Preview**
   - Shows all selected drugs with their primary genes
   - Format: `DRUG → GENE` (e.g., `WARFARIN → CYP2C9`)
   - Displayed as badges for easy visualization

3. **Validation**
   - At least 1 drug must be selected
   - Maximum 10 drugs allowed
   - Only supported drugs accepted

## Backend Features

### API Endpoints

#### 1. List Supported Drugs
```
GET /api/v1/drugs
```

**Response:**
```json
{
  "supported_drugs": [
    {
      "drug": "CODEINE",
      "primary_gene": "CYP2D6",
      "description": "Pain relief opioid",
      "category": "Analgesic"
    },
    ...
  ]
}
```

#### 2. Get Drug Information
```
GET /api/v1/drugs/{drug_name}
```

**Example:** `GET /api/v1/drugs/warfarin`

**Response:**
```json
{
  "drug": "WARFARIN",
  "primary_gene": "CYP2C9",
  "description": "Blood thinner anticoagulant",
  "category": "Anticoagulant"
}
```

**Error (404):**
```json
{
  "detail": {
    "error": "Unsupported drug",
    "drug": "aspirin",
    "supported_drugs": ["CODEINE", "WARFARIN", ...]
  }
}
```

#### 3. Validate Drug List
```
POST /api/v1/drugs/validate
```

**Request:**
```json
["CODEINE", "WARFARIN", "ASPIRIN"]
```

**Response:**
```json
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
    "WARFARIN": {
      "drug": "WARFARIN",
      "primary_gene": "CYP2C9",
      "description": "Blood thinner anticoagulant",
      "category": "Anticoagulant"
    }
  }
}
```

#### 4. Analyze VCF with Drug Filtering
```
POST /api/v1/analyze
```

**Request:**
```json
{
  "patient_id": "PT-2024-001",
  "vcf_content": "##fileformat=VCFv4.2\n...",
  "drugs": ["WARFARIN", "CLOPIDOGREL"],
  "notes": "Patient on anticoagulation therapy"
}
```

**Response:**
```json
{
  "report_id": "RPT-67B2A3F4",
  "patient_id": "PT-2024-001",
  "generated_at": "2026-02-19T23:09:14.123456",
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
      "diplotype": "C/T",
      "phenotype": "Intermediate Metabolizer",
      "risk_level": "moderate",
      "recommendation": "Reduced warfarin dose required...",
      "guideline": "CPIC Guideline for CYP2C9/VKORC1...",
      "evidence": "Strong",
      "alternatives": ["Direct oral anticoagulants (DOACs)"]
    },
    {
      "drug": "Clopidogrel",
      "gene": "CYP2C19",
      "diplotype": "G/A",
      "phenotype": "Poor Metabolizer",
      "risk_level": "high",
      "recommendation": "Use alternative antiplatelet therapy...",
      "guideline": "CPIC Guideline for CYP2C19...",
      "evidence": "Strong",
      "alternatives": ["Prasugrel", "Ticagrelor"]
    }
  ],
  "variants": [...],
  "disclaimer": "This report is for clinical decision support only..."
}
```

### Validation Rules

1. **Drug Field Validation**
   - Required field (at least 1 drug)
   - Maximum 10 drugs allowed
   - Case-insensitive (normalized to uppercase)
   - No duplicate drugs allowed
   - Only supported drugs accepted

2. **Error Responses**

**Missing drugs field (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "drugs"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

**Unsupported drug (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "drugs"],
      "msg": "Unsupported drug(s): ASPIRIN. Supported drugs: CODEINE, WARFARIN, CLOPIDOGREL, SIMVASTATIN, AZATHIOPRINE, FLUOROURACIL",
      "type": "value_error"
    }
  ]
}
```

**Duplicate drugs (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "drugs"],
      "msg": "Duplicate drugs are not allowed",
      "type": "value_error"
    }
  ]
}
```

## Usage Examples

### Example 1: Single Drug Analysis

**Frontend:**
1. Upload VCF file
2. Enter Patient ID: `PT-2024-001`
3. Select drug: `WARFARIN`
4. Click "Analyze Pharmacogenomics"

**Backend Processing:**
- Validates VCF format
- Validates drug selection (WARFARIN is supported)
- Parses VCF variants
- Filters recommendations to only WARFARIN-related findings
- Returns report with WARFARIN recommendations only

### Example 2: Multi-Drug Analysis

**Frontend:**
1. Upload VCF file
2. Enter Patient ID: `PT-2024-002`
3. Select drugs: `CODEINE`, `WARFARIN`, `CLOPIDOGREL`
4. Click "Analyze Pharmacogenomics"

**Backend Processing:**
- Validates all 3 drugs are supported
- Analyzes VCF for variants related to CYP2D6, CYP2C9, and CYP2C19
- Returns recommendations for all 3 drugs (if variants found)

### Example 3: Error Handling

**Scenario:** User tries to select unsupported drug

**Frontend:**
- Drug list is fetched from `/api/v1/drugs` endpoint
- Only supported drugs appear in dropdown
- User cannot manually enter unsupported drugs

**Backend:**
- If somehow an unsupported drug is sent, validation fails
- Returns 422 error with list of supported drugs
- Frontend displays error message

## Technical Implementation

### Backend Architecture

1. **Drug Service** (`app/services/drug_service.py`)
   - Maintains list of supported drugs
   - Provides drug validation functions
   - Maps drugs to genes

2. **Drugs Router** (`app/routers/drugs.py`)
   - Exposes drug management endpoints
   - Handles drug queries and validation

3. **Analysis Router** (`app/routers/analysis.py`)
   - Updated to accept `drugs` field
   - Validates drugs before analysis
   - Passes drugs to PGx engine

4. **PGx Engine** (`app/services/pgx_engine.py`)
   - Updated `analyze_variants()` function
   - Filters recommendations by selected drugs
   - Returns only relevant drug recommendations

### Frontend Architecture

1. **DrugSelector Component** (`src/components/DrugSelector.tsx`)
   - Fetches drugs from API on mount
   - Provides searchable multi-select interface
   - Shows drug-gene mappings
   - Handles validation errors

2. **VcfUploader Component** (`src/components/VcfUploader.tsx`)
   - Integrates DrugSelector
   - Uses React Hook Form with Controller
   - Validates form including drugs field
   - Submits drugs with analysis request

3. **Type Definitions** (`src/lib/types.ts`)
   - Updated `UploadFormData` to include drugs
   - Updated `AnalysisRequest` to include drugs
   - Zod schema validation for drugs field

## Security Features

- **Input Validation**: All drug inputs validated against whitelist
- **Rate Limiting**: Analysis endpoint rate-limited (10 req/min)
- **Sanitization**: Drug names normalized to uppercase
- **Error Handling**: No internal errors exposed to users
- **Logging**: All drug requests logged with sanitized patient IDs

## Future Enhancements

1. **Drug Interactions**: Check for drug-drug interactions
2. **Dosing Recommendations**: Provide specific dosing guidance
3. **More Drugs**: Expand supported drug list
4. **Drug Categories**: Filter by drug category
5. **Favorites**: Save frequently used drug combinations
6. **Batch Analysis**: Analyze multiple patients with same drug set

## Testing

### Manual Testing Steps

1. **Test Drug List Endpoint**
   ```bash
   curl http://localhost:8000/api/v1/drugs
   ```

2. **Test Single Drug Info**
   ```bash
   curl http://localhost:8000/api/v1/drugs/warfarin
   ```

3. **Test Drug Validation**
   ```bash
   curl -X POST http://localhost:8000/api/v1/drugs/validate \
     -H "Content-Type: application/json" \
     -d '["CODEINE", "WARFARIN", "ASPIRIN"]'
   ```

4. **Test Analysis with Drugs**
   - Use frontend UI to upload VCF
   - Select one or more drugs
   - Verify recommendations are filtered

### Expected Behaviors

✅ Drug dropdown loads supported drugs from API
✅ Multi-select allows selecting multiple drugs
✅ Drug-gene mapping preview updates in real-time
✅ Form validation prevents submission without drugs
✅ Backend validates drugs and returns 422 for unsupported drugs
✅ Analysis results only include selected drug recommendations
✅ Error messages are clear and actionable

## Troubleshooting

### Issue: Drug dropdown is empty

**Solution:**
- Check backend is running on port 8000
- Verify `/api/v1/drugs` endpoint returns data
- Check browser console for CORS errors

### Issue: "Unsupported drug" error

**Solution:**
- Ensure drug name is in supported list
- Check spelling and capitalization
- Verify backend drug service is up to date

### Issue: No recommendations in report

**Solution:**
- Verify VCF contains variants for selected drug's gene
- Check that drug-gene mapping is correct
- Ensure VCF format is valid

## API Documentation

Full API documentation available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Support

For issues or questions:
1. Check this documentation
2. Review API documentation at `/docs`
3. Check backend logs for errors
4. Verify all dependencies are installed
