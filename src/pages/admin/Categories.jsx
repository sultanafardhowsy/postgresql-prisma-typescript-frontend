import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import api from "../../lib/api";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/Spinner";
import Modal from "../../components/Modal";
import EmptyState from "../../components/EmptyState";
import StatusBadge from "../../components/StatusBadge";

export default function AdminCategories() {
  const { showToast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [status, setStatus] = useState("ACTIVE");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get("/categories")
      .then((res) => setCategories(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditingId(null);
    setName("");
    setStatus("ACTIVE");
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setStatus(cat.status || "ACTIVE");
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}`, { name, status });
        showToast("Category updated");
      } else {
        await api.post("/categories", { name, status });
        showToast("Category created");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat) => {
    if (!confirm(`Delete "${cat.name}"? Products in it will be unaffected but uncategorized listings may need reassigning.`))
      return;
    try {
      await api.delete(`/categories/${cat.id}`);
      showToast("Category deleted");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-ink">Categories</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 text-sm rounded-sm hover:bg-signal-dark transition-colors"
        >
          <Plus size={15} />
          New category
        </button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="No categories yet" description="Create one to start adding products." />
      ) : (
        <div className="border border-line divide-y divide-line">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between px-4 py-3 bg-paper-raised"
            >
              <span className="text-sm text-ink">{cat.name}</span>
              <div className="flex items-center gap-3">
                <StatusBadge status={cat.status} />
                <button
                  onClick={() => openEdit(cat)}
                  className="text-ink-soft hover:text-ink transition-colors"
                  aria-label="Edit"
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="text-ink-soft hover:text-danger transition-colors"
                  aria-label="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? "Edit category" : "New category"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-medium text-ink block mb-1">Name</label>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-ink block mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-line text-sm outline-none focus:border-signal rounded-sm bg-paper-raised"
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="mt-2 bg-ink text-paper py-2.5 text-sm font-medium rounded-sm hover:bg-signal-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Create category"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
