import type { ParsedVcf, VcfVariant, ClinicalReport, DrugRecommendation, RiskLevel } from "./types";

// --- CPIC-style pharmacogenomic rules ---
const CPIC_RULES: Array<{
  gene: string;
  rsId: string;
  riskAllele: string;
  drug: string;
  phenotype: string;
  riskLevel: RiskLevel;
  recommendation: string;
  guideline: string;
  evidence: string;
  alternatives: string[];
}> = [
  {
    gene: "CYP2D6",
    rsId: "rs3892097",
    riskAllele: "A",
    drug: "Codeine",
    phenotype: "Poor Metabolizer",
    riskLevel: "high",
    recommendation: "Avoid codeine. Use alternative analgesics not metabolized by CYP2D6 (e.g., morphine, non-opioid analgesics).",
    guideline: "CPIC Guideline for CYP2D6 and Codeine Therapy (2019)",
    evidence: "Strong",
    alternatives: ["Morphine", "Acetaminophen", "NSAIDs"],
  },
  {
    gene: "CYP2C19",
    rsId: "rs4244285",
    riskAllele: "A",
    drug: "Clopidogrel",
    phenotype: "Poor Metabolizer",
    riskLevel: "high",
    recommendation: "Use alternative antiplatelet therapy (e.g., prasugrel, ticagrelor). Clopidogrel is a prodrug requiring CYP2C19 activation.",
    guideline: "CPIC Guideline for CYP2C19 and Clopidogrel Therapy (2022)",
    evidence: "Strong",
    alternatives: ["Prasugrel", "Ticagrelor"],
  },
  {
    gene: "SLCO1B1",
    rsId: "rs4149056",
    riskAllele: "C",
    drug: "Simvastatin",
    phenotype: "Decreased Function",
    riskLevel: "moderate",
    recommendation: "Prescribe a lower dose or use an alternative statin (e.g., pravastatin, rosuvastatin). Increased risk of myopathy.",
    guideline: "CPIC Guideline for SLCO1B1 and Statin Therapy (2022)",
    evidence: "Strong",
    alternatives: ["Pravastatin", "Rosuvastatin"],
  },
  {
    gene: "HLA-B",
    rsId: "rs2395029",
    riskAllele: "T",
    drug: "Abacavir",
    phenotype: "HLA-B*57:01 Positive",
    riskLevel: "high",
    recommendation: "Do NOT prescribe abacavir. High risk of severe hypersensitivity reaction. Use alternative antiretroviral agents.",
    guideline: "CPIC Guideline for HLA-B and Abacavir Therapy (2014)",
    evidence: "Strong",
    alternatives: ["Tenofovir", "Emtricitabine"],
  },
  {
    gene: "TPMT",
    rsId: "rs1800460",
    riskAllele: "T",
    drug: "Azathioprine",
    phenotype: "Intermediate Metabolizer",
    riskLevel: "moderate",
    recommendation: "Reduce starting dose by 30-70%. Monitor for myelosuppression. Consider TPMT enzyme activity testing.",
    guideline: "CPIC Guideline for TPMT/NUDT15 and Thiopurine Therapy (2018)",
    evidence: "Strong",
    alternatives: ["Mycophenolate mofetil"],
  },
  {
    gene: "CYP2C9",
    rsId: "rs1799853",
    riskAllele: "T",
    drug: "Warfarin",
    phenotype: "Intermediate Metabolizer",
    riskLevel: "moderate",
    recommendation: "Reduced warfarin dose required. Use pharmacogenomic-guided dosing algorithms. Monitor INR closely.",
    guideline: "CPIC Guideline for CYP2C9/VKORC1 and Warfarin Therapy (2017)",
    evidence: "Strong",
    alternatives: ["Direct oral anticoagulants (DOACs)"],
  },
  {
    gene: "DPYD",
    rsId: "rs3918290",
    riskAllele: "A",
    drug: "5-Fluorouracil",
    phenotype: "Poor Metabolizer",
    riskLevel: "high",
    recommendation: "Avoid 5-FU and capecitabine. Risk of severe/fatal toxicity. Use alternative chemotherapy regimens.",
    guideline: "CPIC Guideline for DPYD and Fluoropyrimidine Therapy (2017)",
    evidence: "Strong",
    alternatives: ["Alternative chemotherapy per oncology consult"],
  },
  {
    gene: "CYP2C19",
    rsId: "rs12248560",
    riskAllele: "T",
    drug: "Voriconazole",
    phenotype: "Ultrarapid Metabolizer",
    riskLevel: "moderate",
    recommendation: "Subtherapeutic levels expected. Use alternative antifungal agent or increase dose with therapeutic drug monitoring.",
    guideline: "CPIC Guideline for CYP2C19 and Voriconazole Therapy (2016)",
    evidence: "Moderate",
    alternatives: ["Isavuconazole", "Posaconazole"],
  },
];

