import fs from 'fs';
import axios from 'axios';

// Comprehensive route report for the business management system
const routes = [
  // User management routes
  { path: "/api/users", methods: ["GET"], type: "User", description: "Get all users", access: "authenticated" },
  { path: "/api/users/:id", methods: ["GET"], type: "User", description: "Get user by ID", access: "authenticated" },
  { path: "/api/users", methods: ["POST"], type: "User", description: "Create new user", access: "admin" },
  { path: "/api/users/:id", methods: ["PUT"], type: "User", description: "Update user", access: "admin" },
  { path: "/api/users/:id", methods: ["DELETE"], type: "User", description: "Delete user", access: "admin" },
  
  // Admin settings routes
  { path: "/api/admin/settings", methods: ["GET"], type: "Admin", description: "Get all admin settings", access: "admin" },
  { path: "/api/admin/settings/:key", methods: ["GET"], type: "Admin", description: "Get admin setting by key", access: "admin" },
  { path: "/api/admin/settings", methods: ["POST"], type: "Admin", description: "Create new admin setting", access: "admin" },
  { path: "/api/admin/settings/:key", methods: ["PUT"], type: "Admin", description: "Update admin setting", access: "admin" },
  { path: "/api/admin/settings/:key", methods: ["DELETE"], type: "Admin", description: "Delete admin setting", access: "admin" },
  
  // Client management routes
  { path: "/api/clients", methods: ["GET"], type: "User", description: "Get all clients", access: "authenticated" },
  { path: "/api/clients/:id", methods: ["GET"], type: "User", description: "Get client by ID", access: "authenticated" },
  { path: "/api/clients", methods: ["POST"], type: "User", description: "Create new client", access: "authenticated" },
  { path: "/api/clients/:id", methods: ["PUT"], type: "User", description: "Update client", access: "authenticated" },
  { path: "/api/clients/:id", methods: ["DELETE"], type: "User", description: "Delete client", access: "authenticated" },
  
  // Job management routes
  { path: "/api/jobs", methods: ["GET"], type: "User", description: "Get all jobs", access: "authenticated" },
  { path: "/api/jobs/:id", methods: ["GET"], type: "User", description: "Get job by ID", access: "authenticated" },
  { path: "/api/jobs", methods: ["POST"], type: "User", description: "Create new job", access: "authenticated" },
  { path: "/api/jobs/:id", methods: ["PUT"], type: "User", description: "Update job", access: "authenticated" },
  { path: "/api/jobs/:id", methods: ["DELETE"], type: "User", description: "Delete job", access: "authenticated" },
  
  // Job items routes
  { path: "/api/jobs/:jobId/items", methods: ["GET"], type: "User", description: "Get job items", access: "authenticated" },
  { path: "/api/jobs/:jobId/items", methods: ["POST"], type: "User", description: "Create job item", access: "authenticated" },
  { path: "/api/job-items/:id", methods: ["PUT"], type: "User", description: "Update job item", access: "authenticated" },
  { path: "/api/job-items/:id", methods: ["DELETE"], type: "User", description: "Delete job item", access: "authenticated" }
];

async function testRoutes() {
  const baseUrl = 'http://localhost:5000';
  const report = {
    timestamp: new Date().toISOString(),
    totalRoutes: routes.length,
    routesByType: {
      User: routes.filter(r => r.type === 'User').length,
      Admin: routes.filter(r => r.type === 'Admin').length
    },
    routesByAccess: {
      authenticated: routes.filter(r => r.access === 'authenticated').length,
      admin: routes.filter(r => r.access === 'admin').length
    },
    routes: []
  };

  for (const route of routes) {
    const routeReport = {
      ...route,
      tested: false,
      status: null,
      error: null
    };

    // Test GET routes only for safety
    if (route.methods.includes('GET')) {
      try {
        // Use a simple path without parameters for testing
        let testPath = route.path.replace('/:id', '/test-id').replace('/:jobId', '/test-job-id').replace('/:key', '/test-key');
        const response = await axios.get(`${baseUrl}${testPath}`, { timeout: 5000 });
        routeReport.tested = true;
        routeReport.status = response.status;
      } catch (error) {
        routeReport.tested = true;
        routeReport.status = error.response ? error.response.status : 'ERROR';
        routeReport.error = error.message;
      }
    }

    report.routes.push(routeReport);
  }

  return report;
}

// Generate report
testRoutes().then(report => {
  fs.writeFileSync('route_report.json', JSON.stringify(report, null, 2));
  console.log('✔ Route testing complete. Report saved to route_report.json');
  console.log(`Total routes tested: ${report.routes.filter(r => r.tested).length}/${report.totalRoutes}`);
  console.log(`User routes: ${report.routesByType.User}, Admin routes: ${report.routesByType.Admin}`);
}).catch(error => {
  console.error('Error testing routes:', error);
});