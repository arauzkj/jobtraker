import { Timeline_EntryDto } from "@/dto/timeline_entry.dto";
import { TimelineEntryRepository } from "@/repositories/timeline_entry.repository";

export class TimelineEntryService{
    static async createTimelineEntry(timelineEntryData: Partial<Timeline_EntryDto>) {
        try {
            const timelineEntryDto = new Timeline_EntryDto(timelineEntryData);
            const timelineEntry = await TimelineEntryRepository.create(timelineEntryDto.toPrismaCreateInput());
            return Timeline_EntryDto.fromPrisma(timelineEntry).toJSON();

        } catch (error) {
            console.error("Error al crear la entrada de la línea de tiempo:", error);
            throw new Error("No se pudo crear la entrada de la línea de tiempo");
        }
    }
}