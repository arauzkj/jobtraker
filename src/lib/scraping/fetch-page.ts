// lib/scraping/fetch-page.ts

const BLOCK_INDICATORS = [
  "captcha",
  "cf-challenge",
  "cloudflare",
  "access denied",
  "attention required",
  "verify you are human",
];

export type FetchPageResult =
  | { blocked: false; html: string }
  | { blocked: true; reason: string };

export async function fetchJobPage(url: string): Promise<FetchPageResult> {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });

    // Bloqueo explícito por status
    if ([401, 403, 429, 503].includes(res.status)) {
      return { blocked: true, reason: `http_${res.status}` };
    }

    if (!res.ok) {
      return { blocked: true, reason: `http_${res.status}` };
    }

    const html = await res.text();

    // Heurística: página sospechosamente corta o con señales de challenge
    const lower = html.toLowerCase();
    const hasBlockSignal = BLOCK_INDICATORS.some((ind) => lower.includes(ind));
    if (hasBlockSignal || html.length < 500) {
      return { blocked: true, reason: "challenge_detected" };
    }

    return { blocked: false, html };
  } catch (err) {
    // timeout, DNS, TLS, etc. -> tratamos como bloqueo para no complicar
    return { blocked: true, reason: "fetch_error" };
  }
}