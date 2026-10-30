import { callOpenRouterJSON } from "@/lib/openrouter-client";
import { auth } from "@/lib/auth";
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

  const url = decodeURIComponent((await ctx.params).link);

  // Try Jina Reader first (renders JS, returns clean markdown — works with LinkedIn, ATS, etc.)
  // Fall back to direct HTML fetch if Jina is unavailable.
  let text: string;
  try {
    const jinaRes = await fetch(`https://r.jina.ai/${url}`, {
      headers: { Accept: "text/plain" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!jinaRes.ok) throw new Error("Jina returned non-OK");
    text = (await jinaRes.text()).slice(0, 12_000);
  } catch {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml",
        },
        signal: AbortSignal.timeout(10_000),
      });
      const html = await res.text();
      text = html
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .replace(/<style[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s{2,}/g, " ")
        .trim()
        .slice(0, 12_000);
    } catch {
      return Response.json(
        { error: "No se pudo acceder a la URL proporcionada" },
        { status: 422 },
      );
    }
  }

  const prompt = `Extrae la información de esta oferta de trabajo y devuelve SOLO un JSON válido con exactamente estas claves (usa cadena vacía "" si no encuentras el dato):

{
  "title": "título descriptivo de la postulación (ej: Postulación Frontend Engineer - Empresa Q3)",
  "role": "nombre del puesto",
  "company": "nombre de la empresa",
  "location": "ciudad o país",
  "workMode": "Remoto | Híbrido | Presencial (elige uno o cadena vacía)",
  "salary": "rango salarial si se menciona",
  "wheresApplied": "plataforma de origen (ej: LinkedIn, Indeed, Bumeran)",
  "description": "copia TEXTUAL de la descripción del puesto. En LinkedIn extrae solo la sección 'Acerca del trabajo' / 'About the job'. No resumas ni traduzcas. Si no hay descripción, cadena vacía"
}

Texto de la oferta:
${text}`;

  try {
    const data = await callOpenRouterJSON(prompt);
    return Response.json({ data }, { status: 200 });
  } catch {
    return Response.json(
      { error: "El modelo no pudo procesar la oferta" },
      { status: 502 },
    );
  }
}
