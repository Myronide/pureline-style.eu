import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-32 text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight">Nothing here.</h1>
      <p className="mt-3 text-muted">This page does not exist.</p>
      <Link to="/" className="mt-8 inline-block rounded-md border border-line bg-surface px-5 py-2.5 text-sm hover:bg-raised">Back home</Link>
    </div>
  );
}
