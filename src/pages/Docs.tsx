import { useEffect, useState } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { Markdown } from "../components/Markdown";
import { docPath, getDoc, headings, INDEX_SLUG, nav, repoUrl, SHOW_MACHINE_TRANSLATIONS, translatedBody } from "../content";
import { Icon } from "../components/Icon";
import { LanguageLogo } from "../components/LanguageLogo";
import { useI18n } from "../i18n/context";
import { canTranslateLive, loadMissing, translateBody, type Missing } from "../lib/liveTranslate";
import { NotFound } from "./NotFound";

function DocNav() {
  const { t } = useI18n();
  return (
    <>
      {nav.map((g) => (
        <div key={g.label} className="mb-8 last:mb-0">
          <p className="display mb-3 text-[15px] text-fg">{g.label}</p>
          <ul className="space-y-px border-l border-line">
            {g.docs.map((d) => (
              <li key={d.slug}>
                <NavLink
                  to={docPath(d.slug)}
                  end
                  className={({ isActive }) => `-ml-px block rounded-r-md border-l py-1.5 pl-4 text-sm leading-snug transition-colors ${isActive ? "border-accent bg-raised text-fg" : "border-transparent text-muted hover:border-line hover:bg-raised/50 hover:text-fg"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <LanguageLogo slug={d.slug} className="size-4 shrink-0" />
                    {d.slug === INDEX_SLUG ? t("docs.guide") : d.title.replace(/ Code Style$/, "").replace(/^Pureline /, "")}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function Toc({ items }: { items: { id: string; text: string; level: number }[] }) {
  return (
    <ul className="space-y-1.5 border-l border-line text-sm">
      {items.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className={`-ml-px block border-l border-transparent text-muted transition-colors hover:border-accent hover:text-fg ${h.level === 3 ? "pl-6 text-[13px] leading-snug" : "pl-3"}`}>{h.text}</a>
        </li>
      ))}
    </ul>
  );
}

type Live = { key: string; body: string };

/** Offers to translate the passages the build has no translation for yet, locally in the browser. */
function LiveTranslateBar({ docKey, locale, slug, body, onDone }: { docKey: string; locale: string; slug: string; body: string; onDone: (live: Live) => void }) {
  const { t } = useI18n();
  const [items, setItems] = useState<Missing[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = true;
    setState("idle");
    setItems([]);
    if (canTranslateLive(locale)) {
      loadMissing(locale, slug).then((list) => current && setItems(list));
    }
    return () => {
      current = false;
    };
  }, [locale, slug]);

  if (!canTranslateLive(locale) || (items.length === 0 && state !== "done")) return null;

  const run = async () => {
    setState("loading");
    try {
      const translated = await translateBody(body, locale, items, setProgress);
      onDone({ key: docKey, body: translated });
      setState("done");
    } catch (error) {
      console.error(error);
      setState("error");
    }
  };

  return (
    <div className="island mb-6 flex flex-wrap items-center justify-between gap-3 px-5 py-3 text-sm">
      <p className="text-muted" role="status">
        {state === "done" ? t("docs.live.done") : state === "error" ? t("docs.live.error") : state === "loading" ? `${t("docs.live.loading")} ${Math.round(progress * 100)}%` : t("docs.live.missing", { count: items.length })}
      </p>
      {state !== "done" && (
        <button type="button" onClick={run} disabled={state === "loading"} title={t("docs.live.hint")} className="rounded-lg border border-line bg-raised px-3.5 py-1.5 text-fg transition-colors hover:border-accent/50 disabled:opacity-60">
          {t("docs.live.button")}
        </button>
      )}
    </div>
  );
}

export function Docs() {
  const { t, locale } = useI18n();
  const slug = useParams()["*"] || INDEX_SLUG;
  const doc = getDoc(slug);
  const [live, setLive] = useState<Live | null>(null);
  // The machine translation is rough, so the English original is the default and the translation is opt-in.
  const [showMachine, setShowMachine] = useState(() => localStorage.getItem("pureline-machine") === "1");
  const chooseMachine = (on: boolean) => {
    localStorage.setItem("pureline-machine", on ? "1" : "0");
    setShowMachine(on);
  };
  if (!doc) {
    return <NotFound />;
  }

  const available = locale !== "en" && SHOW_MACHINE_TRANSLATIONS ? translatedBody(slug, locale) : null;
  const machine = showMachine ? available : null;
  const docKey = `${locale}/${slug}`;
  const base = machine ?? doc.body;
  const body = live?.key === docKey ? live.body : base;
  const toc = headings(body);
  const all = nav.flatMap((g) => g.docs);
  const i = all.findIndex((d) => d.slug === slug);
  const prev = all[i - 1];
  const next = all[i + 1];

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[17rem_minmax(0,1fr)_14rem]">
      <aside className="hidden lg:sticky lg:top-24 lg:block lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto lg:pr-2" aria-label="Documentation">
        <DocNav />
      </aside>

      <details className="island mb-2 lg:hidden">
        <summary className="display cursor-pointer select-none px-6 py-4 text-[15px]">{t("docs.browse")}</summary>
        <div className="px-6 pb-6"><DocNav /></div>
      </details>

      {toc.length > 1 && (
        <details className="island mb-2 xl:hidden">
          <summary className="display cursor-pointer select-none px-6 py-4 text-[15px]">{t("docs.onThisPage")}</summary>
          <div className="px-6 pb-6"><Toc items={toc} /></div>
        </details>
      )}

      <article className="min-w-0">
        {locale !== "en" && (
          <p className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <span>{t(machine ? "docs.machineNote" : "docs.englishNote")}</span>
            {available && (
              <button type="button" onClick={() => chooseMachine(!machine)} className="underline decoration-line underline-offset-4 transition-colors hover:text-fg">
                {t(machine ? "docs.showEnglish" : "docs.showMachine")}
              </button>
            )}
          </p>
        )}
        {machine && <LiveTranslateBar docKey={docKey} locale={locale} slug={slug} body={base} onDone={setLive} />}
        <div className="doc prose prose-invert max-w-none"><Markdown slug={slug}>{body}</Markdown></div>
        <div className="mt-20 flex items-center justify-between gap-4 border-t border-line pt-6 text-sm">
          {prev ? <Link to={docPath(prev.slug)} className="flex items-center gap-2 text-muted hover:text-fg"><Icon name="lucide:arrow-left" />{prev.title}</Link> : <span />}
          {next ? <Link to={docPath(next.slug)} className="flex items-center gap-2 text-muted hover:text-fg">{next.title}<Icon name="lucide:arrow-right" /></Link> : <span />}
        </div>
        <a href={`${repoUrl}/blob/HEAD/${slug.startsWith("PURELINE") ? slug : `docs/code-style/${slug}`}.md`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg">
          <Icon name="lucide:pencil" className="size-3.5" /> {t("docs.viewSource")}
        </a>
      </article>

      {toc.length > 1 && (
        <aside className="hidden xl:sticky xl:top-24 xl:block xl:max-h-[calc(100vh-7rem)] xl:self-start xl:overflow-y-auto" aria-label={t("docs.onThisPage")}>
          <p className="display mb-3 text-[15px] text-fg">{t("docs.onThisPage")}</p>
          <Toc items={toc} />
        </aside>
      )}
    </div>
  );
}
