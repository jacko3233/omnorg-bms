import { FileText, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeliveryStats {
  pending: number;
  completed: number;
  thisMonth: number;
}

interface DeliveryNotesProps {
  stats?: DeliveryStats;
  onManageDeliveries?: () => void;
}

export function DeliveryNotes({ 
  stats = { pending: 12, completed: 48, thisMonth: 156 },
  onManageDeliveries 
}: DeliveryNotesProps) {
  return (
    <div className="glass-effect rounded-2xl p-6 animate-slide-up" style={{ animationDelay: "1.0s" }}>
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <FileText className="text-green-600 w-5 h-5 mr-3" />
        DELIVERY NOTES
      </h3>
      
      <Button 
        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        onClick={onManageDeliveries}
      >
        <div className="flex items-center justify-center space-x-2">
          <Truck className="w-5 h-5" />
          <span>Manage Deliveries</span>
        </div>
      </Button>
      
      <div className="mt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Pending:</span>
          <span className="font-semibold text-orange-600">{stats.pending}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Completed:</span>
          <span className="font-semibold text-green-600">{stats.completed}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">This Month:</span>
          <span className="font-semibold text-blue-600">{stats.thisMonth}</span>
        </div>
      </div>
    </div>
  );
}
