import { JobService } from "@/services/job.service";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await JobService.getAllJobs();

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
