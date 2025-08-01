import { users, clients, jobs, jobItems, adminSettings, jobCounter, type User, type InsertUser, type Client, type InsertClient, type Job, type InsertJob, type JobItem, type InsertJobItem, type AdminSettings, type InsertAdminSettings, type JobCounter, type InsertJobCounter } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getAllUsers(): Promise<User[]>;
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<void>;

  // Admin settings methods
  getAllAdminSettings(): Promise<AdminSettings[]>;
  getAdminSetting(key: string): Promise<AdminSettings | undefined>;
  createAdminSetting(setting: InsertAdminSettings): Promise<AdminSettings>;
  updateAdminSetting(key: string, setting: Partial<AdminSettings>): Promise<AdminSettings>;
  deleteAdminSetting(key: string): Promise<void>;

  // Client methods
  getAllClients(): Promise<Client[]>;
  getClient(id: string): Promise<Client | undefined>;
  createClient(insertClient: InsertClient): Promise<Client>;
  updateClient(id: string, client: Partial<Client>): Promise<Client>;
  deleteClient(id: string): Promise<void>;

  // Job methods
  getAllJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job | undefined>;
  createJob(insertJob: InsertJob): Promise<Job>;
  updateJob(id: string, job: Partial<Job>): Promise<Job>;
  deleteJob(id: string): Promise<void>;
  
  // Job counter methods
  getNextJobNumber(): Promise<number>;
  generateJobLes(jobNumber: number, department: string): string;

  // Job item methods
  getJobItems(jobId: string): Promise<JobItem[]>;
  createJobItem(insertJobItem: InsertJobItem): Promise<JobItem>;
  updateJobItem(id: string, jobItem: Partial<JobItem>): Promise<JobItem>;
  deleteJobItem(id: string): Promise<void>;
  deleteJobItemsByJobId(jobId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private clients: Map<string, Client>;
  private jobs: Map<string, Job>;
  private jobItems: Map<string, JobItem>;
  private adminSettings: Map<string, AdminSettings>;
  private jobCounter: number = 0; // Simple counter for memory storage

  constructor() {
    this.users = new Map();
    this.clients = new Map();
    this.jobs = new Map();
    this.jobItems = new Map();
    this.adminSettings = new Map();
  }

  // User methods
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const now = new Date();
    const user: User = { 
      id,
      username: insertUser.username,
      password: insertUser.password,
      role: insertUser.role || "User",
      email: insertUser.email || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      isActive: insertUser.isActive ?? true,
      createdAt: now,
      lastLogin: null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.users.has(id)) {
      throw new Error("User not found");
    }
    this.users.delete(id);
  }

  // Admin settings methods
  async getAllAdminSettings(): Promise<AdminSettings[]> {
    return Array.from(this.adminSettings.values());
  }

  async getAdminSetting(key: string): Promise<AdminSettings | undefined> {
    return this.adminSettings.get(key);
  }

  async createAdminSetting(insertSetting: InsertAdminSettings): Promise<AdminSettings> {
    const id = randomUUID();
    const now = new Date();
    const setting: AdminSettings = { 
      id,
      settingKey: insertSetting.settingKey,
      settingValue: insertSetting.settingValue || null,
      description: insertSetting.description || null,
      updatedBy: insertSetting.updatedBy || null,
      updatedAt: now
    };
    this.adminSettings.set(insertSetting.settingKey, setting);
    return setting;
  }

  async updateAdminSetting(key: string, updates: Partial<AdminSettings>): Promise<AdminSettings> {
    const setting = this.adminSettings.get(key);
    if (!setting) {
      throw new Error("Admin setting not found");
    }
    const updatedSetting = { ...setting, ...updates, updatedAt: new Date() };
    this.adminSettings.set(key, updatedSetting);
    return updatedSetting;
  }

  async deleteAdminSetting(key: string): Promise<void> {
    if (!this.adminSettings.has(key)) {
      throw new Error("Admin setting not found");
    }
    this.adminSettings.delete(key);
  }

  // Client methods
  async getAllClients(): Promise<Client[]> {
    return Array.from(this.clients.values());
  }

  async getClient(id: string): Promise<Client | undefined> {
    return this.clients.get(id);
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const id = randomUUID();
    const now = new Date();
    const client: Client = { 
      companyName: insertClient.companyName,
      tradingName: insertClient.tradingName || null,
      companyRegNo: insertClient.companyRegNo || null,
      companyVatNo: insertClient.companyVatNo || null,
      parentCompany: insertClient.parentCompany || null,
      yearsTrading: insertClient.yearsTrading || null,
      businessType: insertClient.businessType || "Limited Company",
      invoiceAddress: insertClient.invoiceAddress || null,
      deliveryAddress: insertClient.deliveryAddress || null,
      telephone: insertClient.telephone || null,
      deliveryTelephone: insertClient.deliveryTelephone || null,
      email: insertClient.email || null,
      deliveryEmail: insertClient.deliveryEmail || null,
      natureOfBusiness: insertClient.natureOfBusiness || null,
      numberOfEmployees: insertClient.numberOfEmployees || null,
      directorName: insertClient.directorName || null,
      pLedgerName: insertClient.pLedgerName || null,
      pLedgerTel: insertClient.pLedgerTel || null,
      pLedgerEmail: insertClient.pLedgerEmail || null,
      tradeRef1Name: insertClient.tradeRef1Name || null,
      tradeRef1Phone: insertClient.tradeRef1Phone || null,
      tradeRef1Website: insertClient.tradeRef1Website || null,
      tradeRef2Name: insertClient.tradeRef2Name || null,
      tradeRef2Phone: insertClient.tradeRef2Phone || null,
      tradeRef2Website: insertClient.tradeRef2Website || null,
      creditApplicationAmount: insertClient.creditApplicationAmount || null,
      bankName: insertClient.bankName || null,
      bankSortCode: insertClient.bankSortCode || null,
      bankPostCode: insertClient.bankPostCode || null,
      bankAccountNo: insertClient.bankAccountNo || null,
      electronicInvoices: insertClient.electronicInvoices || false,
      active: insertClient.active !== false,
      status: insertClient.status || 'pending',
      approvedAt: insertClient.approvedAt || null,
      rejectedAt: insertClient.rejectedAt || null,
      notes: insertClient.notes || null,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.clients.set(id, client);
    return client;
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    const client = this.clients.get(id);
    if (!client) {
      throw new Error(`Client with id ${id} not found`);
    }
    const updatedClient = { 
      ...client, 
      ...clientData, 
      updatedAt: new Date() 
    };
    this.clients.set(id, updatedClient);
    return updatedClient;
  }

  async deleteClient(id: string): Promise<void> {
    this.clients.delete(id);
  }

  // Job methods
  async getAllJobs(): Promise<Job[]> {
    return Array.from(this.jobs.values());
  }

  async getJob(id: string): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = randomUUID();
    const now = new Date();
    const jobNumber = await this.getNextJobNumber();
    const jobLes = this.generateJobLes(jobNumber, insertJob.department || 'GEN');
    
    const job: Job = { 
      jobNumber,
      jobLes,
      jobNo: insertJob.jobNo || null,
      jobStatus: insertJob.jobStatus || "OPEN",
      pm: insertJob.pm || null,
      date: insertJob.date || now,
      clientId: insertJob.clientId || null,
      description: insertJob.description || null,
      jobType: insertJob.jobType || null,
      department: insertJob.department || 'GEN',
      linkedJobRef: insertJob.linkedJobRef || null,
      costNett: insertJob.costNett || "0.00",
      quoteRef: insertJob.quoteRef || null,
      jobComplete: insertJob.jobComplete || false,
      invoiced: insertJob.invoiced || false,
      jobComments: insertJob.jobComments || null,
      purchaseOrder: insertJob.purchaseOrder || null,
      attachments: insertJob.attachments || null,
      invoiceComments: insertJob.invoiceComments || null,
      completionPhotos: null,
      photoUploadedAt: null,
      photoUploadedBy: null,
      id,
      createdAt: now,
      updatedAt: now
    };
    this.jobs.set(id, job);
    return job;
  }

  async getNextJobNumber(): Promise<number> {
    this.jobCounter += 1;
    return this.jobCounter;
  }

  generateJobLes(jobNumber: number, department: string): string {
    const paddedNumber = jobNumber.toString().padStart(6, '0');
    let prefix = 'LEG'; // Default prefix
    
    switch (department?.toUpperCase()) {
      case 'HIRE':
        prefix = 'LEH';
        break;
      case 'FABRICATION':
        prefix = 'LEF';
        break;
      case 'SALES':
        prefix = 'LES';
        break;
      case 'TESTING':
        prefix = 'LET';
        break;
      case 'TRANSPORT':
        prefix = 'LEX';
        break;
      default:
        prefix = 'LEG';
    }
    
    return `${prefix}${paddedNumber}`;
  }

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const job = this.jobs.get(id);
    if (!job) {
      throw new Error(`Job with id ${id} not found`);
    }
    const updatedJob = { 
      ...job, 
      ...jobData, 
      updatedAt: new Date() 
    };
    this.jobs.set(id, updatedJob);
    return updatedJob;
  }

  async deleteJob(id: string): Promise<void> {
    this.jobs.delete(id);
  }

  // Job item methods
  async getJobItems(jobId: string): Promise<JobItem[]> {
    return Array.from(this.jobItems.values()).filter(item => item.jobId === jobId);
  }

  async createJobItem(insertJobItem: InsertJobItem): Promise<JobItem> {
    const id = randomUUID();
    const jobItem: JobItem = { 
      jobId: insertJobItem.jobId,
      itemDescription: insertJobItem.itemDescription,
      itemAssetNo: insertJobItem.itemAssetNo || null,
      onHireDate: insertJobItem.onHireDate || null,
      offHireDate: insertJobItem.offHireDate || null,
      priceWeek: insertJobItem.priceWeek || "0.00",
      comments: insertJobItem.comments || null,
      id,
      createdAt: new Date()
    };
    this.jobItems.set(id, jobItem);
    return jobItem;
  }

  async updateJobItem(id: string, jobItemData: Partial<JobItem>): Promise<JobItem> {
    const jobItem = this.jobItems.get(id);
    if (!jobItem) {
      throw new Error(`Job item with id ${id} not found`);
    }
    const updatedJobItem = { ...jobItem, ...jobItemData };
    this.jobItems.set(id, updatedJobItem);
    return updatedJobItem;
  }

  async deleteJobItem(id: string): Promise<void> {
    this.jobItems.delete(id);
  }

  async deleteJobItemsByJobId(jobId: string): Promise<void> {
    const itemsToDelete = Array.from(this.jobItems.values())
      .filter(item => item.jobId === jobId)
      .map(item => item.id);
    
    itemsToDelete.forEach(id => this.jobItems.delete(id));
  }
}

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  // User methods
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Admin settings methods
  async getAllAdminSettings(): Promise<AdminSettings[]> {
    return await db.select().from(adminSettings);
  }

  async getAdminSetting(key: string): Promise<AdminSettings | undefined> {
    const [setting] = await db.select().from(adminSettings).where(eq(adminSettings.settingKey, key));
    return setting || undefined;
  }

  async createAdminSetting(insertSetting: InsertAdminSettings): Promise<AdminSettings> {
    const [setting] = await db
      .insert(adminSettings)
      .values(insertSetting)
      .returning();
    return setting;
  }

  async updateAdminSetting(key: string, updates: Partial<AdminSettings>): Promise<AdminSettings> {
    const [setting] = await db
      .update(adminSettings)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(adminSettings.settingKey, key))
      .returning();
    return setting;
  }

  async deleteAdminSetting(key: string): Promise<void> {
    await db.delete(adminSettings).where(eq(adminSettings.settingKey, key));
  }

  // Client methods
  async getAllClients(): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.active, true));
  }

  async getClient(id: string): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client || undefined;
  }

  async createClient(insertClient: InsertClient): Promise<Client> {
    const [client] = await db
      .insert(clients)
      .values(insertClient)
      .returning();
    return client;
  }

  async updateClient(id: string, clientData: Partial<Client>): Promise<Client> {
    const [client] = await db
      .update(clients)
      .set({ ...clientData, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return client;
  }

  async deleteClient(id: string): Promise<void> {
    await db.delete(clients).where(eq(clients.id, id));
  }

  // Job methods
  async getAllJobs(): Promise<Job[]> {
    return await db.select().from(jobs);
  }

  async getJob(id: string): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job || undefined;
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    // Determine department from jobType or explicit department field
    let department = insertJob.department;
    if (!department && insertJob.jobType) {
      // Enhanced mapping for all departments
      const departmentMap: Record<string, string> = {
        'Hire': 'HIRE',
        'Engineering': 'ENGINEERING', 
        'Fabrication': 'FABRICATION',
        'Sales': 'SALES',
        'Testing': 'TESTING',
        'Transport': 'TRANSPORT',
        'Clients': 'CLIENTS'
      };
      department = departmentMap[insertJob.jobType] || 'GENERAL';
    }
    
    // Get the next job number and generate jobLes automatically
    const jobNumber = await this.getNextJobNumber();
    const jobLes = this.generateJobLes(jobNumber, department || 'GENERAL');
    
    // Prepare job data with auto-generated numbers
    const jobData = {
      ...insertJob,
      jobNumber,
      jobLes,
      department,
      // Remove any manual job number attempts from client
      jobNo: insertJob.jobNo || null
    };
    
    console.log(`✅ Auto-generating job: ${jobLes} (${department}) - Job #${jobNumber}`);
    
    const [job] = await db
      .insert(jobs)
      .values(jobData)
      .returning();
    return job;
  }

  async getNextJobNumber(): Promise<number> {
    // Initialize counter if it doesn't exist
    const [existingCounter] = await db.select().from(jobCounter).where(eq(jobCounter.id, 1));
    
    if (!existingCounter) {
      // Create initial counter
      await db.insert(jobCounter).values({ id: 1, lastJobNumber: 1 });
      return 1;
    }
    
    // Increment counter and update
    const newJobNumber = existingCounter.lastJobNumber + 1;
    await db
      .update(jobCounter)
      .set({ lastJobNumber: newJobNumber, updatedAt: new Date() })
      .where(eq(jobCounter.id, 1));
    
    return newJobNumber;
  }

  generateJobLes(jobNumber: number, department: string): string {
    const paddedNumber = jobNumber.toString().padStart(6, '0');
    let prefix = 'LEG'; // Default prefix for General
    
    // Enhanced department prefixes for all departments
    switch (department?.toUpperCase()) {
      case 'HIRE':
        prefix = 'LEH'; // Hire Department
        break;
      case 'ENGINEERING':
        prefix = 'LEE'; // Engineering Department
        break;
      case 'FABRICATION':
        prefix = 'LEF'; // Fabrication Department
        break;
      case 'SALES':
        prefix = 'LES'; // Sales Department
        break;
      case 'TESTING':
        prefix = 'LET'; // Testing Department
        break;
      case 'TRANSPORT':
        prefix = 'LEX'; // Transport Department
        break;
      case 'CLIENTS':
        prefix = 'LEC'; // Client Management
        break;
      case 'ADMIN':
        prefix = 'LEA'; // Admin Tasks
        break;
      case 'GENERAL':
      default:
        prefix = 'LEG'; // General/Unknown
    }
    
    return `${prefix}${paddedNumber}`;
  }

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set({ ...jobData, updatedAt: new Date() })
      .where(eq(jobs.id, id))
      .returning();
    return job;
  }

  async deleteJob(id: string): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Job item methods
  async getJobItems(jobId: string): Promise<JobItem[]> {
    return await db.select().from(jobItems).where(eq(jobItems.jobId, jobId));
  }

  async createJobItem(insertJobItem: InsertJobItem): Promise<JobItem> {
    const [jobItem] = await db
      .insert(jobItems)
      .values(insertJobItem)
      .returning();
    return jobItem;
  }

  async updateJobItem(id: string, jobItemData: Partial<JobItem>): Promise<JobItem> {
    const [jobItem] = await db
      .update(jobItems)
      .set(jobItemData)
      .where(eq(jobItems.id, id))
      .returning();
    return jobItem;
  }

  async deleteJobItem(id: string): Promise<void> {
    await db.delete(jobItems).where(eq(jobItems.id, id));
  }

  async deleteJobItemsByJobId(jobId: string): Promise<void> {
    await db.delete(jobItems).where(eq(jobItems.jobId, jobId));
  }
}

export const storage = new DatabaseStorage();
