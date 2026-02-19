import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Dna, Shield, Zap, Users, CheckCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const features = [
    {
      icon: Dna,
      title: 'Genomic Analysis',
      description: 'Advanced VCF file analysis with CPIC-based recommendations',
    },
    {
      icon: Shield,
      title: 'Secure & Compliant',
      description: 'HIPAA-compliant with enterprise-grade security',
    },
    {
      icon: Zap,
      title: 'Real-Time Results',
      description: 'Get pharmacogenomic insights in seconds',
    },
    {
      icon: Users,
      title: 'Clinical Decision Support',
      description: 'Evidence-based recommendations for healthcare providers',
    },
  ];

  const stats = [
    { label: 'Drugs Supported', value: '6+' },
    { label: 'Analysis Time', value: '<2s' },
    { label: 'Accuracy', value: '99%' },
    { label: 'Users', value: '1000+' },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-background py-20 md:py-32">
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Personalized Medicine Through Pharmacogenomics
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              DRUGIFY empowers healthcare providers with AI-powered pharmacogenomic analysis.
              Make informed prescribing decisions based on individual patient genetics.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link to="/analyzer">
                <Button size="lg" className="gap-2">
                  Start Analysis
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute left-1/2 top-0 -translate-x-1/2 blur-3xl opacity-30">
            <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-blue-600 to-purple-600" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why Choose DRUGIFY?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive pharmacogenomic analysis with cutting-edge technology
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-20 md:py-32">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, fast, and accurate pharmacogenomic analysis
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Upload VCF File',
                description: 'Upload patient genomic data in VCF format',
              },
              {
                step: '2',
                title: 'Select Drugs',
                description: 'Choose specific drugs for analysis',
              },
              {
                step: '3',
                title: 'Get Results',
                description: 'Receive detailed pharmacogenomic recommendations',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mb-4">
                      {item.step}
                    </div>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-8 text-blue-50">
                Join thousands of healthcare providers using DRUGIFY for personalized medicine
              </p>
              <div className="flex items-center justify-center gap-4">
                <Link to="/signup">
                  <Button size="lg" variant="secondary">
                    Sign Up Free
                  </Button>
                </Link>
                <Link to="/analyzer">
                  <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                    Try Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
