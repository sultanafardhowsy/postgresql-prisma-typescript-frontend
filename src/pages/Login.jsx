import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast("Welcome back");
      navigate(location.state?.from || "/");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-3xl text-ink mb-1.5">Log in</h1>
      <p className="text-ink-soft text-sm mb-8">
        Access your cart, orders, and reviews.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink block mb-1.5">
            Email
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2.5 border border-line bg-paper-raised text-sm outline-none focus:border-signal rounded-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink block mb-1.5">
            Password
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-line bg-paper-raised text-sm outline-none focus:border-signal rounded-sm"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-ink text-paper py-2.5 text-sm font-medium rounded-sm hover:bg-signal-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Don't have an account?{" "}
        <Link to="/register" className="text-signal-dark font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
