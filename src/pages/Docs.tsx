import { Link, NavLink, useParams } from "react-router-dom";
import { Markdown } from "../components/Markdown";
import { docPath, getDoc, headings, INDEX_SLUG, nav, repoUrl } from "../content";
import { Icon } from "../components/Icon";
import { NotFound } from "./NotFound";

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
    <div className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[14rem_minmax(0,1fr)] xl:grid-cols-[14rem_minmax(0,1fr)_13rem]">
      <aside className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:self-start lg:overflow-y-auto">
        {nav.map((g) => (
          <div key={g.label} className="mb-6">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">{g.label}</p>
            <ul className="space-y-0.5">
              {g.docs.map((d) => (
                <li key={d.slug}>
                  <NavLink
                    to={docPath(d.slug)}
                    end
                    className={({ isActive }) => `block rounded px-2.5 py-1.5 text-sm transition-colors ${isActive ? "bg-raised text-accent" : "text-muted hover:text-fg"}`}
                  >
                    {d.slug === INDEX_SLUG ? "Guide" : d.title.replace(/ Code Style$/, "").replace(/^Pureline /, "")}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </aside>

      <article className="min-w-0">
        <div className="doc prose prose-invert max-w-none"><Markdown slug={slug}>{doc.body}</Markdown></div>
        <div className="mt-14 flex items-center justify-between gap-4 border-t border-line pt-6 text-sm">
          {prev ? <Link to={docPath(prev.slug)} className="flex items-center gap-2 text-muted hover:text-fg"><Icon name="lucide:arrow-left" />{prev.title}</Link> : <span />}
          {next ? <Link to={docPath(next.slug)} className="flex items-center gap-2 text-muted hover:text-fg">{next.title}<Icon name="lucide:arrow-right" /></Link> : <span />}
        </div>
        <a href={`${repoUrl}/blob/HEAD/${slug.startsWith("PURELINE") ? slug : `docs/code-style/${slug}`}.md`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg">
          <Icon name="lucide:pencil" className="size-3.5" /> View source on GitHub
        </a>
      </article>

      {toc.length > 1 && (
        <aside className="hidden xl:sticky xl:top-20 xl:block xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">On this page</p>
          <ul className="space-y-1.5 border-l border-line text-sm">
            {toc.map((h) => (
              <li key={h.id}><a href={`#${h.id}`} className="-ml-px block border-l border-transparent pl-3 text-muted transition-colors hover:border-accent hover:text-fg">{h.text}</a></li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
