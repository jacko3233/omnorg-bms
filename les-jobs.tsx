import { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar, 
  User, 
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { PhotoCompletionDialog } from '@/components/PhotoCompletionDialog';
import JobEditModal from '@/components/JobEditModal';
import type { Job, Client } from '@shared/schema';

interface CompanyConfig {
  name: string;
  tagline: string;
}

const companyConfig: CompanyConfig = {
  name: "LES",
  tagline: "Engineering Services - Job Management"
};

export default function LESJobs() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [jobToComplete, setJobToComplete] = useState<Job | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [jobToEdit, setJobToEdit] = useState<string>('');

  // Fetch jobs
  const { data: jobs = [], isLoading: jobsLoading } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
  });

  // Fetch clients for reference
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  // Filter jobs for transport department with useMemo optimization
  const transportJobs = useMemo(() => 
    jobs.filter(job => job.department === 'TRANSPORT' || job.jobLes?.startsWith('LEX')), 
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

  // Filter jobs with useMemo optimization
  const filteredJobs = useMemo(() => 
    transportJobs.filter((job: Job) => {
      const matchesSearch = 
        job.jobLes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.jobNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientMap[job.clientId || '']?.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || job.jobStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    }), 
    [transportJobs, searchTerm, statusFilter, clientMap]
  );

  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({
        title: "Success",
        description: "Job deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete job",
        variant: "destructive",
      });
    },
  });

  // Update job status mutation
  const updateJobMutation = useMutation({
    mutationFn: async ({ jobId, updates }: { jobId: string; updates: Partial<Job> }) => {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Failed to update job');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({
        title: "Success",
        description: "Job updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update job",
        variant: "destructive",
      });
    },
  });

  // Handle status change with photo completion check
  const handleStatusChange = (job: Job, newStatus: string) => {
    if (newStatus === 'COMPLETED' && job.jobStatus !== 'COMPLETED') {
      // Job is being completed - show photo dialog
      setJobToComplete(job);
      setPhotoDialogOpen(true);
    } else {
      // Normal status update
      updateJobMutation.mutate({
        jobId: job.id,
        updates: { jobStatus: newStatus }
      });
    }
  };

  // Complete job with optional photos
  const handleCompleteJob = (photos?: string[]) => {
    if (!jobToComplete) return;

    const updates: Partial<Job> = {
      jobStatus: 'COMPLETED',
      jobComplete: true,
      ...(photos && photos.length > 0 && {
        completionPhotos: photos,
        photoUploadedAt: new Date(),
        photoUploadedBy: 'current_user' // In real app, get from auth context
      })
    };

    updateJobMutation.mutate({
      jobId: jobToComplete.id,
      updates
    });

    setPhotoDialogOpen(false);
    setJobToComplete(null);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN': return <Clock className="w-4 h-4" />;
      case 'IN_PROGRESS': return <AlertCircle className="w-4 h-4" />;
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />;
      case 'CANCELLED': return <Trash2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

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
          <Button 
            onClick={() => setLocation('/')} 
            variant="outline" 
            className="border-white text-white hover:bg-white hover:text-red-600"
          >
            Back to Main
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">TRANSPORT DEPARTMENT</h1>
          <p className="text-xl text-gray-600">Logistics • Delivery • Transport Management</p>
        </div>
        
        {/* Page Title and Actions */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Transport Job Management</h2>
          <Button 
            onClick={() => setLocation('/transport-jobs/new')} 
            className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Transport Job
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card 
            className="border-l-4 border-l-blue-500 cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={() => setStatusFilter('OPEN')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-blue-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Open Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredJobs.filter((job: Job) => job.jobStatus === 'OPEN').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-l-4 border-l-yellow-500 cursor-pointer hover:bg-yellow-50 transition-colors"
            onClick={() => setStatusFilter('IN_PROGRESS')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="w-8 h-8 text-yellow-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredJobs.filter((job: Job) => job.jobStatus === 'IN_PROGRESS').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-l-4 border-l-green-500 cursor-pointer hover:bg-green-50 transition-colors"
            onClick={() => setStatusFilter('COMPLETED')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredJobs.filter((job: Job) => job.jobStatus === 'COMPLETED').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-l-4 border-l-purple-500 cursor-pointer hover:bg-purple-50 transition-colors"
            onClick={() => setStatusFilter('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="w-8 h-8 text-purple-500 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredJobs.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search jobs by LES, Job No, description, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="OPEN">Open</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Jobs Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Jobs Database ({filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {jobsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">
                  {jobs.length === 0 ? "Get started by creating your first job." : "Try adjusting your search or filter criteria."}
                </p>
                <Button onClick={() => setLocation('/transport-jobs/new')} className="bg-red-600 hover:bg-red-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Job
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-blue-50">
                      <TableHead className="font-bold text-blue-800">Transport Code</TableHead>
                      <TableHead className="font-bold text-blue-800">Job No</TableHead>
                      <TableHead className="font-bold text-blue-800">Client</TableHead>
                      <TableHead className="font-bold text-blue-800">Description</TableHead>
                      <TableHead className="font-bold text-blue-800">PM</TableHead>
                      <TableHead className="font-bold text-blue-800">Status</TableHead>
                      <TableHead className="font-bold text-blue-800">Date</TableHead>
                      <TableHead className="font-bold text-blue-800">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredJobs.map((job: Job) => (
                      <TableRow 
                        key={job.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => setLocation(`/transport/job/${job.id}`)}
                      >
                        <TableCell className="font-medium">{job.jobLes}</TableCell>
                        <TableCell>{job.jobNo || '-'}</TableCell>
                        <TableCell>
                          {clientMap[job.clientId || '']?.companyName || 'Unknown Client'}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{job.description}</TableCell>
                        <TableCell>{job.pm || '-'}</TableCell>
                        <TableCell>
                          <Select 
                            value={job.jobStatus} 
                            onValueChange={(newStatus) => handleStatusChange(job, newStatus)}
                          >
                            <SelectTrigger className="w-36">
                              <SelectValue asChild>
                                <Badge className={`${getStatusColor(job.jobStatus)} flex items-center gap-1 w-fit border-none`}>
                                  {getStatusIcon(job.jobStatus)}
                                  {job.jobStatus.replace('_', ' ')}
                                </Badge>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OPEN">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-4 h-4" />
                                  Open
                                </div>
                              </SelectItem>
                              <SelectItem value="IN_PROGRESS">
                                <div className="flex items-center gap-2">
                                  <AlertCircle className="w-4 h-4" />
                                  In Progress
                                </div>
                              </SelectItem>
                              <SelectItem value="COMPLETED">
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="w-4 h-4" />
                                  Completed
                                </div>
                              </SelectItem>
                              <SelectItem value="CANCELLED">
                                <div className="flex items-center gap-2">
                                  <Trash2 className="w-4 h-4" />
                                  Cancelled
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          {job.date ? new Date(job.date).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedJob(job)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Transport Job Details - {job.jobLes}</DialogTitle>
                                </DialogHeader>
                                {selectedJob && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Transport Code</label>
                                        <p className="text-lg font-semibold">{selectedJob.jobLes}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Job Number</label>
                                        <p className="text-lg">{selectedJob.jobNo || 'Not assigned'}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Client</label>
                                        <p className="text-lg">{clientMap[selectedJob.clientId || '']?.companyName || 'Unknown'}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Project Manager</label>
                                        <p className="text-lg">{selectedJob.pm || 'Unassigned'}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Job Type</label>
                                        <p className="text-lg">{selectedJob.jobType || 'Not specified'}</p>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Cost (Net)</label>
                                        <p className="text-lg font-semibold text-green-600">
                                          £{selectedJob.costNett || '0.00'}
                                        </p>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium text-gray-600">Description</label>
                                      <p className="text-gray-800 bg-gray-50 p-3 rounded mt-1">
                                        {selectedJob.description || 'No description provided'}
                                      </p>
                                    </div>
                                    {selectedJob.jobComments && (
                                      <div>
                                        <label className="text-sm font-medium text-gray-600">Comments</label>
                                        <p className="text-gray-800 bg-gray-50 p-3 rounded mt-1">
                                          {selectedJob.jobComments}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setJobToEdit(job.id);
                                setEditModalOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => deleteJobMutation.mutate(job.id)}
                              disabled={deleteJobMutation.isPending}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
          </CardContent>
        </Card>

        {/* Photo Completion Dialog */}
        <PhotoCompletionDialog
          isOpen={photoDialogOpen}
          onClose={() => {
            setPhotoDialogOpen(false);
            setJobToComplete(null);
          }}
          onContinue={handleCompleteJob}
          jobId={jobToComplete?.id || ''}
          jobDescription={jobToComplete?.description || undefined}
        />

        {/* Job Edit Modal */}
        <JobEditModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setJobToEdit('');
          }}
          jobId={jobToEdit}
        />
      </div>
    </div>
  );
}