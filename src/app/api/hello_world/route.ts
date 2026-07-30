import { auth } from "@/lib/auth";
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

  return Response.json({ message: "Authorized Hello World" }, { status: 200 });
}
