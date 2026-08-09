import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <p className="font-mono text-signal text-sm mb-2">404</p>
      <h1 className="font-display text-3xl text-ink mb-3">Page not found</h1>
      <p className="text-ink-soft mb-6">
        That page isn't on the shelf. Let's get you back to the catalog.
      </p>
      <Link
        to="/"
        className="inline-block bg-ink text-paper px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-signal-dark transition-colors"
      >
        Back to catalog
      </Link>
    </div>
  );
}
