# Quick Reference Card - Risk Assessment System

## 🎯 5 Risk Categories

| Category | Icon | Color | Meaning | Action |
|----------|------|-------|---------|--------|
| **Toxicity** | 🛡️⚠️ | 🔴 Red | High risk of severe side effects | **AVOID** - Do not use |
| **Ineffective** | 🛡️❌ | 🟠 Orange | Drug won't work due to genetics | **SWITCH** - Use alternative |
| **Adjust Dosage** | 💊 | 🟡 Yellow | Need to modify dose | **ADJUST** - Follow guidance |
| **Safe** | 🛡️✅ | 🟢 Green | No genetic concerns | **STANDARD** - Use normally |
| **Unknown** | ❓ | ⚪ Gray | No variant detected | **MONITOR** - Watch patient |

---

## 💊 Supported Drugs

| Drug | Gene | Common Use |
|------|------|------------|
| CODEINE | CYP2D6 | Pain relief |
| WARFARIN | CYP2C9 | Blood thinner |
| CLOPIDOGREL | CYP2C19 | Antiplatelet |
| SIMVASTATIN | SLCO1B1 | Cholesterol |
| AZATHIOPRINE | TPMT | Immunosuppressant |
| FLUOROURACIL | DPYD | Chemotherapy |

---

## 📋 How to Use

1. **Upload VCF** - Max 5MB, .vcf only
2. **Enter Patient ID** - Alphanumeric
3. **Select Drugs** - Choose 1-10 drugs
4. **Analyze** - Click button
5. **Review Results** - Only selected drugs shown

---

## 🎨 Visual Guide

### Toxicity Risk (Red)
```
┌─────────────────────────────────┐
│ 🛡️⚠️ FLUOROURACIL [Toxicity]   │
│ DPYD · Poor Metabolizer         │
├─────────────────────────────────┤
│ 💊 Do not use. High risk of     │
│ severe neutropenia and death.   │
└─────────────────────────────────┘
```

### Adjust Dosage (Yellow)
```
┌─────────────────────────────────┐
│ 💊 WARFARIN [Adjust Dosage]     │
│ CYP2C9 · Intermediate           │
├─────────────────────────────────┤
│ 💊 Reduce dose by 25-50%        │
│ (start 2.5-3.75mg daily).       │
│ Monitor INR closely.            │
└─────────────────────────────────┘
```

### Unknown (Gray)
```
┌─────────────────────────────────┐
│ ❓ CODEINE [Unknown]            │
│ CYP2D6 · Normal (presumed)      │
├─────────────────────────────────┤
│ 💊 Standard dosing recommended. │
│ Monitor patient response.       │
└─────────────────────────────────┘
```

---

## 📊 Summary Statistics

```
┌──────────┬──────────┬──────────┐
│ Drugs    │ Toxicity │ Ineffect │
│ Analyzed │ Risk     │ -ive     │
├──────────┼──────────┼──────────┤
│ Dosage   │ Safe     │ Unknown  │
│ Adjust   │          │          │
└──────────┴──────────┴──────────┘
```

---

## ⚡ Quick Actions

### If you see Toxicity (Red)
1. **STOP** - Do not prescribe
2. **SWITCH** - Use alternative
3. **DOCUMENT** - Note in patient record

### If you see Ineffective (Orange)
1. **AVOID** - Won't work
2. **CHOOSE** - Select alternative
3. **EXPLAIN** - Tell patient why

### If you see Adjust Dosage (Yellow)
1. **FOLLOW** - Use dosage guidance
2. **MONITOR** - Watch closely
3. **ADJUST** - Based on response

### If you see Unknown (Gray)
1. **STANDARD** - Use normal dose
2. **MONITOR** - Watch for issues
3. **ADJUST** - If needed

---

## 🔍 Interpretation Guide

### Diplotype
- **C/T** - Heterozygous (one variant)
- **T/T** - Homozygous (two variants)
- **C/C** - Wild type (no variants)
- **Not detected** - No variant found

### Phenotype
- **Poor Metabolizer** - Very slow processing
- **Intermediate Metabolizer** - Slower processing
- **Normal Metabolizer** - Standard processing
- **Ultrarapid Metabolizer** - Very fast processing

### Evidence Level
- **Strong** - High confidence
- **Moderate** - Medium confidence
- **Weak** - Lower confidence

---

## 🚨 Red Flags

Watch for these high-risk combinations:

| Drug | Variant | Risk | Action |
|------|---------|------|--------|
| FLUOROURACIL | DPYD | Toxicity | **DO NOT USE** |
| CODEINE | CYP2D6 Poor | Ineffective | **SWITCH** |
| CLOPIDOGREL | CYP2C19 Poor | Ineffective | **SWITCH** |
| WARFARIN | CYP2C9 | Adjust | **REDUCE 25-50%** |
| SIMVASTATIN | SLCO1B1 | Adjust | **MAX 40mg** |

---

## 📞 Support

- **API Docs**: http://localhost:8000/docs
- **Frontend**: http://localhost:8081
- **Backend**: http://localhost:8000

---

## 💡 Pro Tips

1. **Select specific drugs** - Don't select all, choose what patient needs
2. **Check unknown status** - Means no variant found, not an error
3. **Follow dosage guidance** - Specific instructions provided
4. **Use alternatives** - Listed for each high-risk drug
5. **Monitor patients** - Especially with "Unknown" status

---

## 📝 Clinical Workflow

```
1. Order genetic test
   ↓
2. Receive VCF file
   ↓
3. Upload to DRUGIFY
   ↓
4. Select patient's medications
   ↓
5. Review risk categories
   ↓
6. Follow dosage guidance
   ↓
7. Prescribe accordingly
   ↓
8. Monitor patient response
   ↓
9. Adjust if needed
```

---

## ✅ Checklist

Before prescribing:
- [ ] VCF analyzed for patient's drugs
- [ ] Risk category reviewed
- [ ] Dosage guidance followed
- [ ] Alternatives considered if needed
- [ ] Patient informed of genetic findings
- [ ] Monitoring plan in place
- [ ] Documentation complete

---

## 🎯 Remember

- **Red = Stop** - Do not use
- **Orange = Switch** - Use alternative
- **Yellow = Adjust** - Modify dose
- **Green = Go** - Standard dose
- **Gray = Monitor** - Watch closely

---

**Keep this card handy for quick reference!**

Print and post near workstation for easy access.
