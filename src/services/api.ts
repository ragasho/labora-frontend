// src/services/apiService.ts
import type { CartItem, Order, OrderData, FeedbackData } from '../types';
import { apiClient } from '../config/./apiClient.ts';

// Base request helper
async function request<T>(url: string, options: RequestInit): Promise<T> {
    const res = await fetch(url, options);

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || res.statusText);
    }

    // Handle empty response (204 or no content-type)
    if (!res.headers.get("Content-Type")?.includes("application/json")) {
        return {} as T;
    }

    return res.json();
}

export const apiService = {
    // 🛒 Cart
    getCart(accessToken: string): Promise<CartItem[]> {
        return request(`${apiClient.apiUrl}/cart`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
    },

    saveCart(cartItems: CartItem[], accessToken: string): Promise<{ success: true }> {
        return request(`${apiClient.apiUrl}/cart`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ items: cartItems })
        });
    },

    // 📦 Orders
    placeOrder(orderData: OrderData, accessToken: string): Promise<Order> {
        return request(`${apiClient.apiUrl}/orders`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(orderData)
        });
    },

    getOrders(accessToken: string): Promise<Order[]> {
        return request(`${apiClient.apiUrl}/orders`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
    },

    cancelOrder(orderId: string, accessToken: string): Promise<{ success: true }> {
        return request(`${apiClient.apiUrl}/orders/${orderId}/cancel`, {
            method: "POST", // or DELETE if backend supports it
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
    },

    // 📝 Feedback
    submitFeedback(feedbackData: FeedbackData, accessToken: string): Promise<{ success: true }> {
        return request(`${apiClient.apiUrl}/feedback`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(feedbackData)
        });
    }
};
