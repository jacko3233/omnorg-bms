import { ArrowLeft, UserPlus, FileCheck, Clock, CheckCircle, Users, Eye } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Client } from "@shared/schema";

interface CompanyConfig {
  name: string;
  tagline: string;
}

// White-label configuration
const companyConfig: CompanyConfig = {
  name: "Your Company",
  tagline: "Eng Services Ltd"
};

export default function Clients() {
  const [, setLocation] = useLocation();

  // Fetch clients for approved count
  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["/api/clients"],
  });

  // For demo - simulate pending reviews (would come from a separate pending_applications table in real system)
  const pendingReviews = 3; // This would be a query to count pending applications

  const cardActions = [
    {
      title: "ADD NEW CLIENT",
      subtitle: "Register new client account", 
      icon: UserPlus,
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      onClick: () => setLocation("/clients/new")
    },
    {
      title: "REVIEW CLIENTS", 
      subtitle: `${pendingReviews} pending review${pendingReviews > 1 ? 's' : ''}`,
      icon: FileCheck,
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      badge: pendingReviews > 0 ? pendingReviews : undefined,
      onClick: () => setLocation("/admin/applications")
    }
  ];

  const formatDate = (date: Date | null) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Section */}
      <div className="bg-red-600 text-white p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-white hover:bg-red-700">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="bg-white text-red-600 rounded-lg p-3 font-bold text-lg">
              {companyConfig.name.toUpperCase()}
            </div>
            <span className="text-lg font-medium">{companyConfig.tagline}</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-red-100">Total Clients</div>
            <div className="text-2xl font-bold">{clients.length}</div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-2">CLIENT MANAGEMENT</h1>
          <p className="text-lg text-gray-600">Manage client accounts and review applications</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {cardActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={action.title}
                onClick={action.onClick}
                className={`${action.color} ${action.hoverColor} text-white p-8 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl relative overflow-hidden group`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <IconComponent className="w-12 h-12" />
                    {action.badge && (
                      <Badge className="bg-red-500 text-white text-lg px-3 py-1 animate-pulse">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{action.title}</h3>
                  <p className="text-lg opacity-90">{action.subtitle}</p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </button>
            );
          })}
        </div>

        {/* Current Clients Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center">
              <Users className="w-8 h-8 mr-3 text-blue-600" />
              APPROVED CLIENTS
            </h2>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {clients.length} Active
              </Badge>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4 animate-spin" />
              <p className="text-gray-600">Loading clients...</p>
            </div>
          ) : clients.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No Clients Yet</h3>
              <p className="text-gray-500 mb-6">Add your first client or review pending applications</p>
              <Button 
                onClick={() => setLocation("/clients/new")}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Add First Client
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-blue-50">
                    <TableHead className="font-bold text-blue-800">Company Name</TableHead>
                    <TableHead className="font-bold text-blue-800">Email</TableHead>
                    <TableHead className="font-bold text-blue-800">Phone</TableHead>
                    <TableHead className="font-bold text-blue-800">Business Type</TableHead>
                    <TableHead className="font-bold text-blue-800">Date Added</TableHead>
                    <TableHead className="font-bold text-blue-800">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clients.map((client) => (
                    <TableRow key={client.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{client.companyName}</TableCell>
                      <TableCell>{client.email || "N/A"}</TableCell>
                      <TableCell>{client.telephone || "N/A"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{client.businessType}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(client.createdAt)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">Client Management Workflow</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span>Client submits credit application via private portal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span>Review application in the admin panel</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span>Approve to add client to database</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}