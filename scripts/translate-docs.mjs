// Translates the guide (src/content, without the specification) into German, Spanish, French, Italian and Dutch.
// Runs once at build time with local Helsinki-NLP models (Xenova ONNX builds). No API key, no external service.
// Results go to src/content-i18n/<locale>/ and a sentence cache in scripts/translation-cache/ keeps reruns fast.
import { pipeline } from "@huggingface/transformers";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "src/content");
const OUTPUT = join(ROOT, "src/content-i18n");
const CACHE = join(ROOT, "scripts/translation-cache");

const MODELS = {
  de: "Xenova/opus-mt-en-de",
  es: "Xenova/opus-mt-en-es",
  fr: "Xenova/opus-mt-en-fr",
  it: "Xenova/opus-mt-en-it",
  nl: "Xenova/opus-mt-en-nl",
};

const BATCH = 8;

/** Opus-MT invents filler on short fragments ("......", "????", wiki headings). Those sentences fall back to English. */
function acceptable(source, translation) {
  if (!translation || !translation.trim()) return false;
  if (/\.{4,}|\?{3,}|={2,}|_{3,}|Einzelnachweise|References\b/.test(translation)) return false;
  const ratio = translation.length / source.length;
  return ratio > 0.5 && ratio < 2.2;
}
const onlyLocales = process.argv.slice(2);

function markdownFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return markdownFiles(path);
    return name.endsWith(".md") && !name.startsWith("PURELINE") ? [path] : [];
  });
}

/**
 * Rewrites one markdown document. `translate` receives plain sentences with all code, rule IDs and
 * link targets already replaced by placeholders, and returns the translated sentence.
 */
function transform(markdown, translate) {
  const out = [];
  let inFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      out.push(line);
      continue;
    }
    if (inFence || !line.trim()) {
      out.push(line);
      continue;
    }
    if (/^\s*\|/.test(line)) {
      // Table rows: separator rows stay, every other cell is translated on its own.
      if (/^\s*\|[\s:|-]+\|\s*$/.test(line)) {
        out.push(line);
        continue;
      }
      out.push(line.split("|").map((cell) => (cell.trim() ? cell.replace(/[^|]+/, (text) => translateText(text, translate)) : cell)).join("|"));
      continue;
    }
    const prefix = /^(\s*(?:#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s*)*)/.exec(line)[1];
    out.push(prefix + translateText(line.slice(prefix.length), translate));
  }
  return out.join("\n");
}

/** Protects code, links and rule IDs, translates sentence by sentence, then restores the protected parts. */
function translateText(text, translate) {
  const kept = [];
  const protect = (value) => {
    kept.push(value);
    return `ZQ${kept.length - 1}Z`;
  };

  let masked = text
    .replace(/\[([^\]]*)\]\(([^)]*)\)/g, (_, label, url) => `[${label}](${protect(url)})`)
    .replace(/`[^`]*`/g, (code) => protect(code))
    .replace(/PL-[A-Z0-9-]+/g, (id) => protect(id))
    .replace(/Pureline/g, (name) => protect(name))
    .replace(/\*\*|__/g, (marker) => protect(marker));

  if (!/[A-Za-z]{2,}/.test(masked.replace(/ZQ\d+Z/g, ""))) return text;

  const sentences = masked.split(/(?<=[.!?:])\s+/);
  const translated = sentences.map((s) => (/[A-Za-z]{2,}/.test(s.replace(/ZQ\d+Z/g, "")) ? translate(s) : s)).join(" ");

  // A translation that loses a placeholder would corrupt code or links: keep the source text instead.
  const placeholders = (masked.match(/ZQ\d+Z/g) ?? []).length;
  if ((translated.match(/ZQ\d+Z/g) ?? []).length !== placeholders) return text;
  return translated.replace(/ZQ(\d+)Z/g, (_, n) => kept[Number(n)]);
}

async function main() {
  const files = markdownFiles(SOURCE);
  const locales = Object.keys(MODELS).filter((l) => !onlyLocales.length || onlyLocales.includes(l));
  mkdirSync(CACHE, { recursive: true });

  for (const locale of locales) {
    const cachePath = join(CACHE, `${locale}.json`);
    const cache = existsSync(cachePath) ? JSON.parse(readFileSync(cachePath, "utf8")) : {};

    // Pass 1: collect every sentence that is not cached yet.
    const pending = new Set();
    for (const file of files) transform(readFileSync(file, "utf8"), (s) => (cache[s] === undefined && pending.add(s), s));

    if (pending.size) {
      console.log(`[${locale}] translating ${pending.size} sentences with ${MODELS[locale]}`);
      const translator = await pipeline("translation", MODELS[locale], { dtype: "q8" });
      const list = [...pending];
      for (let i = 0; i < list.length; i += BATCH) {
        const batch = list.slice(i, i + BATCH);
        const result = await translator(batch, { max_new_tokens: 256 });
        batch.forEach((source, k) => (cache[source] = result[k].translation_text));
      }
      writeFileSync(cachePath, JSON.stringify(cache, null, 1));
    }

    // Pass 2: write the translated documents.
    for (const file of files) {
      const target = join(OUTPUT, locale, relative(SOURCE, file));
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, transform(readFileSync(file, "utf8"), (s) => (acceptable(s, cache[s]) ? cache[s] : s)));
    }
    console.log(`[${locale}] wrote ${files.length} documents`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
