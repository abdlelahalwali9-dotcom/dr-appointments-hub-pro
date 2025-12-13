import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  getPatientByPhone,
  getPatientById,
  searchPatients,
  getAllPatients,
  getDoctorById,
  getAllDoctors,
  getAppointmentById,
  getAppointmentsByDate,
  getAppointmentsByDoctor,
  getAppointmentsByPatient,
  getUpcomingAppointments,
  getMedicalRecordsByPatient,
  getWaitingQueueByDoctor,
  getUnreadNotifications,
  getDailyStatistics,
  getActiveUsersCount,
  getSystemSettings,
  createAuditLog,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ============ PATIENT ROUTERS ============
  patient: router({
    searchByPhone: protectedProcedure
      .input(z.object({ phone: z.string() }))
      .query(async ({ input }) => {
        return await getPatientByPhone(input.phone);
      }),

    searchByQuery: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ input }) => {
        return await searchPatients(input.query);
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getPatientById(input.id);
      }),

    getAll: protectedProcedure
      .input(
        z.object({
          limit: z.number().default(100),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        return await getAllPatients(input.limit, input.offset);
      }),

    getMedicalRecords: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        return await getMedicalRecordsByPatient(input.patientId);
      }),
  }),

  // ============ DOCTOR ROUTERS ============
  doctor: router({
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getDoctorById(input.id);
      }),

    getAll: protectedProcedure.query(async () => {
      return await getAllDoctors();
    }),
  }),

  // ============ APPOINTMENT ROUTERS ============
  appointment: router({
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getAppointmentById(input.id);
      }),

    getByDate: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ input }) => {
        return await getAppointmentsByDate(input.date);
      }),

    getByDoctor: protectedProcedure
      .input(
        z.object({
          doctorId: z.number(),
          fromDate: z.date().optional(),
          toDate: z.date().optional(),
        })
      )
      .query(async ({ input }) => {
        return await getAppointmentsByDoctor(
          input.doctorId,
          input.fromDate,
          input.toDate
        );
      }),

    getByPatient: protectedProcedure
      .input(z.object({ patientId: z.number() }))
      .query(async ({ input }) => {
        return await getAppointmentsByPatient(input.patientId);
      }),

    getUpcoming: protectedProcedure
      .input(z.object({ days: z.number().default(7) }))
      .query(async ({ input }) => {
        return await getUpcomingAppointments(input.days);
      }),
  }),

  // ============ WAITING QUEUE ROUTERS ============
  waitingQueue: router({
    getByDoctor: protectedProcedure
      .input(z.object({ doctorId: z.number() }))
      .query(async ({ input }) => {
        return await getWaitingQueueByDoctor(input.doctorId);
      }),
  }),

  // ============ NOTIFICATION ROUTERS ============
  notification: router({
    getUnread: protectedProcedure.query(async ({ ctx }) => {
      if (!ctx.user) return [];
      return await getUnreadNotifications(ctx.user.id);
    }),
  }),

  // ============ STATISTICS ROUTERS ============
  statistics: router({
    getDailyStats: protectedProcedure
      .input(z.object({ date: z.date() }))
      .query(async ({ input }) => {
        return await getDailyStatistics(input.date);
      }),

    getActiveUsers: protectedProcedure.query(async () => {
      return await getActiveUsersCount();
    }),
  }),

  // ============ SETTINGS ROUTERS ============
  settings: router({
    getSystemSettings: protectedProcedure.query(async () => {
      return await getSystemSettings();
    }),
  }),
});

export type AppRouter = typeof appRouter;
