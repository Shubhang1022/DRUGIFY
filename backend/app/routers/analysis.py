from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import get_db
from ..schemas import AnalysisRequest, ClinicalReportOut
from ..services.vcf_parser import parse_vcf
from ..services.pgx_engine import analyze_variants
from ..models import PatientUpload, ExtractedVariant, GeneratedReport, DrugRequestHistory
from ..security import rate_limit_dependency, sanitize_patient_id
from ..config import settings
import logging

router = APIRouter()
logger = logging.getLogger("pharmaguard.analysis")


@router.post("/analyze", response_model=ClinicalReportOut, dependencies=[Depends(rate_limit_dependency)])
async def analyze_vcf(
    request: AnalysisRequest,
    http_request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Analyze a VCF file and generate a pharmacogenomic report.
    
    Rate limited to 10 requests per minute per IP address.
    
    **Security Features:**
    - Input validation and sanitization
    - Rate limiting
    - Request logging with sanitized patient IDs
    - File size limits (5MB)
    - Drug validation (only supported drugs allowed)
    """
    client_ip = http_request.client.host if http_request.client else "unknown"
    sanitized_patient_id = sanitize_patient_id(request.patient_id)
    
    logger.info(
        f"Analysis request from {client_ip} for patient {sanitized_patient_id} "
        f"with drugs: {', '.join(request.drugs)}"
    )
    
    # Validate file size
    vcf_size = len(request.vcf_content.encode('utf-8'))
    if vcf_size > settings.max_upload_size:
        logger.warning(f"File size {vcf_size} exceeds limit from {client_ip}")
        raise HTTPException(
            status_code=413,
            detail=f"File size exceeds maximum allowed size of {settings.max_upload_size / (1024*1024)}MB"
        )
    
    # Parse VCF
    try:
        parsed = parse_vcf(request.vcf_content)
    except Exception as e:
        logger.error(f"VCF parsing error from {client_ip}: {e}")
        raise HTTPException(
            status_code=422,
            detail=f"Invalid VCF format: {str(e)}"
        )
    
    # Validate variant count
    if len(parsed["variants"]) == 0:
        raise HTTPException(
            status_code=422,
            detail="No variants found in VCF file"
        )
    
    if len(parsed["variants"]) > 100000:
        raise HTTPException(
            status_code=422,
            detail="Too many variants. Maximum 100,000 variants allowed."
        )
    
    try:
        # Save upload metadata
        upload = PatientUpload(
            patient_id=request.patient_id,
            file_name="uploaded.vcf",
            file_size=vcf_size,
            notes=request.notes,
        )
        db.add(upload)
        await db.flush()
        
        # Save variants (limit to first 1000 for storage)
        for v in parsed["variants"][:1000]:
            db.add(ExtractedVariant(
                upload_id=upload.id,
                chrom=v["chrom"],
                pos=v["pos"],
                rs_id=v["id"],
                ref=v["ref"],
                alt=v["alt"],
                qual=v["qual"],
                genotype=v["genotype"],
            ))
        
        # Run analysis with drug filtering
        report = analyze_variants(parsed, request.patient_id, request.drugs)
        
        # Save report
        db.add(GeneratedReport(
            upload_id=upload.id,
            report_id=report["report_id"],
            patient_id=request.patient_id,
            report_json=report,
        ))
        
        # Save drug request history
        for rec in report["recommendations"]:
            db.add(DrugRequestHistory(
                report_id=report["report_id"],
                patient_id=request.patient_id,
                drug_name=rec["drug"],
                gene=rec["gene"],
                risk_level=rec["risk_level"],
            ))
        
        await db.commit()
        
        logger.info(
            f"Report {report['report_id']} generated for patient {sanitized_patient_id} "
            f"({len(parsed['variants'])} variants, {len(report['recommendations'])} recommendations)"
        )
        
        return report
        
    except Exception as e:
        await db.rollback()
        logger.error(f"Database error during analysis: {e}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail="An error occurred while processing your request"
        )


@router.get("/health")
async def health():
    """Analysis service health check"""
    return {"status": "ok", "service": "analysis"}
