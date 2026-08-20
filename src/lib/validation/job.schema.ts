import { z } from "zod";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const JobStatusSchema = z.enum([
  "UNANSWERED",
  "APPLIED",
  "PENDENTING",
  "INTERVIEW",
  "TECHNICAL_TEST",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
  "ACCEPTED",
]);

export const JobStageSchema = z.enum([
  "APPLIED",
  "PHONE_SCREEN",
  "TECHNICAL_INTERVIEW",
  "TEAM_INTERVIEW",
  "FINAL_INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
  "ACCEPTED",
]);

export type JobStatus = z.infer<typeof JobStatusSchema>;
export type JobStage = z.infer<typeof JobStageSchema>;

type StatusMeta = {
  label: string;
  description: string;
  badge: string;
  dot: string;
};

type StageMeta = {
  label: string;
  step: number;
};

export const STATUS_META = {
  PENDENTING: {
    label: "Pendiente",
    description: "Postulación enviada, esperando respuesta",
    badge: "bg-info/10 text-info-foreground border-info/20",
    dot: "bg-info",
  },
  UNANSWERED: {
    label: "Sin respuesta",
    description: "Sin novedades tras varios días (fantasma)",
    badge: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
  },
  INTERVIEW: {
    label: "En entrevista",
    description: "En algún proceso de entrevista",
    badge: "bg-warning/15 text-warning-foreground border-warning/25",
    dot: "bg-warning",
  },
  OFFER: {
    label: "Oferta",
    description: "Recibiste una oferta",
    badge: "bg-success/15 text-success-foreground border-success/25",
    dot: "bg-success",
  },
  REJECTED: {
    label: "Rechazado",
    description: "Respondieron para avisar que no continúan",
    badge: "bg-destructive/10 text-destructive border-destructive/20",
    dot: "bg-destructive",
  },
  WITHDRAWN: {
    label: "Retirado",
    description: "Retiraste tu postulación",
    badge: "bg-secondary text-secondary-foreground border-border",
    dot: "bg-muted-foreground",
  },
  APPLIED: {
    label: "Postulado",
    description: "Has enviado tu postulación",
    badge: "bg-primary/10 text-primary-foreground border-primary/20",
    dot: "bg-primary",
  },
  TECHNICAL_TEST: {
    label: "Prueba técnica",
    description: "Estás en proceso de prueba técnica",
    badge: "bg-info/10 text-info-foreground border-info/20",
    dot: "bg-info",
  },
  ACCEPTED: {
    label: "Aceptado",
    description: "Has aceptado la oferta",
    badge: "bg-success/15 text-success-foreground border-success/25",
    dot: "bg-success",
  },
} satisfies Record<JobStatus, StatusMeta>;

export const STAGE_META = {
  APPLIED: { label: "Postulado", step: 0 },
  PHONE_SCREEN: { label: "Filtro de RRHH", step: 1 },
  TECHNICAL_INTERVIEW: { label: "Entrevista técnica", step: 2 },
  TEAM_INTERVIEW: { label: "Entrevista con el equipo", step: 3 },
  FINAL_INTERVIEW: { label: "Entrevista final / Gerencia", step: 4 },
  OFFER: { label: "Oferta", step: 5 },
  REJECTED: { label: "Rechazado", step: 6 },
  WITHDRAWN: { label: "Retirado", step: 7 },
  ACCEPTED: { label: "Aceptado", step: 8 },
} satisfies Record<JobStage, StageMeta>;

export const STAGE_ORDER = [
  "APPLIED",
  "PHONE_SCREEN",
  "TECHNICAL_INTERVIEW",
  "TEAM_INTERVIEW",
  "FINAL_INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
  "ACCEPTED",
] as const satisfies readonly JobStage[];

// ─── Timeline Entry ───────────────────────────────────────────────────────────

export const TimelineEntrySchema = z.object({
  id: z.string().optional(),
  jobId: z.string(),
  date: z.string().optional(),
  stage: JobStageSchema.nullable().optional(),
  notes: z.string(),
  legacyLabel: z.string().nullable().optional(),
});

export type TimelineEntry = z.infer<typeof TimelineEntrySchema>;

// ─── Job (respuesta de la API) ────────────────────────────────────────────────

export const JobSchema = z.object({
  id: z.string().optional(),
  title: z.string().default(""),
  description: z.string().default(""),
  status: JobStatusSchema.default("APPLIED"),
  lastStatus: JobStatusSchema.nullable().optional(),
  stage: JobStageSchema.nullable().optional(),
  role: z.string().default(""),
  location: z.string().default(""),
  workMode: z.string().default(""),
  contact: z.string().default(""),
  notes: z.string().default(""),
  salary: z.string().default(""),
  contactEmail: z.string().default(""),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
  link: z.string().default(""),
  company: z.string().default(""),
  wheresApplied: z.string().default(""),
  applierId: z.string().optional(),
  timeline: z.array(TimelineEntrySchema).default([]),
});

export type Job = z.infer<typeof JobSchema>;

// ─── CreateJobInput (formulario de creación / edición) ────────────────────────

export const CreateJobSchema = z.object({
  title: z.string().default(""),
  role: z.string().default(""),
  company: z.string().default(""),
  location: z.string().default(""),
  workMode: z.string().default(""),
  salary: z.string().default(""),
  wheresApplied: z.string().default(""),
  status: JobStatusSchema.default("APPLIED"),
  contact: z.string().default(""),
  contactEmail: z.string().default(""),
  link: z.string().default(""),
  description: z.string().default(""),
  notes: z.string().default(""),
});

export type CreateJobInput = z.infer<typeof CreateJobSchema>;

// ─── Re-exports de constantes de presentación ─────────────────────────────────
// Los componentes frontend importan todo desde @/validation, nunca desde @/dto.
