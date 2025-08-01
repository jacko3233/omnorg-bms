import { ArrowLeft, Plus, Edit, ShoppingCart, Briefcase, Clock, AlertCircle, CheckCircle, FileText } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Job, Client } from "@shared/schema";

interface CompanyConfig {
  name: string;
  tagline: string;
}

// White-label configuration - easily customizable
const companyConfig: CompanyConfig = {
  name: "OMNOR GROUP",
  tagline: "Built from the North. Delivered Worldwide."
};

export default function Hire() {
  const [activeTab, setActiveTab] = useState<'actions' | 'live-jobs'>('actions');
  const [, setLocation] = useLocation();

  // Fetch real jobs from database
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  // Fetch clients for reference
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Filter jobs for hire department with useMemo optimization
  const hireJobs = useMemo(() => 
    jobs.filter(job => job.department === 'HIRE' || job.jobLes?.startsWith('LEH')), 
    [jobs]
  );

  // Create client lookup map with useMemo optimization
  const clientMap = useMemo(() => 
    clients.reduce((acc, client) => {
      acc[client.id] = client;
      return acc;
    }, {} as Record<string, Client>), 
    [clients]
  );

  const hireActions = [
    {
      name: "NEW JOB",
      code: "LEH",
      icon: Plus,
      onClick: () => setLocation("/hire/new-job")
    },
    {
      name: "UPDATE JOBS",
      code: "LEH", 
      icon: Edit,
      onClick: () => setLocation("/hire/live-jobs")
    },
    {
      name: "RAISE PURCHASE ORDER",
      code: "",
      icon: ShoppingCart,
      onClick: () => setLocation("/purchase-orders")
    }
  ];

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Clock className="w-4 h-4" />;
      case 'IN_PROGRESS': return <AlertCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <button className="flex items-center space-x-2 bg-white text-red-600 rounded-lg p-2 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back</span>
              </button>
            </Link>
            <div className="bg-white text-red-600 rounded-lg p-3 font-bold text-lg">
              {companyConfig.name.toUpperCase()}
            </div>
            <span className="text-lg font-medium">{companyConfig.tagline}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">HIRE DEPARTMENT</h1>
          <p className="text-xl text-gray-600">Equipment • Resources • Personnel Management</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-4 mb-8">
          <button
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'actions' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setActiveTab('actions')}
          >
            <div className="flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Actions</span>
            </div>
          </button>
          <button
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              activeTab === 'live-jobs' 
                ? 'bg-red-600 text-white' 
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => setLocation("/hire/live-jobs")}
          >
            <div className="flex items-center space-x-2">
              <Briefcase className="w-5 h-5" />
              <span>Live Jobs</span>
            </div>
          </button>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'actions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - Action Buttons */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">QUICK ACTIONS</h2>
              
              {/* Action Buttons */}
              {hireActions.map((action, index) => (
                <button
                  key={action.name}
                  className="department-button animate-slide-up w-full"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={action.onClick}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <action.icon className="w-6 h-6" />
                      <span className="text-xl font-bold">
                        {action.name} {action.code && `(${action.code})`}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column - Department Overview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Department Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Hire Jobs</span>
                      <span className="text-2xl font-bold text-blue-600">{hireJobs.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Active Jobs</span>
                      <span className="text-2xl font-bold text-yellow-600">
                        {hireJobs.filter(job => job.jobStatus === 'OPEN' || job.jobStatus === 'IN_PROGRESS').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Completed Jobs</span>
                      <span className="text-2xl font-bold text-green-600">
                        {hireJobs.filter(job => job.jobStatus === 'COMPLETED').length}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => setLocation('/hire/new-job')} 
                      className="w-full bg-red-600 hover:bg-red-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Hire Job
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation('/hire/live-jobs')} 
                      className="w-full"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Manage All Jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'live-jobs' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">LIVE HIRE JOBS</h2>
            
            {jobsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading jobs...</p>
              </div>
            ) : hireJobs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Hire Jobs Found</h3>
                  <p className="text-gray-600 mb-4">Get started by creating your first hire job.</p>
                  <Button onClick={() => setLocation('/hire/new-job')} className="bg-red-600 hover:bg-red-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Hire Job
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {hireJobs.map((job: Job, index) => (
                  <Card 
                    key={job.id}
                    className="hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => setLocation(`/hire/job/${job.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-800 mb-1">{job.jobLes}</h3>
                          <p className="text-gray-600 mb-2">{job.description || 'No description'}</p>
                          <p className="text-sm text-gray-500">
                            Client: {job.clientId ? clientMap[job.clientId]?.companyName || 'Unknown' : 'No client assigned'}
                          </p>
                        </div>
                        <Badge className={`${getStatusColor(job.jobStatus)} flex items-center gap-1`}>
                          {getJobStatusIcon(job.jobStatus)}
                          {job.jobStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">PM:</span>
                          <span className="ml-1 font-medium">{job.pm || 'Unassigned'}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <span className="ml-1 font-medium">
                            {job.date ? new Date(job.date).toLocaleDateString() : 'No date'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <span className="ml-1 font-medium text-green-600">£{job.costNett || '0.00'}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}