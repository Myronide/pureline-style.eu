import meta from "./content/meta.json";

const raw = import.meta.glob("./content/**/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

export interface Doc {
  slug: string;
  title: string;
  body: string;
}

export interface NavGroup {
  label: string;
  docs: Doc[];
}

const docs = new Map<string, Doc>();
for (const [path, body] of Object.entries(raw)) {
  const slug = path.replace("./content/", "").replace(/\.md$/, "");
  const title = body.match(/^#\s+(.+)$/m)?.[1] ?? slug;
  docs.set(slug, { slug, title, body });
}

export const repoUrl = `https://github.com/${meta.repo}`;
export const syncedAt = meta.syncedAt;
export const INDEX_SLUG = "README";

export const getDoc = (slug: string) => docs.get(slug);
export const docPath = (slug: string) => (slug === INDEX_SLUG ? "/docs" : `/docs/${slug}`);

const pick = (prefix: string) =>
  [...docs.values()].filter((d) => d.slug.startsWith(prefix) && !d.slug.endsWith("README")).sort((a, b) => a.slug.localeCompare(b.slug));
const named = (...slugs: string[]) => slugs.map((s) => docs.get(s)).filter((d): d is Doc => !!d);

export const nav: NavGroup[] = [
  { label: "Start", docs: named(INDEX_SLUG, "overview") },
  { label: "Core rules", docs: pick("core/") },
  { label: "Languages", docs: [...named("languages/README"), ...pick("languages/")] },
  { label: "Reference", docs: named("tooling", "PURELINE_SPECIFICATION_1.7") },
];

export const languageDocs = pick("languages/");
export const shortTitle = (d: Doc) => d.title.replace(/ Code Style$/, "").replace(/^Pureline /, "");

/** Resolves a relative markdown link from `fromSlug` to an internal route, or null if it is not a known doc. */
export function resolveLink(fromSlug: string, href: string): string | null {
  const [pathPart, hash] = href.split("#");
  const parts = fromSlug.split("/").slice(0, -1);
  for (const seg of (pathPart ?? "").split("/")) {
    if (seg === "..") parts.pop();
    else if (seg && seg !== ".") parts.push(seg);
  }
  const slug = (pathPart ? parts.join("/") : fromSlug).replace(/\.md$/, "");
  if (!docs.has(slug)) return null;
  return docPath(slug) + (hash ? `#${hash}` : "");
}

export function headings(body: string) {
  return [...body.matchAll(/^(##)\s+(.+)$/gm)].map((m) => ({ text: m[2]!.replace(/`/g, ""), id: slugify(m[2]!) }));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s/g, "-");
}
