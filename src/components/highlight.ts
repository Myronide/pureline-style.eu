import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

const langs = {
  java: () => import("shiki/langs/java.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  go: () => import("shiki/langs/go.mjs"),
  rust: () => import("shiki/langs/rust.mjs"),
  crystal: () => import("shiki/langs/crystal.mjs"),
} as const;

const aliases: Record<string, keyof typeof langs> = { js: "javascript", ts: "typescript", rs: "rust", cr: "crystal" };

const resolve = (lang: string) => {
  const name = aliases[lang] ?? lang;
  return name in langs ? (name as keyof typeof langs) : null;
};

let highlighter: Promise<HighlighterCore> | undefined;

const load = () =>
  (highlighter ??= createHighlighterCore({
    themes: [import("shiki/themes/github-dark.mjs")],
    langs: [],
    engine: createJavaScriptRegexEngine(),
  }));

/** Returns highlighted HTML, or null when the language is unknown (render plain text). */
export async function highlight(code: string, lang: string): Promise<string | null> {
  const name = resolve(lang);
  if (!name) return null;
  const hl = await load();
  if (!hl.getLoadedLanguages().includes(name)) await hl.loadLanguage(langs[name]());
  return hl.codeToHtml(code, { lang: name, theme: "github-dark" });
}
