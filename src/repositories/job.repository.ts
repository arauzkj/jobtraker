import { Job } from "@/app/generated/prisma/client";
import prisma from "@/lib/prisma";

export class JobRepository {
    static async findAll() {
        try {
            const jobs: Job[]= await prisma.job.findMany();            
            return jobs;
        } catch (error) {
            console.error("Error al obtener las ofertas de trabajo:", error);
            throw new Error("No se pudieron obtener las ofertas de trabajo");
        }
    }
}