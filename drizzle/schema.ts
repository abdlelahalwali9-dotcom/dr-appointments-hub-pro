import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  json,
} from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extended with role-based access control for different user types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "receptionist", "doctor", "patient", "user"]).default("user").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Patients table - comprehensive patient information
 */
export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }).notNull(),
  dateOfBirth: timestamp("dateOfBirth"),
  gender: mysqlEnum("gender", ["male", "female", "other"]),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  emergencyContact: varchar("emergencyContact", { length: 100 }),
  emergencyPhone: varchar("emergencyPhone", { length: 20 }),
  medicalHistory: text("medicalHistory"), // JSON string
  allergies: text("allergies"), // JSON string
  currentMedications: text("currentMedications"), // JSON string
  notes: text("notes"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;

/**
 * Doctors table - doctor information and work schedule
 */
export const doctors = mysqlTable("doctors", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId"),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 20 }),
  specialization: varchar("specialization", { length: 100 }).notNull(),
  licenseNumber: varchar("licenseNumber", { length: 100 }),
  bio: text("bio"),
  workDays: text("workDays"), // JSON: ["Saturday", "Sunday", "Monday", ...]
  workStartTime: varchar("workStartTime", { length: 10 }), // HH:MM
  workEndTime: varchar("workEndTime", { length: 10 }), // HH:MM
  consultationFee: int("consultationFee").notNull(), // in smallest currency unit
  followUpFreeDays: int("followUpFreeDays").default(7).notNull(), // free follow-up days
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Doctor = typeof doctors.$inferSelect;
export type InsertDoctor = typeof doctors.$inferInsert;

/**
 * Services table - medical services offered
 */
export const services = mysqlTable("services", {
  id: int("id").autoincrement().primaryKey(),
  doctorId: int("doctorId").notNull(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  fee: int("fee").notNull(), // in smallest currency unit
  durationMinutes: int("durationMinutes").default(30).notNull(),
  followUpFreeDays: int("followUpFreeDays").default(7).notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type InsertService = typeof services.$inferInsert;

/**
 * Appointments table - patient appointments
 */
export const appointments = mysqlTable("appointments", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId").notNull(),
  serviceId: int("serviceId"),
  appointmentDate: timestamp("appointmentDate").notNull(),
  startTime: varchar("startTime", { length: 10 }).notNull(), // HH:MM
  endTime: varchar("endTime", { length: 10 }).notNull(), // HH:MM
  status: mysqlEnum("status", ["scheduled", "waiting", "completed", "cancelled", "no_show", "follow_up"]).default("scheduled").notNull(),
  notes: text("notes"),
  fee: int("fee"), // in smallest currency unit
  isPaid: boolean("isPaid").default(false).notNull(),
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "transfer", "other"]),
  diagnosis: text("diagnosis"),
  prescription: text("prescription"),
  followUpDate: timestamp("followUpDate"),
  isFollowUpFree: boolean("isFollowUpFree").default(false).notNull(),
  createdBy: int("createdBy"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

/**
 * Medical Records - Electronic Medical Record (EMR)
 */
export const medicalRecords = mysqlTable("medicalRecords", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  appointmentId: int("appointmentId"),
  doctorId: int("doctorId").notNull(),
  recordType: mysqlEnum("recordType", ["diagnosis", "prescription", "lab_test", "note", "other"]).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content").notNull(),
  attachments: text("attachments"), // JSON: array of file URLs
  isConfidential: boolean("isConfidential").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MedicalRecord = typeof medicalRecords.$inferSelect;
export type InsertMedicalRecord = typeof medicalRecords.$inferInsert;

/**
 * Waiting Queue - real-time waiting queue management
 */
export const waitingQueue = mysqlTable("waitingQueue", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId").notNull(),
  patientId: int("patientId").notNull(),
  doctorId: int("doctorId").notNull(),
  position: int("position").notNull(),
  priority: mysqlEnum("priority", ["normal", "urgent", "child", "elderly"]).default("normal").notNull(),
  estimatedWaitTime: int("estimatedWaitTime"), // in minutes
  checkedInAt: timestamp("checkedInAt"),
  calledAt: timestamp("calledAt"),
  seenAt: timestamp("seenAt"),
  status: mysqlEnum("status", ["waiting", "called", "in_progress", "completed", "no_show"]).default("waiting").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type WaitingQueue = typeof waitingQueue.$inferSelect;
export type InsertWaitingQueue = typeof waitingQueue.$inferInsert;

/**
 * Messages - internal communication between staff
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  senderId: int("senderId").notNull(),
  recipientId: int("recipientId"),
  groupId: int("groupId"),
  content: text("content").notNull(),
  messageType: mysqlEnum("messageType", ["text", "alert", "notification"]).default("text").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Message Groups - group chats
 */
export const messageGroups = mysqlTable("messageGroups", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  description: text("description"),
  createdBy: int("createdBy").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MessageGroup = typeof messageGroups.$inferSelect;
export type InsertMessageGroup = typeof messageGroups.$inferInsert;

/**
 * Message Group Members
 */
export const messageGroupMembers = mysqlTable("messageGroupMembers", {
  id: int("id").autoincrement().primaryKey(),
  groupId: int("groupId").notNull(),
  userId: int("userId").notNull(),
  joinedAt: timestamp("joinedAt").defaultNow().notNull(),
});

export type MessageGroupMember = typeof messageGroupMembers.$inferSelect;
export type InsertMessageGroupMember = typeof messageGroupMembers.$inferInsert;

/**
 * Notifications - system notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  type: mysqlEnum("type", ["appointment_reminder", "follow_up", "message", "alert", "system"]).default("system").notNull(),
  relatedId: int("relatedId"),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  sentVia: mysqlEnum("sentVia", ["in_app", "sms", "whatsapp", "email"]).default("in_app").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/**
 * Dynamic Fields - customizable form fields
 */
export const dynamicFields = mysqlTable("dynamicFields", {
  id: int("id").autoincrement().primaryKey(),
  formType: mysqlEnum("formType", ["patient", "appointment", "medical_record"]).notNull(),
  fieldName: varchar("fieldName", { length: 100 }).notNull(),
  fieldLabel: varchar("fieldLabel", { length: 200 }).notNull(),
  fieldType: mysqlEnum("fieldType", ["text", "number", "date", "select", "checkbox", "textarea"]).notNull(),
  isRequired: boolean("isRequired").default(false).notNull(),
  options: text("options"), // JSON: for select/checkbox fields
  placeholder: varchar("placeholder", { length: 200 }),
  order: int("order").notNull(),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DynamicField = typeof dynamicFields.$inferSelect;
export type InsertDynamicField = typeof dynamicFields.$inferInsert;

/**
 * System Settings
 */
export const systemSettings = mysqlTable("systemSettings", {
  id: int("id").autoincrement().primaryKey(),
  clinicName: varchar("clinicName", { length: 200 }).notNull(),
  clinicEmail: varchar("clinicEmail", { length: 320 }),
  clinicPhone: varchar("clinicPhone", { length: 20 }),
  clinicAddress: text("clinicAddress"),
  clinicLogo: varchar("clinicLogo", { length: 500 }),
  currency: varchar("currency", { length: 10 }).default("SAR").notNull(),
  language: mysqlEnum("language", ["ar", "en"]).default("ar").notNull(),
  timeZone: varchar("timeZone", { length: 50 }).default("Asia/Riyadh").notNull(),
  workingDays: text("workingDays"), // JSON
  workingHours: text("workingHours"), // JSON
  appointmentDurationMinutes: int("appointmentDurationMinutes").default(30).notNull(),
  smsEnabled: boolean("smsEnabled").default(false).notNull(),
  whatsappEnabled: boolean("whatsappEnabled").default(false).notNull(),
  emailEnabled: boolean("emailEnabled").default(false).notNull(),
  reminderHoursBefore: int("reminderHoursBefore").default(24).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

/**
 * Audit Log - track all important actions
 */
export const auditLogs = mysqlTable("auditLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entityType", { length: 100 }).notNull(),
  entityId: int("entityId"),
  changes: text("changes"), // JSON: before/after values
  ipAddress: varchar("ipAddress", { length: 50 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Revenue Records - financial tracking
 */
export const revenueRecords = mysqlTable("revenueRecords", {
  id: int("id").autoincrement().primaryKey(),
  appointmentId: int("appointmentId"),
  doctorId: int("doctorId"),
  amount: int("amount").notNull(), // in smallest currency unit
  paymentMethod: mysqlEnum("paymentMethod", ["cash", "card", "transfer", "other"]).notNull(),
  notes: text("notes"),
  recordedBy: int("recordedBy"),
  recordedAt: timestamp("recordedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RevenueRecord = typeof revenueRecords.$inferSelect;
export type InsertRevenueRecord = typeof revenueRecords.$inferInsert;
