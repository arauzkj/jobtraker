import { Timeline_Entry } from "@/app/generated/prisma/client";

export class Timeline_EntryDto {
  id?: bigint;
  jobId: bigint;
  date?: Date;
  label: string;
  notes: string;

  constructor(data: Partial<Timeline_EntryDto>) {
    this.id = data.id;
    this.jobId = data.jobId!;
    this.date = data.date;
    this.label = data.label || "";
    this.notes = data.notes || "";
  }

  toJSON() {
    return {
      id: this.id ? this.id.toString() : undefined,
      jobId: this.jobId.toString(),
      date: this.date?.toISOString(),
      label: this.label,
      notes: this.notes,
    };
  }

  toPrismaCreateInput() {
    return {
      label: this.label,
      notes: this.notes,
      job: {
        connect: { id: this.jobId },
      },
    };
  }

  static fromPrisma(entry: Timeline_Entry): Timeline_EntryDto {
    return new Timeline_EntryDto({
      id: entry.id,
      jobId: entry.jobId,
      date: entry.date,
      label: entry.label,
      notes: entry.notes ?? "",
    });
  }
}