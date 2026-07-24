import { JobService } from "@/services/job.service";

export async function GET() {
  try {
    const jobs = await JobService.getAllJobs();

    return Response.json({data:jobs}, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}
