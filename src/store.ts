import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./store/cartSlice";

// Load persisted cart from localStorage
const loadCartFromStorage = () => {
    try {
        const saved = localStorage.getItem("quickmart-my-cart");
        if (saved) return JSON.parse(saved);
    } catch {
        return undefined;
    }
    return undefined;
};

// Save cart to localStorage
const saveCartToStorage = (state: any) => {
    try {
        localStorage.setItem("quickmart-my-cart", JSON.stringify(state.cart.items));
    } catch {}
};

export const store = configureStore({
    reducer: {
        cart: cartReducer,
    },
    preloadedState: {
        cart: {
            items: loadCartFromStorage() || [],
        },
    },
});

store.subscribe(() => saveCartToStorage(store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
