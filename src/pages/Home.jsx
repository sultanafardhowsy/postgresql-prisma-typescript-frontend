import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  PackageSearch,
  Zap,
  ShieldCheck,
  ScanSearch,
  Truck,
  ArrowRight,
} from "lucide-react";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const features = [
  {
    icon: Zap,
    title: "Real-time inventory",
    description:
      "Stock counts stream straight from the warehouse ledger — the number on screen is the number in the building.",
  },
  {
    icon: ShieldCheck,
    title: "Ledger-verified stock",
    description:
      "Every listing is checked against live counts, so you never chase an item that isn't actually on the shelf.",
  },
  {
    icon: ScanSearch,
    title: "Find anything fast",
    description:
      "Search the full catalog, filter by category, and jump to the exact product you need in seconds.",
  },
  {
    icon: Truck,
    title: "Order in minutes",
    description:
      "A lightning-fast checkout moves orders out the door before the competition adds to cart.",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 48 };
    if (activeCategory) params.categoryId = activeCategory;
    if (search) params.search = search;

    api
      .get("/products", { params })
      .then((res) => setProducts(res.data.data))
      .finally(() => setLoading(false));
  }, [activeCategory, search]);

  const scrollToCatalog = (e) => {
    e.preventDefault();
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const stats = [
    { value: products.length.toLocaleString(), label: "Live products" },
    { value: String(categories.length), label: "Categories" },
    { value: "100%", label: "Ledger-verified" },
    { value: "24/7", label: "Real-time sync" },
  ];

  return (
    <div className="min-h-screen bg-paper">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="hero-grid absolute inset-0" />
          <div className="absolute -left-48 -top-48 h-[560px] w-[560px] rounded-full bg-gradient-to-br from-primary/25 via-secondary/15 to-transparent blur-3xl" />
          <div className="absolute -right-40 -top-24 h-[480px] w-[480px] rounded-full bg-gradient-to-bl from-accent/20 via-secondary/10 to-transparent blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 text-center md:pt-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/80 px-4 py-1.5 text-xs font-medium text-ink-soft shadow-sm backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Live inventory · synced 24/7
          </div>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-ink md:text-6xl md:leading-[1.05]">
            What&apos;s on the shelf,{" "}
            <span className="text-gradient">tracked to the last unit.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
            Every listing reflects real stock counts pulled straight from the
            warehouse ledger — no guessing what&apos;s actually available.
          </p>

          <form
            onSubmit={scrollToCatalog}
            className="mx-auto mt-9 flex w-full max-w-xl items-center gap-2 rounded-full border border-line bg-white p-1.5 pl-5 shadow-xl shadow-indigo-950/10"
          >
            <Search size={18} className="shrink-0 text-ink-soft" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search the catalog..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft"
            />
            <button
              type="submit"
              className="btn-gradient shrink-0 rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:brightness-110"
            >
              Search
            </button>
          </form>

          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#catalog"
              className="btn-gradient group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:brightness-110 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              Browse the catalog
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </a>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-6 py-3 text-sm font-semibold text-ink shadow-sm transition-colors hover:border-indigo-300 hover:text-primary"
            >
              Create an account
            </Link>
          </div>

          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-3 md:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-line bg-white/80 px-4 py-5 shadow-sm backdrop-blur"
              >
                <p className="font-mono text-2xl font-semibold text-ink">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs font-medium text-ink-soft">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative mx-auto max-w-6xl px-5 pb-20">
        <div className="mb-10 text-center">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
            Built for the shelf
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink md:text-4xl">
            Everything you need to run your inventory
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-soft">
            A clean, fast catalog backed by trustworthy stock data — designed
            for storefronts that move quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-line bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-950/5"
            >
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-md shadow-indigo-500/25 transition-transform group-hover:scale-105">
                <feature.icon size={20} />
              </div>
              <h3 className="text-base font-semibold text-ink">
                {feature.title}
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Catalog */}
      <section id="catalog" className="mx-auto max-w-6xl px-5 pb-24">
        <div className="mb-8 flex flex-col gap-5">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
              Full catalog · live inventory
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-ink md:text-3xl">
              On the shelf right now
            </h2>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveCategory(null)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                !activeCategory
                  ? "bg-primary text-white shadow-md shadow-indigo-500/25"
                  : "border border-line bg-white text-ink-soft hover:border-indigo-300 hover:text-primary"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  activeCategory === cat.id
                    ? "bg-primary text-white shadow-md shadow-indigo-500/25"
                    : "border border-line bg-white text-ink-soft hover:border-indigo-300 hover:text-primary"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="Nothing matches"
            description="Try a different search term or clear the category filter."
          />
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-10 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2.5">
            <img src="/favicon.svg" alt="" className="h-7 w-7 object-contain" />
            <span className="font-display text-lg font-bold tracking-tight text-ink">
              Stockroom
            </span>
          </div>
          <p className="text-sm text-ink-soft">
            © {new Date().getFullYear()} Stockroom — inventory you can trust.
          </p>
        </div>
      </footer>
    </div>
  );
}
