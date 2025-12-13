import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  patients,
  doctors,
  appointments,
  medicalRecords,
  waitingQueue,
  messages,
  notifications,
  systemSettings,
  auditLogs,
  services,
  revenueRecords,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ USER OPERATIONS ============

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod", "phone"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ PATIENT OPERATIONS ============

export async function getPatientByPhone(phone: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(patients)
    .where(eq(patients.phone, phone))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getPatientById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(patients)
    .where(eq(patients.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function searchPatients(query: string) {
  const db = await getDb();
  if (!db) return [];

  const searchTerm = `%${query}%`;
  const result = await db
    .select()
    .from(patients)
    .where(
      sql`CONCAT(firstName, ' ', lastName) LIKE ${searchTerm} OR phone LIKE ${searchTerm}`
    )
    .limit(10);

  return result;
}

export async function getAllPatients(limit = 100, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(patients)
    .where(eq(patients.isActive, true))
    .limit(limit)
    .offset(offset);
}

// ============ DOCTOR OPERATIONS ============

export async function getDoctorById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(doctors)
    .where(eq(doctors.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllDoctors() {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(doctors)
    .where(eq(doctors.isActive, true));
}

// ============ APPOINTMENT OPERATIONS ============

export async function getAppointmentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(appointments)
    .where(eq(appointments.id, id))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAppointmentsByDate(date: Date) {
  const db = await getDb();
  if (!db) return [];

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  return await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, startOfDay),
        lte(appointments.appointmentDate, endOfDay)
      )
    )
    .orderBy(appointments.startTime);
}

export async function getAppointmentsByDoctor(doctorId: number, fromDate?: Date, toDate?: Date) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(appointments.doctorId, doctorId)];

  if (fromDate && toDate) {
    conditions.push(gte(appointments.appointmentDate, fromDate));
    conditions.push(lte(appointments.appointmentDate, toDate));
  }

  return await db
    .select()
    .from(appointments)
    .where(and(...conditions))
    .orderBy(appointments.appointmentDate);
}

export async function getAppointmentsByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(appointments)
    .where(eq(appointments.patientId, patientId))
    .orderBy(desc(appointments.appointmentDate));
}

export async function getUpcomingAppointments(days = 7) {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return await db
    .select()
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, now),
        lte(appointments.appointmentDate, futureDate),
        sql`status IN ('scheduled', 'waiting')`
      )
    )
    .orderBy(appointments.appointmentDate);
}

// ============ MEDICAL RECORDS OPERATIONS ============

export async function getMedicalRecordsByPatient(patientId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(medicalRecords)
    .where(eq(medicalRecords.patientId, patientId))
    .orderBy(desc(medicalRecords.createdAt));
}

// ============ WAITING QUEUE OPERATIONS ============

export async function getWaitingQueueByDoctor(doctorId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(waitingQueue)
    .where(
      and(
        eq(waitingQueue.doctorId, doctorId),
        sql`status IN ('waiting', 'called')`
      )
    )
    .orderBy(waitingQueue.position);
}

// ============ NOTIFICATION OPERATIONS ============

export async function getUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.isRead, false)
      )
    )
    .orderBy(desc(notifications.createdAt));
}

// ============ STATISTICS OPERATIONS ============

export async function getDailyStatistics(date: Date) {
  const db = await getDb();
  if (!db) return null;

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointmentCount = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, startOfDay),
        lte(appointments.appointmentDate, endOfDay)
      )
    );

  const revenue = await db
    .select({ total: sql<number>`SUM(amount)` })
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.createdAt, startOfDay),
        lte(revenueRecords.createdAt, endOfDay)
      )
    );

  const completedAppointments = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(appointments)
    .where(
      and(
        gte(appointments.appointmentDate, startOfDay),
        lte(appointments.appointmentDate, endOfDay),
        eq(appointments.status, "completed")
      )
    );

  return {
    totalAppointments: appointmentCount[0]?.count || 0,
    completedAppointments: completedAppointments[0]?.count || 0,
    totalRevenue: revenue[0]?.total || 0,
  };
}

export async function getActiveUsersCount() {
  const db = await getDb();
  if (!db) return 0;

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(users)
    .where(gte(users.lastSignedIn, oneDayAgo));

  return result[0]?.count || 0;
}

export async function getMonthlyRevenue(year: number, month: number) {
  const db = await getDb();
  if (!db) return [];

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return await db
    .select({
      doctorId: revenueRecords.doctorId,
      total: sql<number>`SUM(amount)`,
    })
    .from(revenueRecords)
    .where(
      and(
        gte(revenueRecords.createdAt, startDate),
        lte(revenueRecords.createdAt, endDate)
      )
    );
}

// ============ AUDIT LOG OPERATIONS ============

export async function createAuditLog(
  userId: number,
  action: string,
  entityType: string,
  entityId?: number,
  changes?: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(auditLogs).values({
    userId,
    action,
    entityType,
    entityId: entityId || null,
    changes: changes ? JSON.stringify(changes) : null,
  });
}

// ============ SYSTEM SETTINGS OPERATIONS ============

export async function getSystemSettings() {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(systemSettings).limit(1);
  return result.length > 0 ? result[0] : null;
}
