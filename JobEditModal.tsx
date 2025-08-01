import { X, Save, Building2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Job, Client } from "@shared/schema";

interface JobEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

interface JobFormData {
  jobLes: string;
  jobNo: string;
  description: string;
  clientId: string;
  pm: string;
  jobType: string;
  costNett: string;
  jobStatus: string;
  jobComments: string;
  department: string;
}

export default function JobEditModal({ isOpen, onClose, jobId }: JobEditModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<JobFormData>({
    jobLes: '',
    jobNo: '',
    description: '',
    clientId: '',
    pm: '',
    jobType: '',
    costNett: '',
    jobStatus: 'OPEN',
    jobComments: '',
    department: ''
  });

  // Fetch job data
  const { data: job, isLoading: jobLoading } = useQuery<Job>({
    queryKey: ['/api/jobs', jobId],
    enabled: isOpen && !!jobId,
  });

  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: isOpen,
  });

  // Initialize form when job data is loaded
  useEffect(() => {
    if (job) {
      setFormData({
        jobLes: job.jobLes || '',
        jobNo: job.jobNo || '',
        description: job.description || '',
        clientId: job.clientId || '',
        pm: job.pm || '',
        jobType: job.jobType || '',
        costNett: job.costNett || '',
        jobStatus: job.jobStatus || 'OPEN',
        jobComments: job.jobComments || '',
        department: job.department || ''
      });
    }
  }, [job]);

  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: (data: Partial<Job>) => 
      apiRequest(`/api/jobs/${jobId}`, 'PUT', data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs', jobId] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update job",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateJobMutation.mutate(formData);
  };

  const getDepartmentPrefix = (department: string) => {
    const prefixes = {
      'HIRE': 'LEH',
      'FABRICATION': 'LEF', 
      'SALES': 'LES',
      'TESTING': 'LET',
      'TRANSPORT': 'LEX'
    };
    return prefixes[department as keyof typeof prefixes] || 'LEH';
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building2 className="w-5 h-5 text-blue-600" />
            Edit Job - {formData.jobLes || jobId}
          </DialogTitle>
        </DialogHeader>

        {jobLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Loading job details...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="department">Department *</Label>
                  <Select 
                    value={formData.department} 
                    onValueChange={(value) => {
                      handleInputChange('department', value);
                      // Auto-update jobLes prefix when department changes
                      const prefix = getDepartmentPrefix(value);
                      const currentNumber = formData.jobLes.replace(/^[A-Z]+/, '');
                      handleInputChange('jobLes', prefix + currentNumber);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HIRE">Hire Department</SelectItem>
                      <SelectItem value="FABRICATION">Fabrication Department</SelectItem>
                      <SelectItem value="SALES">Sales Department</SelectItem>
                      <SelectItem value="TESTING">Testing Department</SelectItem>
                      <SelectItem value="TRANSPORT">Transport Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="jobLes">Job Code *</Label>
                  <Input
                    id="jobLes"
                    value={formData.jobLes}
                    onChange={(e) => handleInputChange('jobLes', e.target.value)}
                    placeholder="e.g., LEH000001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="jobNo">Job Number</Label>
                  <Input
                    id="jobNo"
                    value={formData.jobNo}
                    onChange={(e) => handleInputChange('jobNo', e.target.value)}
                    placeholder="Internal job number"
                  />
                </div>

                <div>
                  <Label htmlFor="clientId">Client *</Label>
                  <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.companyName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="pm">Project Manager</Label>
                  <Input
                    id="pm"
                    value={formData.pm}
                    onChange={(e) => handleInputChange('pm', e.target.value)}
                    placeholder="Assigned project manager"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="jobType">Job Type</Label>
                  <Input
                    id="jobType"
                    value={formData.jobType}
                    onChange={(e) => handleInputChange('jobType', e.target.value)}
                    placeholder="Type of job"
                  />
                </div>

                <div>
                  <Label htmlFor="costNett">Cost (Net) £</Label>
                  <Input
                    id="costNett"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.costNett}
                    onChange={(e) => handleInputChange('costNett', e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="jobStatus">Job Status</Label>
                  <Select value={formData.jobStatus} onValueChange={(value) => handleInputChange('jobStatus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OPEN">Open</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-1">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Detailed job description"
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="jobComments">Comments</Label>
              <Textarea
                id="jobComments"
                value={formData.jobComments}
                onChange={(e) => handleInputChange('jobComments', e.target.value)}
                placeholder="Additional comments or notes"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button 
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={updateJobMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateJobMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateJobMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Update Job
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}