import { ArrowLeft, Search, Filter, Download, Eye, Edit, Trash2, Clock, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import JobDetailsModal from "@/components/JobDetailsModal";
import type { Job, Client } from "@shared/schema";

interface CompanyConfig {
  name: string;
  tagline: string;
}

interface LiveJob {
  id: string;
  jobNo: string;
  jobSt: string;
  pm: string;
  date: string;
  client: string;
  description: string;
  jobType: string;
  costNett: string;
  quote: string;
  jobComplete: boolean;
  invoiced: boolean;
  invoiceComments: string;
  jobComments: string;
  purchaseOrderNo: string;
  ongoing: boolean;
}

// White-label configuration
const companyConfig: CompanyConfig = {
  name: "OMNOR GROUP",
  tagline: "Built from the North. Delivered Worldwide."
};

export default function LiveJobs() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch real jobs from database
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  // Fetch clients for reference
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Filter jobs for hire department
  const hireJobs = jobs.filter((job: Job) => 
    job.jobType === 'Hire' || job.jobLes?.startsWith('LEH')
  );

  // Create client lookup map
  const clientMap = clients.reduce((acc: Record<string, Client>, client: Client) => {
    acc[client.id] = client;
    return acc;
  }, {});

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: (jobId: number) => apiRequest(`/api/jobs/${jobId}`, 'DELETE'),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete job",
        variant: "destructive",
      });
    },
  });

  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeJobDetails = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  const getJobStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Clock className="w-4 h-4" />;
      case 'IN_PROGRESS': return <AlertCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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

  // Filter and search functionality
  const filteredJobs = hireJobs.filter((job: Job) => {
    const matchesSearch = searchTerm === '' || 
      job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.jobLes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      clientMap[job.clientId || 0]?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === 'all' || job.jobStatus === statusFilter;
    const matchesType = typeFilter === 'all' || job.jobType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/hire">
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">LIVE JOBS DATABASE</h1>
          <p className="text-lg text-gray-600">Complete job management and tracking system</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs, clients, descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                  <SelectItem value="on hold">On Hold</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="hire">Hire</SelectItem>
                  <SelectItem value="fixed price">Fixed Price</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex items-center space-x-2">
                <Filter className="w-4 h-4" />
                <span>More Filters</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Jobs Table */}
        {jobsLoading ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading hire jobs...</p>
            </div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8">
            <div className="text-center">
              <p className="text-gray-500 text-lg mb-2">No hire jobs found</p>
              <p className="text-gray-400 mb-4">Try adjusting your search or create a new hire job</p>
              <Button onClick={() => setLocation('/hire/new-job')} className="bg-red-600 hover:bg-red-700">
                Create New Hire Job
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="font-bold text-gray-700">Job LES</TableHead>
                  <TableHead className="font-bold text-gray-700">Status</TableHead>
                  <TableHead className="font-bold text-gray-700">PM</TableHead>
                  <TableHead className="font-bold text-gray-700">Date</TableHead>
                  <TableHead className="font-bold text-gray-700">Client</TableHead>
                  <TableHead className="font-bold text-gray-700">Description</TableHead>
                  <TableHead className="font-bold text-gray-700">Type</TableHead>
                  <TableHead className="font-bold text-gray-700">Cost</TableHead>
                  <TableHead className="font-bold text-gray-700 text-center">Complete</TableHead>
                  <TableHead className="font-bold text-gray-700 text-center">Invoiced</TableHead>
                  <TableHead className="font-bold text-gray-700 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job: Job) => (
                  <TableRow key={job.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium text-blue-600">{job.jobLes}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(job.jobStatus)} flex items-center gap-1 w-fit`}>
                        {getJobStatusIcon(job.jobStatus)}
                        {job.jobStatus.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{job.pm || 'Unassigned'}</TableCell>
                    <TableCell>
                      {job.date ? new Date(job.date).toLocaleDateString() : 'No date'}
                    </TableCell>
                    <TableCell className="max-w-48 truncate">
                      {job.clientId ? clientMap[job.clientId]?.companyName || 'Unknown Client' : 'No client assigned'}
                    </TableCell>
                    <TableCell className="max-w-48 truncate">{job.description || 'No description'}</TableCell>
                    <TableCell>{job.jobType}</TableCell>
                    <TableCell className="font-medium text-green-600">£{job.costNett || '0.00'}</TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={job.jobComplete || false} disabled />
                    </TableCell>
                    <TableCell className="text-center">
                      <Checkbox checked={job.invoiced || false} disabled />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:text-blue-700"
                          onClick={() => openJobDetails(job)}
                          title="View Job Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-600 hover:text-gray-700"
                          onClick={() => setLocation(`/hire/edit-job/${job.id}`)}
                          title="Edit Job"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700"
                          onClick={() => deleteJobMutation.mutate(parseInt(job.id))}
                          disabled={deleteJobMutation.isPending}
                          title="Delete Job"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Total Hire Jobs</h3>
            <p className="text-3xl font-bold text-blue-600">{hireJobs.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Open Jobs</h3>
            <p className="text-3xl font-bold text-orange-600">
              {hireJobs.filter(j => j.jobStatus === 'OPEN').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Completed</h3>
            <p className="text-3xl font-bold text-green-600">
              {hireJobs.filter(j => j.jobStatus === 'COMPLETED').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Total Value</h3>
            <p className="text-3xl font-bold text-purple-600">
              £{hireJobs.reduce((sum, job) => {
                const cost = parseFloat((job.costNett || '0').replace('£', '').replace(',', '')) || 0;
                return sum + cost;
              }, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetailsModal
            isOpen={isModalOpen}
            onClose={closeJobDetails}
            jobId={selectedJob.id}
            jobNo={selectedJob.jobLes || `Job ${selectedJob.id}`}
            jobDescription={selectedJob.description || 'No description'}
            jobType={selectedJob.jobType || 'Hire'}
            costNett={selectedJob.costNett || '0.00'}
          />
        )}
      </div>
    </div>
  );
}