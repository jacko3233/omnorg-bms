import { useQuery } from '@tanstack/react-query';
import { useRoute, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, User, DollarSign, FileText, Phone, Mail, MapPin } from 'lucide-react';
import type { Job, Client } from '@shared/schema';

export default function TransportJobDetail() {
  const [, params] = useRoute('/transport/job/:id');
  const [, setLocation] = useLocation();
  const jobId = params?.id;

  // Fetch job details
  const { data: job, isLoading: jobLoading } = useQuery<Job>({
    queryKey: ['/api/jobs', jobId],
    queryFn: async () => {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) throw new Error('Failed to fetch job');
      return response.json();
    },
    enabled: !!jobId,
  });

  // Fetch client details if job has clientId
  const { data: client } = useQuery<Client>({
    queryKey: ['/api/clients', job?.clientId],
    queryFn: async () => {
      const response = await fetch(`/api/clients/${job?.clientId}`);
      if (!response.ok) throw new Error('Failed to fetch client');
      return response.json();
    },
    enabled: !!job?.clientId,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED': return 'bg-green-100 text-green-800 border-green-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
            <Button onClick={() => setLocation('/les-jobs')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Transport Department
            </Button>
          </div>
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
              onClick={() => setLocation('/les-jobs')} 
              className="flex items-center space-x-2 bg-white text-red-600 rounded-lg p-2 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Transport</span>
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Job Details - {job.jobLes}</h1>
          <p className="text-xl text-gray-600">Transport Department Job Information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Job Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Job Information</span>
                <Badge className={getStatusColor(job.jobStatus)}>
                  {job.jobStatus.replace('_', ' ')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Job Code</p>
                  <p className="text-lg font-semibold">{job.jobLes}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Job Type</p>
                  <p className="text-lg">{job.jobType || 'Not specified'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Project Manager</p>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-gray-400" />
                    <p>{job.pm || 'Not assigned'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date</p>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <p>{job.date ? new Date(job.date).toLocaleDateString() : 'No date set'}</p>
                  </div>
                </div>
              </div>

              {job.description && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{job.description}</p>
                </div>
              )}

              {job.jobComments && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Comments</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{job.jobComments}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Financial Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Cost (Net)</p>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                    <p className="text-2xl font-bold text-green-600">£{parseFloat(job.costNett || '0').toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Quote Reference</p>
                  <p>{job.quoteRef || 'No quote reference'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Purchase Order</p>
                  <p>{job.purchaseOrder || 'No purchase order'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Job Complete</p>
                    <p className={job.jobComplete ? 'text-green-600 font-medium' : 'text-gray-600'}>
                      {job.jobComplete ? 'Yes' : 'No'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Invoiced</p>
                    <p className={job.invoiced ? 'text-green-600 font-medium' : 'text-gray-600'}>
                      {job.invoiced ? 'Yes' : 'No'}
                    </p>
                  </div>
                </div>
              </div>

              {job.invoiceComments && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Invoice Comments</p>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{job.invoiceComments}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Client Information Card */}
          {client && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Client Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Company Details</h4>
                    <div className="space-y-2">
                      <p className="text-lg font-semibold">{client.companyName}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>{client.address}, {client.city} {client.postcode}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <User className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{client.contactFirstName} {client.contactLastName}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{client.contactPhone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span>{client.contactEmail}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-3">Business Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="font-medium">Employees:</span> {client.numberOfEmployees}</p>
                      <p><span className="font-medium">Years Trading:</span> {client.yearsTrading}</p>
                      <p><span className="font-medium">Credit Limit:</span> £{client.creditLimit?.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button 
            onClick={() => setLocation(`/transport/job/${job.id}/edit`)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FileText className="w-4 h-4 mr-2" />
            Edit Job
          </Button>
          <Button 
            onClick={() => setLocation('/les-jobs')}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job List
          </Button>
        </div>
      </div>
    </div>
  );
}