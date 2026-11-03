import { Link } from "react-router-dom";
import { useI18n } from "../i18n/context";

export function NotFound() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="font-mono text-sm text-accent">{t("notFound.code")}</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">{t("notFound.title")}</h1>
      <p className="mt-3 text-muted">{t("notFound.text")}</p>
      <Link to="/" className="mt-8 inline-block rounded-md border border-line bg-surface px-5 py-2.5 text-sm hover:bg-raised">{t("notFound.back")}</Link>
    </div>
  );
}
