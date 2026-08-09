import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Register() {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(name, email, password);
      showToast("Account created");
      navigate("/");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-3xl text-ink mb-1.5">Sign up</h1>
      <p className="text-ink-soft text-sm mb-8">
        Create an account to start shopping.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="text-sm font-medium text-ink block mb-1.5">
            Full name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2.5 border border-line bg-paper-raised text-sm outline-none focus:border-signal rounded-sm"
          />
        </div>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2.5 border border-line bg-paper-raised text-sm outline-none focus:border-signal rounded-sm"
          />
          <p className="text-xs text-ink-soft mt-1">At least 6 characters</p>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-ink text-paper py-2.5 text-sm font-medium rounded-sm hover:bg-signal-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="text-sm text-ink-soft mt-6">
        Already have an account?{" "}
        <Link to="/login" className="text-signal-dark font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
}
