import { Job } from "@/app/generated/prisma/client";
import { JobDto } from "@/dto/job.dto";
import { JobRepository } from "@/repositories/job.repository";

export class JobService {
  static async getAllJobs() {
    try {
      const jobs: Job[] = await JobRepository.findAll();
      const jobsDto: JobDto[] = jobs.map((job) => JobDto.fromPrisma(job));
      return jobsDto.map((jobDto) => jobDto.toJSON());
    } catch (error) {
      console.error("Error al procesar la lista de ofertas de trabajo:", error);
      throw new Error(
        "Ocurrió un error al procesar la lista de ofertas de trabajo",
      );
    }
  }
}
