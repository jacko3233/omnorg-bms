import { Building2, Users, DollarSign, FileText, TrendingUp, AlertCircle, Download } from "lucide-react";
import omnorLogo from "@assets/omnorgroup_logo_1753734315943.png";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContextualHelp from "@/components/ContextualHelp";
import type { Job, Client } from "@shared/schema";
import { memo, useMemo, useCallback, useEffect } from "react";
import { isMobile, isLowEndDevice, observePerformance } from "@/utils/performance";

interface CompanyConfig {
  name: string;
  tagline: string;
  brandColor?: string;
  deliveryColor?: string;
}

// Omnor Group branding configuration
const companyConfig: CompanyConfig = {
  name: "OMNOR GROUP",
  tagline: "Built from the North. Delivered Worldwide.",
  brandColor: "#1e3a8a", // Deep blue from logo
  deliveryColor: "#64748b" // Slate gray from logo
};

// Dashboard Cards Component - Memoized for performance
const DashboardCards = memo(function DashboardCards() {
  const { data: jobs = [] } = useQuery<Job[]>({
    queryKey: ['/api/jobs'],
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false, // Reduce unnecessary refetches on mobile
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    staleTime: 60000, // Cache for 1 minute
    refetchOnWindowFocus: false,
  });

  // Memoize expensive calculations
  const metrics = useMemo(() => {
    const liveJobs = (jobs as Job[]).filter(job => 
      job.jobStatus === 'OPEN' || job.jobStatus === 'IN_PROGRESS'
    ).length;

    const completedNotInvoiced = (jobs as Job[]).filter(job => 
      job.jobStatus === 'COMPLETED' && !job.invoiced
    );

    const totalAmountNotInvoiced = completedNotInvoiced.reduce((sum, job) => 
      sum + (parseFloat(job.costNett || '0') || 0), 0
    );

    return { liveJobs, completedNotInvoiced, totalAmountNotInvoiced };
  }, [jobs]);

  const { liveJobs, completedNotInvoiced, totalAmountNotInvoiced } = metrics;

  const generateInvoice = useCallback(() => {
    // Create invoice HTML content
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .logo { font-size: 24px; font-weight: bold; color: #dc2626; }
          .address { margin: 20px 0; }
          .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          .table th { background-color: #f2f2f2; }
          .total { font-weight: bold; font-size: 18px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">YOUR COMPANY LTD</div>
          <div class="address">
            Humpty Dumpty Lane<br>
            Engineering Services Division<br>
            Tel: 01234 567890
          </div>
        </div>
        
        <h2>INVOICE</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        
        <table class="table">
          <thead>
            <tr>
              <th>Transport Code</th>
              <th>Description</th>
              <th>Amount (£)</th>
            </tr>
          </thead>
          <tbody>
            ${completedNotInvoiced.map(job => `
              <tr>
                <td>${job.jobLes}</td>
                <td>${job.description || 'Transport Services'}</td>
                <td>£${parseFloat(job.costNett || '0').toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="total">
              <td colspan="2">TOTAL</td>
              <td>£${totalAmountNotInvoiced.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <p><em>Generated from Transport Database System</em></p>
      </body>
      </html>
    `;

    // Create and download the invoice
    const blob = new Blob([invoiceHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [completedNotInvoiced]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 md:gap-4">
      {/* Active Jobs */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 md:p-5">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-sm md:text-base font-medium text-slate-100">Active Jobs</h3>
          </div>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-slate-100 mb-1 md:mb-2">{liveJobs}</div>
        <p className="text-slate-400 text-xs md:text-sm">Currently in progress</p>
      </div>

      {/* Pending Invoices */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 md:p-5">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-sm md:text-base font-medium text-slate-100">Pending Invoices</h3>
          </div>
        </div>
        <div className="text-2xl md:text-3xl font-bold text-slate-100 mb-1 md:mb-2">{completedNotInvoiced.length}</div>
        <p className="text-slate-400 text-xs md:text-sm">Ready for invoicing</p>
      </div>

      {/* Outstanding Revenue */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 md:p-5">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h3 className="text-sm md:text-base font-medium text-slate-100">Outstanding Revenue</h3>
          </div>
        </div>
        <div className="text-xl md:text-3xl font-bold text-slate-100 mb-1 md:mb-2">£{totalAmountNotInvoiced.toFixed(2)}</div>
        <p className="text-slate-400 text-xs md:text-sm">Awaiting collection</p>
      </div>

      {/* Invoice Generator */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 md:p-5">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
            </div>
            <h3 className="text-sm md:text-base font-medium text-slate-100">Invoice Generator</h3>
          </div>
        </div>
        <Button 
          onClick={generateInvoice}
          disabled={completedNotInvoiced.length === 0}
          className="w-full bg-slate-700 hover:bg-slate-600 active:bg-slate-600 text-slate-100 border-slate-600 text-xs md:text-sm touch-manipulation min-h-[44px]"
        >
          <Download className="w-3 h-3 md:w-4 md:h-4 mr-2" />
          Generate Invoice ({completedNotInvoiced.length})
        </Button>
        {completedNotInvoiced.length === 0 && (
          <p className="text-slate-400 text-xs mt-2 text-center">
            No jobs ready for invoicing
          </p>
        )}
      </div>
    </div>
  );
});

export default function Home() {
  const [, setLocation] = useLocation();

  // Initialize performance monitoring
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      observePerformance();
    }
  }, []);

  // Optimize for mobile devices
  const mobileOptimizations = useMemo(() => {
    const mobile = isMobile();
    const lowEnd = isLowEndDevice();
    
    return {
      isMobile: mobile,
      isLowEndDevice: lowEnd,
      reducedAnimations: lowEnd,
      optimizedBlur: mobile
    };
  }, []);

  // Memoize department configuration to prevent unnecessary re-renders
  const departments = useMemo(() => [
    {
      name: "TRANSPORT",
      code: "TRS",  
      onClick: () => setLocation("/transport-jobs")
    },
    {
      name: "HIRE",
      code: "HIR",  
      onClick: () => setLocation("/hire")
    },
    {
      name: "FABRICATION",
      code: "FAB",  
      onClick: () => setLocation("/fabrication-jobs")
    },
    {
      name: "SALES",
      code: "SAL",  
      onClick: () => setLocation("/sales-jobs")
    },
    {
      name: "TESTING",
      code: "TST",  
      onClick: () => setLocation("/testing-jobs")
    },
    {
      name: "CLIENTS", 
      code: "CLI",
      onClick: () => setLocation("/clients")
    }
  ], [setLocation]);

  // Memoize department button rendering for performance
  const departmentButtons = useMemo(() => 
    departments.map((department, index) => (
      <button
        key={department.code}
        className="w-full bg-slate-800/50 hover:bg-slate-700/70 active:bg-slate-700/80 backdrop-blur-sm rounded-lg p-3 md:p-4 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 group touch-manipulation"
        onClick={department.onClick}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-500 to-slate-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div className="text-left">
              <div className="text-sm md:text-base font-medium text-slate-100 group-hover:text-white">
                {department.name}
              </div>
              <div className="text-xs text-slate-400 font-mono">
                {department.code}
              </div>
            </div>
          </div>
          <div className="text-slate-400 group-hover:text-slate-200 transition-colors">
            <Building2 className="w-3 h-3 md:w-4 md:h-4" />
          </div>
        </div>
      </button>
    )), [departments]);

  // Memoize quick action handlers
  const handleDeliveryNotes = useCallback(() => {
    setLocation("/delivery-notes");
  }, [setLocation]);

  const handleNewClient = useCallback(() => {
    setLocation("/clients/new");
  }, [setLocation]);

  const handlePerformanceInsights = useCallback(() => {
    setLocation("/performance");
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile-Optimized Header */}
      <div className="bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-1.5 md:p-2 border border-slate-700/30">
              <img 
                src={omnorLogo} 
                alt="Omnor Group" 
                className="h-6 md:h-8 w-auto"
                loading="eager"
                decoding="async"
              />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-semibold text-slate-100 tracking-wide">
                {companyConfig.name}
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium hidden sm:block">{companyConfig.tagline}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="flex items-center space-x-1.5 md:space-x-2 text-slate-300">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-emerald-400 rounded-full"></div>
              <span className="text-xs md:text-sm font-medium hidden sm:inline">System Active</span>
              <span className="text-xs font-medium sm:hidden">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-Responsive Main Content */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-80px)] p-4 md:p-6 gap-4 md:gap-6">
          
        {/* Mobile: Department Navigation - Full Width */}
        <div className="w-full lg:w-80 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 md:p-6">
          <div className="flex items-center mb-4 md:mb-6">
            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-slate-400 rounded-full mr-3 md:mr-4"></div>
            <h2 className="text-base md:text-lg font-semibold text-slate-100 tracking-wide">
              Business Departments
            </h2>
          </div>
          
          {/* Mobile: Grid Layout for Departments */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 md:gap-2">
            {departmentButtons}

            
            {/* Mobile-Optimized Quick Actions */}
            <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-700/50">
              <h3 className="text-sm font-medium text-slate-300 mb-3 md:mb-4 tracking-wide">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2">
                
                {/* Prominent Performance Insights Button */}
                <button
                  className="w-full bg-gradient-to-r from-blue-600/50 to-indigo-600/50 hover:from-blue-600/70 hover:to-indigo-600/70 active:from-blue-600/80 active:to-indigo-600/80 backdrop-blur-sm rounded-lg p-3 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200 group touch-manipulation"
                  onClick={handlePerformanceInsights}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-blue-100 group-hover:text-white">
                      Performance Insights
                    </span>
                  </div>
                </button>

                <button
                  className="w-full bg-slate-800/50 hover:bg-slate-700/70 active:bg-slate-700/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 group touch-manipulation"
                  onClick={handleDeliveryNotes}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-300" />
                    </div>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                      Delivery Notes
                    </span>
                  </div>
                </button>

                <button
                  className="w-full bg-slate-800/50 hover:bg-slate-700/70 active:bg-slate-700/80 backdrop-blur-sm rounded-lg p-3 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 group touch-manipulation"
                  onClick={handleNewClient}
                >
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-lg flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-slate-300" />
                    </div>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                      New Client
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Analytics - Full Width */}
        <div className="flex-1 bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 md:p-6">
          <div className="flex items-center mb-4 md:mb-6">
            <div className="w-1 h-6 md:h-8 bg-gradient-to-b from-blue-500 to-slate-400 rounded-full mr-3 md:mr-4"></div>
            <h2 className="text-base md:text-lg font-semibold text-slate-100 tracking-wide">
              Business Analytics
            </h2>
          </div>
          
          <DashboardCards />
        </div>
      </div>
      
      {/* AI-Powered Contextual Help */}
      <ContextualHelp currentPage="home" />
    </div>
  );
}