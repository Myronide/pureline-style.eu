import { Link, NavLink, useParams } from "react-router-dom";
import { Markdown } from "../components/Markdown";
import { docPath, getDoc, headings, INDEX_SLUG, nav, repoUrl } from "../content";
import { Icon } from "../components/Icon";
import { LanguageLogo } from "../components/LanguageLogo";
import { NotFound } from "./NotFound";

function DocNav() {
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
                    {d.slug === INDEX_SLUG ? "Guide" : d.title.replace(/ Code Style$/, "").replace(/^Pureline /, "")}
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

export function Docs() {
  const slug = useParams()["*"] || INDEX_SLUG;
  const doc = getDoc(slug);
  if (!doc) return <NotFound />;

  const toc = headings(doc.body);
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
        <summary className="display cursor-pointer select-none px-6 py-4 text-[15px]">Browse the docs</summary>
        <div className="px-6 pb-6"><DocNav /></div>
      </details>

      {toc.length > 1 && (
        <details className="island mb-2 xl:hidden">
          <summary className="display cursor-pointer select-none px-6 py-4 text-[15px]">On this page</summary>
          <div className="px-6 pb-6"><Toc items={toc} /></div>
        </details>
      )}

      <article className="min-w-0">
        <div className="doc prose prose-invert max-w-none"><Markdown slug={slug}>{doc.body}</Markdown></div>
        <div className="mt-20 flex items-center justify-between gap-4 border-t border-line pt-6 text-sm">
          {prev ? <Link to={docPath(prev.slug)} className="flex items-center gap-2 text-muted hover:text-fg"><Icon name="lucide:arrow-left" />{prev.title}</Link> : <span />}
          {next ? <Link to={docPath(next.slug)} className="flex items-center gap-2 text-muted hover:text-fg">{next.title}<Icon name="lucide:arrow-right" /></Link> : <span />}
        </div>
        <a href={`${repoUrl}/blob/HEAD/${slug.startsWith("PURELINE") ? slug : `docs/code-style/${slug}`}.md`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg">
          <Icon name="lucide:pencil" className="size-3.5" /> View source on GitHub
        </a>
      </article>

      {toc.length > 1 && (
        <aside className="hidden xl:sticky xl:top-24 xl:block xl:max-h-[calc(100vh-7rem)] xl:self-start xl:overflow-y-auto" aria-label="On this page">
          <p className="display mb-3 text-[15px] text-fg">On this page</p>
          <Toc items={toc} />
        </aside>
      )}
    </div>
  );
}
