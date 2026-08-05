import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  process.env.BETTER_AUTH_URL ??
  "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/terminos`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/eula`, changeFrequency: "yearly", priority: 0.3 },
  ];
}
