/**
 * Translates the sentences that the build could not translate yet, in the visitor's browser.
 * The model comes from the lite-translator packages (Transformers.js, OPUS-MT), is downloaded on the first use,
 * cached by the browser, and everything runs locally. No API key, no server. The packages are loaded on demand,
 * so they cost nothing for visitors who never press the button.
 */
export interface Missing {
  masked: string;
  restored: string;
  tokens: Record<string, string>;
}

export const LIVE_LOCALES = ["de", "es", "fr", "it", "nl"] as const;
export type LiveLocale = (typeof LIVE_LOCALES)[number];

const missingFiles = import.meta.glob<Record<string, Missing[]>>("../content-i18n/*/_missing.json", { import: "default" });

export function canTranslateLive(locale: string): locale is LiveLocale {
  return (LIVE_LOCALES as readonly string[]).includes(locale);
}

export async function loadMissing(locale: string, slug: string): Promise<Missing[]> {
  const load = missingFiles[`../content-i18n/${locale}/_missing.json`];
  if (!load) return [];
  const all = await load();
  return all[slug] ?? [];
}

/** Same plausibility check as the build: invented filler and length outliers are dropped. */
function plausible(source: string, translation: string): boolean {
  if (!translation.trim()) return false;
  if (/\.{4,}|\?{3,}|={2,}|_{3,}/.test(translation)) return false;
  const ratio = translation.length / source.length;
  return ratio > 0.5 && ratio < 2.2;
}

/** Returns the document body with the missing sentences replaced. Sentences that fail the checks stay English. */
export async function translateBody(body: string, locale: LiveLocale, items: Missing[], onProgress: (fraction: number) => void): Promise<string> {
  const [{ createTranslator }, { createOnnxEngine }] = await Promise.all([import("@lite-translator/core"), import("@lite-translator/engine-onnx")]);
  const translator = await createTranslator({
    from: "en",
    to: locale,
    engines: [createOnnxEngine()],
    onProgress: (event) => {
      if (Number.isFinite(event.progress)) onProgress(event.progress);
    },
  });

  try {
    const results = await translator.translateBatch(items.map((item) => item.masked));
    let result = body;
    results.forEach((entry, index) => {
      const item = items[index]!;
      const placeholders = (item.masked.match(/ZQ\d+Z/g) ?? []).length;
      // A translation that loses a placeholder would corrupt code or links: keep the English sentence.
      if ((entry.text.match(/ZQ\d+Z/g) ?? []).length !== placeholders || !plausible(item.masked, entry.text)) return;
      const text = entry.text.replace(/ZQ\d+Z/g, (token) => item.tokens[token] ?? token);
      result = result.split(item.restored).join(text);
    });
    return result;
  } finally {
    await translator.dispose();
  }
}
