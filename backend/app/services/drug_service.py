"""Drug service for managing supported drugs and drug-gene mappings"""
from typing import List, Dict, Any, Optional

# Supported drugs with their metadata
SUPPORTED_DRUGS = [
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
    {
        "drug": "CLOPIDOGREL",
        "primary_gene": "CYP2C19",
        "description": "Antiplatelet therapy",
        "category": "Antiplatelet"
    },
    {
        "drug": "SIMVASTATIN",
        "primary_gene": "SLCO1B1",
        "description": "Cholesterol statin",
        "category": "Statin"
    },
    {
        "drug": "AZATHIOPRINE",
        "primary_gene": "TPMT",
        "description": "Immunosuppressant",
        "category": "Immunosuppressant"
    },
    {
        "drug": "FLUOROURACIL",
        "primary_gene": "DPYD",
        "description": "Chemotherapy",
        "category": "Chemotherapy"
    }
]

# Create lookup dictionaries for fast access
DRUG_TO_GENE_MAP = {drug["drug"]: drug["primary_gene"] for drug in SUPPORTED_DRUGS}
DRUG_METADATA = {drug["drug"]: drug for drug in SUPPORTED_DRUGS}


def get_supported_drugs() -> List[Dict[str, str]]:
    """Get list of all supported drugs with metadata"""
    return SUPPORTED_DRUGS


def is_drug_supported(drug_name: str) -> bool:
    """Check if a drug is supported"""
    return drug_name.upper() in DRUG_TO_GENE_MAP


def get_primary_gene(drug_name: str) -> Optional[str]:
    """Get the primary gene for a drug"""
    return DRUG_TO_GENE_MAP.get(drug_name.upper())


def get_drug_metadata(drug_name: str) -> Optional[Dict[str, str]]:
    """Get full metadata for a drug"""
    return DRUG_METADATA.get(drug_name.upper())


def validate_drugs(drugs: List[str]) -> tuple[bool, List[str], List[str]]:
    """
    Validate a list of drugs
    
    Returns:
        tuple: (all_valid, valid_drugs, invalid_drugs)
    """
    valid_drugs = []
    invalid_drugs = []
    
    for drug in drugs:
        drug_upper = drug.upper()
        if is_drug_supported(drug_upper):
            valid_drugs.append(drug_upper)
        else:
            invalid_drugs.append(drug)
    
    return len(invalid_drugs) == 0, valid_drugs, invalid_drugs


def get_drug_gene_mapping(drug_name: str) -> Dict[str, Any]:
    """Get drug-gene mapping with metadata"""
    drug_upper = drug_name.upper()
    if not is_drug_supported(drug_upper):
        return None
    
    metadata = get_drug_metadata(drug_upper)
    return {
        "drug": drug_upper,
        "primary_gene": metadata["primary_gene"],
        "description": metadata["description"],
        "category": metadata["category"]
    }
