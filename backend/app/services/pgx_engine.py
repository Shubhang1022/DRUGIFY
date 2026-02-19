"""CPIC-style Pharmacogenomic Analysis Engine"""
from typing import Dict, Any, List, Optional
from datetime import datetime
import time

# Risk assessment categories
RISK_CATEGORIES = {
    "safe": "Safe - Standard dosing recommended",
    "adjust_dosage": "Adjust Dosage - Modified dosing required",
    "toxicity": "Toxicity Risk - High risk of adverse effects",
    "ineffective": "Ineffective - Drug unlikely to work",
    "unknown": "Unknown - No genetic variant detected"
}

# Drug-to-gene mapping for all supported drugs
DRUG_GENE_MAP = {
    "CODEINE": "CYP2D6",
    "WARFARIN": "CYP2C9",
    "CLOPIDOGREL": "CYP2C19",
    "SIMVASTATIN": "SLCO1B1",
    "AZATHIOPRINE": "TPMT",
    "FLUOROURACIL": "DPYD"
}

CPIC_RULES = [
    {
        "gene": "CYP2D6", "rs_id": "rs3892097", "risk_allele": "A", "drug": "CODEINE",
        "phenotype": "Poor Metabolizer", 
        "risk_category": "ineffective",
        "risk_level": "high",
        "recommendation": "Avoid codeine. Use alternative analgesics not metabolized by CYP2D6.",
        "dosage_guidance": "Do not use. Codeine will not be converted to morphine (active form).",
        "guideline": "CPIC Guideline for CYP2D6 and Codeine Therapy (2019)",
        "evidence": "Strong", 
        "alternatives": ["Morphine", "Acetaminophen", "NSAIDs"]
    },
    {
        "gene": "CYP2C19", "rs_id": "rs4244285", "risk_allele": "A", "drug": "CLOPIDOGREL",
        "phenotype": "Poor Metabolizer", 
        "risk_category": "ineffective",
        "risk_level": "high",
        "recommendation": "Use alternative antiplatelet therapy (e.g., prasugrel, ticagrelor).",
        "dosage_guidance": "Do not use. Clopidogrel will not be activated to its therapeutic form.",
        "guideline": "CPIC Guideline for CYP2C19 and Clopidogrel Therapy (2022)",
        "evidence": "Strong", 
        "alternatives": ["Prasugrel", "Ticagrelor"]
    },
    {
        "gene": "SLCO1B1", "rs_id": "rs4149056", "risk_allele": "C", "drug": "SIMVASTATIN",
        "phenotype": "Decreased Function", 
        "risk_category": "adjust_dosage",
        "risk_level": "moderate",
        "recommendation": "Prescribe a lower dose or use an alternative statin.",
        "dosage_guidance": "Reduce dose to 20mg daily (max 40mg). Monitor for muscle pain/weakness.",
        "guideline": "CPIC Guideline for SLCO1B1 and Statin Therapy (2022)",
        "evidence": "Strong", 
        "alternatives": ["Pravastatin", "Rosuvastatin"]
    },
    {
        "gene": "TPMT", "rs_id": "rs1800460", "risk_allele": "T", "drug": "AZATHIOPRINE",
        "phenotype": "Intermediate Metabolizer", 
        "risk_category": "adjust_dosage",
        "risk_level": "moderate",
        "recommendation": "Reduce starting dose by 30-70%. Monitor for myelosuppression.",
        "dosage_guidance": "Start with 30-70% of standard dose (0.75-1.5 mg/kg/day). Monitor CBC weekly for 4 weeks.",
        "guideline": "CPIC Guideline for TPMT/NUDT15 and Thiopurine Therapy (2018)",
        "evidence": "Strong", 
        "alternatives": ["Mycophenolate mofetil"]
    },
    {
        "gene": "CYP2C9", "rs_id": "rs1799853", "risk_allele": "T", "drug": "WARFARIN",
        "phenotype": "Intermediate Metabolizer", 
        "risk_category": "adjust_dosage",
        "risk_level": "moderate",
        "recommendation": "Reduced warfarin dose required. Use pharmacogenomic-guided dosing.",
        "dosage_guidance": "Reduce initial dose by 25-50% (start 2.5-3.75mg daily). Monitor INR closely.",
        "guideline": "CPIC Guideline for CYP2C9/VKORC1 and Warfarin Therapy (2017)",
        "evidence": "Strong", 
        "alternatives": ["Direct oral anticoagulants (DOACs)"]
    },
    {
        "gene": "DPYD", "rs_id": "rs3918290", "risk_allele": "A", "drug": "FLUOROURACIL",
        "phenotype": "Poor Metabolizer", 
        "risk_category": "toxicity",
        "risk_level": "high",
        "recommendation": "Avoid 5-FU and capecitabine. Risk of severe/fatal toxicity.",
        "dosage_guidance": "Do not use. High risk of severe neutropenia, mucositis, and death.",
        "guideline": "CPIC Guideline for DPYD and Fluoropyrimidine Therapy (2017)",
        "evidence": "Strong", 
        "alternatives": ["Alternative chemotherapy per oncology consult"]
    },
]


