import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Client, InsertJob } from "@shared/schema";
import omnorLogo from "@assets/omnorgroup_logo_1753734315943.png";

interface FormData {
  jobLes: string;
  jobNo: string;
  jobStatus: string;
  pm: string;
  clientId: string;
  description: string;
  jobType: string;
  linkedJobRef: string;
  costNett: string;
  quoteRef: string;
  jobComments: string;
  purchaseOrder: string;
  invoiceComments: string;
}

export default function NewTestingJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<FormData>({
    jobLes: '',
    jobNo: '',
    jobStatus: 'OPEN',
    pm: '',
    clientId: '',
    description: '',
    jobType: 'Testing',
    linkedJobRef: '',
    costNett: '0.00',
    quoteRef: '',
    jobComments: '',
    purchaseOrder: '',
    invoiceComments: ''
  });

  // Fetch clients for dropdown
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData: InsertJob) => {
      return apiRequest('POST', '/api/jobs', jobData);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Testing job created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      setLocation('/testing-jobs');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create job",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation - removed manual job number requirement
    if (!formData.clientId || formData.clientId === 'none') {
      toast({
        title: "Validation Error",
        description: "Please select a client",
        variant: "destructive",
      });
      return;
    }

    const jobData: InsertJob = {
      jobStatus: formData.jobStatus,
      pm: formData.pm || null,
      date: new Date(),
      clientId: formData.clientId,
      description: formData.description || null,
      jobType: 'Testing', // Set consistent job type
      department: 'TESTING', // Auto-assign department for job numbering
      linkedJobRef: formData.linkedJobRef || null,
      costNett: formData.costNett || '0.00',
      quoteRef: formData.quoteRef || null,
      jobComplete: false,
      invoiced: false,
      jobComments: formData.jobComments || null,
      purchaseOrder: formData.purchaseOrder || null,
      attachments: null,
      invoiceComments: formData.invoiceComments || null,
    };

    createJobMutation.mutate(jobData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 via-blue-900 to-slate-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img src={omnorLogo} alt="Omnor Group" className="h-12 w-auto" />
              <div className="h-12 w-px bg-white/20"></div>
              <span className="text-lg font-medium">Built from the North. Delivered Worldwide.</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => setLocation('/testing-jobs')} 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-red-600"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Testing Job</h1>
          <p className="text-gray-600">Enter job details for the testing services database</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-800">Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Auto-generated Job Info */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <Label className="text-sm font-medium text-blue-700">Auto-Generated Job Information</Label>
                    </div>
                    <p className="text-sm text-blue-600">
                      Job number and Testing code will be automatically generated when this job is created.
                      <br />
                      <span className="font-medium">Job Type: Testing</span> → Job LES will start with "LET"
                    </p>
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

                  {/* Job Status */}
                  <div>
                    <Label htmlFor="jobStatus" className="text-sm font-medium text-gray-700 mb-2 block">
                      Job Status *
                    </Label>
                    <Select value={formData.jobStatus} onValueChange={(value) => handleInputChange('jobStatus', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
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

                  {/* Project Manager */}
                  <div>
                    <Label htmlFor="pm" className="text-sm font-medium text-gray-700 mb-2 block">
                      Testing Manager
                    </Label>
                    <Input
                      id="pm"
                      value={formData.pm}
                      onChange={(e) => handleInputChange('pm', e.target.value)}
                      placeholder="Enter testing manager name"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>

                  {/* Client */}
                  <div>
                    <Label htmlFor="clientId" className="text-sm font-medium text-gray-700 mb-2 block">
                      Client
                    </Label>
                    <Select value={formData.clientId} onValueChange={(value) => handleInputChange('clientId', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-red-500 focus:ring-red-500">
                        <SelectValue placeholder="Select client" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Client</SelectItem>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Job Type */}
                  <div>
                    <Label htmlFor="jobType" className="text-sm font-medium text-gray-700 mb-2 block">
                      Testing Type
                    </Label>
                    <Input
                      id="jobType"
                      value={formData.jobType}
                      onChange={(e) => handleInputChange('jobType', e.target.value)}
                      placeholder="Enter testing type"
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

                  {/* Cost */}
                  <div>
                    <Label htmlFor="costNett" className="text-sm font-medium text-gray-700 mb-2 block">
                      Testing Cost (£)
                    </Label>
                    <Input
                      id="costNett"
                      type="number"
                      step="0.01"
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

                  {/* Purchase Order */}
                  <div>
                    <Label htmlFor="purchaseOrder" className="text-sm font-medium text-gray-700 mb-2 block">
                      Purchase Order
                    </Label>
                    <Input
                      id="purchaseOrder"
                      value={formData.purchaseOrder}
                      onChange={(e) => handleInputChange('purchaseOrder', e.target.value)}
                      placeholder="Enter purchase order"
                      className="border-gray-300 focus:border-red-500 focus:ring-red-500"
                    />
                  </div>
                </div>
              </div>

              {/* Full Width Fields */}
              <div className="space-y-6">
                {/* Description */}
                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700 mb-2 block">
                    Testing Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe the testing requirements and protocols..."
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
                  onClick={() => setLocation('/testing-jobs')}
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
                      Create Testing Job
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