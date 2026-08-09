import { useEffect, useState } from "react";
import { Package, Tags, ClipboardList, Users, Star } from "lucide-react";
import api from "../../lib/api";
import Spinner from "../../components/Spinner";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/products", { params: { limit: 1 } }),
      api.get("/categories"),
      api.get("/orders", { params: { limit: 1 } }),
      api.get("/users"),
      api.get("/reviews", { params: { status: "PENDING", limit: 1 } }),
    ]).then(
      ([productsRes, categoriesRes, ordersRes, usersRes, reviewsRes]) => {
        setStats({
          products: productsRes.data.pagination?.totalProducts ?? 0,
          categories: categoriesRes.data.data.length,
          orders: ordersRes.data.pagination?.totalOrders ?? 0,
          users: usersRes.data.data.length,
          pendingReviews: reviewsRes.data.pagination?.totalReviews ?? 0,
        });
      }
    );
  }, []);

  if (!stats) return <Spinner />;

  const cards = [
    { label: "Products", value: stats.products, icon: Package },
    { label: "Categories", value: stats.categories, icon: Tags },
    { label: "Orders", value: stats.orders, icon: ClipboardList },
    { label: "Users", value: stats.users, icon: Users },
    { label: "Reviews pending", value: stats.pendingReviews, icon: Star },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Overview</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="border border-line bg-paper-raised p-4 flex flex-col gap-3"
          >
            <Icon size={16} className="text-signal" />
            <div>
              <p className="font-mono text-2xl text-ink">{value}</p>
              <p className="text-xs text-ink-soft mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
