import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { repoUrl, syncedAt } from "../content";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const link = "text-sm text-muted transition-colors hover:text-fg";

export function Layout() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-5">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <Logo className="h-5" />
            Pureline
          </Link>
          <nav className="flex items-center gap-6">
            <NavLink to="/docs" className={({ isActive }) => `${link} ${isActive ? "!text-fg" : ""}`}>Docs</NavLink>
            <NavLink to="/docs/languages/README" className={link}>Languages</NavLink>
            <a href={repoUrl} target="_blank" rel="noreferrer" className={`${link} flex items-center gap-1.5`}>
              <Icon name="simple-icons:github" /> GitHub
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 text-xs text-muted">
          <span>Pureline Style 1.5 · Code without noise.</span>
          <span>Content synced from <a href={repoUrl} className="underline underline-offset-4 hover:text-fg">Myronide/pureline-style</a> · {new Date(syncedAt).toLocaleString("en-GB")}</span>
        </div>
      </footer>
    </div>
  );
}
