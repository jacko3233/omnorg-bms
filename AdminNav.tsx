import { Link, useLocation } from "wouter";
import { Users, Settings, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminNav() {
  const [location] = useLocation();

  const navItems = [
    { path: "/admin/users", label: "User Management", icon: Users },
    { path: "/admin/settings", label: "System Settings", icon: Settings },
  ];

  return (
    <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 p-3 md:p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 md:space-x-3">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <h1 className="text-lg md:text-xl font-semibold text-slate-100 tracking-wide">Admin Panel</h1>
        </div>
        
        <nav className="flex space-x-1 md:space-x-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} href={path}>
              <Button
                variant={location === path ? "default" : "ghost"}
                size="sm"
                className={`flex items-center space-x-1 md:space-x-2 text-xs md:text-sm touch-manipulation min-h-[40px] px-2 md:px-3 ${
                  location === path 
                    ? "bg-slate-700 text-slate-100 hover:bg-slate-600" 
                    : "text-slate-300 hover:text-slate-100 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{label.split(' ')[0]}</span>
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}