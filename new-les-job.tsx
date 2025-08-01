import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import type { Client } from '@shared/schema';

interface CompanyConfig {
  name: string;
  tagline: string;
}

const companyConfig: CompanyConfig = {
  name: "LES",
  tagline: "Engineering Services - New Job"
};

interface JobFormData {
  jobLes: string;
  jobNo: string;
  pm: string;
  date: string;
  clientId: string;
  description: string;
  jobType: string;
  linkedJobRef: string;
  costNett: string;
  quoteRef: string;
  jobComments: string;
  purchaseOrder: string;
}

export default function NewLESJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<JobFormData>({
    jobLes: '',
    jobNo: '',
    pm: '',
    date: new Date().toISOString().split('T')[0],
    clientId: '',
    description: 'HIRE - ',
    jobType: '',
    linkedJobRef: '',
    costNett: '0.00',
    quoteRef: '',
    jobComments: '',
    purchaseOrder: ''
  });

  // Fetch clients for dropdown
  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const handleInputChange = (field: keyof JobFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (jobData: JobFormData) => {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...jobData,
          department: 'TRANSPORT', // Auto-assign department
          costNett: parseFloat(jobData.costNett) || 0,
          date: new Date(jobData.date).toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create job');
      }
      
      return response.json();
    },
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      toast({
        title: "Success",
        description: `Job ${job.jobLes} created successfully`,
      });
      setLocation('/les-jobs');
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create job",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation - removed manual job number requirement
    if (!formData.clientId) {
      toast({
        title: "Validation Error", 
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    // Enhanced job data with proper department assignment
    const jobDataForAPI = {
      ...formData,
      jobType: 'Transport', // Set consistent job type
      department: 'TRANSPORT', // Auto-assign department for job numbering
      costNett: (parseFloat(formData.costNett) || 0).toString(), // Keep as string to match interface
      date: new Date(formData.date).toISOString(),
    };

    createJobMutation.mutate(jobDataForAPI);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 text-white p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-slate-400 to-blue-500"></div>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="bg-white text-slate-800 rounded-xl p-3 font-bold text-lg shadow-lg">
              OMNOR
            </div>
            <span className="text-lg font-medium">Built from the North. Delivered Worldwide.</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => setLocation('/transport-jobs')} 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-red-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
            <Button 
              onClick={() => setLocation('/')} 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-red-600"
            >
              Main Page
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Transport Job</h1>
          <p className="text-gray-600">Enter job details for the transport services database</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl font-semibold">
                <Building2 className="w-6 h-6 mr-2 text-red-600" />
                Job Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* LES Code */}
                  <div>
                    <Label htmlFor="jobLes" className="text-sm font-medium text-gray-700 mb-2 block">
                      Transport Code *
                    </Label>
                    <Input
                      id="jobLes"
                      value={formData.jobLes}
                      onChange={(e) => handleInputChange('jobLes', e.target.value)}
                      placeholder="Enter Transport code (e.g., TRS001)"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                      required
                    />
                  </div>

                  {/* Job Number */}
                  <div>
                    <Label htmlFor="jobNo" className="text-sm font-medium text-gray-700 mb-2 block">
                      Job Number
                    </Label>
                    <Input
                      id="jobNo" 
                      value={formData.jobNo}
                      onChange={(e) => handleInputChange('jobNo', e.target.value)}
                      placeholder="Enter job number"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  {/* Project Manager */}
                  <div>
                    <Label htmlFor="pm" className="text-sm font-medium text-gray-700 mb-2 block">
                      Project Manager
                    </Label>
                    <Select value={formData.pm} onValueChange={(value) => handleInputChange('pm', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select Project Manager" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="JL">JL</SelectItem>
                        <SelectItem value="DE">DE</SelectItem>
                        <SelectItem value="ML">ML</SelectItem>
                        <SelectItem value="MR">MR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date */}
                  <div>
                    <Label htmlFor="date" className="text-sm font-medium text-gray-700 mb-2 block">
                      Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  {/* Client */}
                  <div>
                    <Label htmlFor="clientId" className="text-sm font-medium text-gray-700 mb-2 block">
                      Client *
                    </Label>
                    <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select Client"} />
                      </SelectTrigger>
                      <SelectContent>
                        {(clients as Client[]).map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.companyName}
                          </SelectItem>
                        ))}
                        {clients.length === 0 && !clientsLoading && (
                          <SelectItem value="no-clients" disabled>
                            No clients available
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">
                      No clients? <button 
                        type="button"
                        onClick={() => setLocation('/clients/new')} 
                        className="text-orange-600 hover:underline"
                      >
                        Add New Client
                      </button>
                    </p>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Job Type */}
                  <div>
                    <Label htmlFor="jobType" className="text-sm font-medium text-gray-700 mb-2 block">
                      Job Type
                    </Label>
                    <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select Job Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hire">Hire</SelectItem>
                        <SelectItem value="Fixed Price">Fixed Price</SelectItem>
                        <SelectItem value="Service">Service</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Consultation">Consultation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cost (Net) */}
                  <div>
                    <Label htmlFor="costNett" className="text-sm font-medium text-gray-700 mb-2 block">
                      Cost (Net) £
                    </Label>
                    <Input
                      id="costNett"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.costNett}
                      onChange={(e) => handleInputChange('costNett', e.target.value)}
                      placeholder="0.00"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  {/* Quote Reference */}
                  <div>
                    <Label htmlFor="quoteRef" className="text-sm font-medium text-gray-700 mb-2 block">
                      Quote Reference
                    </Label>  
                    <Input
                      id="quoteRef"
                      value={formData.quoteRef}
                      onChange={(e) => handleInputChange('quoteRef', e.target.value)}
                      placeholder="Enter quote reference"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  {/* Linked Job Reference */}
                  <div>
                    <Label htmlFor="linkedJobRef" className="text-sm font-medium text-gray-700 mb-2 block">
                      Linked Job Reference
                    </Label>
                    <Input
                      id="linkedJobRef"
                      value={formData.linkedJobRef}
                      onChange={(e) => handleInputChange('linkedJobRef', e.target.value)}
                      placeholder="Enter linked job reference"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  {/* Purchase Order */}
                  <div>
                    <Label htmlFor="purchaseOrder" className="text-sm font-medium text-gray-700 mb-2 block">
                      Purchase Order
                    </Label>
                    <Input
                      id="purchaseOrder"
                      value={formData.purchaseOrder}
                      onChange={(e) => handleInputChange('purchaseOrder', e.target.value)}
                      placeholder="Enter purchase order details"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="mt-6 space-y-6">
                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    Job Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the job requirements..."
                    rows={3}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>

                {/* Comments */}
                <div>
                  <Label htmlFor="jobComments" className="text-sm font-medium text-gray-700 mb-2 block">
                    Job Comments
                  </Label>
                  <Textarea
                    id="jobComments"
                    value={formData.jobComments}
                    onChange={(e) => handleInputChange('jobComments', e.target.value)}
                    placeholder="Additional comments or notes..."
                    rows={3}
                    className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-end space-x-4">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/transport-jobs')}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createJobMutation.isPending}
                  className="bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {createJobMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Transport Job
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}