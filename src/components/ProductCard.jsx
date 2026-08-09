import { Link } from "react-router-dom";
import { Package } from "lucide-react";

export default function ProductCard({ product }) {
  const lowStock = product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock <= 0;

  return (
    <Link
      to={`/products/${product.id}`}
      className="group relative flex flex-col bg-paper-raised border border-line hover:border-line-strong transition-colors"
    >
      {/* Signature: inventory tag showing stock count, ledger-style */}
      <div className="absolute top-3 right-3 z-10 bg-ink text-paper text-[11px] font-mono px-2 py-1 rounded-sm flex items-center gap-1 shadow-sm">
        <Package size={11} />
        {outOfStock ? "0 left" : `${product.stock} in stock`}
      </div>

      <div className="aspect-[4/3] w-full bg-paper flex items-center justify-center overflow-hidden border-b border-line">
        {product.image ? (
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <span className="font-display text-4xl text-line-strong select-none">
            {product.title.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <span className="text-[11px] uppercase tracking-wide text-ink-soft font-mono">
          {product.category?.name || "General"}
        </span>
        <h3 className="font-display text-lg leading-snug text-ink group-hover:text-signal-dark transition-colors">
          {product.title}
        </h3>
        <div className="flex items-baseline justify-between pt-1">
          <span className="font-mono text-base text-ink">
            ${product.price.toFixed(2)}
          </span>
          {lowStock && (
            <span className="text-[11px] font-medium text-brass">Low stock</span>
          )}
          {outOfStock && (
            <span className="text-[11px] font-medium text-danger">Sold out</span>
          )}
        </div>
      </div>
    </Link>
  );
}
