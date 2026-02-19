import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, FileText, AlertTriangle, Loader2, Beaker } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DrugSelector from "@/components/DrugSelector";
import { uploadFormSchema, type UploadFormData, type ClinicalReport } from "@/lib/types";
import { generateDemoVcf } from "@/lib/pharmaguard-engine";

interface VcfUploaderProps {
  onReportGenerated: (report: ClinicalReport) => void;
}

export default function VcfUploader({ onReportGenerated }: VcfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<UploadFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: { patientId: "", drugs: [], notes: "" },
  });

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setError(null);
    setFile(null);
    
    // Handle rejected files first
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rejection = rejectedFiles[0];
      const file = rejection.file;
      
      // Check file extension
      if (!file.name.toLowerCase().endsWith(".vcf")) {
        setError(
          `❌ Invalid file type: "${file.name}"\n\n` +
          `Only VCF files are accepted. Please upload a file with .vcf extension.\n\n` +
          `File type detected: ${file.type || "unknown"}`
        );
        return;
      }
      
      // Check file size
      if (file.size > 5 * 1024 * 1024) {
        setError(
          `❌ File too large: "${file.name}"\n\n` +
          `File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB\n` +
          `Maximum allowed: 5 MB\n\n` +
          `Please compress your file or upload a smaller VCF file.`
        );
        return;
      }
      
      // Generic rejection error
      setError(
        `❌ File rejected: "${file.name}"\n\n` +
        `Please ensure your file:\n` +
        `• Has a .vcf extension\n` +
        `• Is under 5 MB in size\n` +
        `• Is in VCF v4.2 format`
      );
      return;
    }
    
    // Handle accepted files
    const f = acceptedFiles[0];
    if (!f) {
      setError(
        `❌ No file selected\n\n` +
        `Please drag and drop a VCF file or click to browse.`
      );
      return;
    }
    
    // Double-check file extension (extra validation)
    if (!f.name.toLowerCase().endsWith(".vcf")) {
      setError(
        `❌ Wrong file format: "${f.name}"\n\n` +
        `This application only accepts VCF (Variant Call Format) files.\n\n` +
        `Expected: .vcf extension\n` +
        `Received: ${f.name.split('.').pop()?.toUpperCase() || "unknown"} file\n\n` +
        `Please upload a valid VCF file to proceed.`
      );
      return;
    }
    
    // Check file size (extra validation)
    if (f.size > 5 * 1024 * 1024) {
      setError(
        `❌ File exceeds size limit: "${f.name}"\n\n` +
        `Current size: ${(f.size / (1024 * 1024)).toFixed(2)} MB\n` +
        `Maximum allowed: 5.00 MB\n\n` +
        `Please reduce the file size or upload a different VCF file.`
      );
      return;
    }
    
    // Check if file is empty
    if (f.size === 0) {
      setError(
        `❌ Empty file: "${f.name}"\n\n` +
        `The uploaded file appears to be empty (0 bytes).\n\n` +
        `Please upload a valid VCF file with genomic data.`
      );
      return;
    }
    
    // File is valid
    setFile(f);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { 
      "text/plain": [".vcf"],
      "application/octet-stream": [".vcf"]
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
  });

  const processAnalysis = async (vcfContent: string, patientId: string, selectedDrugs: string[]) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      // Validate drugs are selected
      if (!selectedDrugs || selectedDrugs.length === 0) {
        throw new Error("At least one drug must be selected");
      }

      // Get API URL from environment or use default
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      
      // Call backend API
      const response = await fetch(`${API_URL}/api/v1/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patient_id: patientId,
          vcf_content: vcfContent,
          drugs: selectedDrugs,
          notes: "", // Can be added later if needed
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        const errorMessage = errorData.detail || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const report = await response.json();
      
      if (report && onReportGenerated) {
        onReportGenerated(report);
      } else {
        throw new Error("Failed to generate report - invalid response");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(
        `❌ Analysis Failed\n\n` +
        `Failed to analyze the VCF file.\n\n` +
        `Error details: ${errorMessage}\n\n` +
        `Please ensure:\n` +
        `• The file is in VCF v4.2 format\n` +
        `• At least one drug is selected\n` +
        `• The backend server is running\n` +
        `• The file contains valid genomic variant data\n\n` +
        `Try the "Run Demo" button to see a working example.`
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const onSubmit = async (data: UploadFormData) => {
    if (!file) {
      setError(
        `❌ No file uploaded\n\n` +
        `Please upload a VCF file before proceeding with the analysis.`
      );
      return;
    }
    
    try {
      const content = await file.text();
      
      // Validate VCF content
      if (!content.trim()) {
        setError(
          `❌ Empty file content: "${file.name}"\n\n` +
          `The file appears to be empty or contains no readable data.\n\n` +
          `Please upload a valid VCF file with genomic variants.`
        );
        return;
      }
      
      // Check if file starts with VCF header
      if (!content.trim().startsWith("##fileformat=VCF")) {
        setError(
          `❌ Invalid VCF format: "${file.name}"\n\n` +
          `This file does not appear to be a valid VCF file.\n\n` +
          `VCF files must start with: ##fileformat=VCF\n` +
          `Your file starts with: ${content.trim().substring(0, 50)}...\n\n` +
          `Please upload a properly formatted VCF v4.2 file.`
        );
        return;
      }
      
      await processAnalysis(content, data.patientId, data.drugs);
    } catch (err) {
      setError(
        `❌ Failed to read file: "${file.name}"\n\n` +
        `There was an error reading the file content.\n\n` +
        `Error: ${err instanceof Error ? err.message : "Unknown error"}\n\n` +
        `Please ensure the file is not corrupted and try again.`
      );
    }
  };

  const handleDemo = async () => {
    setValue("patientId", "DEMO-PGX-001");
    setValue("drugs", ["CODEINE"]);
    const demoVcf = generateDemoVcf();
    setFile(new File([demoVcf], "demo_sample.vcf", { type: "text/plain" }));
    await processAnalysis(demoVcf, "DEMO-PGX-001", ["CODEINE"]);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-card-foreground">Upload VCF File</h2>
            <p className="text-sm text-muted-foreground">
              Upload a VCF v4.2 genomic file for pharmacogenomic analysis
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDemo}
            disabled={isAnalyzing}
            className="gap-2"
          >
            <Beaker className="h-4 w-4" />
            Run Demo
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* File Format Info */}
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  Accepted File Format
                </p>
                <ul className="text-xs text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• <strong>Format:</strong> VCF (Variant Call Format) v4.2</li>
                  <li>• <strong>Extension:</strong> .vcf only</li>
                  <li>• <strong>Max Size:</strong> 5 MB</li>
                  <li>• <strong>Max Variants:</strong> 100,000</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors
              ${isDragActive ? "border-primary bg-accent" : "border-border hover:border-primary/50 hover:bg-muted/50"}
              ${file ? "border-success bg-success/5" : ""}
            `}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              {file ? (
                <>
                  <FileText className="h-10 w-10 text-success" />
                  <div>
                    <p className="font-medium text-card-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024).toFixed(1)} KB — Click or drag to replace
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-muted-foreground" />
                  <div>
                    <p className="font-medium text-card-foreground">
                      {isDragActive ? "Drop your VCF file here" : "Drag & drop a VCF file"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Or click to browse — VCF v4.2 format only, max 5 MB
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Patient ID */}
          <div className="space-y-2">
            <Label htmlFor="patientId">Patient ID *</Label>
            <Input
              id="patientId"
              placeholder="e.g., PT-2024-00123"
              {...register("patientId")}
              className={errors.patientId ? "border-destructive" : ""}
            />
            {errors.patientId && (
              <p className="text-sm text-destructive">{errors.patientId.message}</p>
            )}
          </div>

          {/* Drug Selection */}
          <div className="space-y-2">
            <Label htmlFor="drugs">Drug Selection *</Label>
            <Controller
              name="drugs"
              control={control}
              render={({ field }) => (
                <DrugSelector
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.drugs?.message}
                />
              )}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Clinical Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional context for the analysis..."
              rows={3}
              {...register("notes")}
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="flex items-start gap-3 rounded-lg border-2 border-destructive bg-destructive/10 p-4">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-destructive mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-semibold text-destructive">Upload Error</p>
                    <pre className="text-sm text-destructive/90 whitespace-pre-wrap font-sans">
                      {error}
                    </pre>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            type="submit"
            disabled={isAnalyzing || !file}
            className="w-full gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing Variants...
              </>
            ) : (
              <>
                <Beaker className="h-4 w-4" />
                Analyze Pharmacogenomics
              </>
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  );
}
