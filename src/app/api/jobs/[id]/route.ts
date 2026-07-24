import { JobService } from "@/services/job.service";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">,
) {
  const { id } = await ctx.params;
  const job = await JobService.getJobById(BigInt(id));
  return Response.json({ data: job }, { status: 200 });
}
