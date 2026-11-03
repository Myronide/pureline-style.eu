import { createHighlighterCore, type HighlighterCore } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";

/** Shiki's bundled languages plus the Pureline-specific TextMate grammars in src/grammars. */
const langs = {
  java: () => import("shiki/langs/java.mjs"),
  javascript: () => import("shiki/langs/javascript.mjs"),
  typescript: () => import("shiki/langs/typescript.mjs"),
  go: () => import("shiki/langs/go.mjs"),
  rust: () => import("shiki/langs/rust.mjs"),
  crystal: () => import("shiki/langs/crystal.mjs"),
  python: () => import("shiki/langs/python.mjs"),
  qml: () => import("shiki/langs/qml.mjs"),
  astro: () => import("shiki/langs/astro.mjs"),
  html: () => import("shiki/langs/html.mjs"),
  css: () => import("shiki/langs/css.mjs"),
  emvus: () => import("../grammars/emvus.tmLanguage.json"),
  emerald: () => import("../grammars/emerald.tmLanguage.json"),
  novus: () => import("../grammars/novus.tmLanguage.json"),
} as const;

type Lang = keyof typeof langs;

const aliases: Record<string, Lang> = {
  js: "javascript",
  ts: "typescript",
  rs: "rust",
  cr: "crystal",
  py: "python",
  ev: "emvus",
  ems: "emerald",
  nv: "novus",
  htm: "html",
  scss: "css",
};

const resolve = (lang: string): Lang | null => {
  const name = aliases[lang] ?? lang;
  return name in langs ? (name as Lang) : null;
};

type LanguageInput = Parameters<HighlighterCore["loadLanguage"]>[0];

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
  if (!name) {
    return null;
  }
  const hl = await load();
  if (!hl.getLoadedLanguages().includes(name)) {
    await hl.loadLanguage((await langs[name]()) as LanguageInput);
  }
  return hl.codeToHtml(code, { lang: name, theme: "github-dark" });
}

export interface Token {
  start: number;
  end: number;
  color: string | undefined;
}

/** Character offsets and colours of every token, so the editor can paint colours under its own underlines. */
export async function tokenize(code: string, lang: string): Promise<Token[] | null> {
  const name = resolve(lang);
  if (!name) {
    return null;
  }
  const hl = await load();
  if (!hl.getLoadedLanguages().includes(name)) {
    await hl.loadLanguage((await langs[name]()) as LanguageInput);
  }
  const lines = hl.codeToTokens(code, { lang: name, theme: "github-dark" }).tokens;
  const tokens: Token[] = [];
  let pos = 0;
  lines.forEach((line, i) => {
    for (const token of line) {
      tokens.push({ start: pos, end: pos + token.content.length, color: token.color });
      pos += token.content.length;
    }
    if (i < lines.length - 1) {
      pos += 1;
    }
  });
  return pos === code.length ? tokens : null;
}
