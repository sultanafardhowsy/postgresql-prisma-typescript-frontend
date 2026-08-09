import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

export default function Cart() {
  const { items, totalCartValue, loading, updateQuantity, removeFromCart } =
    useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleQty = async (item, delta) => {
    const next = item.quantity + delta;
    if (next < 1) return;
    if (next > item.product.stock) {
      return showToast(`Only ${item.product.stock} available`, "error");
    }
    try {
      await updateQuantity(item.id, next);
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleRemove = async (item) => {
    try {
      await removeFromCart(item.id);
      showToast("Removed from cart");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <Spinner />;

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Browse the catalog to find something worth stocking up on."
          action={
            <Link
              to="/"
              className="bg-ink text-paper px-5 py-2.5 rounded-sm text-sm font-medium hover:bg-signal-dark transition-colors"
            >
              Browse catalog
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ink mb-8">Your cart</h1>

      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-5">
            <div className="h-16 w-16 shrink-0 bg-paper-raised border border-line flex items-center justify-center overflow-hidden">
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-xl text-line-strong">
                  {item.product.title.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/products/${item.product.id}`}
                className="font-medium text-ink hover:text-signal-dark transition-colors line-clamp-1"
              >
                {item.product.title}
              </Link>
              <p className="font-mono text-sm text-ink-soft mt-0.5">
                ${item.product.price.toFixed(2)}
              </p>
            </div>

            <div className="flex items-center border border-line rounded-sm">
              <button
                onClick={() => handleQty(item, -1)}
                className="h-8 w-8 flex items-center justify-center hover:bg-paper transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus size={13} />
              </button>
              <span className="w-8 text-center font-mono text-sm">
                {item.quantity}
              </span>
              <button
                onClick={() => handleQty(item, 1)}
                className="h-8 w-8 flex items-center justify-center hover:bg-paper transition-colors"
                aria-label="Increase quantity"
              >
                <Plus size={13} />
              </button>
            </div>

            <p className="font-mono text-sm text-ink w-20 text-right">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>

            <button
              onClick={() => handleRemove(item)}
              className="text-ink-soft hover:text-danger transition-colors"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mt-8">
        <div>
          <p className="text-sm text-ink-soft">Total</p>
          <p className="font-mono text-2xl text-ink">
            ${totalCartValue.toFixed(2)}
          </p>
        </div>
        <button
          onClick={() => navigate("/checkout")}
          className="bg-ink text-paper px-6 py-3 rounded-sm text-sm font-medium hover:bg-signal-dark transition-colors"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}
