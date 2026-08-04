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
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    await JobService.deleteJob(BigInt(id));
    return Response.json({ data: null }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la oferta de trabajo:", error);
    return Response.json(
      { error: "Ocurrió un error al eliminar la oferta de trabajo" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const updated = await JobService.updateJob(BigInt(id), body);
    return Response.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la oferta de trabajo:", error);
    return Response.json(
      { error: "Ocurrió un error al actualizar la oferta de trabajo" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  req: NextRequest,
  ctx: RouteContext<"/api/jobs/[id]">,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await ctx.params;
    const body = await req.json();
    const updated = await JobService.updateJobStatus(BigInt(id), body.status);
    return Response.json({ data: updated }, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar la oferta de trabajo:", error);
    return Response.json(
      { error: "Ocurrió un error al actualizar la oferta de trabajo" },
      { status: 500 },
    );
  }
}