def analyze_variants(parsed_vcf: Dict[str, Any], patient_id: str, selected_drugs: List[str] = None) -> Dict[str, Any]:
    """
    Analyze variants and generate pharmacogenomic recommendations.
    
    CRITICAL: Only analyzes and returns results for selected drugs.
    For each selected drug, returns either:
    - Risk assessment if variant found
    - "Unknown" status if no variant detected
    
    Args:
        parsed_vcf: Parsed VCF data with variants
        patient_id: Patient identifier
        selected_drugs: List of drugs to analyze (REQUIRED, uppercase)
    
    Returns:
        Clinical report with recommendations ONLY for selected drugs
    """
    if not selected_drugs:
        raise ValueError("selected_drugs is required - must specify which drugs to analyze")
    
    recommendations: List[Dict[str, Any]] = []
    variants = parsed_vcf["variants"]
    
    # Normalize selected drugs to uppercase
    selected_drugs = [drug.upper() for drug in selected_drugs]
    
    # Track which selected drugs have been analyzed
    drugs_with_findings = set()
    
    # Find variants for selected drugs only
    for rule in CPIC_RULES:
        drug_upper = rule["drug"].upper()
        
        # CRITICAL: Skip drugs not in selected list
        if drug_upper not in selected_drugs:
            continue
        
        # Check if variant exists for this drug
        variant_found = False
        for v in variants:
            if v["id"] == rule["rs_id"] or rule["risk_allele"] in v["alt"]:
                recommendations.append({
                    "drug": rule["drug"],
                    "gene": rule["gene"],
                    "diplotype": f"{v['ref']}/{v['alt']}",
                    "phenotype": rule["phenotype"],
                    "risk_category": rule["risk_category"],
                    "risk_level": rule["risk_level"],
                    "recommendation": rule["recommendation"],
                    "dosage_guidance": rule["dosage_guidance"],
                    "guideline": rule["guideline"],
                    "evidence": rule["evidence"],
                    "alternatives": rule["alternatives"],
                })
                drugs_with_findings.add(drug_upper)
                variant_found = True
                break
        
        # If variant found, don't check other rules for same drug
        if variant_found:
            continue
    
    # For selected drugs with NO variants found, add "Unknown" status
    for drug in selected_drugs:
        if drug not in drugs_with_findings:
            gene = DRUG_GENE_MAP.get(drug, "Unknown")
            recommendations.append({
                "drug": drug,
                "gene": gene,
                "diplotype": "Not detected",
                "phenotype": "Normal Metabolizer (presumed)",
                "risk_category": "unknown",
                "risk_level": "unknown",
                "recommendation": f"No genetic variants detected for {gene}. Standard dosing may be appropriate, but clinical judgment required.",
                "dosage_guidance": "Standard dosing recommended. Monitor patient response and adjust as needed.",
                "guideline": "No specific guideline - variant not detected",
                "evidence": "N/A",
                "alternatives": [],
            })
    
    # Sort by risk level (high risk first, then unknown last)
    risk_order = {"toxicity": 0, "ineffective": 1, "adjust_dosage": 2, "safe": 3, "unknown": 4}
    recommendations.sort(key=lambda r: risk_order.get(r["risk_category"], 4))

    report_id = f"RPT-{int(time.time()):X}"
    
    # Count risk categories
    toxicity_count = sum(1 for r in recommendations if r["risk_category"] == "toxicity")
    ineffective_count = sum(1 for r in recommendations if r["risk_category"] == "ineffective")
    adjust_dosage_count = sum(1 for r in recommendations if r["risk_category"] == "adjust_dosage")
    safe_count = sum(1 for r in recommendations if r["risk_category"] == "safe")
    unknown_count = sum(1 for r in recommendations if r["risk_category"] == "unknown")

    return {
        "report_id": report_id,
        "patient_id": patient_id,
        "generated_at": datetime.utcnow().isoformat(),
        "selected_drugs": selected_drugs,  # Include selected drugs in response
        "summary": {
            "total_variants": len(variants),
            "drugs_analyzed": len(selected_drugs),
            "clinically_relevant": len([r for r in recommendations if r["risk_category"] != "unknown"]),
            "toxicity_risk": toxicity_count,
            "ineffective_risk": ineffective_count,
            "dosage_adjustment": adjust_dosage_count,
            "safe": safe_count,
            "unknown": unknown_count,
            # Legacy fields for backward compatibility
            "high_risk_drugs": sum(1 for r in recommendations if r["risk_level"] == "high"),
            "moderate_risk_drugs": sum(1 for r in recommendations if r["risk_level"] == "moderate"),
        },
        "recommendations": recommendations,
        "variants": variants[:50],
        "disclaimer": "This report is for clinical decision support only. All recommendations should be reviewed by a qualified healthcare provider. 'Unknown' status indicates no genetic variant was detected - standard dosing may be appropriate but requires clinical judgment.",
    }
