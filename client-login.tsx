import { Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Simple hardcoded credentials for demo - in production this would be more secure
const VALID_CREDENTIALS = {
  username: "client",
  password: "creditapp2024"
};

export default function ClientLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    // Simulate authentication delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (formData.username === VALID_CREDENTIALS.username && 
        formData.password === VALID_CREDENTIALS.password) {
      toast({
        title: "Login Successful",
        description: "Welcome to the credit application form",
      });
      setLocation("/credit-application");
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-red-600 text-white rounded-lg p-4 mb-6">
            <Lock className="w-12 h-12 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Client Portal</h1>
            <p className="text-red-100">Credit Application Access</p>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600 text-sm">
              Enter your credentials to access the credit application form
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700 mb-2 block">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter username"
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter password"
                  className="w-full pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading || !formData.username || !formData.password}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </div>

          {/* Demo Credentials Info */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-800 mb-2">Demo Access Credentials:</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Username:</strong> client</p>
              <p><strong>Password:</strong> creditapp2024</p>
            </div>
            <p className="text-xs text-blue-600 mt-2">
              (In production, these would be provided securely to each client)
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>Having trouble accessing the form?</p>
          <p>Contact us for assistance</p>
        </div>
      </div>
    </div>
  );
}