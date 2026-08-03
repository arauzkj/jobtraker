import { Job } from "@/app/generated/prisma/client";
import { JobDto } from "@/dto/job.dto";
import { callOpenRouterJSON } from "@/lib/openrouter-client";
import { fetchJobPage } from "@/lib/scraping/fetch-page";
import { extractReadableText } from "@/lib/scraping/scrap-text";
import { JobRepository } from "@/repositories/job.repository";
import { JobImportResult } from "@/types/job-import.types";

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

  static async importJobFromLink(url: string): Promise<JobImportResult> {
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      return {
        status: "manual_required",
        reason: "invalid_url",
        message: "El link no es una URL válida.",
        sourceUrl: url,
      };
    }

    const page = await fetchJobPage(parsed.toString());

    if (page.blocked) {
      return {
        status: "manual_required",
        reason: "blocked",
        message:
          "El sitio bloqueó el acceso automático. Completá los datos manualmente.",
        sourceUrl: url,
      };
    }

    const text = extractReadableText(page.html);
    if (text.length < 100) {
      return {
        status: "manual_required",
        reason: "no_content",
        message: "No se pudo extraer contenido útil de la página.",
        sourceUrl: url,
      };
    }

    try {
      const extracted = await callOpenRouterJSON(EXTRACTION_PROMPT(text));
      return {
        status: "ok",
        data: extracted as Partial<JobDto>,
        sourceUrl: url,
      };
    } catch {
      return {
        status: "manual_required",
        reason: "ai_parse_error",
        message:
          "No se pudo interpretar el contenido con IA. Completá los datos manualmente.",
        sourceUrl: url,
      };
    }
  }
}

const EXTRACTION_PROMPT = (text: string) =>
  `
Extraé la siguiente información de esta oferta de trabajo. Respondé SOLO con un objeto JSON, sin texto adicional, sin markdown, con estas claves exactas (usá "" si no encontrás el dato, nunca null ni omitas la clave):

{
  "title": "",
  "company": "",
  "role": "",
  "location": "",
  "workMode": "",
  "salary": "",
  "description": "",
  "contactEmail": ""
}

Contenido de la oferta:
"""
${text}
"""
`.trim();