// --- VCF Parser ---
export function parseVcf(content: string): ParsedVcf {
  const lines = content.split("\n");
  const metadata: Record<string, string> = {};
  const variants: VcfVariant[] = [];
  let sampleId = "UNKNOWN";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("##")) {
      const match = trimmed.match(/^##(\w+)=(.+)$/);
      if (match) metadata[match[1]] = match[2];
      continue;
    }

    if (trimmed.startsWith("#CHROM")) {
      const cols = trimmed.split("\t");
      if (cols.length >= 10) sampleId = cols[9];
      continue;
    }

    const cols = trimmed.split("\t");
    if (cols.length >= 8) {
      variants.push({
        chrom: cols[0],
        pos: parseInt(cols[1], 10),
        id: cols[2] || ".",
        ref: cols[3],
        alt: cols[4],
        qual: cols[5],
        filter: cols[6],
        info: cols[7],
        genotype: cols.length >= 10 ? cols[9] : ".",
      });
    }
  }

  return { sampleId, variants, metadata };
}

// --- Analysis Engine ---
export function analyzeVariants(parsedVcf: ParsedVcf, patientId: string): ClinicalReport {
  const recommendations: DrugRecommendation[] = [];

  for (const rule of CPIC_RULES) {
    const matchingVariant = parsedVcf.variants.find(
      (v) => v.id === rule.rsId || (v.alt.includes(rule.riskAllele))
    );

    if (matchingVariant) {
      recommendations.push({
        drug: rule.drug,
        gene: rule.gene,
        diplotype: `${matchingVariant.ref}/${matchingVariant.alt}`,
        phenotype: rule.phenotype,
        riskLevel: rule.riskLevel,
        recommendation: rule.recommendation,
        guideline: rule.guideline,
        evidence: rule.evidence,
        alternatives: rule.alternatives,
      });
    }
  }

  // Sort by risk: high > moderate > low > unknown
  const riskOrder: Record<RiskLevel, number> = { high: 0, moderate: 1, low: 2, unknown: 3 };
  recommendations.sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);

  const report: ClinicalReport = {
    reportId: `RPT-${Date.now().toString(36).toUpperCase()}`,
    patientId,
    generatedAt: new Date().toISOString(),
    summary: {
      totalVariants: parsedVcf.variants.length,
      clinicallyRelevant: recommendations.length,
      highRiskDrugs: recommendations.filter((r) => r.riskLevel === "high").length,
      moderateRiskDrugs: recommendations.filter((r) => r.riskLevel === "moderate").length,
    },
    recommendations,
    variants: parsedVcf.variants.slice(0, 50), // cap for display
    disclaimer:
      "This report is generated for clinical decision support purposes only. All pharmacogenomic recommendations should be reviewed by a qualified healthcare provider before making prescribing decisions. This system does not replace clinical judgment.",
  };

  return report;
}

// --- Demo VCF Generator ---
export function generateDemoVcf(): string {
  return `##fileformat=VCFv4.2
##source=PharmaGuardDemo
##reference=GRCh38
##INFO=<ID=DP,Number=1,Type=Integer,Description="Total Depth">
##FORMAT=<ID=GT,Number=1,Type=String,Description="Genotype">
#CHROM\tPOS\tID\tREF\tALT\tQUAL\tFILTER\tINFO\tFORMAT\tSAMPLE001
22\t42130692\trs3892097\tG\tA\t99\tPASS\tDP=45\tGT\t0/1
10\t96541616\trs4244285\tG\tA\t85\tPASS\tDP=38\tGT\t1/1
12\t21178615\trs4149056\tT\tC\t92\tPASS\tDP=52\tGT\t0/1
6\t31382317\trs2395029\tC\tT\t78\tPASS\tDP=41\tGT\t0/1
6\t18130918\trs1800460\tC\tT\t88\tPASS\tDP=47\tGT\t0/1
10\t96702047\trs1799853\tC\tT\t95\tPASS\tDP=55\tGT\t0/1
1\t97915614\trs3918290\tC\tA\t90\tPASS\tDP=43\tGT\t0/1
10\t96521657\trs12248560\tC\tT\t82\tPASS\tDP=36\tGT\t1/1
1\t100000001\trs999999\tA\tG\t70\tPASS\tDP=30\tGT\t0/1
3\t200000001\trs888888\tC\tT\t65\tPASS\tDP=28\tGT\t0/0`;
}
