"""Drug management endpoints"""
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from ..services.drug_service import (
    get_supported_drugs,
    is_drug_supported,
    get_drug_gene_mapping,
    validate_drugs
)
import logging

router = APIRouter()
logger = logging.getLogger("pharmaguard.drugs")


@router.get("/drugs", response_model=Dict[str, List[Dict[str, str]]])
async def list_supported_drugs():
    """
    Get list of all supported drugs with metadata
    
    Returns:
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
    """
    logger.info("Fetching supported drugs list")
    return {"supported_drugs": get_supported_drugs()}


@router.get("/drugs/{drug_name}", response_model=Dict[str, Any])
async def get_drug_info(drug_name: str):
    """
    Get detailed information about a specific drug
    
    Args:
        drug_name: Name of the drug (case-insensitive)
    
    Returns:
        Drug metadata including primary gene mapping
    
    Raises:
        404: If drug is not supported
    """
    drug_upper = drug_name.upper()
    
    if not is_drug_supported(drug_upper):
        logger.warning(f"Unsupported drug requested: {drug_name}")
        raise HTTPException(
            status_code=404,
            detail={
                "error": "Unsupported drug",
                "drug": drug_name,
                "supported_drugs": [d["drug"] for d in get_supported_drugs()]
            }
        )
    
    mapping = get_drug_gene_mapping(drug_upper)
    logger.info(f"Drug info retrieved: {drug_upper}")
    return mapping


@router.post("/drugs/validate", response_model=Dict[str, Any])
async def validate_drug_list(drugs: List[str]):
    """
    Validate a list of drugs
    
    Args:
        drugs: List of drug names to validate
    
    Returns:
        {
            "valid": true/false,
            "valid_drugs": [...],
            "invalid_drugs": [...],
            "mappings": {...}
        }
    """
    all_valid, valid_drugs, invalid_drugs = validate_drugs(drugs)
    
    # Get mappings for valid drugs
    mappings = {}
    for drug in valid_drugs:
        mappings[drug] = get_drug_gene_mapping(drug)
    
    logger.info(
        f"Drug validation: {len(valid_drugs)} valid, {len(invalid_drugs)} invalid"
    )
    
    return {
        "valid": all_valid,
        "valid_drugs": valid_drugs,
        "invalid_drugs": invalid_drugs,
        "mappings": mappings
    }
