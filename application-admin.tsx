import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Eye, Calendar, Building, Mail, Phone, CheckCircle, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Client } from "@shared/schema";

export default function ApplicationAdmin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();

  // Approve application mutation
  const approveApplicationMutation = useMutation({
    mutationFn: (clientId: string) => 
      apiRequest(`/api/clients/${clientId}/approve`, 'PUT', { status: 'approved' }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Application approved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve application",
        variant: "destructive",
      });
    },
  });

  // Reject application mutation
  const rejectApplicationMutation = useMutation({
    mutationFn: (clientId: string) => 
      apiRequest(`/api/clients/${clientId}/reject`, 'PUT', { status: 'rejected' }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Application rejected successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/clients'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject application",
        variant: "destructive",
      });
    },
  });

  // Fetch all clients/applications
  const { data: applications = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (app.email && app.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (statusFilter === "all") return matchesSearch;
    // For now, all applications are "pending" since we don't have status field
    return matchesSearch && statusFilter === "pending";
  });

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-red-600 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Credit Applications</h1>
              <p className="text-red-100 mt-1">Manage and review client applications</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-red-100">Total Applications</div>
              <div className="text-2xl font-bold">{applications.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search" className="text-sm font-medium text-gray-700 mb-2 block">
                Search Applications
              </Label>
              <Input
                id="search"
                placeholder="Search by company name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <Label htmlFor="status" className="text-sm font-medium text-gray-700 mb-2 block">
                Status Filter
              </Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Applications</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                Export Applications
              </Button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Applications Found</h3>
              <p className="text-gray-500">
                {searchTerm ? "Try adjusting your search criteria" : "No credit applications have been submitted yet"}
              </p>
            </div>
          ) : (
            filteredApplications.map((application) => (
              <div key={application.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    
                    {/* Main Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-bold text-gray-800">
                          {application.companyName}
                        </h3>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending Review
                        </Badge>
                        {application.businessType && (
                          <Badge variant="outline">
                            {application.businessType}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Submitted: {formatDate(application.createdAt)}</span>
                        </div>
                        
                        {application.email && (
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>{application.email}</span>
                          </div>
                        )}
                        
                        {application.telephone && (
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{application.telephone}</span>
                          </div>
                        )}
                      </div>
                      
                      {application.creditApplicationAmount && (
                        <div className="mt-3">
                          <span className="text-sm text-gray-500">Credit Amount Requested: </span>
                          <span className="font-bold text-lg text-green-600">
                            £{Number(application.creditApplicationAmount).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Credit Application Details</DialogTitle>
                            <DialogDescription>
                              Complete application information for {application.companyName}
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-6">
                            
                            {/* Company Details */}
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                                Company Details
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Company Name:</strong> {application.companyName}</div>
                                <div><strong>Trading Name:</strong> {application.tradingName || "N/A"}</div>
                                <div><strong>Company Reg No:</strong> {application.companyRegNo || "N/A"}</div>
                                <div><strong>VAT No:</strong> {application.companyVatNo || "N/A"}</div>
                                <div><strong>Parent Company:</strong> {application.parentCompany || "N/A"}</div>
                                <div><strong>Years Trading:</strong> {application.yearsTrading || "N/A"}</div>
                                <div><strong>Business Type:</strong> {application.businessType}</div>
                                <div><strong>Employees:</strong> {application.numberOfEmployees || "N/A"}</div>
                              </div>
                            </div>

                            {/* Contact Information */}
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                                Contact Information
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div><strong>Email:</strong> {application.email || "N/A"}</div>
                                <div><strong>Telephone:</strong> {application.telephone || "N/A"}</div>
                                <div><strong>Director:</strong> {application.directorName || "N/A"}</div>
                                <div><strong>P/Ledger Contact:</strong> {application.pLedgerName || "N/A"}</div>
                              </div>
                            </div>

                            {/* Financial Details */}
                            {application.creditApplicationAmount && (
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                                  Financial Information
                                </h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div><strong>Credit Amount:</strong> £{Number(application.creditApplicationAmount).toLocaleString()}</div>
                                  <div><strong>Bank Name:</strong> {application.bankName || "N/A"}</div>
                                  <div><strong>Sort Code:</strong> {application.bankSortCode || "N/A"}</div>
                                  <div><strong>Account No:</strong> {application.bankAccountNo || "N/A"}</div>
                                </div>
                              </div>
                            )}

                            {/* Trade References */}
                            {(application.tradeRef1Name || application.tradeRef2Name) && (
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                                  Trade References
                                </h4>
                                <div className="grid grid-cols-2 gap-6 text-sm">
                                  {application.tradeRef1Name && (
                                    <div>
                                      <strong>Reference 1:</strong>
                                      <div className="ml-4 mt-1 space-y-1">
                                        <div>{application.tradeRef1Name}</div>
                                        {application.tradeRef1Phone && <div>Tel: {application.tradeRef1Phone}</div>}
                                        {application.tradeRef1Website && <div>Web: {application.tradeRef1Website}</div>}
                                      </div>
                                    </div>
                                  )}
                                  {application.tradeRef2Name && (
                                    <div>
                                      <strong>Reference 2:</strong>
                                      <div className="ml-4 mt-1 space-y-1">
                                        <div>{application.tradeRef2Name}</div>
                                        {application.tradeRef2Phone && <div>Tel: {application.tradeRef2Phone}</div>}
                                        {application.tradeRef2Website && <div>Web: {application.tradeRef2Website}</div>}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Addresses */}
                            <div>
                              <h4 className="font-semibold text-gray-800 mb-3 border-b border-gray-200 pb-1">
                                Addresses
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>Invoice Address:</strong>
                                  <div className="mt-1 whitespace-pre-line">{application.invoiceAddress || "N/A"}</div>
                                </div>
                                <div>
                                  <strong>Delivery Address:</strong>
                                  <div className="mt-1 whitespace-pre-line">{application.deliveryAddress || "N/A"}</div>
                                </div>
                              </div>
                            </div>

                            {/* Application Actions */}
                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                              <Button 
                                variant="outline" 
                                className="text-red-600 border-red-600 hover:bg-red-50"
                                onClick={() => rejectApplicationMutation.mutate(application.id)}
                                disabled={rejectApplicationMutation.isPending}
                              >
                                {rejectApplicationMutation.isPending ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
                                    Rejecting...
                                  </>
                                ) : (
                                  <>
                                    <X className="w-4 h-4 mr-2" />
                                    Reject Application
                                  </>
                                )}
                              </Button>
                              <Button 
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => approveApplicationMutation.mutate(application.id)}
                                disabled={approveApplicationMutation.isPending}
                              >
                                {approveApplicationMutation.isPending ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Approving...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve Application
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}