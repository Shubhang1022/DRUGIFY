import { z } from "zod";

// --- VCF Parsing Types ---
export interface VcfVariant {
  chrom: string;
  pos: number;
  id: string;
  ref: string;
  alt: string;
  qual: string;
  filter: string;
  info: string;
  genotype: string;
}

export interface ParsedVcf {
  sampleId: string;
  variants: VcfVariant[];
  metadata: Record<string, string>;
}

// --- Pharmacogenomic Types ---
export type RiskLevel = "high" | "moderate" | "low" | "unknown";
export type RiskCategory = "safe" | "adjust_dosage" | "toxicity" | "ineffective" | "unknown";

export interface DrugRecommendation {
  drug: string;
  gene: string;
  diplotype: string;
  phenotype: string;
  riskCategory: RiskCategory;
  riskLevel: RiskLevel;
  recommendation: string;
  dosageGuidance: string;
  guideline: string;
  evidence: string;
  alternatives: string[];
}

export interface ClinicalReport {
  reportId: string;
  patientId: string;
  generatedAt: string;
  selectedDrugs: string[];
  summary: {
    totalVariants: number;
    drugsAnalyzed: number;
    clinicallyRelevant: number;
    toxicityRisk: number;
    ineffectiveRisk: number;
    dosageAdjustment: number;
    safe: number;
    unknown: number;
    highRiskDrugs: number;
    moderateRiskDrugs: number;
  };
  recommendations: DrugRecommendation[];
  variants: VcfVariant[];
  disclaimer: string;
}

// --- Form Schemas ---
export const uploadFormSchema = z.object({
  patientId: z.string().trim().min(1, "Patient ID is required").max(50, "Max 50 characters"),
  drugs: z.array(z.string()).min(1, "At least one drug must be selected").max(10, "Maximum 10 drugs allowed"),
  notes: z.string().max(500, "Max 500 characters").optional(),
});

export type UploadFormData = z.infer<typeof uploadFormSchema>;

// --- API Types ---
export interface AnalysisRequest {
  patientId: string;
  vcfContent: string;
  drugs: string[];
  notes?: string;
}

export interface AnalysisHistoryItem {
  id: string;
  patientId: string;
  fileName: string;
  analyzedAt: string;
  summary: ClinicalReport["summary"];
}
