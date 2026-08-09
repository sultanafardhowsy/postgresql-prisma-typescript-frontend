import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Minus, Plus, ShoppingBag, MessageSquareText } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/Spinner";
import StarRating from "../components/StarRating";
import EmptyState from "../components/EmptyState";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  // Review form state
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const loadReviews = () => {
    api
      .get("/reviews", { params: { productId: id, status: "APPROVED" } })
      .then((res) => setReviews(res.data.data));
  };

  useEffect(() => {
    setLoading(true);
    api
      .get(`/products/${id}`)
      .then((res) => setProduct(res.data.data))
      .finally(() => setLoading(false));
    loadReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) return navigate("/login");
    setAdding(true);
    try {
      await addToCart(id, qty);
      showToast(`Added ${qty} to cart`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (rating === 0) return showToast("Pick a star rating first", "error");
    setSubmittingReview(true);
    try {
      await api.post("/reviews", { productId: id, rating, comment });
      showToast("Review submitted — pending approval");
      setRating(0);
      setComment("");
      loadReviews();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <Spinner />;
  if (!product)
    return (
      <EmptyState title="Product not found" description="It may have been removed." />
    );

  const outOfStock = product.stock <= 0;
  const inactive = product.status === "INACTIVE";
  const unavailable = inactive || product.status === "OUT_OF_STOCK" || outOfStock;
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="aspect-square bg-paper-raised border border-line flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="font-display text-7xl text-line-strong select-none">
              {product.title.charAt(0)}
            </span>
          )}
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-wide text-ink-soft font-mono">
            {product.category?.name || "General"}
          </span>
          <h1 className="font-display text-3xl text-ink mt-1.5 mb-3">
            {product.title}
          </h1>

          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={Math.round(avgRating)} />
              <span className="text-sm text-ink-soft">
                {avgRating.toFixed(1)} ({reviews.length} review
                {reviews.length !== 1 ? "s" : ""})
              </span>
            </div>
          )}

          <p className="font-mono text-2xl text-ink mb-4">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-ink-soft mb-6 leading-relaxed">
            {product.description || "No description provided for this item."}
          </p>

          <div className="ledger-rule mb-6" />

          <div className="flex items-center gap-2 mb-2 text-sm">
            <span
              className={`font-mono ${
                unavailable ? "text-danger" : "text-signal-dark"
              }`}
            >
              {inactive
                ? "Inactive"
                : outOfStock || product.status === "OUT_OF_STOCK"
                  ? "Out of stock"
                  : `${product.stock} in stock`}
            </span>
          </div>

          {!unavailable && (
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center border border-line rounded-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="h-10 w-10 flex items-center justify-center hover:bg-paper transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-10 text-center font-mono text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="h-10 w-10 flex items-center justify-center hover:bg-paper transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={unavailable || adding}
            className="flex items-center justify-center gap-2 bg-ink text-paper px-6 py-3 rounded-sm text-sm font-medium hover:bg-signal-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            <ShoppingBag size={16} />
            {unavailable ? "Unavailable" : adding ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-16 pt-8 border-t border-line max-w-2xl">
        <h2 className="font-display text-2xl text-ink mb-6 flex items-center gap-2">
          <MessageSquareText size={20} />
          Reviews
        </h2>

        {user && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-8 p-4 border border-line bg-paper-raised"
          >
            <p className="text-sm font-medium text-ink mb-2">Leave a review</p>
            <StarRating rating={rating} onChange={setRating} size={20} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you think?"
              rows={3}
              className="w-full mt-3 px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm resize-none"
            />
            <button
              type="submit"
              disabled={submittingReview}
              className="mt-3 bg-ink text-paper px-4 py-2 text-sm rounded-sm hover:bg-signal-dark transition-colors disabled:opacity-50"
            >
              {submittingReview ? "Submitting..." : "Submit review"}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-ink-soft">
            No reviews yet — be the first to share your thoughts.
          </p>
        ) : (
          <ul className="flex flex-col gap-5">
            {reviews.map((r) => (
              <li key={r.id} className="border-b border-line pb-5 last:border-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-ink">
                    {r.user?.name || "Anonymous"}
                  </span>
                  <StarRating rating={r.rating} size={13} />
                </div>
                {r.comment && (
                  <p className="text-sm text-ink-soft">{r.comment}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
