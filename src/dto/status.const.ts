import { JobStatusDto } from "./jobstatus.dto.enum";

export const STATUS_META: Record<
  JobStatusDto,
  { label: string; description: string; badge: string; dot: string }
> = {
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
};
