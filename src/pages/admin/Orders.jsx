import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const STATUS_STYLES = {
  PENDING: "bg-brass-soft text-brass",
  PROCESSING: "bg-brass-soft text-brass",
  SHIPPED: "bg-line text-ink-soft",
  DELIVERED: "bg-signal/10 text-signal-dark",
  CANCELLED: "bg-danger-soft text-danger",
};

export default function AdminOrders() {
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/orders", { params: { limit: 100 } })
      .then((res) => setOrders(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleStatusChange = async (order, status) => {
    try {
      await api.patch(`/orders/${order.id}`, { status });
      showToast("Order status updated");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Orders</h1>

      {orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders will appear here once customers check out." />
      ) : (
        <div className="border border-line overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-raised text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">Order</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Total</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {orders.map((order) => (
                <tr key={order.id} className="bg-paper-raised">
                  <td className="px-4 py-3 font-mono text-xs">
                    {order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-ink">
                    {order.user?.name || "—"}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    ${order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order, e.target.value)}
                      className={`text-xs font-mono px-2 py-1.5 rounded-sm border-0 outline-none cursor-pointer ${
                        STATUS_STYLES[order.status] || "bg-line text-ink-soft"
                      }`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
