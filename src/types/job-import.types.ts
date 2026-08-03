import { JobDto } from "@/dto/job.dto";
export type JobImportSuccess = {
  status: "ok";
  data: Partial<JobDto>;
  sourceUrl: string;
};

export type JobImportManual = {
  status: "manual_required";
  reason:
    | "blocked"
    | "no_content"
    | "invalid_url"
    | "ai_parse_error"
    | "unknown";
  message: string;
  sourceUrl: string;
};

export type JobImportResult = JobImportSuccess | JobImportManual;
