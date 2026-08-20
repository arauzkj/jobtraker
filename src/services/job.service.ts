import { Job, JobStatus } from "@/app/generated/prisma/client";
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
      const jobs = await JobRepository.findAllByApplierId(applierId);
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

  static async getJobsPageByApplierId(
    applierId: bigint,
    options: {
      page: number;
      pageSize: number;
      status?: JobStatus;
      query?: string;
    },
  ) {
    const result = await JobRepository.findPageByApplierId(applierId, options);

    return {
      ...result,
      jobs: result.jobs.map((job) => JobDto.fromPrisma(job).toJSON()),
    };
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

  static async updateJob(id: bigint, jobData: Partial<JobDto>) {
    try {
      const existingJob = await JobRepository.findById(id);
      const jobDto = new JobDto(jobData);
      const updateData: Parameters<typeof JobRepository.update>[1] = {
        title: jobDto.title,
        description: jobDto.description,
        status: jobDto.status,
        role: jobDto.role,
        location: jobDto.location,
        workMode: jobDto.workMode,
        contact: jobDto.contact,
        notes: jobDto.notes,
        salary: jobDto.salary,
        contactEmail: jobDto.contactEmail,
        link: jobDto.link,
        company: jobDto.company,
        wheresApplied: jobDto.wheresApplied,
      };

      if (existingJob && existingJob.status !== jobDto.status) {
        updateData.lastStatus = existingJob.status;
      }

      const job: Job = await JobRepository.update(id, updateData);
      return JobDto.fromPrisma(job).toJSON();
    } catch (error) {
      console.error("Error al actualizar la oferta de trabajo:", error);
      throw new Error("Ocurrió un error al actualizar la oferta de trabajo");
    }
  }

  static async updateJobStatus(id: bigint, status: string) {
    try {
      const existingJob = await JobRepository.findById(id);
      const updateData: Parameters<typeof JobRepository.update>[1] = {
        status: status as Job["status"],
      };

      if (existingJob && existingJob.status !== status) {
        updateData.lastStatus = existingJob.status;
      }

      const job = await JobRepository.update(id, updateData);
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
