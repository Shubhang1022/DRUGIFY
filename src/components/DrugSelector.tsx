import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, Pill, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

interface Drug {
  drug: string;
  primary_gene: string;
  description: string;
  category: string;
}

interface DrugSelectorProps {
  value: string[];
  onChange: (drugs: string[]) => void;
  error?: string;
}

export default function DrugSelector({ value, onChange, error }: DrugSelectorProps) {
  const [open, setOpen] = useState(false);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    // Small delay to ensure backend is ready
    const timer = setTimeout(() => {
      fetchDrugs();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const fetchDrugs = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
      const url = `${API_URL}/api/v1/drugs`;
      
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add mode to handle CORS
        mode: "cors",
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || !data.supported_drugs) {
        throw new Error("Invalid response format from API");
      }
      
      setDrugs(data.supported_drugs || []);
      setFetchError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      const detailedError = `Failed to load drug list: ${errorMessage}. Please ensure the backend server is running on ${import.meta.env.VITE_API_URL || "http://localhost:8000"}`;
      setFetchError(detailedError);
      console.error("Error fetching drugs:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDrug = (drugName: string) => {
    if (!value || !Array.isArray(value)) {
      onChange([drugName]);
      return;
    }
    const newValue = value.includes(drugName)
      ? value.filter((d) => d !== drugName)
      : [...value, drugName];
    onChange(newValue);
  };

  const getSelectedDrugInfo = () => {
    if (!value || !Array.isArray(value) || !drugs || !Array.isArray(drugs)) {
      return [];
    }
    return value.map((drugName) => drugs.find((d) => d.drug === drugName)).filter(Boolean) as Drug[];
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-4">
        <p className="text-sm text-muted-foreground">Loading drugs...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <p className="text-sm text-destructive font-semibold">Connection Error</p>
        </div>
        <p className="text-sm text-destructive mb-3">{fetchError}</p>
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Troubleshooting steps:
          </p>
          <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1">
            <li>Ensure the backend server is running on port 8000</li>
            <li>Check if the API URL is correct: {import.meta.env.VITE_API_URL || "http://localhost:8000"}</li>
            <li>Verify CORS is configured correctly</li>
            <li>Check browser console for detailed error messages</li>
          </ul>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDrugs}
          className="mt-3"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between",
              error && "border-destructive",
              value.length === 0 && "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-2">
              <Pill className="h-4 w-4" />
              {!value || value.length === 0
                ? "Select drug(s) to analyze..."
                : `${value.length} drug${value.length > 1 ? "s" : ""} selected`}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search drugs..." />
            <CommandEmpty>No drug found.</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {drugs.map((drug) => (
                <CommandItem
                  key={drug.drug}
                  value={drug.drug}
                  onSelect={() => toggleDrug(drug.drug)}
                  className="cursor-pointer"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value && value.includes(drug.drug) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{drug.drug}</div>
                    <div className="text-xs text-muted-foreground">
                      {drug.description} • Gene: {drug.primary_gene}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Selected drugs preview */}
      {value && value.length > 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-3 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Selected Drug → Gene Mapping
          </p>
          <div className="flex flex-wrap gap-2">
            {getSelectedDrugInfo().map((drug) => (
              <Badge
                key={drug.drug}
                variant="secondary"
                className="gap-1.5 py-1.5 px-3"
              >
                <span className="font-semibold">{drug.drug}</span>
                <span className="text-muted-foreground">→</span>
                <span className="text-primary">{drug.primary_gene}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
