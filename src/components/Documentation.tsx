import { Book, Code, Shield, Rocket, FileText, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DocumentationProps {
  onClose: () => void;
}

export default function Documentation({ onClose }: DocumentationProps) {
  const documentationSections = [
    {
      title: "Quick Start",
      icon: Rocket,
      description: "Get started with DRUGIFY in minutes",
      items: [
        { name: "Installation Guide", file: "STARTUP_GUIDE.md" },
        { name: "Quick Reference", file: "QUICK_REFERENCE.md" },
        { name: "Configuration", file: "README.md#configuration" },
      ]
    },
    {
      title: "API Documentation",
      icon: Code,
      description: "Complete API reference and examples",
      items: [
        { name: "API Endpoints", file: "README.md#api-documentation" },
        { name: "Authentication", file: "README.md#security" },
        { name: "Rate Limits", file: "README.md#api-documentation" },
      ]
    },
    {
      title: "Security",
      icon: Shield,
      description: "Security features and best practices",
      items: [
        { name: "Security Audit Report", file: "SECURITY_AUDIT_REPORT.md" },
        { name: "Security Summary", file: "SECURITY_SUMMARY.md" },
        { name: "Production Checklist", file: "PRODUCTION_READY_CHECKLIST.md" },
      ]
    },
    {
      title: "Deployment",
      icon: FileText,
      description: "Deploy DRUGIFY to production",
      items: [
        { name: "Production Deployment", file: "PRODUCTION_DEPLOYMENT.md" },
        { name: "Production Ready Summary", file: "PRODUCTION_READY_SUMMARY.md" },
        { name: "Docker Setup", file: "README.md#deployment" },
      ]
    }
  ];

  const openDocumentation = (file: string) => {
    // Open documentation file in new tab
    const baseUrl = window.location.origin;
    const githubUrl = `https://github.com/yourusername/drugify/blob/main/${file}`;
    window.open(githubUrl, '_blank');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Book className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Documentation</h1>
          </div>
          <p className="text-muted-foreground">
            Comprehensive guides and references for DRUGIFY
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Back to Dashboard
        </Button>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {documentationSections.map((section, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <section.icon className="h-5 w-5 text-primary" />
                <CardTitle className="text-lg">{section.title}</CardTitle>
              </div>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {section.items.map((item, idx) => (
                  <li key={idx}>
                    <button
                      onClick={() => openDocumentation(item.file)}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Documentation Tabs */}
      <Tabs defaultValue="getting-started" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
          <TabsTrigger value="api">API Reference</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
        </TabsList>

        <TabsContent value="getting-started" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Getting Started with DRUGIFY</CardTitle>
              <CardDescription>
                Follow these steps to set up and run DRUGIFY
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">1. Prerequisites</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Python 3.11 or higher</li>
                  <li>Node.js 24.11.0 or higher</li>
                  <li>npm or yarn package manager</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">2. Installation</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`# Clone the repository
git clone https://github.com/yourusername/drugify.git
cd pharmaguard-clinical-insights-main

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
pip install -r requirements.txt`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">3. Configuration</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`# Create environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Generate secret key
openssl rand -hex 32`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">4. Run the Application</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`# Terminal 1: Start Backend
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Frontend
npm run dev`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>
                Complete API documentation for DRUGIFY
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Health Check</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`GET /health

Response:
{
  "status": "healthy",
  "service": "drugify",
  "environment": "development",
  "database": "connected"
}`}</code>
                </pre>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Analyze VCF</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`POST /api/v1/analyze
Content-Type: application/json

Request:
{
  "patient_id": "PT-2024-001",
  "vcf_content": "##fileformat=VCFv4.2\\n...",
  "notes": "Optional clinical notes"
}

Response:
{
  "report_id": "RPT-ABC123",
  "patient_id": "PT-2024-001",
  "generated_at": "2026-02-19T12:00:00Z",
  "summary": {
    "total_variants": 150,
    "clinically_relevant": 8,
    "high_risk_drugs": 3,
    "moderate_risk_drugs": 5
  },
  "recommendations": [...],
  "variants": [...]
}`}</code>
                </pre>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
                  Rate Limits
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  10 requests per minute per IP address
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Features</CardTitle>
              <CardDescription>
                DRUGIFY is built with security as a top priority
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Security Score: 82/100 🟢</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Production-ready with comprehensive security features
                </p>
              </div>

              <div className="grid gap-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-sm">JWT Authentication</p>
                    <p className="text-xs text-muted-foreground">
                      Secure token-based authentication framework
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-sm">Rate Limiting</p>
                    <p className="text-xs text-muted-foreground">
                      10 requests per minute per IP address
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-sm">Input Validation</p>
                    <p className="text-xs text-muted-foreground">
                      Comprehensive validation and sanitization
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-sm">Security Headers</p>
                    <p className="text-xs text-muted-foreground">
                      CSP, HSTS, X-Frame-Options, and more
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-green-500" />
                  <div>
                    <p className="font-medium text-sm">Patient ID Anonymization</p>
                    <p className="text-xs text-muted-foreground">
                      Hashed patient IDs in logs for privacy
                    </p>
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => openDocumentation('SECURITY_AUDIT_REPORT.md')}
              >
                View Full Security Audit Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Deployment</CardTitle>
              <CardDescription>
                Deploy DRUGIFY to production environments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Pre-Deployment Checklist</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Rotate all API keys and secrets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Set ENVIRONMENT=production and DEBUG=False</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Migrate to PostgreSQL database</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Set up SSL/HTTPS certificates</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Configure Redis for rate limiting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded" />
                    <span>Set up monitoring (Sentry, DataDog, etc.)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Docker Deployment</h3>
                <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{`# Build and run with Docker Compose
docker-compose up -d`}</code>
                </pre>
              </div>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => openDocumentation('PRODUCTION_DEPLOYMENT.md')}
              >
                View Complete Deployment Guide
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Additional Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
          <CardDescription>
            More documentation and helpful links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => openDocumentation('README.md')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Complete README
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => openDocumentation('STARTUP_GUIDE.md')}
            >
              <Rocket className="h-4 w-4 mr-2" />
              Startup Guide
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => openDocumentation('QUICK_REFERENCE.md')}
            >
              <Book className="h-4 w-4 mr-2" />
              Quick Reference
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() => window.open('http://localhost:8000/docs', '_blank')}
            >
              <Code className="h-4 w-4 mr-2" />
              API Docs (Dev)
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
