import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import api from "../lib/api";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";

const STATUS_STYLES = {
  PENDING: "bg-brass-soft text-brass",
  PROCESSING: "bg-brass-soft text-brass",
  SHIPPED: "bg-line text-ink-soft",
  DELIVERED: "bg-signal/10 text-signal-dark",
  CANCELLED: "bg-danger-soft text-danger",
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/orders")
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  if (orders.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-5 py-16">
        <EmptyState
          icon={ClipboardList}
          title="No orders yet"
          description="Once you check out, your order history shows up here."
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <h1 className="font-display text-3xl text-ink mb-8">Your orders</h1>

      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              to={`/orders/${order.id}`}
              className="flex items-center justify-between py-4 hover:bg-paper-raised transition-colors px-2 -mx-2"
            >
              <div>
                <p className="font-mono text-xs text-ink-soft">
                  #{order.id.slice(0, 8)}
                </p>
                <p className="text-sm text-ink mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`text-[11px] font-mono px-2 py-1 rounded-sm ${
                    STATUS_STYLES[order.status] || "bg-line text-ink-soft"
                  }`}
                >
                  {order.status}
                </span>
                <span className="font-mono text-sm text-ink w-20 text-right">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
