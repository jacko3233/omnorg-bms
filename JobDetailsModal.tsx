import { X, Plus, Trash2, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { JobItem } from "@shared/schema";

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobNo: string;
  jobDescription: string;
  jobType: string;
  costNett: string;
}

export default function JobDetailsModal({ isOpen, onClose, jobId, jobNo, jobDescription, jobType, costNett }: JobDetailsModalProps) {
  const { toast } = useToast();
  const [jobItems, setJobItems] = useState<JobItem[]>([]);

  // Fetch job items for this job
  const { data: fetchedJobItems = [], isLoading } = useQuery<JobItem[]>({
    queryKey: ['/api/job-items', jobId],
    enabled: isOpen && !!jobId,
  });

  // Initialize job items when data is fetched
  useEffect(() => {
    if (fetchedJobItems.length > 0) {
      setJobItems(fetchedJobItems);
    } else if (isOpen && !isLoading) {
      // Initialize with one empty item if no items exist
      setJobItems([{
        id: `new_${Date.now()}`,
        jobId: jobId,
        createdAt: null,
        itemDescription: "",
        itemAssetNo: "",
        onHireDate: null,
        offHireDate: null,
        priceWeek: "0.00",
        comments: ""
      }]);
    }
  }, [fetchedJobItems, isOpen, isLoading, jobId]);

  // Save job items mutation
  const saveJobItemsMutation = useMutation({
    mutationFn: (items: JobItem[]) => apiRequest('/api/job-items/bulk', 'POST', { jobId, items }),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job items saved successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/job-items', jobId] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save job items",
        variant: "destructive",
      });
    },
  });

  const handleItemChange = (index: number, field: keyof JobItem, value: string) => {
    setJobItems(prev => prev.map((item, i) => {
      if (i === index) {
        // Handle date fields specially
        if (field === 'onHireDate' || field === 'offHireDate') {
          return { ...item, [field]: value ? new Date(value) : null };
        }
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  const addJobItem = () => {
    const newItem: JobItem = {
      id: `new_${Date.now()}`,
      jobId: jobId,
      createdAt: null,
      itemDescription: "",
      itemAssetNo: "",
      onHireDate: null,
      offHireDate: null,
      priceWeek: "0.00",
      comments: ""
    };
    setJobItems(prev => [...prev, newItem]);
  };

  const removeJobItem = (index: number) => {
    if (jobItems.length > 1) {
      setJobItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    const validItems = jobItems.filter(item => 
      item.itemDescription.trim() !== "" || 
      item.onHireDate !== null || 
      item.priceWeek !== "0.00"
    );
    saveJobItemsMutation.mutate(validItems);
  };

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Job Details - {jobNo}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            <p><strong>Description:</strong> {jobDescription}</p>
            <p><strong>Type:</strong> {jobType} | <strong>Cost:</strong> £{costNett}</p>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">Job Items</h3>
            <div className="flex space-x-2">
              <Button
                type="button"
                onClick={addJobItem}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
                size="sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Item</span>
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={saveJobItemsMutation.isPending}
                className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
                size="sm"
              >
                <Save className="w-4 h-4" />
                <span>{saveJobItemsMutation.isPending ? 'Saving...' : 'Save Changes'}</span>
              </Button>
            </div>
          </div>

          {/* Job Items Table */}
          <div className="border rounded-lg overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50">
                  <TableHead className="font-bold text-gray-700 text-xs">Item Description</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs">Asset No</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs">On Hire Date</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs">Off Hire Date</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs">Price/Week</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs">Comments</TableHead>
                  <TableHead className="font-bold text-gray-700 text-xs w-12">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobItems.map((item, index) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="p-1">
                      <Input
                        value={item.itemDescription}
                        onChange={(e) => handleItemChange(index, 'itemDescription', e.target.value)}
                        placeholder="Item description..."
                        className="border-none bg-transparent focus:bg-white text-xs h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        value={item.itemAssetNo || ""}
                        onChange={(e) => handleItemChange(index, 'itemAssetNo', e.target.value)}
                        placeholder="Asset no..."
                        className="border-none bg-transparent focus:bg-white text-xs h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="date"
                        value={item.onHireDate ? item.onHireDate.toISOString().split('T')[0] : ""}
                        onChange={(e) => handleItemChange(index, 'onHireDate', e.target.value)}
                        className="border-none bg-transparent focus:bg-white text-xs h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        type="date"
                        value={item.offHireDate ? item.offHireDate.toISOString().split('T')[0] : ""}
                        onChange={(e) => handleItemChange(index, 'offHireDate', e.target.value)}
                        className="border-none bg-transparent focus:bg-white text-xs h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        value={item.priceWeek || "0.00"}
                        onChange={(e) => handleItemChange(index, 'priceWeek', e.target.value)}
                        placeholder="0.00"
                        className="border-none bg-transparent focus:bg-white text-xs h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      <Input
                        value={item.comments || ""}
                        onChange={(e) => handleItemChange(index, 'comments', e.target.value)}
                        placeholder="Comments..."
                        className="border-none bg-transparent focus:bg-white text-xs h-8"
                      />
                    </TableCell>
                    <TableCell className="p-1">
                      {jobItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeJobItem(index)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}