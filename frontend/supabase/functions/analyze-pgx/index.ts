import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { variants, recommendations, patientId } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const variantSummary = variants.slice(0, 20).map((v: any) =>
      `${v.chrom}:${v.pos} ${v.id} ${v.ref}>${v.alt} (GT: ${v.genotype})`
    ).join("\n");

    const recSummary = recommendations.map((r: any) =>
      `- ${r.drug} (${r.gene}, ${r.riskLevel}): ${r.phenotype} — ${r.recommendation}`
    ).join("\n");

    const systemPrompt = `You are a clinical pharmacogenomics expert AI assistant. You analyze genomic variants and drug interactions based on CPIC guidelines. Provide evidence-based, clinically actionable insights. Be precise and use proper pharmacogenomic terminology. Always include disclaimers about clinical review.`;

    const userPrompt = `Analyze this pharmacogenomic report for patient ${patientId}:

## Genomic Variants Detected
${variantSummary}

## CPIC-Based Drug Recommendations
${recSummary}

Provide a comprehensive clinical analysis including:
1. **Patient Risk Summary**: Overall pharmacogenomic risk profile
2. **Critical Drug Alerts**: Most urgent drug-gene interactions requiring immediate attention
3. **Polypharmacy Considerations**: Potential interactions if multiple flagged drugs are co-prescribed
4. **Clinical Action Items**: Prioritized list of actions for the prescribing physician
5. **Genetic Counseling Notes**: Key points to discuss with the patient
6. **Monitoring Recommendations**: Lab tests or monitoring parameters to consider

Format your response in clear sections with markdown.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits in Settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI analysis failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });

  } catch (e) {
    console.error("analyze-pgx error:", e);
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
