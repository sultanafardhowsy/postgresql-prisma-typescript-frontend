import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ProductCard({ product }) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock <= 0;
  const inactive = product.status === "INACTIVE";

  return (
    <Link
      to={`/products/${product.id}`}
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-950/5 ${
        inactive ? "opacity-70 saturate-50" : ""
      }`}
    >
      {/* Status badge or live stock count */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1">
        {inactive || product.status === "OUT_OF_STOCK" ? (
          <StatusBadge status={product.status} />
        ) : (
          <span className="flex items-center gap-1 rounded-full bg-ink/90 px-2.5 py-1 font-mono text-[11px] text-white shadow-sm backdrop-blur">
            <Package size={11} />
            {outOfStock ? "0 left" : `${product.stock} in stock`}
          </span>
        )}
      </div>

      <div className="aspect-[4/3] w-full overflow-hidden border-b border-line bg-paper">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <span className="flex h-full items-center justify-center font-display text-4xl font-bold text-line-strong select-none">
            {product.title.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
          {product.category?.name || "General"}
        </span>
        <h3 className="font-display text-lg font-semibold leading-snug text-ink transition-colors group-hover:text-primary">
          {product.title}
        </h3>
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-mono text-base font-semibold text-ink">
            ${product.price.toFixed(2)}
          </span>
          {!inactive && lowStock && (
            <span className="text-[11px] font-semibold text-accent">
              Low stock
            </span>
          )}
          {!inactive && outOfStock && (
            <span className="text-[11px] font-semibold text-danger">
              Sold out
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
