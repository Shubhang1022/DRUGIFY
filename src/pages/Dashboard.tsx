import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Clock, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnalysisHistory {
  id: string;
  created_at: string;
  patient_id: string;
  drugs_analyzed: string[];
  risk_count: {
    safe: number;
    adjust: number;
    ineffective: number;
    toxicity: number;
    unknown: number;
  };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState<AnalysisHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch analysis history from Supabase
    // For now, using mock data
    setTimeout(() => {
      setHistory([]);
      setLoading(false);
    }, 500);
  }, []);

  const stats = [
    {
      title: 'Total Analyses',
      value: history.length.toString(),
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      title: 'This Month',
      value: '0',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      title: 'Last Analysis',
      value: history.length > 0 ? 'Today' : 'Never',
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      title: 'Active',
      value: user ? 'Yes' : 'No',
      icon: Activity,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20',
    },
  ];

  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back, {user?.user_metadata?.full_name || user?.email}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Start a new analysis or view your history</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Link to="/analyzer">
            <Button className="gap-2">
              <FileText className="h-4 w-4" />
              New Analysis
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="outline">Learn More</Button>
          </Link>
        </CardContent>
      </Card>

      {/* Analysis History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Analyses</CardTitle>
          <CardDescription>Your pharmacogenomic analysis history</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
              <p className="text-muted-foreground mb-4">
                Start your first pharmacogenomic analysis
              </p>
              <Link to="/analyzer">
                <Button>Start Analysis</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <p className="font-medium">Patient: {item.patient_id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Drugs: {item.drugs_analyzed.join(', ')}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View Report
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
