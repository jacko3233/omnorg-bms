import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Hire from "@/pages/hire";
import NewJob from "@/pages/new-job";
import NewHireJob from "@/pages/hire/new-job";
import LESJobs from "@/pages/les-jobs";
import NewLESJob from "@/pages/new-les-job";
import FabricationJobs from "@/pages/fabrication-jobs";
import NewFabricationJob from "@/pages/new-fabrication-job";
import SalesJobs from "@/pages/sales-jobs";
import NewSalesJob from "@/pages/new-sales-job";
import TestingJobs from "@/pages/testing-jobs";
import NewTestingJob from "@/pages/new-testing-job";
import LiveJobs from "@/pages/live-jobs";
import Clients from "@/pages/clients";
import NewClient from "@/pages/new-client";
import ClientLogin from "@/pages/client-login";
import ClientApplication from "@/pages/client-application";
import ApplicationAdmin from "@/pages/application-admin";
import AdminUsers from "@/pages/admin/users-2050";
import AdminSettings from "@/pages/admin/settings";
import DeliveryNotes from "@/pages/delivery-notes";
import HireJobDetail from "@/pages/hire-job-detail";
import FabricationJobDetail from "@/pages/fabrication-job-detail";
import SalesJobDetail from "@/pages/sales-job-detail";
import TestingJobDetail from "@/pages/testing-job-detail";
import TransportJobDetail from "@/pages/transport-job-detail";
import PerformanceDashboard from "@/pages/performance-dashboard";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/hire" component={Hire} />
      <Route path="/hire/new-job" component={NewHireJob} />
      <Route path="/hire/live-jobs" component={LiveJobs} />
      <Route path="/hire/job/:id" component={HireJobDetail} />
      <Route path="/clients" component={Clients} />
      <Route path="/clients/new" component={NewClient} />
      <Route path="/les-jobs" component={LESJobs} />
      <Route path="/transport-jobs" component={LESJobs} />
      <Route path="/transport-jobs/new" component={NewLESJob} />
      <Route path="/les-jobs/new" component={NewLESJob} />
      <Route path="/transport/job/:id" component={TransportJobDetail} />
      <Route path="/fabrication-jobs" component={FabricationJobs} />
      <Route path="/fabrication-jobs/new" component={NewFabricationJob} />
      <Route path="/fabrication/job/:id" component={FabricationJobDetail} />
      <Route path="/sales-jobs" component={SalesJobs} />
      <Route path="/sales-jobs/new" component={NewSalesJob} />
      <Route path="/sales/job/:id" component={SalesJobDetail} />
      <Route path="/testing-jobs" component={TestingJobs} />
      <Route path="/testing-jobs/new" component={NewTestingJob} />
      <Route path="/testing/job/:id" component={TestingJobDetail} />
      <Route path="/live-jobs" component={LiveJobs} />
      <Route path="/client-login" component={ClientLogin} />
      <Route path="/credit-application" component={ClientApplication} />
      <Route path="/admin/applications" component={ApplicationAdmin} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/settings" component={AdminSettings} />
      <Route path="/performance" component={PerformanceDashboard} />
      <Route path="/delivery-notes" component={DeliveryNotes} />
      <Route path="/purchase-orders" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
