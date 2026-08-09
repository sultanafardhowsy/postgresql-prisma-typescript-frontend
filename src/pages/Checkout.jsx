import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import Spinner from "../components/Spinner";

export default function Checkout() {
  const { items, totalCartValue, loading, refreshCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [placing, setPlacing] = useState(false);

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const res = await api.post("/orders", {});
      await refreshCart();
      showToast("Order placed");
      navigate(`/orders/${res.data.data.id}`);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setPlacing(false);
    }
  };

  if (loading) return <Spinner />;

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-5 py-16 text-center">
        <p className="text-ink-soft">
          Your cart is empty — add something before checking out.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ink mb-8">Review order</h1>

      <ul className="flex flex-col divide-y divide-line border-y border-line mb-6">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-ink">
                {item.product.title}
              </p>
              <p className="text-xs text-ink-soft font-mono">
                {item.quantity} × ${item.product.price.toFixed(2)}
              </p>
            </div>
            <p className="font-mono text-sm text-ink">
              ${(item.product.price * item.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between mb-8">
        <span className="text-sm font-medium text-ink">Total</span>
        <span className="font-mono text-xl text-ink">
          ${totalCartValue.toFixed(2)}
        </span>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={placing}
        className="w-full bg-ink text-paper py-3 rounded-sm text-sm font-medium hover:bg-signal-dark transition-colors disabled:opacity-50"
      >
        {placing ? "Placing order..." : "Place order"}
      </button>
    </div>
  );
}
