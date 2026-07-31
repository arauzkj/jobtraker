import {
  Job,
  JobStage,
  JobStatus,
  Prisma,
  Timeline_Entry,
} from "@/app/generated/prisma/client";
import { Timeline_EntryDto } from "./timeline_entry.dto";
import { JobStatusDto } from "./jobstatus.dto.enum";
import { JobStageDto } from "./jobstage.dto.enum";

export class JobDto {
  id?: bigint;
  title: string;
  description: string;
  status: JobStatusDto;
  lastStatus?: JobStatusDto | null;
  stage?: JobStageDto | null;
  role: string;
  location: string;
  workMode: string;
  contact: string;
  notes: string;
  salary: string;
  contactEmail: string;
  appliedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
  link: string;
  company: string;
  wheresApplied: string;
  applierId?: bigint;
  timeline?: Timeline_EntryDto[];

  constructor(data: Partial<JobDto>) {
    this.id = data.id;
    this.title = data.title || "";
    this.description = data.description || "";
    this.status = (data.status as JobStatusDto) || "APPLIED";
    this.lastStatus = (data.lastStatus as JobStatusDto) ?? "PENDENTING";
    this.stage = (data.stage as JobStageDto) ?? "APPLIED";
    this.role = data.role || "";
    this.location = data.location || "";
    this.workMode = data.workMode || "";
    this.contact = data.contact || "";
    this.notes = data.notes || "";
    this.salary = data.salary || "";
    this.contactEmail = data.contactEmail || "";
    this.appliedAt = data.appliedAt;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.link = data.link || "";
    this.company = data.company || "";
    this.wheresApplied = data.wheresApplied || "";
    this.applierId = data.applierId;
    this.timeline = data.timeline;
  }

  toJSON() {
    return {
      id: this.id ? this.id.toString() : undefined,
      title: this.title,
      description: this.description,
      status: this.status,
      lastStatus: this.lastStatus,
      stage: this.stage,
      role: this.role,
      location: this.location,
      workMode: this.workMode,
      contact: this.contact,
      notes: this.notes,
      salary: this.salary,
      contactEmail: this.contactEmail,
      appliedAt: this.appliedAt?.toISOString(),
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      link: this.link,
      company: this.company,
      wheresApplied: this.wheresApplied,
      applierId: this.applierId?.toString(),
      timeline: this.timeline?.map((t) => t.toJSON()),
    };
  }

  toPrismaCreateInput(): Prisma.JobUncheckedCreateInput {
    if (this.applierId === undefined) {
      throw new Error("applierId is required to persist a Job");
    }
    return {
      title: this.title,
      description: this.description,
      status: this.status as JobStatus,
      lastStatus: (this.lastStatus as JobStatus) ?? null,
      stage: (this.stage as JobStage) ?? null,
      role: this.role,
      location: this.location,
      workMode: this.workMode,
      contact: this.contact,
      notes: this.notes,
      salary: this.salary,
      contactEmail: this.contactEmail,
      appliedAt: this.appliedAt ?? null,
      link: this.link,
      company: this.company,
      wheresApplied: this.wheresApplied,
      applierId: this.applierId,
    };
  }

  static fromPrisma(job: Job & { timeline?: Timeline_Entry[] }): JobDto {
    return new JobDto({
      id: job.id,
      title: job.title ?? "",
      description: job.description ?? "",
      status: job.status as JobStatusDto,
      lastStatus: job.lastStatus as JobStatusDto,
      stage: job.stage as JobStageDto,
      role: job.role ?? "",
      location: job.location ?? "",
      workMode: job.workMode ?? "",
      contact: job.contact ?? "",
      notes: job.notes ?? "",
      salary: job.salary ?? "",
      contactEmail: job.contactEmail ?? "",
      appliedAt: job.appliedAt,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      link: job.link,
      company: job.company ?? "",
      wheresApplied: job.wheresApplied ?? "",
      applierId: job.applierId,
      timeline: job.timeline?.map(Timeline_EntryDto.fromPrisma),
    });
  }
}
