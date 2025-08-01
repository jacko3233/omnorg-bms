import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertClientSchema, insertJobSchema, insertJobItemSchema, insertAdminSettingsSchema } from "@shared/schema";
import { aiHelpService } from "./ai-service";

export async function registerRoutes(app: Express): Promise<Server> {
  // Route listing endpoint - returns all available routes
  app.get("/api/routes", async (req, res) => {
    const routes = [
      // User management routes
      { path: "/api/users", methods: ["GET"], type: "User", description: "Get all users" },
      { path: "/api/users/:id", methods: ["GET"], type: "User", description: "Get user by ID" },
      { path: "/api/users", methods: ["POST"], type: "User", description: "Create new user" },
      { path: "/api/users/:id", methods: ["PUT"], type: "User", description: "Update user" },
      { path: "/api/users/:id", methods: ["DELETE"], type: "User", description: "Delete user" },
      
      // Admin settings routes
      { path: "/api/admin/settings", methods: ["GET"], type: "Admin", description: "Get all admin settings" },
      { path: "/api/admin/settings/:key", methods: ["GET"], type: "Admin", description: "Get admin setting by key" },
      { path: "/api/admin/settings", methods: ["POST"], type: "Admin", description: "Create new admin setting" },
      { path: "/api/admin/settings/:key", methods: ["PUT"], type: "Admin", description: "Update admin setting" },
      { path: "/api/admin/settings/:key", methods: ["DELETE"], type: "Admin", description: "Delete admin setting" },
      
      // Client management routes
      { path: "/api/clients", methods: ["GET"], type: "User", description: "Get all clients" },
      { path: "/api/clients/:id", methods: ["GET"], type: "User", description: "Get client by ID" },
      { path: "/api/clients", methods: ["POST"], type: "User", description: "Create new client" },
      { path: "/api/clients/:id", methods: ["PUT"], type: "User", description: "Update client" },
      { path: "/api/clients/:id", methods: ["DELETE"], type: "User", description: "Delete client" },
      
      // Job management routes
      { path: "/api/jobs", methods: ["GET"], type: "User", description: "Get all jobs" },
      { path: "/api/jobs/:id", methods: ["GET"], type: "User", description: "Get job by ID" },
      { path: "/api/jobs", methods: ["POST"], type: "User", description: "Create new job" },
      { path: "/api/jobs/:id", methods: ["PUT"], type: "User", description: "Update job" },
      { path: "/api/jobs/:id", methods: ["DELETE"], type: "User", description: "Delete job" },
      
      // Job items routes
      { path: "/api/jobs/:jobId/items", methods: ["GET"], type: "User", description: "Get job items" },
      { path: "/api/jobs/:jobId/items", methods: ["POST"], type: "User", description: "Create job item" },
      { path: "/api/job-items/:id", methods: ["PUT"], type: "User", description: "Update job item" },
      { path: "/api/job-items/:id", methods: ["DELETE"], type: "User", description: "Delete job item" },
      
      // Special routes
      { path: "/api/routes", methods: ["GET"], type: "User", description: "List all available routes" }
    ];
    
    res.json(routes);
  });

  // User routes
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response for security
      const safeUsers = users.map(({ password, ...user }) => user);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      // Remove password from response for security
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      // Remove password from response for security
      const { password, ...safeUser } = user;
      res.status(201).json(safeUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(400).json({ error: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.updateUser(req.params.id, req.body);
      // Remove password from response for security
      const { password, ...safeUser } = user;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      await storage.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  // Admin settings routes
  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getAllAdminSettings();
      res.json(settings);
    } catch (error) {
      console.error("Error fetching admin settings:", error);
      res.status(500).json({ error: "Failed to fetch admin settings" });
    }
  });

  app.get("/api/admin/settings/:key", async (req, res) => {
    try {
      const setting = await storage.getAdminSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ error: "Admin setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching admin setting:", error);
      res.status(500).json({ error: "Failed to fetch admin setting" });
    }
  });

  app.post("/api/admin/settings", async (req, res) => {
    try {
      const validatedData = insertAdminSettingsSchema.parse(req.body);
      const setting = await storage.createAdminSetting(validatedData);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating admin setting:", error);
      res.status(400).json({ error: "Failed to create admin setting" });
    }
  });

  app.put("/api/admin/settings/:key", async (req, res) => {
    try {
      const setting = await storage.updateAdminSetting(req.params.key, req.body);
      res.json(setting);
    } catch (error) {
      console.error("Error updating admin setting:", error);
      res.status(500).json({ error: "Failed to update admin setting" });
    }
  });

  app.delete("/api/admin/settings/:key", async (req, res) => {
    try {
      await storage.deleteAdminSetting(req.params.key);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting admin setting:", error);
      res.status(500).json({ error: "Failed to delete admin setting" });
    }
  });

  // Client routes
  app.get("/api/clients", async (req, res) => {
    try {
      const clients = await storage.getAllClients();
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.getClient(req.params.id);
      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }
      res.json(client);
    } catch (error) {
      console.error("Error fetching client:", error);
      res.status(500).json({ error: "Failed to fetch client" });
    }
  });

  app.post("/api/clients", async (req, res) => {
    try {
      const validatedData = insertClientSchema.parse(req.body);
      const client = await storage.createClient(validatedData);
      res.status(201).json(client);
    } catch (error) {
      console.error("Error creating client:", error);
      res.status(400).json({ error: "Failed to create client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const client = await storage.updateClient(req.params.id, req.body);
      res.json(client);
    } catch (error) {
      console.error("Error updating client:", error);
      res.status(500).json({ error: "Failed to update client" });
    }
  });

  app.delete("/api/clients/:id", async (req, res) => {
    try {
      await storage.deleteClient(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting client:", error);
      res.status(500).json({ error: "Failed to delete client" });
    }
  });

  // Approve client application
  app.put("/api/clients/:id/approve", async (req, res) => {
    try {
      const client = await storage.updateClient(req.params.id, { 
        status: 'approved'
      });
      res.json(client);
    } catch (error) {
      console.error("Error approving client:", error);
      res.status(500).json({ error: "Failed to approve client" });
    }
  });

  // Reject client application
  app.put("/api/clients/:id/reject", async (req, res) => {
    try {
      const client = await storage.updateClient(req.params.id, { 
        status: 'rejected'
      });
      res.json(client);
    } catch (error) {
      console.error("Error rejecting client:", error);
      res.status(500).json({ error: "Failed to reject client" });
    }
  });

  // Job routes
  app.get("/api/jobs", async (req, res) => {
    try {
      const jobs = await storage.getAllJobs();
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ error: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.getJob(req.params.id);
      if (!job) {
        return res.status(404).json({ error: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ error: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs", async (req, res) => {
    try {
      const validatedData = insertJobSchema.parse(req.body);
      const job = await storage.createJob(validatedData);
      res.status(201).json(job);
    } catch (error) {
      console.error("Error creating job:", error);
      res.status(400).json({ error: "Failed to create job" });
    }
  });

  app.put("/api/jobs/:id", async (req, res) => {
    try {
      const job = await storage.updateJob(req.params.id, req.body);
      res.json(job);
    } catch (error) {
      console.error("Error updating job:", error);
      res.status(500).json({ error: "Failed to update job" });
    }
  });

  // Job items routes
  app.get("/api/jobs/:jobId/items", async (req, res) => {
    try {
      const items = await storage.getJobItems(req.params.jobId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching job items:", error);
      res.status(500).json({ error: "Failed to fetch job items" });
    }
  });

  app.post("/api/jobs/:jobId/items", async (req, res) => {
    try {
      const validatedData = insertJobItemSchema.parse({
        ...req.body,
        jobId: req.params.jobId
      });
      const item = await storage.createJobItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating job item:", error);
      res.status(400).json({ error: "Failed to create job item" });
    }
  });

  // Job items bulk save
  app.post("/api/job-items/bulk", async (req, res) => {
    try {
      const { jobId, items } = req.body;
      if (!jobId || !Array.isArray(items)) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      // Clear existing items for this job first
      await storage.deleteJobItemsByJobId(jobId);

      // Create new items
      const createdItems = [];
      for (const item of items) {
        const validatedData = insertJobItemSchema.parse({
          ...item,
          jobId: jobId
        });
        const createdItem = await storage.createJobItem(validatedData);
        createdItems.push(createdItem);
      }
      
      res.json(createdItems);
    } catch (error) {
      console.error("Error bulk saving job items:", error);
      res.status(400).json({ error: "Failed to save job items" });
    }
  });

  // Get job items by job ID (alternative endpoint)
  app.get("/api/job-items/:jobId", async (req, res) => {
    try {
      const items = await storage.getJobItems(req.params.jobId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching job items:", error);
      res.status(500).json({ error: "Failed to fetch job items" });
    }
  });

  app.put("/api/job-items/:id", async (req, res) => {
    try {
      const item = await storage.updateJobItem(req.params.id, req.body);
      res.json(item);
    } catch (error) {
      console.error("Error updating job item:", error);
      res.status(500).json({ error: "Failed to update job item" });
    }
  });

  app.delete("/api/job-items/:id", async (req, res) => {
    try {
      await storage.deleteJobItem(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting job item:", error);
      res.status(500).json({ error: "Failed to delete job item" });
    }
  });

  // AI Contextual Help endpoint
  app.post("/api/ai/contextual-help", async (req, res) => {
    try {
      const { currentPage, userAction, pageData, userRole, recentErrors } = req.body;
      
      const recommendations = await aiHelpService.generateContextualHelp({
        currentPage,
        userAction,
        pageData,
        userRole,
        recentErrors
      });
      
      res.json(recommendations);
    } catch (error) {
      console.error("AI Contextual Help Error:", error);
      res.status(500).json({ error: "Failed to generate contextual help" });
    }
  });

  // AI Workflow Suggestions endpoint
  app.post("/api/ai/workflow-suggestions", async (req, res) => {
    try {
      const { jobData, department, jobStatus } = req.body;
      
      const suggestions = await aiHelpService.generateWorkflowSuggestions({
        jobData,
        department,
        jobStatus
      });
      
      res.json({ suggestions });
    } catch (error) {
      console.error("AI Workflow Suggestions Error:", error);
      res.status(500).json({ error: "Failed to generate workflow suggestions" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
