"""Initial migration — PharmaGuard schema

Revision ID: 001
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        "patient_uploads",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("patient_id", sa.String(50), nullable=False, index=True),
        sa.Column("file_name", sa.String(255), nullable=False),
        sa.Column("file_size", sa.Integer, nullable=False),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("uploaded_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "extracted_variants",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("upload_id", UUID(as_uuid=True), sa.ForeignKey("patient_uploads.id"), nullable=False),
        sa.Column("chrom", sa.String(10), nullable=False),
        sa.Column("pos", sa.Integer, nullable=False),
        sa.Column("rs_id", sa.String(50), nullable=True),
        sa.Column("ref", sa.String(255), nullable=False),
        sa.Column("alt", sa.String(255), nullable=False),
        sa.Column("qual", sa.String(20), nullable=True),
        sa.Column("genotype", sa.String(20), nullable=True),
    )

    op.create_table(
        "generated_reports",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("upload_id", UUID(as_uuid=True), sa.ForeignKey("patient_uploads.id"), nullable=False),
        sa.Column("report_id", sa.String(50), unique=True, nullable=False),
        sa.Column("patient_id", sa.String(50), nullable=False, index=True),
        sa.Column("report_json", sa.JSON, nullable=False),
        sa.Column("generated_at", sa.DateTime, server_default=sa.func.now()),
    )

    op.create_table(
        "drug_request_history",
        sa.Column("id", UUID(as_uuid=True), primary_key=True),
        sa.Column("report_id", sa.String(50), nullable=False, index=True),
        sa.Column("patient_id", sa.String(50), nullable=False),
        sa.Column("drug_name", sa.String(100), nullable=False),
        sa.Column("gene", sa.String(50), nullable=False),
        sa.Column("risk_level", sa.String(20), nullable=False),
        sa.Column("requested_at", sa.DateTime, server_default=sa.func.now()),
    )


def downgrade():
    op.drop_table("drug_request_history")
    op.drop_table("generated_reports")
    op.drop_table("extracted_variants")
    op.drop_table("patient_uploads")
