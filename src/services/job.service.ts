import { Job } from "@/app/generated/prisma/client";
import { JobDto } from "@/dto/job.dto";
import { JobRepository } from "@/repositories/job.repository";

export class JobService {
  static async getAllJobs() {
    try {
      const jobs: Job[] = await JobRepository.findAll();
      if (!jobs || jobs.length === 0) {
        return [];
      }
      const jobsDto: JobDto[] = jobs.map((job) => JobDto.fromPrisma(job));

      return jobsDto.map((jobDto) => jobDto.toJSON());
    } catch (error) {
      console.error("Error al procesar la lista de ofertas de trabajo:", error);
      throw new Error(
        "Ocurrió un error al procesar la lista de ofertas de trabajo",
      );
    }
  }

  static async getJobById(id: bigint) {
    try {
      const job: Job | null = await JobRepository.findById(id);
      if (!job) {
        throw new Error("No se encontró la oferta de trabajo");
      }
      return JobDto.fromPrisma(job).toJSON();
    } catch (error) {
      console.error("Error al procesar la oferta de trabajo:", error);
      throw new Error("Ocurrió un error al procesar la oferta de trabajo");
    }
  }

  static async AllJobsByApplierId(applierId: bigint) {
    try {
      const jobs: Job[] = await JobRepository.findAllByApplierId(applierId);
      if (!jobs || jobs.length === 0) {
        return [];
      }
      const jobsDto: JobDto[] = jobs.map((job) => JobDto.fromPrisma(job));
      return jobsDto.map((jobDto) => jobDto.toJSON());
    } catch (error) {
      console.error(
        "Error al procesar las ofertas de trabajo por aplicante:",
        error,
      );
      throw new Error(
        "Ocurrió un error al procesar las ofertas de trabajo por aplicante",
      );
    }
  }

  static async createJob(jobData: Partial<JobDto>) {
    try {
      const jobDto = new JobDto(jobData);
      const job: Job = await JobRepository.create(jobDto.toPrismaCreateInput());
      return JobDto.fromPrisma(job).toJSON();
    } catch (error) {
      console.error("Error al crear la oferta de trabajo:", error);
      throw new Error("Ocurrió un error al crear la oferta de trabajo");
    }
  }

  static async updateJobStatus(id: bigint, status: string) {
    try {
      const job = await JobRepository.update(id, { status } as Parameters<
        typeof JobRepository.update
      >[1]);
      return JobDto.fromPrisma(job).toJSON();
    } catch (error) {
      console.error("Error al actualizar el estado del trabajo:", error);
      throw new Error("Ocurrió un error al actualizar el estado del trabajo");
    }
  }

  static async deleteJob(id: bigint) {
    try {
      await JobRepository.delete(id);
    } catch (error) {
      console.error("Error al eliminar la oferta de trabajo:", error);
      throw new Error("Ocurrió un error al eliminar la oferta de trabajo");
    }
  }
}
