import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dna, Shield, Users, Target, Award, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About() {
  const values = [
    {
      icon: Target,
      title: 'Precision Medicine',
      description: 'Delivering personalized treatment recommendations based on individual genetics',
    },
    {
      icon: Shield,
      title: 'Patient Safety',
      description: 'Reducing adverse drug reactions through genomic insights',
    },
    {
      icon: Users,
      title: 'Healthcare Partnership',
      description: 'Empowering providers with evidence-based clinical decision support',
    },
    {
      icon: Award,
      title: 'Clinical Excellence',
      description: 'Following CPIC guidelines and best practices in pharmacogenomics',
    },
  ];

  const team = [
    {
      name: 'Research Team',
      description: 'PharmD and PhD experts in pharmacogenomics',
    },
    {
      name: 'Development Team',
      description: 'Software engineers specializing in healthcare technology',
    },
    {
      name: 'Clinical Advisory Board',
      description: 'Practicing physicians and pharmacists',
    },
  ];

  return (
    <div className="container py-12 space-y-16">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
          About DRUGIFY
        </h1>
        <p className="text-lg text-muted-foreground">
          Transforming healthcare through pharmacogenomics
        </p>
      </motion.div>

      {/* Mission Section */}
      <section className="grid md:grid-cols-2 gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-muted-foreground mb-4">
            DRUGIFY is dedicated to advancing personalized medicine through cutting-edge
            pharmacogenomic analysis. We bridge the gap between genomic data and clinical
            decision-making, helping healthcare providers prescribe the right drug at the right
            dose for each patient.
          </p>
          <p className="text-muted-foreground">
            Our platform analyzes patient genetic variants to predict drug response, enabling
            safer and more effective treatment strategies across multiple therapeutic areas.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-3xl opacity-20" />
            <Dna className="h-48 w-48 text-primary relative" />
          </div>
        </motion.div>
      </section>

      {/* Values Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <value.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                  <CardDescription>{value.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-muted/50 -mx-4 px-4 py-12 rounded-lg">
        <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.description}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Technology Section */}
      <section className="text-center max-w-3xl mx-auto">
        <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-4">Built for Healthcare</h2>
        <p className="text-muted-foreground mb-4">
          DRUGIFY combines clinical pharmacology expertise with modern software engineering to
          deliver a reliable, secure, and user-friendly platform for pharmacogenomic analysis.
        </p>
        <p className="text-muted-foreground">
          We follow CPIC (Clinical Pharmacogenetics Implementation Consortium) guidelines and
          maintain HIPAA compliance to ensure the highest standards of clinical accuracy and
          data security.
        </p>
      </section>
    </div>
  );
}
