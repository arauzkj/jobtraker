import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

// ── Constants ─────────────────────────────────────────────────────────────────

const PLATFORM_MAP: Record<string, string> = {
  "linkedin.com": "LinkedIn",
  "indeed.com": "Indeed",
  "glassdoor.com": "Glassdoor",
  "bumeran.com": "Bumeran",
  "computrabajo.com": "Computrabajo",
  "greenhouse.io": "Greenhouse",
  "boards.greenhouse.io": "Greenhouse",
  "lever.co": "Lever",
  "jobs.lever.co": "Lever",
  "myworkdayjobs.com": "Workday",
  "ashbyhq.com": "Ashby",
  "jobs.ashbyhq.com": "Ashby",
  "wellfound.com": "Wellfound",
  "angel.co": "AngelList",
  "getonbrd.com": "GetOnBoard",
  "occ.com.mx": "OCC",
};

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
  "Cache-Control": "no-cache",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function detectPlatform(url: string): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    for (const [domain, name] of Object.entries(PLATFORM_MAP)) {
      if (host === domain || host.endsWith(`.${domain}`)) return name;
    }
  } catch {
    // ignore
  }
  return "";
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function firstMatch(html: string, ...patterns: RegExp[]): string {
  for (const pattern of patterns) {
    const m = html.match(pattern);
    if (m?.[1]) return stripHtml(m[1]);
  }
  return "";
}

// ── LinkedIn ──────────────────────────────────────────────────────────────────

