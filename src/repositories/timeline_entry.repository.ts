import prisma from "@/lib/prisma";
import { Prisma, Timeline_Entry } from "@/app/generated/prisma/client";


export class TimelineEntryRepository {
    static async create(timelineEntryData: Prisma.Timeline_EntryUncheckedCreateInput): Promise<Timeline_Entry> {
        try {
            const timelineEntry: Timeline_Entry = await prisma.timeline_Entry.create({
                data: timelineEntryData,
            });
            return timelineEntry;
        } catch (error) {
            console.error("Error al crear la entrada de la línea de tiempo:", error);
            throw new Error("No se pudo crear la entrada de la línea de tiempo");
        }
    }
}