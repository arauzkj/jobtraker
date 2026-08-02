import * as cheerio from "cheerio";

export function extractReadableText(html: string): string {
  const $ = cheerio.load(html);
  $("script, style, nav, footer, header, svg, noscript").remove();

  const text = $("body").text().replace(/\s+/g, " ").trim();

  // Cortamos a un tamaño razonable para no gastar contexto/tokens de más
  return text.slice(0, 12000);
}