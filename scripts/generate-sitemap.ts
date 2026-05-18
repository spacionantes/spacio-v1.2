// Runs before `vite dev` and `vite build`; writes public/sitemap.xml.
import { writeFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://find-fab-spaces.lovable.app";
const SUPABASE_URL = "https://opgcudohhcpmmzvkivtg.supabase.co";
const SUPABASE_ANON =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wZ2N1ZG9oaGNwbW16dmtpdnRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1MDc5NjQsImV4cCI6MjA4NzA4Mzk2NH0.qIOeXz8sh0PCWVSHw7BOHbP7sqWY_EBcOZKqJCYtZ6s";

interface SitemapEntry {
  path: string;
  lastmod?: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/explorer", changefreq: "daily", priority: "0.9" },
  { path: "/devenir-hote", changefreq: "monthly", priority: "0.8" },
  { path: "/louer-local-association-nantes", changefreq: "monthly", priority: "0.85" },
  { path: "/diagnostic", changefreq: "monthly", priority: "0.7" },
  { path: "/commencer", changefreq: "monthly", priority: "0.7" },
  { path: "/missions", changefreq: "yearly", priority: "0.6" },
  { path: "/equipe", changefreq: "yearly", priority: "0.5" },
  { path: "/reseau", changefreq: "monthly", priority: "0.5" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/legal", changefreq: "yearly", priority: "0.3" },
];

async function fetchBlog(): Promise<SitemapEntry[]> {
  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/blog?select=slug,updated_at,published_at&order=published_at.desc`,
      { headers: { apikey: SUPABASE_ANON, Authorization: `Bearer ${SUPABASE_ANON}` } },
    );
    if (!res.ok) return [];
    const rows: { slug: string; updated_at?: string; published_at?: string }[] = await res.json();
    return rows
      .filter((r) => r.slug)
      .map((r) => ({
        path: `/blog/${r.slug}`,
        lastmod: (r.updated_at || r.published_at || "").slice(0, 10) || undefined,
        changefreq: "monthly" as const,
        priority: "0.7",
      }));
  } catch {
    return [];
  }
}

function generate(entries: SitemapEntry[]) {
  const urls = entries.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n"),
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

(async () => {
  const blog = await fetchBlog();
  const entries = [...staticEntries, ...blog];
  writeFileSync(resolve("public/sitemap.xml"), generate(entries));
  console.log(`sitemap.xml written (${entries.length} entries, ${blog.length} blog)`);
})();
