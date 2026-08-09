import { useEffect, useState } from "react";
import { Search, PackageSearch } from "lucide-react";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

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

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      {/* Hero */}
      <div className="mb-10 pb-8 border-b border-line">
        <p className="font-mono text-[11px] uppercase tracking-widest text-signal mb-3">
          Full catalog · live inventory
        </p>
        <h1 className="font-display text-4xl md:text-5xl text-ink leading-tight max-w-2xl">
          What's on the shelf, tracked to the last unit.
        </h1>
        <p className="text-ink-soft mt-3 max-w-lg">
          Every listing here reflects real stock counts pulled straight from
          the warehouse ledger — no guessing what's actually available.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
          />
          <input
            type="text"
            placeholder="Search the catalog..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-line bg-paper-raised text-sm focus:border-signal outline-none rounded-sm"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap rounded-sm border transition-colors ${
              !activeCategory
                ? "bg-ink text-paper border-ink"
                : "border-line text-ink-soft hover:border-line-strong"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-mono whitespace-nowrap rounded-sm border transition-colors ${
                activeCategory === cat.id
                  ? "bg-ink text-paper border-ink"
                  : "border-line text-ink-soft hover:border-line-strong"
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
