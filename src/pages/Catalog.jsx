import { useEffect, useState } from "react";
import { Search, PackageSearch } from "lucide-react";
import api from "../lib/api";
import ProductCard from "../components/ProductCard";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { limit: 48 };
    if (activeCategory) params.categoryId = activeCategory;
    if (activeStatus) params.status = activeStatus;
    if (search) params.search = search;

    api
      .get("/products", { params })
      .then((res) => setProducts(res.data.data))
      .finally(() => setLoading(false));
  }, [activeCategory, activeStatus, search]);

  return (
    <div className="min-h-screen bg-paper">
      <section id="catalog" className="mx-auto max-w-6xl px-5 py-10">
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

          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveStatus(null)}
              className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                !activeStatus
                  ? "bg-ink text-white"
                  : "border border-line bg-white text-ink-soft hover:border-indigo-300 hover:text-primary"
              }`}
            >
              All statuses
            </button>
            {["ACTIVE", "INACTIVE", "OUT_OF_STOCK"].map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(activeStatus === s ? null : s)}
                className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  activeStatus === s
                    ? "bg-ink text-white"
                    : "border border-line bg-white text-ink-soft hover:border-indigo-300 hover:text-primary"
                }`}
              >
                {s.replace(/_/g, " ").toLowerCase()}
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
    </div>
  );
}
