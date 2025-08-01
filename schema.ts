import { sql, relations } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, boolean, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("User"),
  email: varchar("email", { length: 150 }),
  firstName: varchar("first_name", { length: 100 }),
  lastName: varchar("last_name", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
});

export const clients = pgTable("clients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic Company Details
  companyName: varchar("company_name", { length: 200 }).notNull(),
  tradingName: varchar("trading_name", { length: 200 }),
  companyRegNo: varchar("company_reg_no", { length: 50 }),
  companyVatNo: varchar("company_vat_no", { length: 50 }),
  parentCompany: varchar("parent_company", { length: 200 }),
  yearsTrading: integer("years_trading"),
  businessType: varchar("business_type", { length: 50 }).notNull().default("Limited Company"),
  
  // Addresses
  invoiceAddress: text("invoice_address"),
  deliveryAddress: text("delivery_address"),
  
  // Contact Details
  telephone: varchar("telephone", { length: 20 }),
  deliveryTelephone: varchar("delivery_telephone", { length: 20 }),
  email: varchar("email", { length: 150 }),
  deliveryEmail: varchar("delivery_email", { length: 150 }),
  natureOfBusiness: text("nature_of_business"),
  numberOfEmployees: integer("number_of_employees"),
  
  // Key Contacts
  directorName: varchar("director_name", { length: 100 }),
  pLedgerName: varchar("p_ledger_name", { length: 100 }),
  pLedgerTel: varchar("p_ledger_tel", { length: 20 }),
  pLedgerEmail: varchar("p_ledger_email", { length: 150 }),
  
  // Trade References
  tradeRef1Name: varchar("trade_ref1_name", { length: 200 }),
  tradeRef1Phone: varchar("trade_ref1_phone", { length: 20 }),
  tradeRef1Website: varchar("trade_ref1_website", { length: 200 }),
  tradeRef2Name: varchar("trade_ref2_name", { length: 200 }),
  tradeRef2Phone: varchar("trade_ref2_phone", { length: 20 }),
  tradeRef2Website: varchar("trade_ref2_website", { length: 200 }),
  
  // Bank and Financial Details
  creditApplicationAmount: decimal("credit_application_amount", { precision: 10, scale: 2 }),
  bankName: varchar("bank_name", { length: 100 }),
  bankSortCode: varchar("bank_sort_code", { length: 10 }),
  bankPostCode: varchar("bank_post_code", { length: 20 }),
  bankAccountNo: varchar("bank_account_no", { length: 20 }),
  
  // Preferences
  electronicInvoices: boolean("electronic_invoices").default(false),
  
  // Internal
  active: boolean("active").default(true),
  status: varchar("status", { length: 20 }).default("pending"), // pending, approved, rejected
  approvedAt: timestamp("approved_at"),
  rejectedAt: timestamp("rejected_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Global job counter for auto-generating unique job numbers
export const jobCounter = pgTable("job_counter", {
  id: integer("id").primaryKey().default(1),
  lastJobNumber: integer("last_job_number").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobs = pgTable("jobs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobNumber: integer("job_number").notNull().unique(), // Auto-generated unique job number
  jobLes: varchar("job_les", { length: 15 }).notNull(), // Auto-generated from job number + department
  jobNo: varchar("job_no", { length: 50 }),
  jobStatus: varchar("job_status", { length: 20 }).notNull().default("OPEN"),
  pm: varchar("pm", { length: 100 }),
  date: timestamp("date").defaultNow(),
  clientId: varchar("client_id").references(() => clients.id),
  description: text("description"),
  jobType: varchar("job_type", { length: 50 }),
  department: varchar("department", { length: 50 }), // Added department field
  linkedJobRef: varchar("linked_job_ref", { length: 100 }),
  costNett: decimal("cost_nett", { precision: 10, scale: 2 }).default("0.00"),
  quoteRef: varchar("quote_ref", { length: 100 }),
  jobComplete: boolean("job_complete").default(false),
  invoiced: boolean("invoiced").default(false),
  jobComments: text("job_comments"),
  purchaseOrder: text("purchase_order"),
  attachments: text("attachments"),
  invoiceComments: text("invoice_comments"),
  // Photo storage fields
  completionPhotos: text("completion_photos").array(), // Array of photo URLs/paths
  photoUploadedAt: timestamp("photo_uploaded_at"),
  photoUploadedBy: varchar("photo_uploaded_by", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const jobItems = pgTable("job_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobId: varchar("job_id").notNull().references(() => jobs.id, { onDelete: "cascade" }),
  itemDescription: text("item_description").notNull(),
  itemAssetNo: varchar("item_asset_no", { length: 100 }),
  onHireDate: timestamp("on_hire_date"),
  offHireDate: timestamp("off_hire_date"),
  priceWeek: decimal("price_week", { precision: 10, scale: 2 }).default("0.00"),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const clientsRelations = relations(clients, ({ many }) => ({
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ many, one }) => ({
  items: many(jobItems),
  client: one(clients, {
    fields: [jobs.clientId],
    references: [clients.id],
  }),
}));

export const jobItemsRelations = relations(jobItems, ({ one }) => ({
  job: one(jobs, {
    fields: [jobItems.jobId],
    references: [jobs.id],
  }),
}));

// Schemas
// Admin settings table
export const adminSettings = pgTable("admin_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  settingKey: varchar("setting_key", { length: 100 }).notNull().unique(),
  settingValue: text("setting_value"),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
  updatedBy: varchar("updated_by", { length: 100 }),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export const insertAdminSettingsSchema = createInsertSchema(adminSettings).omit({
  id: true,
  updatedAt: true,
});

export const insertClientSchema = createInsertSchema(clients).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  jobNumber: true, // Auto-generated
  jobLes: true, // Auto-generated  
  createdAt: true,
  updatedAt: true,
}).extend({
  date: z.union([z.date(), z.string().transform((str) => new Date(str))]).optional(),
  costNett: z.union([z.string(), z.number().transform((num) => num.toString())]).optional(),
});

export const insertJobCounterSchema = createInsertSchema(jobCounter).omit({
  updatedAt: true,
});

export const insertJobItemSchema = createInsertSchema(jobItems).omit({
  id: true,
  createdAt: true,
}).extend({
  onHireDate: z.union([z.date(), z.string().transform((str) => str ? new Date(str) : null), z.null()]).optional(),
  offHireDate: z.union([z.date(), z.string().transform((str) => str ? new Date(str) : null), z.null()]).optional(),
  priceWeek: z.union([z.string(), z.number().transform((num) => num.toString())]).optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AdminSettings = typeof adminSettings.$inferSelect;
export type InsertAdminSettings = z.infer<typeof insertAdminSettingsSchema>;
export type Client = typeof clients.$inferSelect;
export type InsertClient = z.infer<typeof insertClientSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type JobItem = typeof jobItems.$inferSelect;
export type InsertJobItem = z.infer<typeof insertJobItemSchema>;
export type JobCounter = typeof jobCounter.$inferSelect;
export type InsertJobCounter = z.infer<typeof insertJobCounterSchema>;
