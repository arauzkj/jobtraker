import { Job } from "@/app/generated/prisma/client";
import { JobDto } from "@/dto/job.dto";
import { JobRepository } from "@/repositories/job.repository";

export class JobService {
  static async getAllJobs() {
    try {
      const jobs: Job[] = await JobRepository.findAll();
      if (!jobs || jobs.length === 0) {
        throw new Error("No se encontró la oferta de trabajo");
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
}
