import { JobStageDto } from "./jobstage.dto.enum";

export const STAGE_META: Record<JobStageDto, { label: string; step: number }> =
  {
    APPLIED: { label: "Aplicado", step: 0 },
    PHONE_SCREEN: { label: "Screening RRHH", step: 1 },
    TECHNICAL_INTERVIEW: { label: "Entrevista técnica", step: 2 },
    TEAM_INTERVIEW: { label: "Entrevista con el equipo", step: 3 },
    FINAL_INTERVIEW: { label: "Entrevista final / Manager", step: 4 },
    OFFER: { label: "Oferta", step: 5 },
    REJECTED: { label: "Rechazado", step: 6 },
    WITHDRAWN: { label: "Retirado", step: 7 },
    ACCEPTED: { label: "Aceptado", step: 8 },
  };