import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import api from "../lib/api";
import Spinner from "../components/Spinner";

const STATUS_STYLES = {
  PENDING: "bg-brass-soft text-brass",
  PROCESSING: "bg-brass-soft text-brass",
  SHIPPED: "bg-line text-ink-soft",
  DELIVERED: "bg-signal/10 text-signal-dark",
  CANCELLED: "bg-danger-soft text-danger",
};

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/orders/${id}`)
      .then((res) => setOrder(res.data.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Spinner />;
  if (!order) return null;

  return (
    <div className="max-w-2xl mx-auto px-5 py-10">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft size={14} />
        All orders
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="font-mono text-xs text-ink-soft mb-1">
            #{order.id.slice(0, 8)}
          </p>
          <h1 className="font-display text-2xl text-ink">
            {new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h1>
        </div>
        <span
          className={`text-xs font-mono px-2.5 py-1.5 rounded-sm ${
            STATUS_STYLES[order.status] || "bg-line text-ink-soft"
          }`}
        >
          {order.status}
        </span>
      </div>

      <ul className="flex flex-col divide-y divide-line border-y border-line mb-6">
        {order.orderItems.map((item) => (
          <li key={item.id} className="flex items-center justify-between py-4">
            <div>
              <p className="text-sm font-medium text-ink">
                {item.product?.title || "Product"}
              </p>
              <p className="text-xs text-ink-soft font-mono">
                {item.quantity} × ${item.price.toFixed(2)}
              </p>
            </div>
            <p className="font-mono text-sm text-ink">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink">Total</span>
        <span className="font-mono text-xl text-ink">
          ${order.totalAmount.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
