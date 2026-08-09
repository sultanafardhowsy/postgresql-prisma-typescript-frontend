import { Star } from "lucide-react";

export default function StarRating({ rating = 0, size = 14, onChange }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === "function";

  return (
    <div className="flex items-center gap-0.5">
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          disabled={!interactive}
          onClick={() => onChange?.(star)}
          className={interactive ? "cursor-pointer" : "cursor-default"}
          aria-label={interactive ? `Rate ${star} out of 5` : undefined}
        >
          <Star
            size={size}
            className={star <= rating ? "fill-brass text-brass" : "text-line-strong"}
          />
        </button>
      ))}
    </div>
  );
}
