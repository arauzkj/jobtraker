import { Timeline_EntryDto } from "@/dto/timeline_entry.dto";
import { auth } from "@/lib/auth";
import { TimelineEntryService } from "@/services/timeline_entry.service";
import { headers } from "next/headers";

export async function GET() {
    return Response.json({ message: "Hello from the timeline_entry API route!" });
}

export async function POST(request: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return Response.json(
            { error: "Unauthorized access" },
            { status: 401 },
        );
    }

    try {
        const timelineEntryData = await request.json();
        const timelineEntry = await TimelineEntryService.createTimelineEntry(new Timeline_EntryDto(timelineEntryData));
        return Response.json({ data: timelineEntry }, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unexpected error";
        return Response.json({ error: message }, { status: 500 });
    }
}