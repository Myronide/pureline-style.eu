import { type KeyboardEvent, type ReactNode, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { type Token, tokenize } from "../components/highlight";
import { docPath } from "../content";
import { useI18n } from "../i18n/context";
import type { Messages } from "../i18n/messages";
import { analyze, applyEdits, convert, docsFor, indentUnit, type Issue, type Lang, type Severity } from "../lint";
import { samples } from "../lint/samples";
import { extraSamples } from "./editorSamples";

/** Every language gets highlighting; only the three with a checker get underlines and fixes. */
const LANGS = [
  { id: "typescript", label: "TypeScript", checked: true },
  { id: "javascript", label: "JavaScript", checked: true },
  { id: "java", label: "Java", checked: true },
  { id: "rust", label: "Rust" },
  { id: "go", label: "Go" },
  { id: "python", label: "Python" },
  { id: "crystal", label: "Crystal" },
  { id: "emvus", label: "Emvus" },
  { id: "emerald", label: "Emerald" },
  { id: "novus", label: "Novus" },
  { id: "qml", label: "QML" },
  { id: "astro", label: "Astro" },
  { id: "html", label: "HTML" },
  { id: "css", label: "CSS" },
] as const;

type EditorLang = (typeof LANGS)[number]["id"];

const isChecked = (id: EditorLang): id is Lang => id === "typescript" || id === "javascript" || id === "java";
const labelOf = (id: EditorLang) => LANGS.find((l) => l.id === id)!.label;
const exampleFor = (id: EditorLang): string => (isChecked(id) ? samples[id] : extraSamples[id]!);

const TONE: Record<Severity, { text: string; line: string; dot: string; rank: number; chip: string }> = {
  error: { text: "text-warn", line: "decoration-warn", dot: "bg-warn", rank: 3, chip: "border-warn/40 text-warn" },
  warn: { text: "text-amber-400", line: "decoration-amber-400", dot: "bg-amber-400", rank: 2, chip: "border-amber-400/40 text-amber-400" },
  info: { text: "text-accent", line: "decoration-accent", dot: "bg-accent", rank: 1, chip: "border-accent/40 text-accent" },
};

/** Gutter, colour layer and textarea must share these metrics exactly, or the text drifts. */
const MONO = "font-mono text-[13px] leading-6 [tab-size:4] [font-variant-ligatures:none]";
const LINE_HEIGHT = 24;

const button = "inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors hover:bg-raised disabled:pointer-events-none disabled:opacity-40";

/** First-line extent of an issue: long ranges (a whole `if` block) would otherwise underline the whole block. */
function visibleEnd(code: string, issue: Issue): number {
  const eol = code.indexOf("\n", issue.start);
  return Math.max(issue.start + 1, Math.min(issue.end, eol === -1 ? code.length : eol));
}

/**
 * Paints the code: token colours from the highlighter and wavy underlines from the checker,
 * split at every boundary of either so the two layers never fight over a character.
 */
function paint(code: string, tokens: Token[] | null, issues: Issue[]): ReactNode[] {
  const ranges = issues.map((issue) => ({ from: issue.start, to: visibleEnd(code, issue), severity: issue.severity }));
  const cuts = new Set([0, code.length]);
  for (const t of tokens ?? []) {
    cuts.add(t.start);
    cuts.add(t.end);
  }
  for (const r of ranges) {
    cuts.add(r.from);
    cuts.add(Math.min(r.to, code.length));
  }
  const points = [...cuts].filter((p) => p >= 0 && p <= code.length).sort((a, b) => a - b);

  const out: ReactNode[] = [];
  let k = 0;
  for (let i = 0; i < points.length - 1; i++) {
    const from = points[i]!;
    const to = points[i + 1]!;
    if (from === to) continue;
    while (tokens && k < tokens.length && tokens[k]!.end <= from) k++;
    const color = tokens && k < tokens.length && tokens[k]!.start <= from ? tokens[k]!.color : undefined;
    const top = ranges
      .filter((r) => r.from < to && r.to > from)
      .reduce<Severity | null>((best, r) => (!best || TONE[r.severity].rank > TONE[best].rank ? r.severity : best), null);
    const text = code.slice(from, to);
    if (!color && !top) {
      out.push(text);
      continue;
    }
    out.push(
      <span key={from} style={color ? { color } : undefined} className={top ? `underline decoration-wavy decoration-1 underline-offset-4 ${TONE[top].line}` : undefined}>
        {text}
      </span>,
    );
  }
  return out;
}

/** Renders `code` spans inside an issue message. */
function Message({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 ? <code key={i} className="rounded bg-raised px-1 py-0.5 font-mono text-[0.85em]">{part}</code> : part,
      )}
    </>
  );
}

