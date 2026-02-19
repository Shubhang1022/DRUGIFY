import { useState } from "react";
import { Brain, Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { ClinicalReport } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AiInsightsPanelProps {
  report: ClinicalReport;
}

// Helper function to highlight important medical terms
function highlightImportantTerms(text: string): JSX.Element[] {
  // Define important keywords to highlight
  const importantKeywords = [
    // Risk levels
    'high risk', 'moderate risk', 'low risk', 'severe', 'critical', 'caution',
    // Actions
    'avoid', 'do not', 'contraindicated', 'recommended', 'consider', 'monitor',
    'reduce dose', 'increase dose', 'alternative', 'switch to',
    // Medical terms
    'metabolizer', 'poor metabolizer', 'intermediate metabolizer', 'ultrarapid metabolizer',
    'toxicity', 'adverse', 'hypersensitivity', 'efficacy', 'therapeutic',
    'myelosuppression', 'myopathy', 'reaction',
    // Genes
    'CYP2D6', 'CYP2C19', 'CYP2C9', 'SLCO1B1', 'HLA-B', 'TPMT', 'DPYD', 'VKORC1', 'NUDT15',
    // Drug names (common ones)
    'warfarin', 'clopidogrel', 'codeine', 'simvastatin', 'abacavir', 'azathioprine',
    '5-fluorouracil', '5-FU', 'voriconazole', 'prasugrel', 'ticagrelor',
    // Guidelines
    'CPIC', 'FDA', 'guideline',
  ];

  // Create a regex pattern that matches whole words (case-insensitive)
  const pattern = new RegExp(
    `\\b(${importantKeywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
    'gi'
  );

  const parts: JSX.Element[] = [];
  let lastIndex = 0;
  let match;
  let keyCounter = 0;

  while ((match = pattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${keyCounter++}`}>
          {text.substring(lastIndex, match.index)}
        </span>
      );
    }

    // Add the highlighted match
    const matchedText = match[0];
    const lowerMatch = matchedText.toLowerCase();
    
    // Determine highlight color based on term type
    let highlightClass = 'bg-yellow-200/60 dark:bg-yellow-500/30 font-semibold px-1 rounded';
    
    if (lowerMatch.includes('high risk') || lowerMatch.includes('severe') || 
        lowerMatch.includes('avoid') || lowerMatch.includes('do not') || 
        lowerMatch.includes('contraindicated') || lowerMatch.includes('toxicity')) {
      highlightClass = 'bg-red-200/70 dark:bg-red-500/40 font-bold px-1 rounded text-red-900 dark:text-red-100';
    } else if (lowerMatch.includes('moderate risk') || lowerMatch.includes('caution') || 
               lowerMatch.includes('monitor') || lowerMatch.includes('reduce')) {
      highlightClass = 'bg-orange-200/70 dark:bg-orange-500/40 font-semibold px-1 rounded text-orange-900 dark:text-orange-100';
    } else if (lowerMatch.includes('recommended') || lowerMatch.includes('alternative') || 
               lowerMatch.includes('consider')) {
      highlightClass = 'bg-green-200/70 dark:bg-green-500/40 font-semibold px-1 rounded text-green-900 dark:text-green-100';
    } else if (lowerMatch.includes('cyp') || lowerMatch.includes('hla') || 
               lowerMatch.includes('tpmt') || lowerMatch.includes('dpyd') ||
               lowerMatch.includes('slco') || lowerMatch.includes('vkorc') ||
               lowerMatch.includes('nudt')) {
      highlightClass = 'bg-blue-200/70 dark:bg-blue-500/40 font-semibold px-1 rounded text-blue-900 dark:text-blue-100';
    }

    parts.push(
      <span key={`highlight-${keyCounter++}`} className={highlightClass}>
        {matchedText}
      </span>
    );

    lastIndex = pattern.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(
      <span key={`text-${keyCounter++}`}>
        {text.substring(lastIndex)}
      </span>
    );
  }

  return parts;
}

export default function AiInsightsPanel({ report }: AiInsightsPanelProps) {
  const [insights, setInsights] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const runAiAnalysis = async () => {
    setIsLoading(true);
    setError(null);
    setInsights("");

    const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-pgx`;

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          variants: report.variants || [],
          recommendations: report.recommendations || [],
          patientId: report.patientId || 'Unknown',
        }),
      });

      if (resp.status === 429) {
        toast({ title: "Rate Limited", description: "Too many requests. Please wait a moment and try again.", variant: "destructive" });
        setError("Rate limited. Please try again shortly.");
        setIsLoading(false);
        return;
      }
      if (resp.status === 402) {
        toast({ title: "Credits Required", description: "AI usage limit reached. Add credits in Settings.", variant: "destructive" });
        setError("AI credits exhausted.");
        setIsLoading(false);
        return;
      }
      if (!resp.ok || !resp.body) {
        throw new Error("Failed to start AI analysis");
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";
      let streamDone = false;
      let accumulated = "";

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              accumulated += content;
              setInsights(accumulated);
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Flush remaining
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split("\n")) {
          if (!raw) continue;
          if (raw.endsWith("\r")) raw = raw.slice(0, -1);
          if (raw.startsWith(":") || raw.trim() === "") continue;
          if (!raw.startsWith("data: ")) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === "[DONE]") continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              accumulated += content;
              setInsights(accumulated);
            }
          } catch { /* ignore */ }
        }
      }
    } catch (e) {
      console.error("AI analysis error:", e);
      setError("Failed to run AI analysis. Please try again.");
      toast({ title: "Analysis Error", description: "Could not complete AI analysis.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-card-foreground">AI Clinical Analysis</h3>
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-primary">
            AI-Powered
          </span>
        </div>
        {!insights && !isLoading && (
          <Button onClick={runAiAnalysis} size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Generate AI Insights
          </Button>
        )}
        {insights && !isLoading && (
          <Button onClick={runAiAnalysis} variant="outline" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4" />
            Regenerate
          </Button>
        )}
      </div>

      <AnimatePresence>
        {isLoading && !insights && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 py-6 justify-center text-muted-foreground"
          >
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <span className="text-sm">Analyzing pharmacogenomic data with AI...</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive"
          >
            <AlertTriangle className="h-4 w-4 shrink-0" />
            {error}
          </motion.div>
        )}

        {insights && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm max-w-none text-card-foreground"
          >
            <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed">
              <div className="whitespace-pre-wrap">
                {highlightImportantTerms(insights)}
                {isLoading && <span className="inline-block w-2 h-4 bg-primary/60 animate-pulse-glow ml-0.5" />}
              </div>
            </div>
            
            {/* Legend for highlights */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-red-200/70 dark:bg-red-500/40"></span>
                <span className="text-muted-foreground">High Risk/Avoid</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-orange-200/70 dark:bg-orange-500/40"></span>
                <span className="text-muted-foreground">Moderate Risk/Caution</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-green-200/70 dark:bg-green-500/40"></span>
                <span className="text-muted-foreground">Recommended</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-blue-200/70 dark:bg-blue-500/40"></span>
                <span className="text-muted-foreground">Gene</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="inline-block w-3 h-3 rounded bg-yellow-200/60 dark:bg-yellow-500/30"></span>
                <span className="text-muted-foreground">Important Term</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
