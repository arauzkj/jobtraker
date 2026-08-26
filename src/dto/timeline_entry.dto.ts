import {
  JobStage,
  Prisma,
  Timeline_Entry,
} from "@/app/generated/prisma/client";

export class Timeline_EntryDto {
  id?: bigint;
  jobId: bigint;
  date?: Date;
  stage?: JobStage | null;
  legacyLabel?: string | null;
  notes: string;

  constructor(data: Partial<Timeline_EntryDto>) {
    this.id = data.id;
    this.jobId = data.jobId!;
    this.date = data.date ? new Date(data.date) : undefined;
    this.stage = data.stage ?? null;
    this.legacyLabel = data.legacyLabel ?? null;
    this.notes = data.notes || "";
  }

  toJSON() {
    return {
      id: this.id ? this.id.toString() : undefined,
      jobId: this.jobId.toString(),
      date: this.date?.toISOString(),
      stage: this.stage,
      legacyLabel: this.legacyLabel,
      notes: this.notes,
    };
  }

  toPrismaCreateInput(): Prisma.Timeline_EntryUncheckedCreateInput {
    if (!this.stage) {
      throw new Error("stage is required to create a timeline entry");
    }

    return {
      stage: this.stage,
      legacyLabel: this.legacyLabel,
      notes: this.notes,
      jobId: this.jobId,
      date: this.date || new Date(),
    };
  }

  static fromPrisma(entry: Timeline_Entry): Timeline_EntryDto {
    return new Timeline_EntryDto({
      id: entry.id,
      jobId: entry.jobId,
      date: entry.date,
      stage: entry.stage,
      legacyLabel: entry.legacyLabel,
      notes: entry.notes ?? "",
    });
  }
}
