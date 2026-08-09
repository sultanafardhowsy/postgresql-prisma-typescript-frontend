import { createContext, useCallback, useContext, useEffect, useState } from "react";
import api from "../lib/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [totalCartValue, setTotalCartValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      setTotalCartValue(0);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get("/cart-items");
      setItems(res.data.data);
      setTotalCartValue(res.data.totalCartValue || 0);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId, quantity = 1) => {
    await api.post("/cart-items", { productId, quantity });
    await refreshCart();
  };

  const updateQuantity = async (cartItemId, quantity) => {
    await api.patch(`/cart-items/${cartItemId}`, { quantity });
    await refreshCart();
  };

  const removeFromCart = async (cartItemId) => {
    await api.delete(`/cart-items/${cartItemId}`);
    await refreshCart();
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalCartValue,
        itemCount,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
