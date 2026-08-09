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
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-2xl tracking-tight text-ink">
            Stockroom
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-soft">
          <Link to="/" className="hover:text-ink transition-colors">
            Catalog
          </Link>
          {user && (
            <Link to="/orders" className="hover:text-ink transition-colors">
              Orders
            </Link>
          )}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 hover:text-ink transition-colors"
            >
              <LayoutDashboard size={15} />
              Admin
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to="/cart"
                className="relative flex items-center justify-center h-9 w-9 hover:bg-paper-raised border border-transparent hover:border-line rounded-sm transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-signal text-paper text-[10px] font-mono font-semibold h-4.5 min-w-4.5 px-1 rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              <div className="hidden sm:flex items-center gap-1.5 text-sm text-ink-soft">
                <User size={15} />
                {user.name.split(" ")[0]}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center h-9 w-9 hover:bg-paper-raised border border-transparent hover:border-line rounded-sm transition-colors"
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
                className="text-sm font-medium text-ink-soft hover:text-ink transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="text-sm font-medium bg-ink text-paper px-4 py-2 rounded-sm hover:bg-signal-dark transition-colors"
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
