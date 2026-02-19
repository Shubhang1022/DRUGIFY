import { motion } from "framer-motion";
import { AlertTriangle, AlertCircle, CheckCircle, HelpCircle, ChevronDown, ChevronUp, Pill, ShieldAlert, ShieldX, ShieldCheck } from "lucide-react";
import { useState } from "react";
import type { DrugRecommendation, RiskLevel, RiskCategory } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface DrugRecommendationCardProps {
  rec: DrugRecommendation;
  index: number;
}

const riskCategoryConfig: Record<RiskCategory, { 
  icon: typeof AlertTriangle; 
  label: string; 
  className: string; 
  badgeClass: string;
  description: string;
}> = {
  toxicity: {
    icon: ShieldAlert,
    label: "Toxicity Risk",
    className: "border-l-red-600 bg-red-50 dark:bg-red-950/20",
    badgeClass: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300",
    description: "High risk of adverse effects - avoid or use extreme caution"
  },
  ineffective: {
    icon: ShieldX,
    label: "Ineffective",
    className: "border-l-orange-600 bg-orange-50 dark:bg-orange-950/20",
    badgeClass: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300",
    description: "Drug unlikely to work due to genetic factors"
  },
  adjust_dosage: {
    icon: Pill,
    label: "Adjust Dosage",
    className: "border-l-yellow-600 bg-yellow-50 dark:bg-yellow-950/20",
    badgeClass: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300",
    description: "Modified dosing required based on genetics"
  },
  safe: {
    icon: ShieldCheck,
    label: "Safe",
    className: "border-l-green-600 bg-green-50 dark:bg-green-950/20",
    badgeClass: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300",
    description: "Standard dosing recommended"
  },
  unknown: {
    icon: HelpCircle,
    label: "Unknown",
    className: "border-l-gray-400 bg-gray-50 dark:bg-gray-900/20",
    badgeClass: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800/30 dark:text-gray-400",
    description: "No genetic variant detected - standard dosing may be appropriate"
  },
};

export default function DrugRecommendationCard({ rec, index }: DrugRecommendationCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Handle both camelCase and snake_case from API
  const riskCategoryRaw = rec.riskCategory || (rec as any).risk_category || 'unknown';
  // Normalize and validate risk category - ensure it's always a valid key
  const riskCategory: RiskCategory = (
    typeof riskCategoryRaw === 'string' && 
    riskCategoryRaw in riskCategoryConfig
  ) ? riskCategoryRaw as RiskCategory : 'unknown';
  
  // Safely get config - this should never be undefined now
  const config = riskCategoryConfig[riskCategory] ?? riskCategoryConfig.unknown;
  const Icon = config?.icon ?? HelpCircle;
  
  // Handle dosage guidance field (camelCase or snake_case)
  const dosageGuidance = rec.dosageGuidance || (rec as any).dosage_guidance || 'No specific guidance available.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`rounded-lg border border-border border-l-4 ${config.className} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-4 text-left hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1">
          <Icon className="h-6 w-6 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-lg text-card-foreground">{rec.drug || 'Unknown Drug'}</span>
              <Badge variant="outline" className={`${config.badgeClass} font-semibold`}>
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              <span className="font-semibold">{rec.gene || 'N/A'}</span> · {rec.phenotype || 'N/A'}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border-t border-border px-4 pb-4 pt-3 space-y-4 bg-card"
        >
          {/* Risk Category Description */}
          <div className="rounded-md bg-muted/50 p-3">
            <p className="text-sm text-muted-foreground italic">
              {config.description}
            </p>
          </div>

          {/* Recommendation */}
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Clinical Recommendation
            </p>
            <p className="text-sm text-card-foreground leading-relaxed">
              {rec.recommendation || 'No specific recommendation available.'}
            </p>
          </div>

          {/* Dosage Guidance - NEW */}
          <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-900 dark:text-blue-300 mb-1.5 flex items-center gap-1.5">
              <Pill className="h-3.5 w-3.5" />
              Dosage Guidance
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed font-medium">
              {dosageGuidance}
            </p>
          </div>

          {/* Genetic Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Diplotype
              </p>
              <p className="font-mono text-sm text-card-foreground bg-muted/50 px-2 py-1 rounded">
                {rec.diplotype || 'Not detected'}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Evidence Level
              </p>
              <p className="text-sm text-card-foreground font-semibold">
                {rec.evidence || 'N/A'}
              </p>
            </div>
          </div>

          {/* Alternatives */}
          {rec.alternatives && Array.isArray(rec.alternatives) && rec.alternatives.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Alternative Medications
              </p>
              <div className="flex flex-wrap gap-2">
                {rec.alternatives.map((alt) => (
                  <Badge key={alt} variant="secondary" className="text-xs px-2.5 py-1">
                    {alt}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Guideline Reference */}
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground italic">
              <span className="font-semibold">Reference:</span> {rec.guideline || 'N/A'}
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
