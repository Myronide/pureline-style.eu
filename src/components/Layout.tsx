import { useEffect } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { repoUrl, syncedAt } from "../content";
import { useI18n } from "../i18n/context";
import { localeNames, locales, type Locale } from "../i18n/messages";
import { Authors } from "./Authors";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

const navLink = ({ isActive }: { isActive: boolean }) =>
  `relative py-1 text-sm transition-colors hover:text-fg ${isActive ? "text-fg after:absolute after:inset-x-0 after:-bottom-px after:h-px after:bg-accent" : "text-muted"}`;

function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <label className="relative flex items-center">
      <span className="sr-only">{t("nav.language")}</span>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="cursor-pointer appearance-none rounded-md border border-line bg-surface py-1 pl-2.5 pr-7 text-sm text-muted transition-colors hover:text-fg focus:border-accent focus:outline-none"
      >
        {locales.map((code) => (
          <option key={code} value={code}>{localeNames[code]}</option>
        ))}
      </select>
      <Icon name="lucide:chevron-down" className="pointer-events-none absolute right-2 size-3.5 text-muted" />
    </label>
  );
}

export function Layout() {
  const { pathname, hash } = useLocation();
  const { locale, t } = useI18n();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [pathname, hash]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-4 focus:py-2 focus:text-sm focus:text-bg">{t("skip")}</a>
      <header className="sticky top-0 z-30 pt-4">
        <div className="mx-auto w-full max-w-[96rem] px-4">
          <div className="island flex h-14 items-center justify-between px-6 backdrop-blur-xl">
            <Link to="/" className="group flex items-center gap-2.5 text-[17px] font-semibold tracking-tight">
              <Logo className="h-5" />
              <span className="display brand-gradient inline-block bg-no-repeat bg-[length:100%_2px] bg-bottom pb-1 text-lg">Pureline</span>
            </Link>
            <nav className="flex items-center gap-6 sm:gap-8">
              <NavLink to="/docs" end={false} className={navLink}>{t("nav.guide")}</NavLink>
              <NavLink to="/rules" className={navLink}>{t("nav.rules")}</NavLink>
              <NavLink to="/docs/languages/README" className={navLink}>{t("nav.languages")}</NavLink>
              <NavLink to="/editor" className={navLink}>{t("nav.editor")}</NavLink>
              <a href={repoUrl} target="_blank" rel="noreferrer" aria-label={t("nav.github")} className="flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg">
                <Icon name="simple-icons:github" className="size-4" /> <span className="hidden sm:inline">{t("nav.github")}</span>
              </a>
              <LanguageSwitcher />
            </nav>
          </div>
        </div>
      </header>
      <main id="main" className="flex-1"><Outlet /></main>
      <footer className="pb-6">
        <div className="mx-auto w-full max-w-[96rem] px-4">
          <div className="island flex flex-col gap-6 px-8 py-10 text-sm text-muted sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-4">
              <p className="display text-lg text-fg">{t("footer.tagline")}</p>
              <Authors />
            </div>
            <p className="max-w-xs text-xs leading-relaxed sm:text-right">
              {t("footer.version")}{" "}
              <a href={repoUrl} className="underline underline-offset-4 decoration-line hover:text-fg">Myronide/pureline-style</a>{" "}
              {t("footer.on")} {new Date(syncedAt).toLocaleString(locale)}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