function getLinkedInJobId(url: string): string | null {
  const m = url.match(/\/jobs\/view\/(?:[^/?#]+-)?(\d+)/);
  return m ? m[1] : null;
}

function parseLinkedInHtml(html: string, platform: string) {
  // Title & company
  const role = firstMatch(
    html,
    /<h2[^>]*class="[^"]*top-card-layout__title[^"]*"[^>]*>([\s\S]*?)<\/h2>/i,
    /<h1[^>]*class="[^"]*topcard__title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i,
  );
  const company = firstMatch(
    html,
    /<a[^>]*class="[^"]*topcard__org-name-link[^"]*"[^>]*>([\s\S]*?)<\/a>/i,
    /<span[^>]*class="[^"]*topcard__flavor(?![^"]*bullet)[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
  );

  // Location
  const location = firstMatch(
    html,
    /<span[^>]*class="[^"]*topcard__flavor--bullet[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
  );

  // Description: extract from show-more-less-html__markup to the next <button
  let description = "";
  const markupIdx = html.indexOf("show-more-less-html__markup");
  if (markupIdx !== -1) {
    const tagEnd = html.indexOf(">", markupIdx) + 1;
    const buttonIdx = html.indexOf("<button", tagEnd);
    const sectionClose = html.indexOf("</section>", tagEnd);
    const end = Math.min(
      buttonIdx !== -1 ? buttonIdx : Infinity,
      sectionClose !== -1 ? sectionClose : Infinity,
    );
    if (end !== Infinity) {
      description = stripHtml(html.slice(tagEnd, end));
    }
  }

  // Work mode from criteria list
  let workMode = "";
  const criteriaItems = [
    ...html.matchAll(
      /<li[^>]*class="[^"]*description__job-criteria-item[^"]*"[^>]*>([\s\S]*?)<\/li>/gi,
    ),
  ];
  for (const m of criteriaItems) {
    const item = m[1];
    if (!/workplace|tipo.de.lugar|modalidad|remote|remoto/i.test(item)) continue;
    const val = firstMatch(
      item,
      /<span[^>]*class="[^"]*description__job-criteria-text[^"]*"[^>]*>([\s\S]*?)<\/span>/i,
    ).toLowerCase();
    if (val.includes("remote") || val.includes("remoto")) workMode = "Remoto";
    else if (val.includes("hybrid") || val.includes("híbrido")) workMode = "Híbrido";
    else if (
      val.includes("on-site") ||
      val.includes("presencial") ||
      val.includes("in-person")
    )
      workMode = "Presencial";
  }

  return {
    title: [role, company].filter(Boolean).join(" - "),
    role,
    company,
    location,
    workMode,
    salary: "",
    wheresApplied: platform,
    description,
  };
}

// ── JSON-LD (generic sites) ───────────────────────────────────────────────────

function extractJobPosting(html: string): Record<string, unknown> | null {
  const re =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      const items: unknown[] = Array.isArray(parsed)
        ? parsed
        : (parsed["@graph"] ?? [parsed]);
      for (const item of items) {
        if (typeof item !== "object" || item === null || !("@type" in item))
          continue;
        const t = (item as Record<string, unknown>)["@type"];
        if (t === "JobPosting" || (Array.isArray(t) && t.includes("JobPosting")))
          return item as Record<string, unknown>;
      }
    } catch {
      // skip malformed blocks
    }
  }
  return null;
}

function extractMeta(html: string, property: string): string {
  const m =
    html.match(
      new RegExp(
        `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']+)["']`,
        "i",
      ),
    ) ??
    html.match(
      new RegExp(
        `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${property}["']`,
        "i",
      ),
    );
  return m ? m[1].trim() : "";
}

function resolveLocation(job: Record<string, unknown>): string {
  const loc = job["jobLocation"];
  const target = Array.isArray(loc) ? loc[0] : loc;
  if (!target || typeof target !== "object") return "";
  const addr = (target as Record<string, unknown>)["address"];
  if (!addr || typeof addr !== "object") return "";
  const a = addr as Record<string, unknown>;
  return [a["addressLocality"], a["addressCountry"]]
    .filter((p): p is string => typeof p === "string" && p.length > 0)
    .slice(0, 2)
    .join(", ");
}

function resolveWorkMode(job: Record<string, unknown>): string {
  const t = job["jobLocationType"];
  if (t === "TELECOMMUTE" || (Array.isArray(t) && t.includes("TELECOMMUTE")))
    return "Remoto";
  return "";
}

function resolveSalary(job: Record<string, unknown>): string {
  const base = job["baseSalary"];
  if (!base || typeof base !== "object") return "";
  const b = base as Record<string, unknown>;
  const v = b["value"];
  if (!v || typeof v !== "object") return "";
  const val = v as Record<string, unknown>;
  const cur = typeof b["currency"] === "string" ? ` ${b["currency"]}` : "";
  if (val["minValue"] != null && val["maxValue"] != null)
    return `${val["minValue"]} - ${val["maxValue"]}${cur}`.trim();
  if (val["value"] != null) return `${val["value"]}${cur}`.trim();
  return "";
}

function mapJsonLd(job: Record<string, unknown>, platform: string) {
  const role = typeof job["title"] === "string" ? job["title"] : "";
  const company =
    typeof job["hiringOrganization"] === "object" &&
    job["hiringOrganization"] !== null
      ? (
          (job["hiringOrganization"] as Record<string, unknown>)[
            "name"
          ] as string
        ) ?? ""
      : "";
  const description =
    typeof job["description"] === "string" ? stripHtml(job["description"]) : "";

  return {
    title: [role, company].filter(Boolean).join(" - "),
    role,
    company,
    location: resolveLocation(job),
    workMode: resolveWorkMode(job),
    salary: resolveSalary(job),
    wheresApplied: platform,
    description,
  };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/jobs/link/[link]">,
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return Response.json({ error: "Unauthorized access" }, { status: 401 });
  }

  const url = decodeURIComponent((await ctx.params).link);
  const platform = detectPlatform(url);

  // ── LinkedIn: guest API (no login required) ───────────────────────────────
  if (platform === "LinkedIn") {
    const jobId = getLinkedInJobId(url);
    if (jobId) {
      try {
        const res = await fetch(
          `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${jobId}`,
          { headers: BROWSER_HEADERS, signal: AbortSignal.timeout(10_000) },
        );
        if (res.ok) {
          const html = await res.text();
          return Response.json(
            { data: parseLinkedInHtml(html, platform) },
            { status: 200 },
          );
        }
      } catch {
        // fall through to generic path
      }
    }
  }

  // ── Generic: fetch page → JSON-LD → meta tags ─────────────────────────────
  let html: string;
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(10_000),
    });
    html = await res.text();
  } catch {
    return Response.json(
      { error: "No se pudo acceder a la URL proporcionada" },
      { status: 422 },
    );
  }

  const job = extractJobPosting(html);
  if (job) {
    return Response.json({ data: mapJsonLd(job, platform) }, { status: 200 });
  }

  // Last resort: Open Graph meta tags
  const ogTitle = extractMeta(html, "og:title") || extractMeta(html, "title");
  const ogDescription = extractMeta(html, "og:description");

  if (!ogTitle && !ogDescription) {
    return Response.json(
      { error: "No se encontraron datos en esta página" },
      { status: 404 },
    );
  }

  return Response.json(
    {
      data: {
        title: ogTitle,
        role: "",
        company: "",
        location: "",
        workMode: "",
        salary: "",
        wheresApplied: platform,
        description: ogDescription,
      },
    },
    { status: 200 },
  );
}
