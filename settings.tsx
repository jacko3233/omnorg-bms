import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Edit, Settings, Plus, Search, Key, Info } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAdminSettingsSchema, type AdminSettings, type InsertAdminSettings } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export default function AdminSettingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<AdminSettings | null>(null);
  const { toast } = useToast();

  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
  });

  const createSettingMutation = useMutation({
    mutationFn: async (settingData: InsertAdminSettings) => {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingData),
      });
      if (!response.ok) throw new Error("Failed to create setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: "Success",
        description: "Setting created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create setting",
        variant: "destructive",
      });
    },
  });

  const updateSettingMutation = useMutation({
    mutationFn: async ({ settingKey, ...settingData }: Partial<AdminSettings> & { settingKey: string }) => {
      const response = await fetch(`/api/admin/settings/${settingKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settingData),
      });
      if (!response.ok) throw new Error("Failed to update setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      setEditingSetting(null);
      toast({
        title: "Success",
        description: "Setting updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update setting",
        variant: "destructive",
      });
    },
  });

  const deleteSettingMutation = useMutation({
    mutationFn: async (settingKey: string) => {
      const response = await fetch(`/api/admin/settings/${settingKey}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete setting");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({
        title: "Success",
        description: "Setting deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete setting",
        variant: "destructive",
      });
    },
  });

  const createForm = useForm<InsertAdminSettings>({
    resolver: zodResolver(insertAdminSettingsSchema),
    defaultValues: {
      settingKey: "",
      settingValue: "",
      description: "",
      updatedBy: "",
    },
  });

  const editForm = useForm<Partial<AdminSettings>>({
    defaultValues: {
      settingKey: "",
      settingValue: "",
      description: "",
      updatedBy: "",
    },
  });

  const filteredSettings = (settings as AdminSettings[]).filter((setting: AdminSettings) =>
    setting.settingKey.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.settingValue?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    setting.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onCreateSubmit = (data: InsertAdminSettings) => {
    createSettingMutation.mutate(data);
  };

  const onEditSubmit = (data: Partial<AdminSettings>) => {
    if (editingSetting) {
      updateSettingMutation.mutate({ ...data, settingKey: editingSetting.settingKey });
    }
  };

  const handleEdit = (setting: AdminSettings) => {
    setEditingSetting(setting);
    editForm.reset({
      settingKey: setting.settingKey,
      settingValue: setting.settingValue || "",
      description: setting.description || "",
      updatedBy: setting.updatedBy || "",
    });
  };

  const handleDelete = (settingKey: string) => {
    if (confirm("Are you sure you want to delete this setting?")) {
      deleteSettingMutation.mutate(settingKey);
    }
  };

  // Group settings by category (based on key prefix)
  const groupedSettings = filteredSettings.reduce((groups: Record<string, AdminSettings[]>, setting: AdminSettings) => {
    const category = setting.settingKey.split('_')[0] || 'general';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(setting);
    return groups;
  }, {});

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'system': return <Settings className="h-5 w-5" />;
      case 'company': return <Info className="h-5 w-5" />;
      case 'maintenance': return <Key className="h-5 w-5" />;
      default: return <Settings className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'system': return 'bg-blue-500';
      case 'company': return 'bg-green-500';
      case 'maintenance': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">System Settings</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">Manage system-wide configuration settings</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Setting
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Setting</DialogTitle>
              <DialogDescription>
                Add a new system configuration setting.
              </DialogDescription>
            </DialogHeader>
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                <FormField
                  control={createForm.control}
                  name="settingKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setting Key</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., company_name, system_version" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="settingValue"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Setting Value</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter setting value" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe what this setting controls" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={createForm.control}
                  name="updatedBy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Updated By</FormLabel>
                      <FormControl>
                        <Input placeholder="Your username or identifier" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createSettingMutation.isPending}>
                    {createSettingMutation.isPending ? "Creating..." : "Create Setting"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search settings by key, value, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Settings by Category */}
      <div className="space-y-6">
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">Loading settings...</div>
            </CardContent>
          </Card>
        ) : Object.keys(groupedSettings).length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                {searchTerm ? "No settings found matching your search." : "No settings configured yet."}
              </div>
            </CardContent>
          </Card>
        ) : (
          Object.entries(groupedSettings).map(([category, categorySettings]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 capitalize">
                  <div className={`p-2 rounded-lg ${getCategoryColor(category)} text-white`}>
                    {getCategoryIcon(category)}
                  </div>
                  <span>{category} Settings</span>
                  <Badge variant="secondary">{categorySettings.length}</Badge>
                </CardTitle>
                <CardDescription>
                  Configuration settings for {category} functionality
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {categorySettings.map((setting: AdminSettings) => (
                  <div key={setting.id} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">{setting.settingKey}</h3>
                          <Badge variant="outline" className="text-xs">
                            {setting.settingValue?.length || 0} chars
                          </Badge>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium text-gray-500">Value:</span>
                            <p className="text-sm text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-700 rounded p-2 mt-1 font-mono">
                              {setting.settingValue || <span className="text-gray-400 italic">No value set</span>}
                            </p>
                          </div>
                          
                          {setting.description && (
                            <div>
                              <span className="text-sm font-medium text-gray-500">Description:</span>
                              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{setting.description}</p>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="text-xs text-gray-500">
                            <p>Updated: {new Date(setting.updatedAt).toLocaleString()}</p>
                            {setting.updatedBy && <p>By: {setting.updatedBy}</p>}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(setting)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(setting.settingKey)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Edit Setting Dialog */}
      <Dialog open={!!editingSetting} onOpenChange={() => setEditingSetting(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Setting</DialogTitle>
            <DialogDescription>
              Update the setting value and description.
            </DialogDescription>
          </DialogHeader>
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="settingKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setting Key</FormLabel>
                    <FormControl>
                      <Input {...field} disabled className="bg-gray-100 dark:bg-gray-800" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="settingValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setting Value</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter setting value" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe what this setting controls" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={editForm.control}
                name="updatedBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Updated By</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username or identifier" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setEditingSetting(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateSettingMutation.isPending}>
                  {updateSettingMutation.isPending ? "Updating..." : "Update Setting"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}