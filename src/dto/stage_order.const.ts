import { JobStageDto } from "./jobstage.dto.enum";

export const STAGE_ORDER: JobStageDto[] = [
    JobStageDto.APPLIED,
    JobStageDto.PHONE_SCREEN,
    JobStageDto.TECHNICAL_INTERVIEW,
    JobStageDto.TEAM_INTERVIEW,
    JobStageDto.FINAL_INTERVIEW
]