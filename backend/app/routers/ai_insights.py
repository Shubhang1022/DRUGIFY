from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Dict, Any
import json
import asyncio
import logging

router = APIRouter()
logger = logging.getLogger("pharmaguard.ai_insights")


class AiInsightsRequest(BaseModel):
    variants: List[Dict[str, Any]]
    recommendations: List[Dict[str, Any]]
    patientId: str


async def generate_ai_insights(variants: List[Dict], recommendations: List[Dict], patient_id: str):
    """
    Generate AI-powered clinical insights based on pharmacogenomic data.
    This is a mock implementation that provides structured clinical guidance.
    In production, this would integrate with OpenAI, Anthropic, or similar AI services.
    """
    
    # Build comprehensive analysis
    analysis_parts = []
    
    # Introduction
    intro = f"## 🧬 Comprehensive Pharmacogenomic Analysis Report\n\n"
    intro += f"**Patient ID:** {patient_id}\n"
    intro += f"**Analysis Date:** {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n"
    intro += f"**Report Type:** AI-Enhanced Clinical Decision Support\n\n"
    intro += "---\n\n"
    intro += "### Executive Summary\n\n"
    intro += "This comprehensive pharmacogenomic analysis evaluates the patient's genetic profile to provide personalized medication guidance. "
    intro += "The analysis integrates genetic variant data with established clinical pharmacogenetics guidelines (CPIC, FDA, PharmGKB) "
    intro += "to identify potential drug-gene interactions that may affect medication safety, efficacy, and optimal dosing.\n\n"
    intro += f"**Total Genetic Variants Analyzed:** {len(variants)}\n"
    intro += f"**Drugs Evaluated:** {len(recommendations)}\n"
    intro += f"**Clinically Actionable Findings:** {sum(1 for r in recommendations if r.get('risk_level') in ['high_toxicity_risk', 'ineffective', 'adjust_dosage'])}\n\n"
    analysis_parts.append(intro)
    
    # Detailed gene-drug interaction database
    gene_info = {
        "CYP2D6": {
            "full_name": "Cytochrome P450 2D6",
            "function": "Metabolizes approximately 25% of commonly prescribed medications including antidepressants, antipsychotics, beta-blockers, and opioids",
            "phenotypes": "Poor, Intermediate, Normal, Ultrarapid Metabolizers",
            "clinical_impact": "Variants can lead to drug accumulation (poor metabolizers) or reduced efficacy (ultrarapid metabolizers)"
        },
        "CYP2C19": {
            "full_name": "Cytochrome P450 2C19",
            "function": "Metabolizes proton pump inhibitors, antiplatelet drugs (clopidogrel), and some antidepressants",
            "phenotypes": "Poor, Intermediate, Normal, Rapid, Ultrarapid Metabolizers",
            "clinical_impact": "Critical for clopidogrel activation; poor metabolizers have reduced antiplatelet effect and increased cardiovascular risk"
        },
        "CYP2C9": {
            "full_name": "Cytochrome P450 2C9",
            "function": "Metabolizes warfarin, NSAIDs, phenytoin, and oral hypoglycemic agents",
            "phenotypes": "Poor, Intermediate, Normal Metabolizers",
            "clinical_impact": "Reduced function variants increase bleeding risk with warfarin and require lower doses"
        },
        "VKORC1": {
            "full_name": "Vitamin K Epoxide Reductase Complex Subunit 1",
            "function": "Target enzyme for warfarin; recycles vitamin K in the clotting cascade",
            "phenotypes": "Low, Intermediate, High Sensitivity to Warfarin",
            "clinical_impact": "Variants affect warfarin dose requirements; some patients need 50-70% lower doses"
        },
        "SLCO1B1": {
            "full_name": "Solute Carrier Organic Anion Transporter 1B1",
            "function": "Transports statins and other drugs into liver cells for metabolism",
            "phenotypes": "Normal, Intermediate, Poor Function",
            "clinical_impact": "Reduced function increases statin blood levels and myopathy risk, especially with simvastatin"
        },
        "TPMT": {
            "full_name": "Thiopurine S-Methyltransferase",
            "function": "Metabolizes thiopurine drugs (azathioprine, 6-mercaptopurine, thioguanine)",
            "phenotypes": "Poor, Intermediate, Normal Metabolizers",
            "clinical_impact": "Deficiency causes severe, potentially fatal myelosuppression; requires 90% dose reduction or alternative therapy"
        },
        "DPYD": {
            "full_name": "Dihydropyrimidine Dehydrogenase",
            "function": "Metabolizes fluoropyrimidine chemotherapy drugs (5-fluorouracil, capecitabine)",
            "phenotypes": "Poor, Intermediate, Normal Metabolizers",
            "clinical_impact": "Deficiency causes severe, life-threatening toxicity including neutropenia, mucositis, and diarrhea"
        },
        "HLA-B": {
            "full_name": "Human Leukocyte Antigen B",
            "function": "Immune system gene involved in drug hypersensitivity reactions",
            "phenotypes": "Presence or absence of specific alleles (e.g., *57:01, *15:02, *58:01)",
            "clinical_impact": "Certain alleles dramatically increase risk of severe drug reactions like Stevens-Johnson syndrome"
        }
    }
    
    # Analyze each recommendation with extensive detail
    if recommendations:
        analysis_parts.append("---\n\n")
        analysis_parts.append("## 💊 Detailed Drug-Gene Interaction Analysis\n\n")
        
        for idx, rec in enumerate(recommendations, 1):
            drug = rec.get("drug", "Unknown")
            gene = rec.get("gene", "Unknown")
            risk_level = rec.get("risk_level", "unknown")
            variant = rec.get("variant", "Unknown")
            recommendation = rec.get("recommendation", "No specific guidance available")
            dosage_guidance = rec.get("dosage_guidance", "")
            
            analysis_parts.append(f"### {idx}. {drug.upper()}\n\n")
            
            # Gene background information
            if gene in gene_info:
                info = gene_info[gene]
                analysis_parts.append(f"**🧬 Genetic Background:**\n")
                analysis_parts.append(f"- **Gene:** {gene} ({info['full_name']})\n")
                analysis_parts.append(f"- **Function:** {info['function']}\n")
                analysis_parts.append(f"- **Metabolizer Phenotypes:** {info['phenotypes']}\n")
                analysis_parts.append(f"- **Clinical Impact:** {info['clinical_impact']}\n\n")
            
            # Risk-based analysis with extensive detail
            if risk_level == "high_toxicity_risk":
                analysis_parts.append(f"**⚠️ CRITICAL ALERT: HIGH TOXICITY RISK**\n\n")
                analysis_parts.append(f"**Detected Variant:** {variant}\n\n")
                analysis_parts.append(f"**Risk Assessment:**\n")
                analysis_parts.append(f"This patient carries a genetic variant that significantly increases the risk of severe adverse reactions to {drug}. ")
                analysis_parts.append(f"The variant affects drug metabolism or immune response, potentially leading to toxic drug accumulation or hypersensitivity reactions.\n\n")
                
                analysis_parts.append(f"**Clinical Implications:**\n")
                analysis_parts.append(f"- **Toxicity Mechanism:** ")
                if "CYP" in gene:
                    analysis_parts.append(f"Reduced enzyme activity leads to impaired drug clearance, causing elevated plasma concentrations and prolonged drug exposure.\n")
                elif "DPYD" in gene:
                    analysis_parts.append(f"Deficient enzyme activity prevents normal drug breakdown, leading to severe toxicity including bone marrow suppression and GI toxicity.\n")
                elif "TPMT" in gene:
                    analysis_parts.append(f"Reduced enzyme activity causes accumulation of toxic metabolites, resulting in life-threatening myelosuppression.\n")
                elif "HLA" in gene:
                    analysis_parts.append(f"Immune-mediated hypersensitivity reaction with potential for severe cutaneous adverse reactions (SCAR).\n")
                else:
                    analysis_parts.append(f"Genetic variant disrupts normal drug processing, increasing toxicity risk.\n")
                
                analysis_parts.append(f"- **Expected Adverse Effects:** Severe reactions may include bone marrow suppression, organ toxicity, severe skin reactions, or life-threatening complications.\n")
                analysis_parts.append(f"- **Onset Timeline:** Adverse effects may occur within days to weeks of treatment initiation.\n")
                analysis_parts.append(f"- **Severity:** Potentially life-threatening; requires immediate clinical intervention.\n\n")
                
                analysis_parts.append(f"**Evidence-Based Recommendation:**\n")
                analysis_parts.append(f"{recommendation}\n\n")
                
                if dosage_guidance:
                    analysis_parts.append(f"**Dosing Guidance:**\n{dosage_guidance}\n\n")
                
                analysis_parts.append(f"**Alternative Medications:**\n")
                if drug == "CODEINE":
                    analysis_parts.append(f"- Consider non-CYP2D6 dependent analgesics: morphine, hydromorphone, oxycodone, or non-opioid alternatives\n")
                elif drug == "CLOPIDOGREL":
                    analysis_parts.append(f"- Consider alternative antiplatelet agents: prasugrel, ticagrelor (not affected by CYP2C19)\n")
                elif drug == "WARFARIN":
                    analysis_parts.append(f"- Consider direct oral anticoagulants (DOACs): apixaban, rivaroxaban, dabigatran\n")
                elif drug == "SIMVASTATIN":
                    analysis_parts.append(f"- Consider alternative statins: pravastatin, rosuvastatin (lower myopathy risk)\n")
                elif drug == "AZATHIOPRINE":
                    analysis_parts.append(f"- Consider alternative immunosuppressants: mycophenolate, methotrexate, or biologics\n")
                elif drug == "FLUOROURACIL":
                    analysis_parts.append(f"- Consider alternative chemotherapy regimens or significantly reduced doses with intensive monitoring\n")
                analysis_parts.append("\n")
                
                analysis_parts.append(f"**Monitoring Requirements:**\n")
                analysis_parts.append(f"- If {drug} must be used: Intensive clinical monitoring, frequent laboratory tests, dose titration based on response\n")
                analysis_parts.append(f"- Watch for early signs of toxicity and maintain low threshold for dose reduction or discontinuation\n")
                analysis_parts.append(f"- Patient education on warning signs and when to seek immediate medical attention\n\n")
                
                analysis_parts.append(f"**CPIC Guideline Level:** Strong recommendation (Level A evidence)\n\n")
                
            elif risk_level == "ineffective":
                analysis_parts.append(f"**⚠️ REDUCED EFFICACY WARNING**\n\n")
                analysis_parts.append(f"**Detected Variant:** {variant}\n\n")
                analysis_parts.append(f"**Efficacy Assessment:**\n")
                analysis_parts.append(f"This patient's genetic profile indicates reduced or absent therapeutic response to {drug}. ")
                analysis_parts.append(f"The variant affects drug activation or metabolism, resulting in subtherapeutic drug levels or inactive metabolites.\n\n")
                
                analysis_parts.append(f"**Clinical Implications:**\n")
                analysis_parts.append(f"- **Mechanism of Reduced Efficacy:** ")
                if drug == "CLOPIDOGREL":
                    analysis_parts.append(f"CYP2C19 is required to convert clopidogrel (prodrug) to its active metabolite. Reduced enzyme activity results in inadequate antiplatelet effect.\n")
                elif drug == "CODEINE":
                    analysis_parts.append(f"CYP2D6 converts codeine to morphine (active form). Reduced enzyme activity prevents adequate analgesia.\n")
                else:
                    analysis_parts.append(f"Genetic variant impairs drug activation or metabolism, preventing achievement of therapeutic effect.\n")
                
                analysis_parts.append(f"- **Treatment Failure Risk:** High probability of inadequate symptom control or disease progression\n")
                analysis_parts.append(f"- **Clinical Consequences:** ")
                if drug == "CLOPIDOGREL":
                    analysis_parts.append(f"Increased risk of cardiovascular events (MI, stroke, stent thrombosis) in patients requiring antiplatelet therapy\n")
                elif drug == "CODEINE":
                    analysis_parts.append(f"Inadequate pain control, patient suffering, potential for opioid escalation\n")
                else:
                    analysis_parts.append(f"Suboptimal disease management and potential for complications\n")
                analysis_parts.append("\n")
                
                analysis_parts.append(f"**Evidence-Based Recommendation:**\n")
                analysis_parts.append(f"{recommendation}\n\n")
                
                if dosage_guidance:
                    analysis_parts.append(f"**Dosing Guidance:**\n{dosage_guidance}\n\n")
                
                analysis_parts.append(f"**Preferred Alternative Medications:**\n")
                if drug == "CLOPIDOGREL":
                    analysis_parts.append(f"- **First-line alternatives:** Prasugrel or ticagrelor (not dependent on CYP2C19 activation)\n")
                    analysis_parts.append(f"- **Evidence:** Superior outcomes in CYP2C19 poor metabolizers\n")
                elif drug == "CODEINE":
                    analysis_parts.append(f"- **Alternatives:** Morphine, hydromorphone, oxycodone (direct-acting opioids)\n")
                    analysis_parts.append(f"- **Non-opioid options:** Acetaminophen, NSAIDs, or multimodal analgesia\n")
                analysis_parts.append("\n")
                
                analysis_parts.append(f"**CPIC Guideline Level:** Strong recommendation (Level A evidence)\n\n")
                
            elif risk_level == "adjust_dosage":
                analysis_parts.append(f"**⚡ DOSAGE MODIFICATION REQUIRED**\n\n")
                analysis_parts.append(f"**Detected Variant:** {variant}\n\n")
                analysis_parts.append(f"**Pharmacokinetic Impact:**\n")
                analysis_parts.append(f"This patient's genetic variant alters drug metabolism, requiring personalized dosing to achieve optimal therapeutic effect while minimizing adverse reactions.\n\n")
                
                analysis_parts.append(f"**Clinical Implications:**\n")
                analysis_parts.append(f"- **Metabolizer Status:** ")
                if "poor" in recommendation.lower() or "reduced" in recommendation.lower():
                    analysis_parts.append(f"Reduced enzyme activity (poor/intermediate metabolizer) leads to slower drug clearance and higher plasma concentrations\n")
                elif "rapid" in recommendation.lower() or "ultra" in recommendation.lower():
                    analysis_parts.append(f"Increased enzyme activity (rapid/ultrarapid metabolizer) leads to faster drug clearance and lower plasma concentrations\n")
                else:
                    analysis_parts.append(f"Altered enzyme activity affects drug exposure and requires dose adjustment\n")
                
                analysis_parts.append(f"- **Standard Dose Risk:** Using standard doses may result in toxicity (if slow metabolizer) or therapeutic failure (if rapid metabolizer)\n")
                analysis_parts.append(f"- **Dose-Response Relationship:** Genetic variant shifts the dose-response curve, requiring individualized dosing\n\n")
                
                analysis_parts.append(f"**Evidence-Based Recommendation:**\n")
                analysis_parts.append(f"{recommendation}\n\n")
                
                if dosage_guidance:
                    analysis_parts.append(f"**Specific Dosing Guidance:**\n{dosage_guidance}\n\n")
                
                analysis_parts.append(f"**Therapeutic Drug Monitoring:**\n")
                if drug == "WARFARIN":
                    analysis_parts.append(f"- **Initial Monitoring:** INR every 2-3 days until stable, then weekly, then monthly\n")
                    analysis_parts.append(f"- **Target INR:** Typically 2.0-3.0 (indication-dependent)\n")
                    analysis_parts.append(f"- **Dose Titration:** Adjust by 5-20% based on INR response\n")
                    analysis_parts.append(f"- **Genetic Dosing Algorithms:** Consider using pharmacogenetic-guided warfarin dosing calculators\n")
                elif drug == "SIMVASTATIN":
                    analysis_parts.append(f"- **Baseline:** CK, liver function tests, lipid panel\n")
                    analysis_parts.append(f"- **Follow-up:** Monitor for muscle pain/weakness, repeat CK if symptomatic\n")
                    analysis_parts.append(f"- **Efficacy:** Lipid panel at 4-12 weeks after initiation or dose change\n")
                else:
                    analysis_parts.append(f"- Regular monitoring of therapeutic response and adverse effects\n")
                    analysis_parts.append(f"- Consider therapeutic drug level monitoring if available\n")
                    analysis_parts.append(f"- Adjust dose based on clinical response and tolerability\n")
                analysis_parts.append("\n")
                
                analysis_parts.append(f"**CPIC Guideline Level:** Moderate to Strong recommendation (Level A-B evidence)\n\n")
                
            elif risk_level == "safe":
                analysis_parts.append(f"**✓ STANDARD THERAPY APPROPRIATE**\n\n")
                analysis_parts.append(f"**Detected Variant:** {variant}\n\n")
                analysis_parts.append(f"**Genetic Assessment:**\n")
                analysis_parts.append(f"No clinically significant pharmacogenomic variants detected for {drug}. The patient's genetic profile suggests normal drug metabolism and response.\n\n")
                
                analysis_parts.append(f"**Clinical Implications:**\n")
                analysis_parts.append(f"- **Metabolizer Status:** Normal/extensive metabolizer phenotype\n")
                analysis_parts.append(f"- **Expected Response:** Standard therapeutic response to typical doses\n")
                analysis_parts.append(f"- **Safety Profile:** No increased genetic risk for adverse reactions\n\n")
                
                analysis_parts.append(f"**Recommendation:**\n")
                analysis_parts.append(f"{recommendation}\n\n")
                
                if dosage_guidance:
                    analysis_parts.append(f"**Dosing Guidance:**\n{dosage_guidance}\n\n")
                
                analysis_parts.append(f"**Standard Monitoring:**\n")
                analysis_parts.append(f"- Follow routine clinical monitoring protocols for {drug}\n")
                analysis_parts.append(f"- No additional pharmacogenetic-based monitoring required\n")
                analysis_parts.append(f"- Adjust dose based on clinical response and standard therapeutic guidelines\n\n")
                
            else:  # unknown
                analysis_parts.append(f"**ℹ️ INSUFFICIENT GENETIC DATA**\n\n")
                analysis_parts.append(f"**Status:** No relevant pharmacogenomic variant detected in the analyzed genetic data for {drug}-{gene} interaction.\n\n")
                
                analysis_parts.append(f"**Interpretation:**\n")
                analysis_parts.append(f"- The absence of a detected variant may indicate:\n")
                analysis_parts.append(f"  • Normal/wild-type genotype (most common scenario)\n")
                analysis_parts.append(f"  • Variant not covered by the genetic test performed\n")
                analysis_parts.append(f"  • Insufficient sequencing depth or quality at this locus\n\n")
                
                analysis_parts.append(f"**Recommendation:**\n")
                analysis_parts.append(f"{recommendation}\n\n")
                
                analysis_parts.append(f"**Clinical Approach:**\n")
                analysis_parts.append(f"- Apply standard prescribing guidelines for {drug}\n")
                analysis_parts.append(f"- Monitor for therapeutic response and adverse effects as per routine practice\n")
                analysis_parts.append(f"- Consider expanded pharmacogenetic testing if:\n")
                analysis_parts.append(f"  • Unexpected adverse reactions occur\n")
                analysis_parts.append(f"  • Therapeutic failure despite adequate dosing\n")
                analysis_parts.append(f"  • Family history of drug sensitivity\n\n")
            
            analysis_parts.append("---\n\n")
    
    # Summary and clinical guidance
    high_risk_count = sum(1 for r in recommendations if r.get("risk_level") == "high_toxicity_risk")
    adjust_count = sum(1 for r in recommendations if r.get("risk_level") == "adjust_dosage")
    ineffective_count = sum(1 for r in recommendations if r.get("risk_level") == "ineffective")
    
    analysis_parts.append("### Clinical Summary:\n\n")
    
    if high_risk_count > 0:
        analysis_parts.append(f"⚠️ **{high_risk_count} HIGH RISK medication(s)** identified - AVOID these drugs or use with extreme caution.\n\n")
    
    if ineffective_count > 0:
        analysis_parts.append(f"⚠️ **{ineffective_count} medication(s)** may have REDUCED EFFICACY - consider alternatives.\n\n")
    
    if adjust_count > 0:
        analysis_parts.append(f"⚡ **{adjust_count} medication(s)** require DOSAGE ADJUSTMENT based on genetic profile.\n\n")
    
    analysis_parts.append("### General Recommendations:\n\n")
    analysis_parts.append("1. **Consult with a clinical pharmacist or pharmacogenomics specialist** to review these findings in the context of the patient's complete medical history.\n\n")
    analysis_parts.append("2. **Follow CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines** for evidence-based dosing recommendations.\n\n")
    analysis_parts.append("3. **Monitor for adverse effects** when initiating any new medication, especially those flagged with genetic concerns.\n\n")
    analysis_parts.append("4. **Document pharmacogenomic findings** in the patient's medical record for future prescribing decisions.\n\n")
    analysis_parts.append("5. **Consider additional genetic testing** if clinically indicated for other medications not covered in this analysis.\n\n")
    
    analysis_parts.append("---\n\n")
    analysis_parts.append("*This analysis is for clinical decision support only and should not replace professional medical judgment. ")
    analysis_parts.append("Always consider the patient's complete clinical picture, comorbidities, and other medications.*\n")
    # Summary and clinical guidance
    high_risk_count = sum(1 for r in recommendations if r.get("risk_level") == "high_toxicity_risk")
    adjust_count = sum(1 for r in recommendations if r.get("risk_level") == "adjust_dosage")
    ineffective_count = sum(1 for r in recommendations if r.get("risk_level") == "ineffective")
    safe_count = sum(1 for r in recommendations if r.get("risk_level") == "safe")
    unknown_count = sum(1 for r in recommendations if r.get("risk_level") == "unknown")
    
    analysis_parts.append("## 📊 Clinical Summary and Risk Stratification\n\n")
    
    analysis_parts.append("### Priority Action Items:\n\n")
    
    if high_risk_count > 0:
        analysis_parts.append(f"🔴 **CRITICAL PRIORITY:** {high_risk_count} medication(s) with HIGH TOXICITY RISK identified\n")
        analysis_parts.append(f"   - **Action:** AVOID these medications or use only with extreme caution and intensive monitoring\n")
        analysis_parts.append(f"   - **Timeline:** Review immediately before prescribing\n")
        analysis_parts.append(f"   - **Consultation:** Consider pharmacogenomics specialist or clinical pharmacist consultation\n\n")
    
    if ineffective_count > 0:
        analysis_parts.append(f"🟠 **HIGH PRIORITY:** {ineffective_count} medication(s) with REDUCED EFFICACY predicted\n")
        analysis_parts.append(f"   - **Action:** Consider alternative medications with better predicted response\n")
        analysis_parts.append(f"   - **Timeline:** Review before initiating therapy\n")
        analysis_parts.append(f"   - **Impact:** Risk of treatment failure and disease progression\n\n")
    
    if adjust_count > 0:
        analysis_parts.append(f"🟡 **MODERATE PRIORITY:** {adjust_count} medication(s) requiring DOSAGE ADJUSTMENT\n")
        analysis_parts.append(f"   - **Action:** Use pharmacogenetic-guided dosing algorithms\n")
        analysis_parts.append(f"   - **Timeline:** Implement at treatment initiation\n")
        analysis_parts.append(f"   - **Monitoring:** Enhanced therapeutic drug monitoring required\n\n")
    
    if safe_count > 0:
        analysis_parts.append(f"🟢 **STANDARD THERAPY:** {safe_count} medication(s) appropriate for standard dosing\n")
        analysis_parts.append(f"   - **Action:** Follow routine prescribing guidelines\n")
        analysis_parts.append(f"   - **Monitoring:** Standard clinical monitoring protocols\n\n")
    
    if unknown_count > 0:
        analysis_parts.append(f"⚪ **INSUFFICIENT DATA:** {unknown_count} medication(s) with no detected variants\n")
        analysis_parts.append(f"   - **Action:** Apply standard prescribing practices\n")
        analysis_parts.append(f"   - **Note:** Consider expanded testing if unexpected responses occur\n\n")
    
    analysis_parts.append("---\n\n")
    
    analysis_parts.append("## 🎯 Evidence-Based Clinical Recommendations\n\n")
    
    analysis_parts.append("### 1. Immediate Clinical Actions\n\n")
    analysis_parts.append("**Before Prescribing:**\n")
    analysis_parts.append("- Review all high-risk and ineffective medication flags before prescribing\n")
    analysis_parts.append("- Consult pharmacogenomics database (PharmGKB, CPIC) for latest guidelines\n")
    analysis_parts.append("- Consider patient's complete medication list for drug-drug-gene interactions\n")
    analysis_parts.append("- Document pharmacogenomic findings in electronic health record\n\n")
    
    analysis_parts.append("**Patient Communication:**\n")
    analysis_parts.append("- Explain genetic test results in patient-friendly language\n")
    analysis_parts.append("- Discuss why certain medications are recommended or avoided\n")
    analysis_parts.append("- Provide written summary of genetic findings for patient records\n")
    analysis_parts.append("- Encourage patient to share results with all healthcare providers\n\n")
    
    analysis_parts.append("### 2. Therapeutic Drug Monitoring Strategy\n\n")
    analysis_parts.append("**Enhanced Monitoring Protocols:**\n")
    if high_risk_count > 0 or adjust_count > 0:
        analysis_parts.append("- Implement more frequent monitoring for medications flagged with genetic concerns\n")
        analysis_parts.append("- Establish baseline laboratory values before treatment initiation\n")
        analysis_parts.append("- Set specific monitoring intervals based on drug half-life and risk profile\n")
        analysis_parts.append("- Use therapeutic drug level monitoring when available\n")
        analysis_parts.append("- Maintain low threshold for dose adjustment or medication change\n\n")
    else:
        analysis_parts.append("- Follow standard monitoring protocols for prescribed medications\n")
        analysis_parts.append("- Routine assessment of therapeutic response and adverse effects\n\n")
    
    analysis_parts.append("**Warning Signs to Monitor:**\n")
    analysis_parts.append("- Unexpected adverse effects at standard doses\n")
    analysis_parts.append("- Lack of therapeutic response despite adequate dosing\n")
    analysis_parts.append("- Signs of drug toxicity (organ dysfunction, severe reactions)\n")
    analysis_parts.append("- Need for dose adjustments outside typical ranges\n\n")
    
    analysis_parts.append("### 3. Multidisciplinary Care Coordination\n\n")
    analysis_parts.append("**Recommended Consultations:**\n")
    if high_risk_count > 0:
        analysis_parts.append("- **Pharmacogenomics Specialist:** For complex cases with multiple high-risk findings\n")
    analysis_parts.append("- **Clinical Pharmacist:** For medication therapy management and dosing optimization\n")
    if any(r.get("drug") in ["WARFARIN", "CLOPIDOGREL"] for r in recommendations):
        analysis_parts.append("- **Cardiologist/Hematologist:** For anticoagulant/antiplatelet therapy management\n")
    if any(r.get("drug") in ["FLUOROURACIL", "AZATHIOPRINE"] for r in recommendations):
        analysis_parts.append("- **Oncologist/Specialist:** For chemotherapy or immunosuppressive therapy\n")
    analysis_parts.append("\n")
    
    analysis_parts.append("**Care Team Communication:**\n")
    analysis_parts.append("- Share pharmacogenomic results with all prescribers\n")
    analysis_parts.append("- Update medication allergy/alert list with genetic contraindications\n")
    analysis_parts.append("- Coordinate monitoring responsibilities across specialties\n")
    analysis_parts.append("- Establish clear communication channels for adverse event reporting\n\n")
    
    analysis_parts.append("### 4. Long-Term Pharmacogenomic Management\n\n")
    analysis_parts.append("**Lifetime Utility:**\n")
    analysis_parts.append("- Genetic results are permanent and applicable throughout patient's lifetime\n")
    analysis_parts.append("- Results remain relevant for future medication decisions\n")
    analysis_parts.append("- Consider preemptive testing for commonly prescribed medications\n")
    analysis_parts.append("- Update clinical decision support systems with genetic data\n\n")
    
    analysis_parts.append("**Future Considerations:**\n")
    analysis_parts.append("- Expanded pharmacogenetic panel if additional medications needed\n")
    analysis_parts.append("- Periodic review of new CPIC guidelines and drug-gene pairs\n")
    analysis_parts.append("- Family cascade testing for actionable variants (if appropriate)\n")
    analysis_parts.append("- Integration with precision medicine initiatives\n\n")
    
    analysis_parts.append("### 5. Quality Assurance and Documentation\n\n")
    analysis_parts.append("**Medical Record Documentation:**\n")
    analysis_parts.append("- Document genetic test results in structured format\n")
    analysis_parts.append("- Record clinical decisions based on pharmacogenomic data\n")
    analysis_parts.append("- Note any deviations from genetic recommendations with justification\n")
    analysis_parts.append("- Track outcomes to assess pharmacogenomic implementation effectiveness\n\n")
    
    analysis_parts.append("**Clinical Decision Support:**\n")
    analysis_parts.append("- Implement EHR alerts for contraindicated medications\n")
    analysis_parts.append("- Create patient-specific dosing recommendations\n")
    analysis_parts.append("- Link to evidence-based guidelines at point of prescribing\n")
    analysis_parts.append("- Enable pharmacist review of genetic-based recommendations\n\n")
    
    analysis_parts.append("---\n\n")
    
    analysis_parts.append("## 📚 Clinical Resources and Guidelines\n\n")
    analysis_parts.append("**Evidence-Based Resources:**\n")
    analysis_parts.append("- **CPIC (Clinical Pharmacogenetics Implementation Consortium):** www.cpicpgx.org\n")
    analysis_parts.append("  - Gold standard for pharmacogenetic dosing guidelines\n")
    analysis_parts.append("  - Peer-reviewed, evidence-based recommendations\n")
    analysis_parts.append("  - Regularly updated with new drug-gene pairs\n\n")
    
    analysis_parts.append("- **PharmGKB (Pharmacogenomics Knowledge Base):** www.pharmgkb.org\n")
    analysis_parts.append("  - Comprehensive database of drug-gene interactions\n")
    analysis_parts.append("  - Clinical annotations and variant information\n")
    analysis_parts.append("  - Drug labels and regulatory information\n\n")
    
    analysis_parts.append("- **FDA Pharmacogenomic Biomarkers:** www.fda.gov/drugs/science-research-drugs/table-pharmacogenomic-biomarkers-drug-labeling\n")
    analysis_parts.append("  - FDA-approved drug labels with genetic information\n")
    analysis_parts.append("  - Required and recommended genetic testing\n")
    analysis_parts.append("  - Regulatory guidance on pharmacogenomic implementation\n\n")
    
    analysis_parts.append("**Professional Organizations:**\n")
    analysis_parts.append("- Association for Molecular Pathology (AMP)\n")
    analysis_parts.append("- American College of Medical Genetics and Genomics (ACMG)\n")
    analysis_parts.append("- American Society of Health-System Pharmacists (ASHP)\n\n")
    
    analysis_parts.append("---\n\n")
    
    analysis_parts.append("## ⚠️ Important Disclaimers and Limitations\n\n")
    analysis_parts.append("**Clinical Context:**\n")
    analysis_parts.append("- This analysis provides clinical decision support and should NOT replace professional medical judgment\n")
    analysis_parts.append("- Pharmacogenomic data is ONE factor in prescribing decisions alongside:\n")
    analysis_parts.append("  • Patient's complete medical history and comorbidities\n")
    analysis_parts.append("  • Current medications and potential drug interactions\n")
    analysis_parts.append("  • Organ function (renal, hepatic) and physiologic status\n")
    analysis_parts.append("  • Patient preferences and treatment goals\n")
    analysis_parts.append("  • Cost, availability, and insurance coverage\n\n")
    
    analysis_parts.append("**Test Limitations:**\n")
    analysis_parts.append("- Genetic testing may not detect all relevant variants\n")
    analysis_parts.append("- Rare or novel variants may not have established clinical significance\n")
    analysis_parts.append("- Phenotype prediction may not be 100% accurate for all individuals\n")
    analysis_parts.append("- Environmental factors and drug interactions can modify genetic effects\n")
    analysis_parts.append("- Guidelines evolve as new evidence emerges\n\n")
    
    analysis_parts.append("**Liability:**\n")
    analysis_parts.append("- Prescribing clinician retains full responsibility for medication decisions\n")
    analysis_parts.append("- This report does not establish standard of care\n")
    analysis_parts.append("- Clinical judgment should prevail when genetic recommendations conflict with patient-specific factors\n\n")
    
    analysis_parts.append("---\n\n")
    
    analysis_parts.append(f"**Report Generated by:** DRUGIFY Pharmacogenomic Analysis System v1.0\n")
    analysis_parts.append(f"**Analysis Methodology:** AI-Enhanced Clinical Decision Support with CPIC Guideline Integration\n")
    analysis_parts.append(f"**Last Updated:** {__import__('datetime').datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
    
    analysis_parts.append("*For questions about this report or pharmacogenomic implementation, consult with a clinical pharmacist, pharmacogenomics specialist, or genetic counselor.*\n\n")
    
    # Stream the response in chunks to simulate AI generation
    full_text = "".join(analysis_parts)
    
    # Split into words for streaming effect
    words = full_text.split(" ")
    for i, word in enumerate(words):
        # Create SSE format
        chunk = {
            "choices": [{
                "delta": {
                    "content": word + (" " if i < len(words) - 1 else "")
                }
            }]
        }
        yield f"data: {json.dumps(chunk)}\n\n"
        await asyncio.sleep(0.02)  # Small delay for streaming effect
    
    # Send done signal
    yield "data: [DONE]\n\n"


@router.post("/ai-insights")
async def generate_insights(request: AiInsightsRequest):
    """
    Generate AI-powered clinical insights from pharmacogenomic data.
    Returns a streaming response in SSE format.
    """
    try:
        logger.info(f"Generating AI insights for patient {request.patientId}")
        
        return StreamingResponse(
            generate_ai_insights(
                request.variants,
                request.recommendations,
                request.patientId
            ),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )
    except Exception as e:
        logger.error(f"Error generating AI insights: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="Failed to generate AI insights"
        )
