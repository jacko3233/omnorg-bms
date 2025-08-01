import { Building } from "lucide-react";

interface HeaderProps {
  companyName?: string;
  tagline?: string;
}

export function Header({ 
  companyName = "Your Company", 
  tagline = "Business Management System" 
}: HeaderProps) {
  return (
    <header className="glass-effect rounded-2xl p-6 mb-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <div className="flex items-center space-x-4 mb-4 lg:mb-0">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg animate-glow">
            <Building className="text-white w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {companyName}
            </h1>
            <p className="text-gray-600 font-medium">
              {tagline}
            </p>
          </div>
        </div>
        
        <div className="text-center lg:text-right">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent animate-pulse-slow">
            MAIN PAGE
          </h2>
          <p className="text-gray-500 text-sm mt-1">Year 2050 Interface</p>
        </div>
      </div>
    </header>
  );
}