function IssueRow({ issue, stale, onJump, onFix, t }: { issue: Issue; stale: boolean; onJump: () => void; onFix: () => void; t: (key: keyof Messages, vars?: Record<string, string | number>) => string }) {
  return (
    <li className="group flex gap-3 border-b border-line/70 px-4 py-3.5 last:border-0">
      <span className={`mt-2 size-1.5 shrink-0 rounded-full ${TONE[issue.severity].dot}`} />
      <div className="min-w-0 flex-1">
        <button type="button" onClick={onJump} className="block w-full text-left text-sm leading-relaxed transition-colors hover:text-accent">
          <Message text={issue.message} />
        </button>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="font-mono tabular-nums">{t("editor.line", { line: issue.line, col: issue.col })}</span>
          <Link to={docPath(docsFor(issue.rule))} className="rounded-md border border-line px-1.5 py-0.5 font-mono transition-colors hover:text-fg">
            {issue.rule}
          </Link>
          {issue.fixable ? (
            <button type="button" onClick={onFix} disabled={stale} className="ml-auto inline-flex items-center gap-1 rounded-md border border-accent/30 px-2 py-0.5 text-accent transition-colors hover:bg-accent/10 disabled:opacity-40">
              <Icon name="lucide:wand-sparkles" className="size-3" /> {t("editor.fix")}
            </button>
          ) : (
            <span className="ml-auto">{t("editor.manual")}</span>
          )}
        </div>
      </div>
    </li>
  );
}

