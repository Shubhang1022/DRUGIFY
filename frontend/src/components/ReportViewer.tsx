import { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  FileJson,
  Activity,
  AlertTriangle,
  AlertCircle,
  Dna,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ClinicalReport } from "@/lib/types";
import DrugRecommendationCard from "./DrugRecommendationCard";
import AiInsightsPanel from "./AiInsightsPanel";

interface ReportViewerProps {
  report: ClinicalReport;
  onBack: () => void;
}

export default function ReportViewer({ report, onBack }: ReportViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pharmaguard-report-${report.reportId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Clinical Report</h2>
            <p className="font-mono text-xs text-muted-foreground">
              {report.reportId} · Patient {report.patientId}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy JSON"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        <SummaryCard
          icon={<Dna className="h-5 w-5 text-primary" />}
          label="Total Variants"
          value={report.summary?.totalVariants || 0}
        />
        <SummaryCard
          icon={<Activity className="h-5 w-5 text-blue-600" />}
          label="Drugs Analyzed"
          value={report.summary?.drugsAnalyzed || 0}
          highlight
        />
        <SummaryCard
          icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
          label="Toxicity Risk"
          value={report.summary?.toxicityRisk || 0}
          color="red"
        />
        <SummaryCard
          icon={<AlertCircle className="h-5 w-5 text-orange-600" />}
          label="Ineffective"
          value={report.summary?.ineffectiveRisk || 0}
          color="orange"
        />
        <SummaryCard
          icon={<AlertCircle className="h-5 w-5 text-yellow-600" />}
          label="Dosage Adjust"
          value={report.summary?.dosageAdjustment || 0}
          color="yellow"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="recommendations">
            Drug Recommendations ({report.recommendations?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="variants">
            Variants ({report.variants?.length || 0})
          </TabsTrigger>
          <TabsTrigger value="json">
            <FileJson className="mr-1.5 h-3.5 w-3.5" />
            Raw JSON
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-3">
          {!report.recommendations || report.recommendations.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <Activity className="mx-auto h-10 w-10 text-muted-foreground" />
              <p className="mt-3 font-medium text-card-foreground">No actionable findings</p>
              <p className="text-sm text-muted-foreground">
                No pharmacogenomic interactions detected for the analyzed variants.
              </p>
            </div>
          ) : (
            report.recommendations.map((rec, i) => (
              <DrugRecommendationCard key={`${rec.drug || 'unknown'}-${rec.gene || 'unknown'}-${i}`} rec={rec} index={i} />
            ))
          )}
        </TabsContent>

        <TabsContent value="variants">
          <div className="rounded-lg border border-border bg-card overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">CHROM</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">POS</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">ID</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">REF</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">ALT</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">QUAL</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">GT</th>
                </tr>
              </thead>
              <tbody>
                {report.variants && report.variants.length > 0 ? (
                  report.variants.map((v, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-2 font-mono">{v.chrom || 'N/A'}</td>
                      <td className="px-4 py-2 font-mono">{v.pos ? v.pos.toLocaleString() : 'N/A'}</td>
                      <td className="px-4 py-2 font-mono text-primary">{v.id || 'N/A'}</td>
                      <td className="px-4 py-2 font-mono">{v.ref || 'N/A'}</td>
                      <td className="px-4 py-2 font-mono font-semibold">{v.alt || 'N/A'}</td>
                      <td className="px-4 py-2 font-mono">{v.qual || 'N/A'}</td>
                      <td className="px-4 py-2 font-mono">{v.genotype || 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                      No variants found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        <TabsContent value="json">
          <div className="rounded-lg border border-border bg-card p-4">
            <pre className="max-h-[500px] overflow-auto text-xs font-mono text-card-foreground leading-relaxed">
              {JSON.stringify(report, null, 2)}
            </pre>
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Insights */}
      <AiInsightsPanel report={report} />

      {/* Disclaimer */}
      <div className="rounded-lg border border-border bg-muted/50 p-4">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>Disclaimer:</strong> {report.disclaimer || 'This report is for research use only and should not be used as the sole basis for clinical decisions.'}
        </p>
      </div>
    </motion.div>
  );
}

function SummaryCard({ 
  icon, 
  label, 
  value, 
  highlight = false,
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: number;
  highlight?: boolean;
  color?: string;
}) {
  const colorClasses = color ? {
    red: "border-red-200 bg-red-50 dark:bg-red-950/20",
    orange: "border-orange-200 bg-orange-50 dark:bg-orange-950/20",
    yellow: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20",
  }[color] : "";

  return (
    <div className={`rounded-lg border border-border bg-card p-4 shadow-sm ${colorClasses} ${highlight ? 'ring-2 ring-primary/20' : ''}`}>
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-card-foreground">{value}</p>
    </div>
  );
}
