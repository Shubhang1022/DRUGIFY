import uuid
from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base


class PatientUpload(Base):
    __tablename__ = "patient_uploads"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    patient_id = Column(String(50), nullable=False, index=True)
    file_name = Column(String(255), nullable=False)
    file_size = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.utcnow)

    variants = relationship("ExtractedVariant", back_populates="upload", cascade="all, delete-orphan")
    reports = relationship("GeneratedReport", back_populates="upload", cascade="all, delete-orphan")


class ExtractedVariant(Base):
    __tablename__ = "extracted_variants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id = Column(UUID(as_uuid=True), ForeignKey("patient_uploads.id"), nullable=False)
    chrom = Column(String(10), nullable=False)
    pos = Column(Integer, nullable=False)
    rs_id = Column(String(50), nullable=True)
    ref = Column(String(255), nullable=False)
    alt = Column(String(255), nullable=False)
    qual = Column(String(20), nullable=True)
    genotype = Column(String(20), nullable=True)

    upload = relationship("PatientUpload", back_populates="variants")


class GeneratedReport(Base):
    __tablename__ = "generated_reports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    upload_id = Column(UUID(as_uuid=True), ForeignKey("patient_uploads.id"), nullable=False)
    report_id = Column(String(50), unique=True, nullable=False)
    patient_id = Column(String(50), nullable=False, index=True)
    report_json = Column(JSON, nullable=False)
    generated_at = Column(DateTime, default=datetime.utcnow)

    upload = relationship("PatientUpload", back_populates="reports")


class DrugRequestHistory(Base):
    __tablename__ = "drug_request_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    report_id = Column(String(50), nullable=False, index=True)
    patient_id = Column(String(50), nullable=False)
    drug_name = Column(String(100), nullable=False)
    gene = Column(String(50), nullable=False)
    risk_level = Column(String(20), nullable=False)
    requested_at = Column(DateTime, default=datetime.utcnow)
