import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { repoUrl, syncedAt } from "../content";
import { Authors } from "./Authors";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const navLink = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 text-sm transition-colors hover:text-fg ${isActive ? "text-fg after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-accent" : "text-muted"}`;

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
      <header className="sticky top-0 z-30 px-4 pt-4">
        <div className="island mx-auto flex h-14 max-w-5xl items-center justify-between px-5 backdrop-blur-xl">
          <Link to="/" className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight">
            <Logo className="h-5" />
            <span className="display text-lg">Pureline</span>
          </Link>
          <nav className="flex items-center gap-6 sm:gap-8">
            <NavLink to="/docs" end={false} className={navLink}>Guide</NavLink>
            <NavLink to="/docs/languages/README" className={navLink}>Languages</NavLink>
            <NavLink to="/editor" className={navLink}>Editor</NavLink>
            <a href={repoUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg">
              <Icon name="simple-icons:github" className="size-4" /> <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1"><Outlet /></main>
      <footer className="px-4 pb-6">
        <div className="island mx-auto flex max-w-6xl flex-col gap-6 px-8 py-10 text-sm text-muted sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-4">
            <p className="display text-lg text-fg">Code without noise.</p>
            <Authors />
          </div>
          <p className="max-w-xs text-xs leading-relaxed sm:text-right">
            Pureline Style 1.7. Content synced from{" "}
            <a href={repoUrl} className="underline underline-offset-4 decoration-line hover:text-fg">Myronide/pureline-style</a>{" "}
            on {new Date(syncedAt).toLocaleString("en-GB")}.
          </p>
        </div>
      </footer>
    </div>
  );
}
