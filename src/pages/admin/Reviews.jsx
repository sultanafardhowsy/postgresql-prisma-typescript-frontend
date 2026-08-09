import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/Spinner";
import StarRating from "../../components/StarRating";
import EmptyState from "../../components/EmptyState";

const STATUSES = ["PENDING", "APPROVED", "REJECTED"];

const STATUS_STYLES = {
  PENDING: "bg-brass-soft text-brass",
  APPROVED: "bg-signal/10 text-signal-dark",
  REJECTED: "bg-danger-soft text-danger",
};

export default function AdminReviews() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/reviews", { params: { limit: 100 } })
      .then((res) => setReviews(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (review, status) => {
    try {
      await api.patch(`/reviews/${review.id}`, { status });
      showToast("Review status updated");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async (review) => {
    if (!confirm("Delete this review?")) return;
    try {
      await api.delete(`/reviews/${review.id}`);
      showToast("Review deleted");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Reviews</h1>

      {reviews.length === 0 ? (
        <EmptyState title="No reviews yet" />
      ) : (
        <ul className="flex flex-col gap-3">
          {reviews.map((r) => (
            <li
              key={r.id}
              className="border border-line bg-paper-raised p-4 flex flex-col gap-2"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-ink">
                    {r.product?.title || "Product"}
                  </p>
                  <p className="text-xs text-ink-soft">
                    by {r.user?.name || "Anonymous"}
                  </p>
                </div>
                <StarRating rating={r.rating} size={13} />
              </div>

              {r.comment && (
                <p className="text-sm text-ink-soft">{r.comment}</p>
              )}

              <div className="flex items-center justify-between pt-2 mt-1 border-t border-line">
                <select
                  value={r.status}
                  onChange={(e) => handleStatusChange(r, e.target.value)}
                  className={`text-xs font-mono px-2 py-1.5 rounded-sm border-0 outline-none cursor-pointer ${
                    STATUS_STYLES[r.status] || "bg-line text-ink-soft"
                  }`}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleDelete(r)}
                  className="text-ink-soft hover:text-danger transition-colors"
                  aria-label="Delete review"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
