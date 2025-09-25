import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const disbursementItems = pgTable("disbursement_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  description: text("description").notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(),
  isDefault: boolean("is_default").default(true),
  isActive: boolean("is_active").default(true),
  category: text("category"),
});

export const calculations = pgTable("calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyType: text("property_type"),
  selectedItems: text("selected_items").notNull(), // JSON string
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  gst: decimal("gst", { precision: 10, scale: 2 }).notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: text("created_at").default(sql`(current_timestamp)`),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertDisbursementItemSchema = createInsertSchema(disbursementItems).pick({
  description: true,
  unitCost: true,
  isDefault: true,
  isActive: true,
  category: true,
});

export const insertCalculationSchema = createInsertSchema(calculations).pick({
  propertyType: true,
  selectedItems: true,
  subtotal: true,
  gst: true,
  total: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertDisbursementItem = z.infer<typeof insertDisbursementItemSchema>;
export type DisbursementItem = typeof disbursementItems.$inferSelect;
export type InsertCalculation = z.infer<typeof insertCalculationSchema>;
export type Calculation = typeof calculations.$inferSelect;

// Static disbursement data that matches the design
export const defaultDisbursementItems = [
  { 
    id: "professional-fees", 
    description: "Professional fees", 
    unitCost: "550.00", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: false
  },
  { 
    id: "verification-id", 
    description: "Verification of ID (per person on Title)", 
    unitCost: "29.90", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: true
  },
  { 
    id: "titles-search", 
    description: "Titles search", 
    unitCost: "40.39", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: true
  },
  { 
    id: "registered-plan", 
    description: "Registered Plan search", 
    unitCost: "43.37", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: true
  },
  { 
    id: "transport-roads", 
    description: "Qld Transport and Main Roads Property search", 
    unitCost: "49.12", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: true
  },
  { 
    id: "contaminated-land", 
    description: "Contaminated Land search", 
    unitCost: "76.03", 
    category: "standard",
    propertyTypes: ["house", "unit"],
    gstIncluded: true
  },
  { 
    id: "heritage-search", 
    description: "DEHP - Heritage search", 
    unitCost: "90.18", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: true
  },
  { 
    id: "qbcc-insurance", 
    description: "QBCC - Insurance search", 
    unitCost: "96.55", 
    category: "standard",
    propertyTypes: ["house", "unit"],
    gstIncluded: true
  },
  { 
    id: "qcat-records", 
    description: "QCAT Records (per person on Title)", 
    unitCost: "37.58", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: true
  },
  { 
    id: "council-rates", 
    description: "Council Rates (Sunshine Coast)", 
    unitCost: "147.42", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: true
  },
  { 
    id: "water-services", 
    description: "Water Services", 
    unitCost: "262.85", 
    category: "standard",
    propertyTypes: ["house", "unit"],
    gstIncluded: true
  },
  { 
    id: "body-corporate-cts", 
    description: "Body Corporate CTS search", 
    unitCost: "14.18", 
    category: "standard",
    propertyTypes: ["unit"],
    gstIncluded: true
  },
  { 
    id: "cms-dealing", 
    description: "CMS Dealing search", 
    unitCost: "69.11", 
    category: "standard",
    propertyTypes: ["house", "unit"],
    gstIncluded: true
  },
  { 
    id: "body-corporate-cert", 
    description: "Body Corporate Certificate", 
    unitCost: "153.06", 
    category: "standard",
    propertyTypes: ["unit"],
    gstIncluded: true
  },
  { 
    id: "asic-search", 
    description: "ASIC search (per entity)", 
    unitCost: "30.45", 
    category: "standard",
    propertyTypes: ["land", "house", "unit"],
    gstIncluded: true
  },
  { 
    id: "qbcc-pool-safety", 
    description: "QBCC Pool Safety Certificate search", 
    unitCost: "0.00", 
    category: "free",
    propertyTypes: ["house", "unit"],
    gstIncluded: true
  },
  { 
    id: "council-zoning", 
    description: "Council Zoning", 
    unitCost: "0.00", 
    category: "free",
    propertyTypes: [],
    gstIncluded: true
  },
];
