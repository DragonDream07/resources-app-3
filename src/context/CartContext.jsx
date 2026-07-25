import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const GUEST_CART_KEY = 'guest_cart_id';

export function CartProvider({ children }) {
  const { token, user, isAuthenticated } = useAuth();

  const [cartId, setCartId] = useState(() => localStorage.getItem(GUEST_CART_KEY));
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const itemCount = cart?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) ?? 0;
  const subtotal = cart?.subtotal ?? 0;
  const discount = cart?.discount ?? 0;
  const total = cart?.total ?? 0;
  const promoCode = cart?.promoCode ?? null;

  const persistCartId = useCallback((id) => {
    if (id) {
      localStorage.setItem(GUEST_CART_KEY, id);
    } else {
      localStorage.removeItem(GUEST_CART_KEY);
    }
    setCartId(id);
  }, []);

  const setCartData = useCallback((cartData) => {
    setCart(cartData);
    if (cartData?.id) {
      persistCartId(cartData.id);
    }
  }, [persistCartId]);

  const initCart = useCallback((newCartId) => {
    persistCartId(newCartId);
  }, [persistCartId]);

  const addItem = useCallback((item) => {
    setCart((prev) => {
      if (!prev) return prev;
      const existing = prev.items?.find((i) => i.skuId === item.skuId);
      let updatedItems;
      if (existing) {
        updatedItems = prev.items.map((i) =>
          i.skuId === item.skuId ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        updatedItems = [...(prev.items || []), item];
      }
      return { ...prev, items: updatedItems };
    });
  }, []);

  const updateItem = useCallback((itemId, quantity) => {
    setCart((prev) => {
      if (!prev) return prev;
      const updatedItems = prev.items?.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      );
      return { ...prev, items: updatedItems };
    });
  }, []);

  const removeItem = useCallback((itemId) => {
    setCart((prev) => {
      if (!prev) return prev;
      const updatedItems = prev.items?.filter((i) => i.id !== itemId);
      return { ...prev, items: updatedItems };
    });
  }, []);

  const applyPromo = useCallback((promoData) => {
    setCart((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        promoCode: promoData.code,
        discount: promoData.discount,
        total: promoData.total,
      };
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart(null);
    persistCartId(null);
  }, [persistCartId]);

  const mergeGuestCart = useCallback((guestCartId, loggedInCartId) => {
    persistCartId(loggedInCartId);
  }, [persistCartId]);

  useEffect(() => {
    if (isAuthenticated && user && !user.isGuest) {
      const guestCartId = localStorage.getItem(GUEST_CART_KEY);
      if (guestCartId && cartId !== guestCartId) {
        mergeGuestCart(guestCartId, cartId);
      }
    }
  }, [isAuthenticated, user]);

  const value = {
    cartId,
    cart,
    loading,
    error,
    itemCount,
    subtotal,
    discount,
    total,
    promoCode,
    setCartData,
    initCart,
    addItem,
    updateItem,
    removeItem,
    applyPromo,
    clearCart,
    mergeGuestCart,
    setLoading,
    setError,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
