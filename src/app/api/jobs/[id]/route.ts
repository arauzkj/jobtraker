import { auth } from "@/lib/auth";
import { JobService } from "@/services/job.service";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">,
) {
  const session = await auth.api.getSession({
      headers: await headers(),
    });
  
    if (!session) {
      return Response.json(
        { error: "Unauthorized access hello world" },
        { status: 401 },
      );
    }

  const { id } = await ctx.params;
  const job = await JobService.getJobById(BigInt(id));
  return Response.json({ data: job }, { status: 200 });
}



export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">,
){
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json(
      { error: "Unauthorized access" },
      { status: 401 },
    );
  }

  const { id } = await ctx.params;
  
  return Response.json({ data: null }, { status: 200 });

}
