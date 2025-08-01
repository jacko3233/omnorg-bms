import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Edit, UserPlus, Search, Shield, User as UserIcon, Zap, Database, Activity, Star, Cpu, Network } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type User, type InsertUser } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const userFormSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(1, "Confirm password is required")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function Users2050Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/users"],
  });

  const createUserMutation = useMutation({
    mutationFn: async (userData: InsertUser) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "User Entity Created",
        description: "New user successfully deployed to the quantum registry",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (data: { id: string } & Partial<User>) => {
      const { id, ...updateData } = data;
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      setEditingUser(null);
      toast({
        title: "Entity Updated",
        description: "User profile successfully modified",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete user");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({
        title: "Entity Removed",
        description: "User successfully deactivated from the system",
      });
    },
  });

  const createForm = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "User",
      email: "",
      firstName: "",
      lastName: "",
      isActive: true,
    },
  });

  const editForm = useForm<Partial<User>>({
    defaultValues: {
      username: "",
      role: "User",
      email: "",
      firstName: "",
      lastName: "",
      isActive: true,
    },
  });

  const filteredUsers = (users as User[]).filter((user: User) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const onCreateSubmit = (data: UserFormData) => {
    const { confirmPassword, ...userData } = data;
    createUserMutation.mutate(userData);
  };

  const onEditSubmit = (data: Partial<User>) => {
    if (editingUser) {
      updateUserMutation.mutate({ ...data, id: editingUser.id });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    editForm.reset({
      username: user.username,
      role: user.role,
      email: user.email || "",
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      isActive: user.isActive,
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("⚠️ Permanently deactivate this user entity?")) {
      deleteUserMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen cyber-grid">
      <div className="container mx-auto p-6 space-y-8">
        {/* Futuristic Header */}
        <div className="admin-header floating">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Shield className="w-12 h-12 text-cyan-400 neon-glow" />
                <Activity className="w-6 h-6 text-purple-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <h1 className="text-4xl font-bold holographic-text">
                  User Management System
                </h1>
                <p className="text-cyan-400 text-lg mt-1 flex items-center">
                  <Database className="w-5 h-5 mr-2" />
                  Advanced user control & access management interface
                </p>
              </div>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="btn-neon group">
                  <UserPlus className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  <span className="relative z-10">Initialize New User</span>
                  <Zap className="w-4 h-4 ml-2 opacity-70" />
                </Button>
              </DialogTrigger>
              <DialogContent className="glass-card sm:max-w-md border-cyan-500/30">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400 text-xl flex items-center">
                    <Star className="w-6 h-6 mr-2 text-purple-400" />
                    Initialize New User Protocol
                  </DialogTitle>
                  <DialogDescription className="text-cyan-300/80">
                    Deploy a new user entity to the system with quantum-encrypted access permissions.
                  </DialogDescription>
                </DialogHeader>
                <Form {...createForm}>
                  <form onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                    <FormField
                      control={createForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-cyan-400">Username ID</FormLabel>
                          <FormControl>
                            <Input placeholder="◈ Enter unique identifier" {...field} className="bg-transparent border-cyan-500/30" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-cyan-400">First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="First name" {...field} className="bg-transparent border-cyan-500/30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-cyan-400">Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Last name" {...field} className="bg-transparent border-cyan-500/30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={createForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-cyan-400">Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email" {...field} className="bg-transparent border-cyan-500/30" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={createForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-cyan-400">Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="◈ Secure password" {...field} className="bg-transparent border-cyan-500/30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={createForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-cyan-400">Confirm Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="◈ Confirm password" {...field} className="bg-transparent border-cyan-500/30" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={createForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-cyan-400">Access Level</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-transparent border-cyan-500/30">
                                <SelectValue placeholder="Select access level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="glass-card border-cyan-500/30">
                              <SelectItem value="User" className="text-cyan-400">Standard User</SelectItem>
                              <SelectItem value="Admin" className="text-purple-400">System Administrator</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={createForm.control}
                      name="isActive"
                      render={({ field }) => (
                        <FormItem className="glass-card p-4 rounded-lg border-cyan-500/30">
                          <div className="flex items-center justify-between">
                            <div>
                              <FormLabel className="text-cyan-400">Entity Status</FormLabel>
                              <div className="text-sm text-cyan-300/60">Enable quantum access protocols</div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value ?? true}
                                onCheckedChange={field.onChange}
                                className="data-[state=checked]:bg-cyan-500"
                              />
                            </FormControl>
                          </div>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="border-cyan-500/30">
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createUserMutation.isPending} className="btn-neon">
                        {createUserMutation.isPending ? (
                          <>
                            <Activity className="w-4 h-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4 mr-2" />
                            Deploy Entity
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Quantum Search Interface */}
        <div className="glass-card p-6 neon-glow">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 h-5 w-5 animate-pulse" />
              <Input
                placeholder="◈ Quantum search: users, entities, permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-transparent border-cyan-500/30 text-cyan-100 placeholder-cyan-400/60 h-12 text-lg focus:border-cyan-400 focus:ring-cyan-400/20"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <Network className="w-5 h-5 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Quantum User Registry */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold holographic-text flex items-center">
              <UserIcon className="w-8 h-8 mr-3 text-cyan-400" />
              Active User Registry
              <Badge variant="secondary" className="ml-4 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {filteredUsers.length} entities
              </Badge>
            </h2>
            <div className="flex items-center space-x-2 text-cyan-400">
              {isLoading ? (
                <>
                  <Activity className="w-5 h-5 animate-spin" />
                  <span>Quantum sync in progress...</span>
                </>
              ) : (
                <>
                  <Database className="w-5 h-5" />
                  <span>{filteredUsers.length} active entities detected</span>
                </>
              )}
            </div>
          </div>
          
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12">
                <Cpu className="w-12 h-12 mx-auto text-cyan-400 animate-spin mb-4" />
                <p className="text-cyan-400">Accessing quantum user database...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <UserIcon className="w-12 h-12 mx-auto text-cyan-400/50 mb-4" />
                <p className="text-cyan-400/70">
                  {searchTerm ? "No entities match your quantum search parameters" : "No user entities found in the registry"}
                </p>
              </div>
            ) : (
              filteredUsers.map((user: User) => (
                <div key={user.id} className="user-row animate-slide-up">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center neon-glow">
                          {user.role === "Admin" ? (
                            <Shield className="h-6 w-6 text-white" />
                          ) : (
                            <UserIcon className="h-6 w-6 text-white" />
                          )}
                        </div>
                        {user.isActive && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-cyan-100">{user.username}</h3>
                          <Badge className={user.role === "Admin" ? "role-badge-admin" : "role-badge-user"}>
                            {user.role === "Admin" ? "ADMIN" : "USER"}
                          </Badge>
                          {!user.isActive && (
                            <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                              INACTIVE
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-cyan-400/70 mt-1">
                          {user.firstName && user.lastName && (
                            <span>{user.firstName} {user.lastName} • </span>
                          )}
                          {user.email && <span>{user.email}</span>}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(user)}
                        className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modify
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit User Dialog */}
        <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
          <DialogContent className="glass-card sm:max-w-md border-cyan-500/30">
            <DialogHeader>
              <DialogTitle className="text-cyan-400 text-xl flex items-center">
                <Edit className="w-6 h-6 mr-2 text-purple-400" />
                Modify User Entity
              </DialogTitle>
              <DialogDescription className="text-cyan-300/80">
                Update user entity parameters and access permissions.
              </DialogDescription>
            </DialogHeader>
            {editingUser && (
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                  <FormField
                    control={editForm.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyan-400">Username ID</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-transparent border-cyan-500/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={editForm.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-cyan-400">First Name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="bg-transparent border-cyan-500/30" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={editForm.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-cyan-400">Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className="bg-transparent border-cyan-500/30" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={editForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyan-400">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} value={field.value || ""} className="bg-transparent border-cyan-500/30" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-cyan-400">Access Level</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-transparent border-cyan-500/30">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="glass-card border-cyan-500/30">
                            <SelectItem value="User" className="text-cyan-400">Standard User</SelectItem>
                            <SelectItem value="Admin" className="text-purple-400">System Administrator</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={editForm.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="glass-card p-4 rounded-lg border-cyan-500/30">
                        <div className="flex items-center justify-between">
                          <div>
                            <FormLabel className="text-cyan-400">Entity Status</FormLabel>
                            <div className="text-sm text-cyan-300/60">Enable quantum access protocols</div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value ?? true}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-cyan-500"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setEditingUser(null)} className="border-cyan-500/30">
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateUserMutation.isPending} className="btn-neon">
                      {updateUserMutation.isPending ? (
                        <>
                          <Activity className="w-4 h-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Update Entity
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}