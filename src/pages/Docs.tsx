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
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] xl:grid-cols-[13rem_minmax(0,1fr)_12rem]">
      <aside className="island p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:self-start lg:overflow-y-auto">
        {nav.map((g) => (
          <div key={g.label} className="mb-8">
            <p className="display mb-3 text-[15px] text-fg">{g.label}</p>
            <ul className="space-y-px border-l border-line">
              {g.docs.map((d) => (
                <li key={d.slug}>
                  <NavLink
                    to={docPath(d.slug)}
                    end
                    className={({ isActive }) => `-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${isActive ? "border-accent text-fg" : "border-transparent text-muted hover:border-line hover:text-fg"}`}
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
        <div className="mt-20 flex items-center justify-between gap-4 border-t border-line pt-6 text-sm">
          {prev ? <Link to={docPath(prev.slug)} className="flex items-center gap-2 text-muted hover:text-fg"><Icon name="lucide:arrow-left" />{prev.title}</Link> : <span />}
          {next ? <Link to={docPath(next.slug)} className="flex items-center gap-2 text-muted hover:text-fg">{next.title}<Icon name="lucide:arrow-right" /></Link> : <span />}
        </div>
        <a href={`${repoUrl}/blob/HEAD/${slug.startsWith("PURELINE") ? slug : `docs/code-style/${slug}`}.md`} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-xs text-muted hover:text-fg">
          <Icon name="lucide:pencil" className="size-3.5" /> View source on GitHub
        </a>
      </article>

      {toc.length > 1 && (
        <aside className="island hidden p-5 xl:sticky xl:top-24 xl:block xl:max-h-[calc(100vh-7rem)] xl:self-start xl:overflow-y-auto">
          <p className="display mb-3 text-[15px] text-fg">On this page</p>
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
