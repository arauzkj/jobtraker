import {
  Job,
  JobStatus,
  Prisma,
  Timeline_Entry,
} from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

type PaginatedJobsOptions = {
  page: number;
  pageSize: number;
  status?: JobStatus;
  query?: string;
  startDate?: string;
  endDate?: string;
};

export class JobRepository {
  static async findAll(): Promise<(Job & { timeline: Timeline_Entry[] })[]> {
    try {
      const jobs = await prisma.job.findMany({
        include: { timeline: true },
      });
      return jobs;
    } catch (error) {
      console.error("Error al obtener las ofertas de trabajo:", error);
      throw new Error("No se pudieron obtener las ofertas de trabajo");
    }
  }

  static async findById(
    id: bigint,
  ): Promise<(Job & { timeline: Timeline_Entry[] }) | null> {
    try {
      const job = await prisma.job.findUnique({
        where: { id },
        include: { timeline: true },
      });
      return job;
    } catch (error) {
      console.error("Error al obtener las ofertas de trabajo:", error);
      throw new Error("No se pudieron obtener las ofertas de trabajo");
    }
  }

  static async findAllByApplierId(
    applierId: bigint,
  ): Promise<(Job & { timeline: Timeline_Entry[] })[]> {
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

  static async findPageByApplierId(
    applierId: bigint,
    { page, pageSize, status, query, startDate, endDate }: PaginatedJobsOptions,
  ) {
    try {
      const createdAtFilter: Prisma.DateTimeFilter = {};
      if (startDate) {
        const start = new Date(startDate);
        if (!isNaN(start.getTime())) {
          start.setHours(0, 0, 0, 0);
          createdAtFilter.gte = start;
        }
      }
      if (endDate) {
        const end = new Date(endDate);
        if (!isNaN(end.getTime())) {
          end.setHours(23, 59, 59, 999);
          createdAtFilter.lte = end;
        }
      }

      const hasDateFilter = Object.keys(createdAtFilter).length > 0;

      const where: Prisma.JobWhereInput = {
        applierId,
        ...(status ? { status } : {}),
        ...(hasDateFilter ? { createdAt: createdAtFilter } : {}),
        ...(query
          ? {
              OR: [
                { company: { contains: query, mode: "insensitive" } },
                { role: { contains: query, mode: "insensitive" } },
                { location: { contains: query, mode: "insensitive" } },
              ],
            }
          : {}),
      };

      const [jobs, total, groupedStatusCounts] = await prisma.$transaction([
        prisma.job.findMany({
          where,
          include: { timeline: true },
          orderBy: { updatedAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        }),
        prisma.job.count({ where }),
        prisma.job.groupBy({
          by: ["status"],
          where: { applierId },
          orderBy: { status: "asc" },
          _count: { _all: true },
        }),
      ]);
      const statusCounts = groupedStatusCounts as Array<{
        status: JobStatus;
        _count: { _all: number };
      }>;

      return {
        jobs,
        total,
        counts: Object.fromEntries(
          statusCounts.map(({ status, _count }) => [status, _count._all]),
        ),
      };
    } catch (error) {
      console.error("Error al obtener la página de ofertas de trabajo:", error);
      throw new Error("No se pudieron obtener las ofertas de trabajo");
    }
  }

  static async create(
    jobData: Prisma.JobUncheckedCreateInput,
  ): Promise<Job & { timeline: Timeline_Entry[] }> {
    try {
      const job = await prisma.job.create({
        data: {
          ...jobData,
          timeline: jobData.timeline ?? {
            create: [
              {
                stage: jobData.stage ?? "APPLIED",
                notes: "Postulación creada",
              },
            ],
          },
        },
        include: {
          timeline: true,
        },
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
  ): Promise<Job & { timeline: Timeline_Entry[] }> {
    try {
      const job = await prisma.job.update({
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
