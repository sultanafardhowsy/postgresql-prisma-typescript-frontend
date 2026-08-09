import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import Spinner from "../../components/Spinner";
import EmptyState from "../../components/EmptyState";

export default function AdminUsers() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api
      .get("/users")
      .then((res) => setUsers(res.data.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleRoleChange = async (user, role) => {
    try {
      await api.patch(`/users/${user.id}`, { role });
      showToast("Role updated");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeactivate = async (user) => {
    if (!confirm(`Deactivate ${user.name}?`)) return;
    try {
      await api.delete(`/users/${user.id}`);
      showToast("User deactivated");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <h1 className="font-display text-2xl text-ink mb-6">Users</h1>

      {users.length === 0 ? (
        <EmptyState title="No users yet" />
      ) : (
        <div className="border border-line overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-paper-raised text-left text-xs uppercase tracking-wide text-ink-soft">
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium w-16"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {users.map((u) => (
                <tr key={u.id} className="bg-paper-raised">
                  <td className="px-4 py-3 text-ink">{u.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{u.email}</td>
                  <td className="px-4 py-3">
                    <select
                      value={u.role}
                      disabled={u.id === currentUser.id}
                      onChange={(e) => handleRoleChange(u, e.target.value)}
                      className="text-xs font-mono px-2 py-1.5 rounded-sm border border-line outline-none bg-paper cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {u.id !== currentUser.id && (
                      <button
                        onClick={() => handleDeactivate(u)}
                        className="text-ink-soft hover:text-danger transition-colors"
                        aria-label="Deactivate"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
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
