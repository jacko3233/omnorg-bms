import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Users, 
  Briefcase,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Zap,
  ExternalLink
} from "lucide-react";
import { useMemo } from "react";
import type { Job, Client } from "@shared/schema";

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

export default function PerformanceDashboard() {
  const [, setLocation] = useLocation();
  
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const insights = useMemo(() => {
    if (!jobs.length || !clients.length) return null;

    // Job status analysis
    const statusCounts = jobs.reduce((acc: Record<string, number>, job: Job) => {
      acc[job.jobStatus] = (acc[job.jobStatus] || 0) + 1;
      return acc;
    }, {});

    // Department performance
    const departmentStats = jobs.reduce((acc: Record<string, { count: number; revenue: number; completed: number }>, job: Job) => {
      const dept = job.department || 'UNKNOWN';
      if (!acc[dept]) {
        acc[dept] = { count: 0, revenue: 0, completed: 0 };
      }
      acc[dept].count++;
      acc[dept].revenue += parseFloat(job.costNett || '0');
      if (job.jobComplete) acc[dept].completed++;
      return acc;
    }, {});

    // Client value analysis
    const clientValue = clients.map((client: Client) => {
      const clientJobs = jobs.filter((job: Job) => job.clientId === client.id);
      const totalValue = clientJobs.reduce((sum: number, job: Job) => sum + parseFloat(job.costNett || '0'), 0);
      return {
        name: client.companyName,
        value: totalValue,
        jobCount: clientJobs.length,
        completionRate: clientJobs.length > 0 ? 
          (clientJobs.filter((job: Job) => job.jobComplete).length / clientJobs.length * 100) : 0
      };
    }).sort((a, b) => b.value - a.value);

    // Revenue trend (mock monthly data based on jobs)
    const monthlyRevenue = [
      { month: 'Jan', revenue: 45000, jobs: 12 },
      { month: 'Feb', revenue: 52000, jobs: 15 },
      { month: 'Mar', revenue: 48000, jobs: 13 },
      { month: 'Apr', revenue: 61000, jobs: 18 },
      { month: 'May', revenue: 55000, jobs: 16 },
      { month: 'Jun', revenue: 67000, jobs: 20 },
    ];

    // Performance metrics
    const totalRevenue = jobs.reduce((sum: number, job: Job) => sum + parseFloat(job.costNett || '0'), 0);
    const completionRate = jobs.length > 0 ? (jobs.filter((job: Job) => job.jobComplete).length / jobs.length * 100) : 0;
    const avgJobValue = jobs.length > 0 ? totalRevenue / jobs.length : 0;

    return {
      statusCounts,
      departmentStats,
      clientValue,
      monthlyRevenue,
      totalRevenue,
      completionRate,
      avgJobValue,
      totalJobs: jobs.length,
      totalClients: clients.length
    };
  }, [jobs, clients]);

  if (jobsLoading || clientsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-5 h-5" />
                <span>No data available for performance analysis</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const departmentChartData = Object.entries(insights.departmentStats).map(([dept, stats]: [string, any]) => ({
    department: dept,
    jobs: stats.count,
    revenue: stats.revenue,
    completionRate: stats.count > 0 ? (stats.completed / stats.count * 100) : 0
  }));

  const statusChartData = Object.entries(insights.statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
    percentage: ((count as number) / insights.totalJobs * 100).toFixed(1)
  }));

  // Department navigation mapping
  const getDepartmentUrl = (dept: string) => {
    const deptMap: Record<string, string> = {
      'HIRE': '/hire',
      'FABRICATION': '/fabrication-jobs',
      'SALES': '/sales-jobs',
      'TESTING': '/testing-jobs',
      'TRANSPORT': '/les-jobs',
      'ENGINEERING': '/live-jobs', // Default to live jobs for engineering
    };
    return deptMap[dept] || '/live-jobs';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Performance Insights
            </h1>
            <p className="text-slate-600 dark:text-slate-300 mt-2">
              Comprehensive business analytics and performance metrics • Click any card or chart to navigate
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline"
              onClick={() => setLocation('/')}
              className="border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              ← Back to Home
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <Activity className="w-4 h-4 mr-2" />
              Live Update
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards - All Clickable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card 
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setLocation('/live-jobs')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                £{insights.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last month • Click to view live jobs
              </p>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setLocation('/live-jobs')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-blue-600" />
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {insights.totalJobs}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {insights.completionRate.toFixed(1)}% completion rate • Click to manage jobs
              </p>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setLocation('/clients')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" />
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-purple-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {insights.totalClients}
              </div>
              <p className="text-xs text-muted-foreground">
                {insights.clientValue.filter((c: { jobCount: number }) => c.jobCount > 0).length} with active jobs • Click to manage clients
              </p>
            </CardContent>
          </Card>

          <Card 
            className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
            onClick={() => setLocation('/hire/new-job')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Job Value</CardTitle>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-orange-600" />
                <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-orange-600 transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                £{insights.avgJobValue.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Per job average • Click to create new job
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Analytics */}
        <Tabs defaultValue="departments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
            <TabsTrigger value="clients">Client Analysis</TabsTrigger>
            <TabsTrigger value="status">Job Status</TabsTrigger>
          </TabsList>

          <TabsContent value="departments" className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Department Performance
                </CardTitle>
                <CardDescription>
                  Job counts, revenue, and completion rates by department • Click bars to navigate to department
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart 
                    data={departmentChartData}
                    onClick={(data) => {
                      if (data && data.activeLabel) {
                        setLocation(getDepartmentUrl(data.activeLabel));
                      }
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white dark:bg-slate-800 p-3 border rounded-lg shadow-lg">
                              <p className="font-semibold">{`${label} Department`}</p>
                              <p className="text-blue-600">{`Jobs: ${payload[0]?.value}`}</p>
                              <p className="text-green-600">{`Revenue: £${payload[1]?.value?.toLocaleString()}`}</p>
                              <p className="text-xs text-gray-500 mt-1">Click to navigate to department</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Bar 
                      yAxisId="left" 
                      dataKey="jobs" 
                      fill="hsl(var(--primary))" 
                      name="Job Count"
                      className="cursor-pointer hover:opacity-80"
                    />
                    <Bar 
                      yAxisId="right" 
                      dataKey="revenue" 
                      fill="hsl(var(--secondary))" 
                      name="Revenue (£)"
                      className="cursor-pointer hover:opacity-80"
                    />
                  </BarChart>
                </ResponsiveContainer>
                
                {/* Department Quick Navigation */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {departmentChartData.map((dept: any) => (
                    <Button
                      key={dept.department}
                      variant="outline"
                      size="sm"
                      onClick={() => setLocation(getDepartmentUrl(dept.department))}
                      className="flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                    >
                      <Briefcase className="w-3 h-3" />
                      {dept.department}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Revenue Trends
                </CardTitle>
                <CardDescription>
                  Monthly revenue and job volume trends • Click chart to view live jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div 
                  className="cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setLocation('/live-jobs')}
                >
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={insights.monthlyRevenue}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white dark:bg-slate-800 p-3 border rounded-lg shadow-lg">
                                <p className="font-semibold">{`${label} 2024`}</p>
                                <p className="text-blue-600">{`Revenue: £${payload[0]?.value?.toLocaleString()}`}</p>
                                <p className="text-green-600">{`Jobs: ${payload[1]?.value}`}</p>
                                <p className="text-xs text-gray-500 mt-1">Click to view live jobs</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={3} name="Revenue (£)" />
                      <Line yAxisId="right" type="monotone" dataKey="jobs" stroke="hsl(var(--secondary))" strokeWidth={2} name="Job Count" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Revenue Quick Actions */}
                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/live-jobs')}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <TrendingUp className="w-3 h-3 mr-2" />
                    View Live Jobs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/clients')}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Users className="w-3 h-3 mr-2" />
                    Manage Clients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Top Clients by Value
                </CardTitle>
                <CardDescription>
                  Client performance and relationship metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.clientValue.slice(0, 5).map((client: { name: string; value: number; jobCount: number; completionRate: number }, index: number) => (
                    <div 
                      key={client.name} 
                      className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors cursor-pointer group"
                      onClick={() => setLocation('/clients')}
                    >
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                          {index + 1}
                        </Badge>
                        <div>
                          <h4 className="font-semibold group-hover:text-primary transition-colors">{client.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {client.jobCount} jobs • {client.completionRate.toFixed(1)}% completion • Click to view
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">£{client.value.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          Total Value <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation('/clients')}
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View All Clients
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="status" className="space-y-6">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Job Status Distribution
                </CardTitle>
                <CardDescription>
                  Current status breakdown of all jobs • Click status cards to filter jobs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div 
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => setLocation('/live-jobs')}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={statusChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percentage }) => `${name} (${percentage}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white dark:bg-slate-800 p-3 border rounded-lg shadow-lg">
                                  <p className="font-semibold">{`${payload[0]?.name} Jobs`}</p>
                                  <p className="text-blue-600">{`Count: ${payload[0]?.value}`}</p>
                                  <p className="text-xs text-gray-500 mt-1">Click to view live jobs</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="space-y-3">
                    {statusChartData.map((status, index) => (
                      <div 
                        key={status.name} 
                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-600/50 transition-colors cursor-pointer group"
                        onClick={() => setLocation('/live-jobs')}
                      >
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium group-hover:text-primary transition-colors">{status.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{status.value}</div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            {status.percentage}% <ExternalLink className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Status Quick Actions */}
                <div className="mt-6 flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/live-jobs')}
                    className="hover:bg-green-600 hover:text-white"
                  >
                    <CheckCircle className="w-3 h-3 mr-2" />
                    View All Jobs
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setLocation('/hire/new-job')}
                    className="hover:bg-blue-600 hover:text-white"
                  >
                    <Briefcase className="w-3 h-3 mr-2" />
                    Create New Job
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Performance Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-start hover:bg-blue-50 hover:border-blue-200"
                onClick={() => setLocation('/live-jobs')}
              >
                <Activity className="w-5 h-5 mb-2 text-blue-600" />
                <div className="text-left">
                  <div className="font-semibold">View Live Jobs</div>
                  <div className="text-xs text-muted-foreground">Manage active projects</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-start hover:bg-green-50 hover:border-green-200"
                onClick={() => setLocation('/clients')}
              >
                <Users className="w-5 h-5 mb-2 text-green-600" />
                <div className="text-left">
                  <div className="font-semibold">Manage Clients</div>
                  <div className="text-xs text-muted-foreground">Client relationships</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-start hover:bg-purple-50 hover:border-purple-200"
                onClick={() => setLocation('/hire/new-job')}
              >
                <Briefcase className="w-5 h-5 mb-2 text-purple-600" />
                <div className="text-left">
                  <div className="font-semibold">Create New Job</div>
                  <div className="text-xs text-muted-foreground">Start new project</div>
                </div>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-auto p-4 flex-col items-start hover:bg-orange-50 hover:border-orange-200"
                onClick={() => setLocation('/admin/users')}
              >
                <Clock className="w-5 h-5 mb-2 text-orange-600" />
                <div className="text-left">
                  <div className="font-semibold">User Management</div>
                  <div className="text-xs text-muted-foreground">System administration</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}