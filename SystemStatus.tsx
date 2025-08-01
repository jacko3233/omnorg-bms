import { Server } from "lucide-react";

interface SystemStatusProps {
  lastBackup?: string;
}

export function SystemStatus({ lastBackup = "2 hours ago" }: SystemStatusProps) {
  return (
    <div className="glass-effect rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "1.4s" }}>
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Server className="text-blue-500 w-5 h-5 mr-3" />
        System Status
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Database</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Online</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">API Services</span>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">Operational</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Last Backup</span>
          <span className="text-sm font-medium text-gray-700">{lastBackup}</span>
        </div>
      </div>
    </div>
  );
}
