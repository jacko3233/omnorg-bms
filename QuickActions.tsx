import { Plus, BarChart3, Users, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  onNewProject?: () => void;
  onViewReports?: () => void;
  onManageUsers?: () => void;
}

export function QuickActions({
  onNewProject,
  onViewReports,
  onManageUsers
}: QuickActionsProps) {
  return (
    <div className="glass-effect rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "1.2s" }}>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Zap className="text-yellow-500 w-5 h-5 mr-3" />
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start space-x-3 py-3 px-4 text-left hover:shadow-md transition-all duration-300"
          onClick={onNewProject}
        >
          <Plus className="text-blue-600 w-4 h-4" />
          <span>New Project</span>
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start space-x-3 py-3 px-4 text-left hover:shadow-md transition-all duration-300"
          onClick={onViewReports}
        >
          <BarChart3 className="text-indigo-600 w-4 h-4" />
          <span>View Reports</span>
        </Button>
        
        <Button
          variant="outline"
          className="w-full justify-start space-x-3 py-3 px-4 text-left hover:shadow-md transition-all duration-300"
          onClick={onManageUsers}
        >
          <Users className="text-green-600 w-4 h-4" />
          <span>Manage Users</span>
        </Button>
      </div>
    </div>
  );
}
