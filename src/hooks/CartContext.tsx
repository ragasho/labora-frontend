import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { CartItem, Product, CartContextType } from "../types";
import { API_ENDPOINTS } from "../config/constants";
import { useAuth } from "./useAuth";

interface CartEntry {
    productId: string;
    quantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);
let syncTimer: NodeJS.Timeout;

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState<Record<string, number>>({});
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    const userId = user?.id || null;
    const token = user ? localStorage.getItem("auth_token") : null;

    // ---------------- Helper: bulk sync (debounced) ----------------
    const scheduleBulkSync = useCallback(
        (updatedCart: Record<string, number>) => {
            if (!userId) return; // no sync for guest
            clearTimeout(syncTimer);

            syncTimer = setTimeout(async () => {
                try {
                    const items: CartEntry[] = Object.entries(updatedCart).map(([productId, quantity]) => ({
                        productId,
                        quantity,
                    }));
                    await fetch(API_ENDPOINTS.cart.bulk, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ items }),
                    });
                } catch (err) {
                    console.error("Cart bulk sync failed:", err);
                }
            }, 1000); // debounce 1s
        },
        [userId, token]
    );

    // ---------------- Helper: single item update (immediate) ----------------
    const syncUpdate = useCallback(
        async (productId: string, quantity: number) => {
            if (!userId) return;
            try {
                await fetch(API_ENDPOINTS.cart.update, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ productId, quantity }),
                });
            } catch (err) {
                console.error("Cart item update failed:", err);
            }
        },
        [userId, token]
    );

    // ---------------- Hydrate cart from backend ----------------
    const fetchCart = useCallback(
        async (mergeGuestIfEmpty: boolean = false) => {
            if (!userId) {
                // guest user → load from localStorage
                const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "{}");
                setCart(guestCart);
                return;
            }
            try {
                const res = await fetch(API_ENDPOINTS.cart.get, {
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                });
                if (!res.ok) throw new Error("Failed to fetch cart");

                const backendCart: Record<string, number> = await res.json();

                if (Object.keys(backendCart).length > 0 || !mergeGuestIfEmpty) {
                    setCart(backendCart);
                    localStorage.removeItem("guest_cart");
                } else {
                    const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "{}");
                    if (Object.keys(guestCart).length > 0) {
                        setCart(guestCart);
                        scheduleBulkSync(guestCart); // push to backend
                        localStorage.removeItem("guest_cart");
                    } else {
                        setCart({});
                    }
                }
            } catch (err) {
                console.error("Error fetching cart:", err);
            }
        },
        [userId, token, scheduleBulkSync]
    );

    // ---------------- Effect: merge guest cart on login & clear on logout ----------------
    useEffect(() => {
        if (userId) {
            fetchCart(true);
        } else {
            const guestCart = JSON.parse(localStorage.getItem("guest_cart") || "{}");
            setCart(guestCart);
            setCartItems([]);
        }
    }, [userId, fetchCart]);

    // ---------------- Effect: enrich cart items with product details ----------------
    useEffect(() => {
        const updateCartItems = async () => {
            if (!Object.keys(cart).length) return setCartItems([]);

            try {
                const productRes = await fetch(API_ENDPOINTS.productsId(Object.keys(cart)));
                const products: Product[] = await productRes.json();

                const enriched: CartItem[] = Object.entries(cart)
                    .map(([id, qty]) => {
                        const product = products.find((p) => p.id === id);
                        if (!product) return null;
                        return { ...product, quantity: qty };
                    })
                    .filter(Boolean) as CartItem[];

                setCartItems(enriched);
            } catch (err) {
                console.error("Error fetching product details:", err);
            }
        };

        updateCartItems();
    }, [cart]);

    // ---------------- Cart actions ----------------
    const addToCart = (productId: string) => {
        setCart((prev) => {
            const updated = { ...prev, [productId]: (prev[productId] || 0) + 1 };
            if (userId) scheduleBulkSync(updated);
            else localStorage.setItem("guest_cart", JSON.stringify(updated));
            return updated;
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => {
            const { [productId]: _, ...rest } = prev;
            if (userId) syncUpdate(productId, 0);
            else localStorage.setItem("guest_cart", JSON.stringify(rest));
            return rest;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        setCart((prev) => {
            let updated: Record<string, number>;
            if (quantity <= 0) {
                const { [productId]: _, ...rest } = prev;
                updated = rest;
            } else {
                updated = { ...prev, [productId]: quantity };
            }

            if (userId) syncUpdate(productId, quantity);
            else localStorage.setItem("guest_cart", JSON.stringify(updated));

            return updated;
        });
    };

    const clearCart = () => {
        setCart({});
        if (userId) scheduleBulkSync({});
        else localStorage.removeItem("guest_cart");
    };

    return (
        <CartContext.Provider
            value={{ cart, cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within a CartProvider");
    return ctx;
};
