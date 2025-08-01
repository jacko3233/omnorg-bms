import { ChevronRight, LucideIcon } from "lucide-react";

interface DepartmentCardProps {
  name: string;
  code: string;
  description: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  onClick?: () => void;
  delay?: number;
}

export function DepartmentCard({
  name,
  code,
  description,
  icon: Icon,
  gradientFrom,
  gradientTo,
  onClick,
  delay = 0
}: DepartmentCardProps) {
  return (
    <div 
      className="department-card glass-effect rounded-2xl p-6 animate-slide-up group"
      style={{ animationDelay: `${delay}s` }}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center`}>
            <Icon className="text-white w-6 h-6" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-gray-800">
              {name}
            </h4>
            <p className="text-gray-600 text-sm">
              ({code})
            </p>
            <p className="text-gray-500 text-xs mt-1">
              {description}
            </p>
          </div>
        </div>
        <ChevronRight className="text-gray-400 w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
      </div>
    </div>
  );
}
