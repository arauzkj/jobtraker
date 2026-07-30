import { auth } from "@/lib/auth";
import { JobService } from "@/services/job.service";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json(
      { error: "Unauthorized access hello world" },
      { status: 401 },
    );
  }

  try {
    const jobs = await JobService.AllJobsByApplierId(BigInt(session.user.id));

    return Response.json({ data: jobs }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return Response.json(
      { error: "Unauthorized access hello world" },
      { status: 401 },
    );
  }

  
}