export function Editor() {
  const { t } = useI18n();
  const [lang, setLang] = useState<EditorLang>("typescript");
  const [code, setCode] = useState(() => exampleFor("typescript"));
  const [history, setHistory] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tokens, setTokens] = useState<{ text: string; lang: EditorLang; list: Token[] | null } | null>(null);

  const textarea = useRef<HTMLTextAreaElement>(null);
  const layer = useRef<HTMLPreElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const caret = useRef<number | null>(null);
  const trapTab = useRef(true);

  const deferred = useDeferredValue(code);
  const stale = deferred !== code;
  const checked = isChecked(lang);
  const issues = useMemo(() => (isChecked(lang) ? analyze(deferred, lang) : []), [deferred, lang]);
  const fixable = issues.filter((i) => i.fixable).length;
  const lineCount = useMemo(() => deferred.split("\n").length, [deferred]);
  const linesWithIssues = useMemo(() => new Map(issues.map((i) => [i.line, i.severity])), [issues]);

  useEffect(() => {
    let current = true;
    tokenize(deferred, lang).then((list) => {
      if (current) setTokens({ text: deferred, lang, list });
    });
    return () => {
      current = false;
    };
  }, [deferred, lang]);
  const activeTokens = tokens && tokens.text === deferred && tokens.lang === lang ? tokens.list : null;

  useLayoutEffect(() => {
    if (caret.current === null) return;
    textarea.current?.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [code]);

  const unit = (text: string) => (isChecked(lang) ? indentUnit(text, lang) : lang === "go" ? "\t" : "    ");

  function commit(next: string, message: string) {
    if (next === code) return;
    setHistory((h) => [...h.slice(-19), code]);
    setCode(next);
    setNotice(`${message} ${summary(isChecked(lang) ? analyze(next, lang) : [])}`);
  }

  function summary(left: Issue[]) {
    if (!left.length) return t("editor.nothingLeft");
    const auto = left.filter((i) => i.fixable).length;
    return auto ? t("editor.leftAuto", { count: left.length, auto }) : t("editor.leftManual", { count: left.length });
  }

  function onConvert() {
    if (!isChecked(lang)) return;
    const result = convert(code, lang);
    if (result.code === code) {
      setNotice(t("editor.noConvert"));
      return;
    }
    commit(result.code, t("editor.applied", { count: result.fixes }));
  }

  function onUndo() {
    const previous = history[history.length - 1];
    if (previous === undefined) return;
    setHistory(history.slice(0, -1));
    setCode(previous);
    setNotice(null);
  }

  function onLang(next: EditorLang) {
    if (next === lang) return;
    const untouched = !code.trim() || code === exampleFor(lang);
    setLang(next);
    setNotice(null);
    if (untouched) setCode(exampleFor(next));
  }

  function jump(issue: Issue) {
    const el = textarea.current;
    if (!el) return;
    el.focus();
    el.setSelectionRange(issue.start, visibleEnd(deferred, issue));
    el.scrollTop = Math.max(0, (issue.line - 4) * LINE_HEIGHT);
  }

  async function copy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function replaceRange(from: number, to: number, text: string) {
    caret.current = from + text.length;
    setCode(code.slice(0, from) + text + code.slice(to));
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    const el = e.currentTarget;
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Escape") {
      trapTab.current = false;
      return;
    }

    if (e.key === "Tab" && !e.shiftKey && trapTab.current) {
      e.preventDefault();
      replaceRange(el.selectionStart, el.selectionEnd, unit(code));
      return;
    }

    if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const at = el.selectionStart;
      const before = code.slice(at > 0 ? code.lastIndexOf("\n", at - 1) + 1 : 0, at);
      const indent = /^[ \t]*/.exec(before)![0];
      const opens = /[{([]\s*$/.test(before);
      replaceRange(at, el.selectionEnd, `\n${indent}${opens ? unit(code) : ""}`);
    }
  }

  function syncScroll(e: { currentTarget: HTMLTextAreaElement }) {
    const { scrollTop, scrollLeft } = e.currentTarget;
    if (layer.current) {
      layer.current.scrollTop = scrollTop;
      layer.current.scrollLeft = scrollLeft;
    }
    if (gutter.current) gutter.current.scrollTop = scrollTop;
  }

  const counts = (["error", "warn", "info"] as const).map((s) => ({ s, n: issues.filter((i) => i.severity === s).length }));
  const severityLabel: Record<Severity, string> = { error: t("editor.errors"), warn: t("editor.warnings"), info: t("editor.info") };

  return (
    <div className="shell py-12">
      <div className="max-w-2xl">
        <h1 className="display text-[2.25rem] leading-tight">{t("editor.title")}</h1>
        <p className="mt-4 leading-relaxed text-muted">{t("editor.intro")}</p>
      </div>

      <div className="mt-10 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <label className="relative flex items-center">
            <span className="sr-only">{t("editor.language")}</span>
            <select
              value={lang}
              onChange={(e) => onLang(e.target.value as EditorLang)}
              className="cursor-pointer appearance-none rounded-md border border-line bg-surface py-2 pl-3 pr-9 text-sm transition-colors hover:border-accent/50 focus:border-accent focus:outline-none"
            >
              {LANGS.map((l) => (
                <option key={l.id} value={l.id}>{l.label}</option>
              ))}
            </select>
            <Icon name="lucide:chevron-down" className="pointer-events-none absolute right-3 size-4 text-muted" />
          </label>
          <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs ${checked ? "border-accent/40 text-accent" : "border-line text-muted"}`}>
            <span className={`size-1.5 rounded-full ${checked ? "bg-accent" : "bg-muted"}`} />
            {checked ? t("editor.checkerOn") : t("editor.checkerOff")}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={button} onClick={() => commit(exampleFor(lang), t("editor.loaded"))} title={t("editor.exampleTitle")}>
            <Icon name="lucide:file-code" /> {t("editor.example")}
          </button>
          <button type="button" className={button} onClick={copy}>
            <Icon name={copied ? "lucide:check" : "lucide:copy"} /> {copied ? t("editor.copied") : t("editor.copy")}
          </button>
          <button type="button" className={button} onClick={onUndo} disabled={!history.length}>
            <Icon name="lucide:undo-2" /> {t("editor.undo")}
          </button>
          <button
            type="button"
            onClick={onConvert}
            disabled={!code.trim() || !checked}
            className="brand-gradient inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-white shadow-[0_10px_30px_-12px_rgb(139_61_255/0.7)] transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon name="lucide:wand-sparkles" /> {t("editor.convert")}
            {fixable > 0 && <span className="rounded-full bg-black/25 px-1.5 text-xs tabular-nums">{fixable}</span>}
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem]">
        <section aria-label={t("editor.title")} className="island flex min-h-[34rem] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line/80 px-5 py-3 text-xs text-muted">
            <span className="font-medium text-fg">{labelOf(lang)}</span>
            <span className="tabular-nums">{t("editor.lines", { count: lineCount })}</span>
          </div>

          <div className="relative flex min-h-0 flex-1">
            <div ref={gutter} aria-hidden className={`w-12 shrink-0 select-none overflow-hidden border-r border-line/80 py-4 pb-9 pr-3 text-right text-muted ${MONO}`}>
              {Array.from({ length: lineCount }, (_, i) => {
                const severity = linesWithIssues.get(i + 1);
                return <div key={i} className={severity ? `${TONE[severity].text} font-medium` : ""}>{i + 1}</div>;
              })}
            </div>

            <div className="relative min-w-0 flex-1">
              <pre ref={layer} aria-hidden className={`pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre p-4 pb-9 text-fg ${MONO}`}>
                {paint(deferred, activeTokens, issues)}
                {"\n"}
              </pre>
              <textarea
                ref={textarea}
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setNotice(null);
                }}
                onScroll={syncScroll}
                onKeyDown={onKeyDown}
                onBlur={() => (trapTab.current = true)}
                wrap="off"
                spellCheck={false}
                autoCapitalize="off"
                autoCorrect="off"
                aria-label={t("editor.ariaCode", { language: labelOf(lang) })}
                placeholder={t("editor.placeholder")}
                className={`absolute inset-0 size-full resize-none overflow-auto whitespace-pre bg-transparent p-4 text-transparent caret-accent outline-none placeholder:text-muted ${MONO}`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line/80 px-5 py-2.5 text-xs text-muted">
            <span aria-live="polite">{notice ?? t("editor.hint")}</span>
          </div>
        </section>

        <aside aria-label={t("editor.issues")} className="island flex min-h-[34rem] flex-col overflow-hidden">
          <div className="border-b border-line/80 px-5 py-3">
            <div className="flex items-center justify-between">
              <h2 className="display text-[15px]">{t("editor.issues")}</h2>
              <span className="text-xs tabular-nums text-muted">
                {checked ? t("editor.issuesCount", { count: issues.length, fixable }) : ""}
              </span>
            </div>
            {checked && (
              <div className="mt-3 flex flex-wrap gap-2">
                {counts.map(({ s, n }) => (
                  <span key={s} className={`rounded-full border px-2.5 py-0.5 text-xs tabular-nums ${TONE[s].chip} ${n ? "" : "opacity-40"}`}>
                    {n} {severityLabel[s]}
                  </span>
                ))}
              </div>
            )}
          </div>

          {!checked ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted">
              <Icon name="lucide:sparkles" className="size-7 text-accent" />
              {t("editor.noChecker", { language: labelOf(lang) })}
            </div>
          ) : issues.length > 0 ? (
            <ul className="min-h-0 flex-1 overflow-y-auto">
              {issues.map((issue) => (
                <IssueRow
                  key={`${issue.rule}-${issue.start}`}
                  issue={issue}
                  stale={stale}
                  t={t}
                  onJump={() => jump(issue)}
                  onFix={() => commit(applyEdits(code, issue.edits!), t("editor.fixedOne"))}
                />
              ))}
            </ul>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted">
              <Icon name={code.trim() ? "lucide:circle-check" : "lucide:pencil"} className={`size-8 ${code.trim() ? "text-accent" : ""}`} />
              {code.trim() ? t("editor.nothingToFlag") : t("editor.writePrompt")}
            </div>
          )}
        </aside>
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">{t("editor.footnote")}</p>
    </div>
  );
}
