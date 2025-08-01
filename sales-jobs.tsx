import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, Edit, ArrowLeft, Users, Calendar, DollarSign, FileText, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import type { Job, Client } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import JobEditModal from "@/components/JobEditModal";
import omnorLogo from "@assets/omnorgroup_logo_1753734315943.png";

interface JobWithClient extends Job {
  clientName?: string;
}

export default function SalesJobs() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedJob, setSelectedJob] = useState<JobWithClient | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editJobId, setEditJobId] = useState<string>('');
  const queryClient = useQueryClient();

  // Fetch jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ["/api/jobs"],
  });

  // Fetch clients
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // Filter jobs for sales department with useMemo optimization
  const salesJobs = useMemo(() => 
    jobs.filter(job => job.department === 'SALES' || job.jobLes?.startsWith('LES')), 
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

  // Add client names to jobs with useMemo optimization
  const jobsWithClients: JobWithClient[] = useMemo(() => 
    salesJobs.map(job => ({
      ...job,
      clientName: job.clientId ? clientMap[job.clientId]?.companyName : 'No Client'
    })), 
    [salesJobs, clientMap]
  );

  // Filter jobs with useMemo optimization
  const filteredJobs = useMemo(() => 
    jobsWithClients.filter(job => {
      const matchesSearch = job.jobLes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            job.clientName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || job.jobStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    }), 
    [jobsWithClients, searchTerm, statusFilter]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
        return <Clock className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <AlertCircle className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "CANCELLED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  if (jobsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setLocation('/')} 
              className="flex items-center space-x-2 bg-white text-red-600 rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </Button>
            <div className="bg-white text-red-600 rounded-lg p-3 font-bold text-lg">
              OMNOR GROUP
            </div>
            <span className="text-lg font-medium">Built from the North. Delivered Worldwide.</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">SALES DEPARTMENT</h1>
          <p className="text-xl text-gray-600">Client Relations • Opportunities • Revenue Management</p>
        </div>

        {/* Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={() => setLocation('/sales-jobs/new')} 
            className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Sales Job
          </Button>
        </div>

        {/* Jobs Grid */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                {jobs.length === 0 ? "Get started by creating your first job." : "Try adjusting your search or filter criteria."}
              </p>
              <Button onClick={() => setLocation('/sales-jobs/new')} className="bg-red-600 hover:bg-red-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Job
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <Card 
                key={job.id} 
                className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-slate-500 cursor-pointer"
                onClick={() => setLocation(`/sales/job/${job.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-gray-800">
                      {job.jobLes || 'No Code'}
                    </CardTitle>
                    <Badge className={`${getStatusColor(job.jobStatus)} flex items-center gap-1`}>
                      {getStatusIcon(job.jobStatus)}
                      {job.jobStatus.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2" />
                    {job.clientName}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    {job.date ? new Date(job.date).toLocaleDateString() : 'No date'}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <DollarSign className="w-4 h-4 mr-2" />
                    £{parseFloat(job.costNett || '0').toFixed(2)}
                  </div>

                  {job.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                  )}

                  <div className="flex justify-between items-center pt-3">
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditJobId(job.id);
                          setEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedJob(job);
                            }}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Sales Job Details - {job.jobLes}</DialogTitle>
                        </DialogHeader>
                        {selectedJob && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold text-gray-700">Job Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">Code:</span> {selectedJob.jobLes}</p>
                                  <p><span className="font-medium">Status:</span> {selectedJob.jobStatus}</p>
                                  <p><span className="font-medium">PM:</span> {selectedJob.pm || 'Not assigned'}</p>
                                  <p><span className="font-medium">Date:</span> {selectedJob.date ? new Date(selectedJob.date).toLocaleDateString() : 'No date'}</p>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-700">Financial</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">Cost:</span> £{parseFloat(selectedJob.costNett || '0').toFixed(2)}</p>
                                  <p><span className="font-medium">Quote Ref:</span> {selectedJob.quoteRef || 'N/A'}</p>
                                  <p><span className="font-medium">Complete:</span> {selectedJob.jobComplete ? 'Yes' : 'No'}</p>
                                  <p><span className="font-medium">Invoiced:</span> {selectedJob.invoiced ? 'Yes' : 'No'}</p>
                                </div>
                              </div>
                            </div>
                            {selectedJob.description && (
                              <div>
                                <h4 className="font-semibold text-gray-700">Description</h4>
                                <p className="text-sm text-gray-600">{selectedJob.description}</p>
                              </div>
                            )}
                            {selectedJob.jobComments && (
                              <div>
                                <h4 className="font-semibold text-gray-700">Comments</h4>
                                <p className="text-sm text-gray-600">{selectedJob.jobComments}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Job Edit Modal */}
        <JobEditModal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          jobId={editJobId}
        />
      </div>
    </div>
  );
}