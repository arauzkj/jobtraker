import { JobDto } from "@/dto/job.dto";
import { auth } from "@/lib/auth";
import { JobStatusSchema } from "@/lib/validation/job.schema";
import { JobService } from "@/services/job.service";
import { headers } from "next/headers";

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(request: Request) {
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
    const { searchParams } = new URL(request.url);
    const page = parsePositiveInteger(searchParams.get("page"), 1);
    const pageSize = Math.min(
      parsePositiveInteger(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE,
    );
    const rawStatus = searchParams.get("status");
    const statusResult = rawStatus
      ? JobStatusSchema.safeParse(rawStatus)
      : undefined;

    if (statusResult && !statusResult.success) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    const startDate = searchParams.get("startDate")?.trim() || undefined;
    const endDate = searchParams.get("endDate")?.trim() || undefined;

    const result = await JobService.getJobsPageByApplierId(
      BigInt(session.user.id),
      {
        page,
        pageSize,
        status: statusResult?.data,
        query: searchParams.get("q")?.trim() || undefined,
        startDate,
        endDate,
      },
    );

    return Response.json(
      {
        data: result.jobs,
        counts: { all: Object.values(result.counts).reduce((sum, count) => sum + count, 0), ...result.counts },
        pagination: {
          page,
          pageSize,
          total: result.total,
          totalPages: Math.max(1, Math.ceil(result.total / pageSize)),
        },
      },
      { status: 200 },
    );
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

  try {
    const jobData = await request.json();

    const job = await JobService.createJob({
      ...jobData,
      applierId: BigInt(session.user.id),
    });
    return Response.json({ data: job }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ error: message }, { status: 500 });
  }
}
