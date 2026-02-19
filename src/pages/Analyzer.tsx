import { useState } from "react";
import { Dna, Shield, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import VcfUploader from "@/components/VcfUploader";
import ReportViewer from "@/components/ReportViewer";
import Documentation from "@/components/Documentation";
import type { ClinicalReport } from "@/lib/types";

type ViewMode = "dashboard" | "documentation" | "api";

const Index = () => {
  const [report, setReport] = useState<ClinicalReport | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>("dashboard");

  const handleNavigation = (view: ViewMode) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setReport(null); // Clear report when switching views
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              DRUGIFY
            </span>
            <span className="hidden rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-accent-foreground sm:inline">
              Clinical
            </span>
          </div>

          <nav className="hidden items-center gap-6 text-sm md:flex">
            <button
              onClick={() => handleNavigation("dashboard")}
              className={`transition-colors ${
                currentView === "dashboard"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => handleNavigation("documentation")}
              className={`transition-colors ${
                currentView === "documentation"
                  ? "font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Documentation
            </button>
            <button
              onClick={() => window.open("http://localhost:8000/docs", "_blank")}
              className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
            >
              API
            </button>
          </nav>

          <button
            className="md:hidden text-muted-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border md:hidden overflow-hidden"
            >
              <nav className="flex flex-col gap-1 px-4 py-2 text-sm">
                <button
                  onClick={() => handleNavigation("dashboard")}
                  className={`py-2 text-left ${
                    currentView === "dashboard"
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => handleNavigation("documentation")}
                  className={`py-2 text-left ${
                    currentView === "documentation"
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Documentation
                </button>
                <button
                  onClick={() => window.open("http://localhost:8000/docs", "_blank")}
                  className="py-2 text-left text-muted-foreground"
                >
                  API
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-4 py-8">
        <AnimatePresence mode="wait">
          {currentView === "documentation" ? (
            <Documentation key="documentation" onClose={() => handleNavigation("dashboard")} />
          ) : (
            <>
              {/* Hero section — only show when no report */}
              {!report && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Dna className="h-6 w-6 text-primary" />
                    <h1 className="text-2xl font-bold text-foreground">
                      Pharmacogenomic Analysis
                    </h1>
                  </div>
                  <p className="max-w-2xl text-muted-foreground">
                    Upload a patient VCF file to predict drug response risk using CPIC-style
                    pharmacogenomic rules. Generates an explainable clinical report with
                    actionable drug recommendations.
                  </p>
                </motion.div>
              )}

              {report ? (
                <ReportViewer
                  key="report"
                  report={report}
                  onBack={() => setReport(null)}
                />
              ) : (
                <VcfUploader key="uploader" onReportGenerated={setReport} />
              )}
            </>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        DRUGIFY v1.0 · Clinical Decision Support · For Research Use Only
      </footer>
    </div>
  );
};

export default Index;
