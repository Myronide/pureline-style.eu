import { type KeyboardEvent, type ReactNode, useDeferredValue, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { docPath } from "../content";
import { analyze, applyEdits, convert, docsFor, indentUnit, type Issue, type Lang, type Severity } from "../lint";
import { samples } from "../lint/samples";

const LANGS: { id: Lang; label: string }[] = [
  { id: "typescript", label: "TypeScript" },
  { id: "javascript", label: "JavaScript" },
  { id: "java", label: "Java" },
];

const TONE: Record<Severity, { text: string; line: string; dot: string; rank: number }> = {
  error: { text: "text-warn", line: "decoration-warn", dot: "bg-warn", rank: 3 },
  warn: { text: "text-amber-400", line: "decoration-amber-400", dot: "bg-amber-400", rank: 2 },
  info: { text: "text-accent", line: "decoration-accent", dot: "bg-accent", rank: 1 },
};

/** Gutter, underline layer and textarea must share these metrics exactly, or the squiggles drift. */
const MONO = "font-mono text-[13px] leading-6 [tab-size:4] [font-variant-ligatures:none]";
const LINE_HEIGHT = 24;

const button = "inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-3 py-1.5 text-sm transition-colors hover:bg-raised disabled:pointer-events-none disabled:opacity-40";

/** First-line extent of an issue: long ranges (a whole `if` block) would otherwise underline the whole block. */
function visibleEnd(code: string, issue: Issue): number {
  const eol = code.indexOf("\n", issue.start);
  return Math.max(issue.start + 1, Math.min(issue.end, eol === -1 ? code.length : eol));
}

function underlined(code: string, issues: Issue[]): ReactNode[] {
  const ranges = issues.map((issue) => ({ from: issue.start, to: visibleEnd(code, issue), severity: issue.severity }));
  const cuts = new Set([0, code.length]);
  for (const r of ranges) {
    cuts.add(r.from);
    cuts.add(Math.min(r.to, code.length));
  }
  const points = [...cuts].sort((a, b) => a - b);

  return points.slice(0, -1).map((from, k) => {
    const to = points[k + 1];
    const top = ranges
      .filter((r) => r.from < to && r.to > from)
      .reduce<Severity | null>((best, r) => (!best || TONE[r.severity].rank > TONE[best].rank ? r.severity : best), null);
    const text = code.slice(from, to);
    if (!top) return text;
    return <span key={from} className={`underline decoration-wavy decoration-1 underline-offset-4 ${TONE[top].line}`}>{text}</span>;
  });
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

function IssueRow({ issue, stale, onJump, onFix }: { issue: Issue; stale: boolean; onJump: () => void; onFix: () => void }) {
  return (
    <li className="flex gap-3 border-b border-line p-3 last:border-0">
      <span className={`mt-1.5 size-2 shrink-0 rounded-full ${TONE[issue.severity].dot}`} />
      <div className="min-w-0 flex-1">
        <button type="button" onClick={onJump} className="block w-full text-left text-sm leading-snug transition-colors hover:text-accent">
          <Message text={issue.message} />
        </button>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="tabular-nums">Ln {issue.line}:{issue.col}</span>
          <Link to={docPath(docsFor(issue.rule))} className="rounded-md border border-line px-1.5 py-0.5 font-mono transition-colors hover:text-fg">
            {issue.rule}
          </Link>
          {issue.fixable ? (
            <button type="button" onClick={onFix} disabled={stale} className="ml-auto inline-flex items-center gap-1 rounded-md border border-line px-2 py-0.5 text-accent transition-colors hover:bg-raised disabled:opacity-40">
              <Icon name="lucide:wand-sparkles" className="size-3" /> Fix
            </button>
          ) : (
            <span className="ml-auto">manual</span>
          )}
        </div>
      </div>
    </li>
  );
}

export function Editor() {
  const [lang, setLang] = useState<Lang>("typescript");
  const [code, setCode] = useState(samples.typescript);
  const [history, setHistory] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const textarea = useRef<HTMLTextAreaElement>(null);
  const layer = useRef<HTMLPreElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const caret = useRef<number | null>(null);
  const trapTab = useRef(true);

  const deferred = useDeferredValue(code);
  const stale = deferred !== code;
  const issues = useMemo(() => analyze(deferred, lang), [deferred, lang]);
  const fixable = issues.filter((i) => i.fixable).length;
  const lineCount = useMemo(() => deferred.split("\n").length, [deferred]);
  const linesWithIssues = useMemo(() => new Map(issues.map((i) => [i.line, i.severity])), [issues]);

  useLayoutEffect(() => {
    if (caret.current === null) return;
    textarea.current?.setSelectionRange(caret.current, caret.current);
    caret.current = null;
  }, [code]);

  function commit(next: string, message: string) {
    if (next === code) return;
    setHistory((h) => [...h.slice(-19), code]);
    setCode(next);
    setNotice(`${message} ${summary(analyze(next, lang))}`);
  }

  function summary(left: Issue[]) {
    if (!left.length) return "Nothing left to flag.";
    const auto = left.filter((i) => i.fixable).length;
    const rest = `${left.length} issue${left.length === 1 ? "" : "s"} left`;
    if (auto) return `${rest}, ${auto} auto-fixable.`;
    return `${rest}, ${left.length === 1 ? "it needs" : "they need"} a manual change.`;
  }

  function onConvert() {
    const result = convert(code, lang);
    if (result.code === code) {
      setNotice("Nothing can be converted automatically.");
      return;
    }
    commit(result.code, `Applied ${result.fixes} fix${result.fixes === 1 ? "" : "es"}.`);
  }

  function onUndo() {
    const previous = history[history.length - 1];
    if (previous === undefined) return;
    setHistory(history.slice(0, -1));
    setCode(previous);
    setNotice(null);
  }

  function onLang(next: Lang) {
    if (next === lang) return;
    const untouched = !code.trim() || code === samples[lang];
    setLang(next);
    setNotice(null);
    if (untouched) setCode(samples[next]);
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
      replaceRange(el.selectionStart, el.selectionEnd, indentUnit(code, lang));
      return;
    }

    if (e.key === "Enter" && !e.shiftKey && !e.metaKey && !e.ctrlKey && !e.altKey) {
      e.preventDefault();
      const at = el.selectionStart;
      const before = code.slice(at > 0 ? code.lastIndexOf("\n", at - 1) + 1 : 0, at);
      const indent = /^[ \t]*/.exec(before)![0];
      const opens = /[{([]\s*$/.test(before);
      replaceRange(at, el.selectionEnd, `\n${indent}${opens ? indentUnit(code, lang) : ""}`);
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

  return (
    <div className="shell py-10">
      <div className="mb-8 max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight">Live editor</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Paste or write code. Anything that breaks a Pureline rule is underlined as you type, and <strong className="font-medium text-fg">Convert</strong> rewrites what can be fixed mechanically. Everything runs in your browser.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div role="tablist" aria-label="Language" className="inline-flex rounded-md border border-line bg-surface p-0.5">
          {LANGS.map((l) => (
            <button
              key={l.id}
              role="tab"
              aria-selected={l.id === lang}
              onClick={() => onLang(l.id)}
              className={`rounded px-3 py-1 text-sm transition-colors ${l.id === lang ? "bg-raised text-fg" : "text-muted hover:text-fg"}`}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={button} onClick={() => commit(samples[lang], "Loaded the example.")} title="Replace the editor content with an example full of violations">
            <Icon name="lucide:file-code" /> Example
          </button>
          <button type="button" className={button} onClick={copy}>
            <Icon name={copied ? "lucide:check" : "lucide:copy"} /> {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" className={button} onClick={onUndo} disabled={!history.length}>
            <Icon name="lucide:undo-2" /> Undo
          </button>
          <button
            type="button"
            onClick={onConvert}
            disabled={!code.trim()}
            className="brand-gradient inline-flex items-center gap-2 rounded-md px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-40"
          >
            <Icon name="lucide:wand-sparkles" /> Convert{fixable > 0 && <span className="rounded-full bg-black/25 px-1.5 text-xs tabular-nums">{fixable}</span>}
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-label="Editor" className="overflow-hidden rounded-lg border border-line bg-surface">
          <div className="flex h-[34rem]">
            <div ref={gutter} aria-hidden className={`w-12 shrink-0 select-none overflow-hidden border-r border-line py-4 pb-9 pr-3 text-right text-muted ${MONO}`}>
              {Array.from({ length: lineCount }, (_, i) => {
                const severity = linesWithIssues.get(i + 1);
                return <div key={i} className={severity ? `${TONE[severity].text} font-medium` : ""}>{i + 1}</div>;
              })}
            </div>

            <div className="relative min-w-0 flex-1">
              <pre ref={layer} aria-hidden className={`pointer-events-none absolute inset-0 m-0 overflow-hidden whitespace-pre p-4 pb-9 text-transparent ${MONO}`}>
                {underlined(deferred, issues)}
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
                aria-label={`${LANGS.find((l) => l.id === lang)?.label} code`}
                placeholder="Paste code here…"
                className={`absolute inset-0 size-full resize-none overflow-auto whitespace-pre bg-transparent p-4 text-fg caret-white outline-none placeholder:text-muted ${MONO}`}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line px-4 py-2 text-xs text-muted">
            <span aria-live="polite">{notice ?? "Tab indents · Esc then Tab leaves the editor"}</span>
            <span className="tabular-nums">{lineCount} lines</span>
          </div>
        </section>

        <aside aria-label="Issues" className="relative h-96 overflow-hidden rounded-lg border border-line bg-surface lg:h-auto">
          <div className="absolute inset-0 flex flex-col">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <h2 className="text-sm font-medium">Issues</h2>
              <span className="text-xs text-muted tabular-nums">
                {issues.length} · {fixable} auto-fixable
              </span>
            </div>

            {issues.length > 0 ? (
              <ul className="min-h-0 flex-1 overflow-y-auto">
                {issues.map((issue) => (
                  <IssueRow
                    key={`${issue.rule}-${issue.start}`}
                    issue={issue}
                    stale={stale}
                    onJump={() => jump(issue)}
                    onFix={() => commit(applyEdits(code, issue.edits!), "Fixed 1 issue.")}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted">
                <Icon name={code.trim() ? "lucide:circle-check" : "lucide:pencil"} className={`size-8 ${code.trim() ? "text-accent" : ""}`} />
                {code.trim() ? "Nothing to flag. This is Pureline." : "Write or paste some code to check it."}
              </div>
            )}
          </div>
        </aside>
      </div>

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted">
        The checks are heuristics, not a full parser: they cover the rules that can be judged from the text alone. Convert only applies fixes that keep behavior unchanged, and anything it is not sure about stays marked as manual.
      </p>
    </div>
  );
}
