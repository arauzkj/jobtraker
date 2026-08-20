import { Job, Prisma } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export class JobRepository {
  static async findAll(): Promise<Job[]> {
    try {
      const jobs: Job[] = await prisma.job.findMany();
      return jobs;
    } catch (error) {
      console.error("Error al obtener las ofertas de trabajo:", error);
      throw new Error("No se pudieron obtener las ofertas de trabajo");
    }
  }

  static async findById(id: bigint): Promise<Job | null> {
    try {
      const job: Job | null = await prisma.job.findUnique({
        where: { id },
        include: { timeline: true },
      });
      return job;
    } catch (error) {
      console.error("Error al obtener las ofertas de trabajo:", error);
      throw new Error("No se pudieron obtener las ofertas de trabajo");
    }
  }

  static async findAllByApplierId(applierId: bigint) {
    try {
      return await prisma.job.findMany({
        where: { applierId },
        include: { timeline: true },
      });
    } catch (error) {
      console.error(
        "Error al obtener las ofertas de trabajo por aplicante:",
        error,
      );
      throw new Error(
        "No se pudieron obtener las ofertas de trabajo por aplicante",
      );
    }
  }

  static async create(jobData: Prisma.JobUncheckedCreateInput): Promise<Job> {
    try {
      const job: Job = await prisma.job.create({
        data: jobData,
      });
      return job;
    } catch (error) {
      console.error("Error al crear la oferta de trabajo:", error);
      throw new Error("No se pudo crear la oferta de trabajo");
    }
  }


  static async update(
    id: bigint,
    data: Prisma.JobUncheckedUpdateInput,
  ): Promise<Job> {
    try {
      const job: Job = await prisma.job.update({
        where: { id },
        data,
        include: { timeline: true },
      });
      return job;
    } catch (error) {
      console.error("Error al actualizar la oferta de trabajo:", error);
      throw new Error("No se pudo actualizar la oferta de trabajo");
    }
  }

  static async delete(id: bigint) {
    try {
      await prisma.job.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error al eliminar la oferta de trabajo:", error);
      throw new Error("No se pudo eliminar la oferta de trabajo");
    }
  }
}
