import { ArrowLeft, Plus, Trash2, User, Calendar, DollarSign, FileText, Briefcase } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Client } from "@shared/schema";

interface CompanyConfig {
  name: string;
  tagline: string;
}

// White-label configuration
const companyConfig: CompanyConfig = {
  name: "OMNOR GROUP",
  tagline: "Built from the North. Delivered Worldwide."
};

// Form schema for hire job
const hireJobSchema = z.object({
  clientId: z.string().min(1, "Please select a client"),
  description: z.string().min(5, "Description must be at least 5 characters"),
  pm: z.string().min(2, "Project Manager name is required"),
  costNett: z.string().optional(),
  quoteRef: z.string().optional(),
  jobComments: z.string().optional(),
  purchaseOrder: z.string().optional(),
  jobItems: z.array(z.object({
    itemDescription: z.string().min(1, "Item description is required"),
    itemAssetNo: z.string().optional(),
    onHireDate: z.string().optional(),
    offHireDate: z.string().optional(),
    priceWeek: z.string().optional(),
    comments: z.string().optional(),
  })).min(1, "At least one job item is required"),
});

type HireJobForm = z.infer<typeof hireJobSchema>;

export default function NewHireJob() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [jobItems, setJobItems] = useState([{
    itemDescription: "",
    itemAssetNo: "",
    onHireDate: "",
    offHireDate: "",
    priceWeek: "0.00",
    comments: "",
  }]);

  // Fetch clients for the dropdown
  const { data: clients = [], isLoading: clientsLoading } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
  });

  const form = useForm<HireJobForm>({
    resolver: zodResolver(hireJobSchema),
    defaultValues: {
      clientId: "",
      description: "",
      pm: "",
      costNett: "0.00",
      quoteRef: "",
      jobComments: "",
      purchaseOrder: "",
      jobItems: jobItems,
    },
  });

  // Create hire job mutation
  const createJobMutation = useMutation({
    mutationFn: (data: HireJobForm) => {
      const jobData = {
        ...data,
        jobType: "Hire",
        department: "HIRE",
        date: new Date().toISOString(),
        jobStatus: "OPEN",
      };
      return apiRequest('/api/jobs', 'POST', jobData);
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success", 
        description: `Hire job created successfully!`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      setLocation('/hire');
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create hire job",
        variant: "destructive",
      });
    },
  });

  const addJobItem = () => {
    const newItem = {
      itemDescription: "",
      itemAssetNo: "",
      onHireDate: "",
      offHireDate: "",
      priceWeek: "0.00",
      comments: "",
    };
    setJobItems(prev => [...prev, newItem]);
    form.setValue('jobItems', [...jobItems, newItem]);
  };

  const removeJobItem = (index: number) => {
    if (jobItems.length > 1) {
      const updatedItems = jobItems.filter((_, i) => i !== index);
      setJobItems(updatedItems);
      form.setValue('jobItems', updatedItems);
    }
  };

  const updateJobItem = (index: number, field: string, value: string) => {
    const updatedItems = jobItems.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setJobItems(updatedItems);
    form.setValue('jobItems', updatedItems);
  };

  const onSubmit = (data: HireJobForm) => {
    const formattedData = {
      ...data,
      jobItems: jobItems.filter(item => item.itemDescription.trim() !== ""),
    };
    createJobMutation.mutate(formattedData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/hire">
              <button className="flex items-center space-x-2 bg-white text-red-600 rounded-lg p-2 hover:bg-gray-100 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Hire</span>
              </button>
            </Link>
            <div className="bg-white text-red-600 rounded-lg p-3 font-bold text-lg">
              {companyConfig.name.toUpperCase()}
            </div>
            <span className="text-lg font-medium">{companyConfig.tagline}</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">NEW HIRE JOB</h1>
          <p className="text-xl text-gray-600">Equipment • Resources • Personnel Management</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Job Details Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-xl text-gray-800">
                  <Briefcase className="w-6 h-6" />
                  <span>Job Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Selection */}
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <User className="w-4 h-4" />
                          <span>Client</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clientsLoading ? (
                              <SelectItem value="loading">Loading clients...</SelectItem>
                            ) : clients.length === 0 ? (
                              <SelectItem value="no-clients">No clients available</SelectItem>
                            ) : (
                              clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.companyName}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Project Manager */}
                  <FormField
                    control={form.control}
                    name="pm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Manager</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter PM name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Cost */}
                  <FormField
                    control={form.control}
                    name="costNett"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2">
                          <DollarSign className="w-4 h-4" />
                          <span>Cost (Net)</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quote Reference */}
                  <FormField
                    control={form.control}
                    name="quoteRef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quote Reference</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter quote reference" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <FileText className="w-4 h-4" />
                        <span>Job Description</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter detailed job description"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Purchase Order */}
                <FormField
                  control={form.control}
                  name="purchaseOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Order</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter purchase order details"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Job Comments */}
                <FormField
                  control={form.control}
                  name="jobComments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Job Comments</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter any additional comments"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Job Items Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl text-gray-800">Job Items</CardTitle>
                  <Button
                    type="button"
                    onClick={addJobItem}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {jobItems.map((item, index) => (
                    <div key={index} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-800">Item {index + 1}</h4>
                        {jobItems.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeJobItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Item Description *</label>
                          <Input
                            value={item.itemDescription}
                            onChange={(e) => updateJobItem(index, 'itemDescription', e.target.value)}
                            placeholder="Enter item description"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Asset No</label>
                          <Input
                            value={item.itemAssetNo}
                            onChange={(e) => updateJobItem(index, 'itemAssetNo', e.target.value)}
                            placeholder="Enter asset number"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Price/Week</label>
                          <Input
                            value={item.priceWeek}
                            onChange={(e) => updateJobItem(index, 'priceWeek', e.target.value)}
                            placeholder="0.00"
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">On Hire Date</label>
                          <Input
                            type="date"
                            value={item.onHireDate}
                            onChange={(e) => updateJobItem(index, 'onHireDate', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-600">Off Hire Date</label>
                          <Input
                            type="date"
                            value={item.offHireDate}
                            onChange={(e) => updateJobItem(index, 'offHireDate', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="md:col-span-2 lg:col-span-1">
                          <label className="text-sm font-medium text-gray-600">Comments</label>
                          <Input
                            value={item.comments}
                            onChange={(e) => updateJobItem(index, 'comments', e.target.value)}
                            placeholder="Enter comments"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Submit Section */}
            <div className="flex justify-center space-x-4">
              <Link href="/hire">
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                size="lg"
                disabled={createJobMutation.isPending}
                className="bg-green-600 hover:bg-green-700 min-w-[150px]"
              >
                {createJobMutation.isPending ? 'Creating...' : 'Create Hire Job'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}