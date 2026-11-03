// Finishes the hand-written translations in src/content-translations/<locale>/:
//  1. appends the English anchor to every heading ("## Titel {#english-title}"), so links and the rule index still resolve,
//  2. checks that code blocks, inline code, rule IDs and link targets are identical to the English source.
//  3. records a hash of each English source in _sources.json, so the site can tell when the English text changed after the
//     translation was made. Existing hashes are kept; pass --record to overwrite them after re-translating.
// Usage: node scripts/finish-translations.mjs [--record] [locale ...]
import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "src/content");
const TARGET = join(ROOT, "src/content-translations");
const args = process.argv.slice(2);
const record = args.includes("--record");
const only = args.filter((arg) => !arg.startsWith("--"));

/** Same function as in src/content.ts. */
function hash(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(16);
}
const SOURCES = join(TARGET, "_sources.json");
const sources = existsSync(SOURCES) ? JSON.parse(readFileSync(SOURCES, "utf8")) : {};

const slugify = (text) => text.toLowerCase().replace(/`/g, "").replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s/g, "-");
const HEADING_ID = /(?:\s*\{#[^}\s]+\})+\s*$/;

function markdownFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return markdownFiles(path);
    return name.endsWith(".md") && !name.startsWith("PURELINE") ? [path] : [];
  });
}

/** Lines outside fenced code: [{ index, line }], and the fenced blocks as strings. */
function split(text) {
  const prose = [];
  const fences = [];
  let current = null;
  text.split("\n").forEach((line, index) => {
    if (/^\s*```/.test(line)) {
      if (current) {
        current.push(line);
        fences.push(current.join("\n"));
        current = null;
      } else {
        current = [line];
      }
      return;
    }
    if (current) current.push(line);
    else prose.push({ index, line });
  });
  return { prose, fences };
}

const sorted = (list) => [...list].sort();
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const targets = (text) => [...text.matchAll(/\]\(([^)]*)\)/g)].map((m) => m[1]);
const codeSpans = (text) => [...text.matchAll(/`[^`\n]+`/g)].map((m) => m[0]);
const ruleIds = (text) => text.match(/PL-[A-Z0-9]+-\d+/g) ?? [];

let problems = 0;
const locales = readdirSync(TARGET).filter((name) => statSync(join(TARGET, name)).isDirectory() && (!only.length || only.includes(name)));

for (const locale of locales) {
  const files = markdownFiles(SOURCE);
  let done = 0;
  const missing = [];
  for (const file of files) {
    const rel = relative(SOURCE, file);
    const path = join(TARGET, locale, rel);
    if (!existsSync(path)) {
      missing.push(rel);
      continue;
    }
    const english = readFileSync(file, "utf8");
    const raw = readFileSync(path, "utf8");
    const translated = raw.replace(/\r\n/g, "\n");
    const en = split(english);
    const tr = split(translated);
    const note = (message) => {
      problems++;
      console.log(`[${locale}] ${rel}: ${message}`);
    };

    const enHeadings = en.prose.filter(({ line }) => /^#{1,6}\s/.test(line));
    const trHeadings = tr.prose.filter(({ line }) => /^#{1,6}\s/.test(line));
    if (enHeadings.length !== trHeadings.length || enHeadings.some((h, i) => h.line.match(/^#+/)[0] !== trHeadings[i].line.match(/^#+/)[0])) {
      note(`headings differ (${enHeadings.length} English, ${trHeadings.length} translated)`);
      continue;
    }

    const lines = translated.split("\n");
    enHeadings.forEach((h, i) => {
      const level = h.line.match(/^#+/)[0].length;
      if (level < 2 || level > 4) return;
      const slug = slugify(h.line.replace(/^#+\s+/, "").replace(HEADING_ID, ""));
      const target = trHeadings[i];
      lines[target.index] = target.line.replace(HEADING_ID, "") + ` {#${slug}}`;
    });
    const result = lines.join("\n");
    if (result !== raw) writeFileSync(path, result);

    // The text after a fence's language name is prose in one source file; only compare the fence structure and code.
    const normal = (blocks) => blocks.map((block) => block.replace(/^(\s*```\S*).*$/gm, "$1"));
    if (!same(normal(en.fences), normal(tr.fences))) note(`code blocks differ (${en.fences.length} English, ${tr.fences.length} translated)`);
    if (!same(sorted(codeSpans(english)), sorted(codeSpans(translated)))) note("inline code differs");
    if (!same(sorted(ruleIds(english)), sorted(ruleIds(translated)))) note("rule IDs differ");
    if (!same(targets(english), targets(translated))) note("link targets differ");
    if (english.split("\n").length !== translated.split("\n").length) note(`line count differs (${english.split("\n").length} vs ${translated.split("\n").length})`);
    const key = `${locale}/${rel.replace(/\.md$/, "").split("\\").join("/")}`;
    if (record || !sources[key]) sources[key] = hash(english.replace(/\r\n/g, "\n"));
    done++;
  }
  console.log(`[${locale}] ${done}/${files.length} files finished${missing.length ? `, missing: ${missing.join(", ")}` : ""}`);
}
writeFileSync(SOURCES, JSON.stringify(Object.fromEntries(Object.entries(sources).sort()), null, 1) + "\n");
console.log(problems ? `${problems} problems` : "no problems");
