import { auth } from "@/lib/auth";
import { JobService } from "@/services/job.service";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/jobs/link/[link]">,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }
  const { link } = await ctx.params;
  const decodedUrl = decodeURIComponent(link);
  const result = await JobService.importJobFromLink(decodedUrl);

  return Response.json(result, { status: 200 });
}
