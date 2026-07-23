import { Job } from "@/app/generated/prisma/client";

export class JobDto {
  id?: bigint;
  title: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  link: string;
  company: string;
  wheresApplied: string;
  applierId: bigint;

  constructor(data: Partial<JobDto>) {
    this.id = data.id;
    this.title = data.title || "";
    this.description = data.description || "";
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.link = data.link || "";
    this.company = data.company || "";
    this.wheresApplied = data.wheresApplied || "";
    this.applierId = data.applierId!;
  }

  /**
   * Transforma la clase a un objeto JSON seguro.
   * Convierte BigInt a String para evitar errores de serialización.
   */
  toJSON() {
    return {
      id: this.id ? this.id.toString() : undefined,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt?.toISOString(),
      updatedAt: this.updatedAt?.toISOString(),
      link: this.link,
      company: this.company,
      wheresApplied: this.wheresApplied,
      applierId: this.applierId.toString(),
    };
  }

  /**
   * Mapea el DTO al formato que Prisma espera para una inserción/actualización.
   * Omite campos autogenerados como id, createdAt y updatedAt.
   */
  toPrismaCreateInput() {
    return {
      title: this.title,
      description: this.description,
      link: this.link,
      company: this.company,
      wheresApplied: this.wheresApplied,
      applier: {
        connect: { id: this.applierId },
      },
    };
  }

  /**
   * Método estático para convertir el resultado de Prisma (Modelo) a esta clase DTO.
   */
  static fromPrisma(job: Job): JobDto {
    return new JobDto({
      id: job.id,
      title: job.title,
      description: job.description,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
      link: job.link,
      company: job.company,
      wheresApplied: job.wheresApplied,
      applierId: job.applierId,
    });
  }
}
