from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
import re
import bleach


class AnalysisRequest(BaseModel):
    patient_id: str = Field(..., min_length=1, max_length=50)
    vcf_content: str = Field(..., min_length=10, max_length=5_000_000)  # 5MB limit
    drugs: List[str] = Field(..., min_items=1, max_items=10, description="List of drugs to analyze (1-10 drugs)")
    notes: Optional[str] = Field(None, max_length=500)
    
    @validator('patient_id')
    def validate_patient_id(cls, v):
        # Only allow alphanumeric, hyphens, and underscores
        if not re.match(r'^[A-Za-z0-9\-_]+$', v):
            raise ValueError('Patient ID must contain only letters, numbers, hyphens, and underscores')
        return v
    
    @validator('vcf_content')
    def validate_vcf_format(cls, v):
        # Check if it starts with VCF header
        if not v.strip().startswith('##fileformat=VCF'):
            raise ValueError('Invalid VCF format: must start with ##fileformat=VCF')
        
        # Check for minimum required lines
        lines = v.strip().split('\n')
        if len(lines) < 2:
            raise ValueError('Invalid VCF format: file too short')
        
        # Check for column header
        has_header = any(line.startswith('#CHROM') for line in lines)
        if not has_header:
            raise ValueError('Invalid VCF format: missing #CHROM header line')
        
        return v
    
    @validator('notes')
    def sanitize_notes(cls, v):
        if v:
            # Remove any HTML tags and sanitize
            return bleach.clean(v, tags=[], strip=True)
        return v
    
    @validator('drugs')
    def validate_drugs(cls, v):
        if not v:
            raise ValueError('At least one drug must be specified')
        
        # Import here to avoid circular dependency
        from .services.drug_service import is_drug_supported, get_supported_drugs
        
        # Normalize to uppercase
        normalized_drugs = [drug.upper() for drug in v]
        
        # Check for duplicates
        if len(normalized_drugs) != len(set(normalized_drugs)):
            raise ValueError('Duplicate drugs are not allowed')
        
        # Validate each drug
        invalid_drugs = [drug for drug in normalized_drugs if not is_drug_supported(drug)]
        
        if invalid_drugs:
            supported = [d["drug"] for d in get_supported_drugs()]
            raise ValueError(
                f'Unsupported drug(s): {", ".join(invalid_drugs)}. '
                f'Supported drugs: {", ".join(supported)}'
            )
        
        return normalized_drugs


class VariantOut(BaseModel):
    chrom: str
    pos: int
    id: str
    ref: str
    alt: str
    qual: str
    genotype: str
    
    class Config:
        populate_by_name = True


class DrugRecommendationOut(BaseModel):
    drug: str
    gene: str
    diplotype: str
    phenotype: str
    risk_category: str  # New: safe, adjust_dosage, toxicity, ineffective, unknown
    risk_level: str
    recommendation: str
    dosage_guidance: str  # New: Specific dosage recommendations
    guideline: str
    evidence: str
    alternatives: List[str]
    
    class Config:
        # Allow both snake_case and camelCase
        populate_by_name = True
        # Use camelCase for JSON serialization
        alias_generator = lambda field_name: ''.join(
            word.capitalize() if i > 0 else word 
            for i, word in enumerate(field_name.split('_'))
        )
        by_alias = True


class ReportSummary(BaseModel):
    total_variants: int
    drugs_analyzed: int  # New: Number of drugs analyzed
    clinically_relevant: int
    toxicity_risk: int  # New: Count of toxicity risks
    ineffective_risk: int  # New: Count of ineffective drugs
    dosage_adjustment: int  # New: Count of dosage adjustments needed
    safe: int  # New: Count of safe drugs
    unknown: int  # New: Count of unknown status
    # Legacy fields for backward compatibility
    high_risk_drugs: int
    moderate_risk_drugs: int
    
    class Config:
        populate_by_name = True
        alias_generator = lambda field_name: ''.join(
            word.capitalize() if i > 0 else word 
            for i, word in enumerate(field_name.split('_'))
        )
        by_alias = True


class ClinicalReportOut(BaseModel):
    report_id: str
    patient_id: str
    generated_at: datetime
    selected_drugs: List[str]  # New: List of drugs that were analyzed
    summary: ReportSummary
    recommendations: List[DrugRecommendationOut]
    variants: List[VariantOut]
    disclaimer: str
    
    class Config:
        populate_by_name = True
        alias_generator = lambda field_name: ''.join(
            word.capitalize() if i > 0 else word 
            for i, word in enumerate(field_name.split('_'))
        )
        by_alias = True


class AnalysisHistoryOut(BaseModel):
    id: str
    patient_id: str
    file_name: str
    analyzed_at: datetime
    summary: ReportSummary


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserLogin(BaseModel):
    email: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('email')
    def validate_email(cls, v):
        # Basic email validation
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', v):
            raise ValueError('Invalid email format')
        return v.lower()
