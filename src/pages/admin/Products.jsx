import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

const emptyForm = {
  title: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  status: "ACTIVE",
  categoryId: "",
};

export default function AdminProducts() {
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get("/products", { params: { limit: 100 } }),
      api.get("/categories"),
    ])
      .then(([p, c]) => {
        setProducts(p.data.data);
        setCategories(c.data.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm, categoryId: categories[0]?.id || "" });
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      title: product.title,
      description: product.description || "",
      price: product.price,
      stock: product.stock,
      image: product.image || "",
      status: product.status || "ACTIVE",
      categoryId: product.categoryId,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
    };
    try {
      if (editingId) {
        await api.patch(`/products/${editingId}`, payload);
        showToast("Product updated");
      } else {
        await api.post("/products", payload);
        showToast("Product created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Delete "${product.title}"?`)) return;
    try {
      await api.delete(`/products/${product.id}`);
      showToast("Product deleted");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Products</h1>
        <button
          onClick={openCreate}
          disabled={categories.length === 0}
          className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 text-sm rounded-sm hover:bg-signal-dark transition-colors disabled:opacity-40"
        >
          <Plus size={15} />
          New product
        </button>
      </div>

      {categories.length === 0 && (
        <p className="text-sm text-brass mb-4">
          Create a category first before adding products.
        </p>
      )}

      {products.length === 0 ? (
        <EmptyState title="No products yet" description="Add your first product to get started." />
      ) : (
        <div className="border border-line overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-raised text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Category</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3 font-medium w-20"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((p) => (
                <tr key={p.id} className="bg-paper-raised">
                  <td className="px-4 py-3 text-ink">{p.title}</td>
                  <td className="px-4 py-3 text-ink-soft">
                    {p.category?.name || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3 font-mono">${p.price.toFixed(2)}</td>
                  <td className="px-4 py-3 font-mono">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-ink-soft hover:text-ink transition-colors"
                        aria-label="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(p)}
                        className="text-ink-soft hover:text-danger transition-colors"
                        aria-label="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit product" : "New product"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-ink block mb-1">Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink block mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-ink block mb-1">
                Price
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink block mb-1">
                Stock
              </label>
              <input
                required
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-ink block mb-1">
              Category
            </label>
            <select
              required
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm bg-paper-raised"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink block mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm bg-paper-raised"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="OUT_OF_STOCK">OUT OF STOCK</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink block mb-1">
              Image URL
            </label>
            <input
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-2 bg-ink text-paper py-2.5 text-sm font-medium rounded-sm hover:bg-signal-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Create product"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
