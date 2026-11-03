import { Link, NavLink, useParams } from "react-router-dom";
import { Markdown } from "../components/Markdown";
import { docPath, getDoc, headings, INDEX_SLUG, nav, repoUrl } from "../content";
import { Icon } from "../components/Icon";
import { LanguageLogo } from "../components/LanguageLogo";
import { NotFound } from "./NotFound";

/** Wide screens: the side panels sit in the gutters outside the header and footer width. */
const gutter = "min-[1880px]:fixed min-[1880px]:top-28 min-[1880px]:max-h-[calc(100vh-8rem)] min-[1880px]:overflow-y-auto min-[1880px]:p-6";

/** Narrower screens: the same content, collapsed above the article at header width. */
const inline = "mb-8 min-[1880px]:hidden";

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
                  className={({ isActive }) => `-ml-px block border-l py-1.5 pl-4 text-sm leading-snug transition-colors ${isActive ? "border-accent text-fg" : "border-transparent text-muted hover:border-line hover:text-fg"}`}
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

function Toc({ items }: { items: { id: string; text: string }[] }) {
  return (
    <ul className="space-y-1.5 border-l border-line text-sm">
      {items.map((h) => (
        <li key={h.id}>
          <a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-3 text-muted transition-colors hover:border-accent hover:text-fg">{h.text}</a>
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
    <div className="shell py-10">
      <aside className={`island hidden w-72 left-6 p-6 ${gutter} min-[1880px]:block`} aria-label="Documentation">
        <DocNav />
      </aside>

      {toc.length > 1 && (
        <aside className={`island hidden w-60 right-6 p-6 ${gutter} min-[1880px]:block`} aria-label="On this page">
          <p className="display mb-3 text-[15px] text-fg">On this page</p>
          <Toc items={toc} />
        </aside>
      )}

      <details className={`island ${inline}`}>
        <summary className="display cursor-pointer select-none px-6 py-4 text-[15px]">Browse the docs</summary>
        <div className="px-6 pb-6"><DocNav /></div>
      </details>

      {toc.length > 1 && (
        <details className={`island ${inline}`}>
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
    </div>
  );
}
