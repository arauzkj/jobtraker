import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function DELETE(
  _req: NextRequest,
  ctx: RouteContext<"/api/timeline_entry/[id]">,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await ctx.params;
    // TODO: implement TimelineEntryService.delete
    void id;
    return Response.json({ data: null }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la entrada de la línea de tiempo:", error);
    return Response.json(
      { error: "Ocurrió un error al eliminar la entrada de la línea de tiempo" },
      { status: 500 },
    );
  }
}
