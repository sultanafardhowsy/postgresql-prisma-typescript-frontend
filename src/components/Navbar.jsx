import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2.5">
          <img
            src="/favicon.svg"
            alt="Stockroom lightning logo"
            className="h-8 w-8 object-contain"
          />
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            Stockroom
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-soft md:flex">
          <Link to="/catalog" className="transition-colors hover:text-primary">
            Catalog
          </Link>
          {user && (
            <Link to="/orders" className="transition-colors hover:text-primary">
              Orders
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <LayoutDashboard size={15} />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/cart"
                className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition-colors hover:border-line hover:bg-paper"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-primary px-1 font-mono text-[10px] font-semibold text-white">
                    {itemCount}
                  </span>
                )}
              </Link>
              <div className="hidden items-center gap-1.5 text-sm text-ink-soft sm:flex">
                <User size={15} />
                {user.name.split(" ")[0]}
              </div>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent transition-colors hover:border-line hover:bg-paper"
                aria-label="Log out"
                title="Log out"
              >
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-ink-soft transition-colors hover:text-primary"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="btn-gradient rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/25 transition-all hover:brightness-110"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
