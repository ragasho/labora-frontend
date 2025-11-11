
// Application constants and configuration
export const APP_CONFIG = {
  name: 'QuickMart',
  description: 'Delivered in minutes',
  version: '1.0.0',
  defaultDeliveryTime: '15 minutes',
  maxCartQuantity: 99,
  supportPhone: '+91 98765 43210',
  supportEmail: 'support@quickmart.com'
};


export const API_BASE_URL = (import.meta as ImportMeta & { env: Record<string, string> }).env.VITE_API_URL;
export const API_ENDPOINTS = {
    category: `${API_BASE_URL}/category`,
    productsId: (ids?: string[]) =>
        ids && ids.length > 0
            ? `${API_BASE_URL}/products?ids=${ids.join(",")}`
            : `${API_BASE_URL}/products`,
    auth: {
        sendOtp: `${API_BASE_URL}/auth/send-otp`,
        verifyOtp: `${API_BASE_URL}/auth/verify-otp`,
        setName: `${API_BASE_URL}/auth/set-name`,
        refresh: `${API_BASE_URL}/auth/refresh`
    },
    cart: {
        get: `${API_BASE_URL}/cart/`,
        add: `${API_BASE_URL}/cart/add`,
        update: `${API_BASE_URL}/cart/update`,
        clear:  `${API_BASE_URL}/cart/clear`,
        bulk: `${API_BASE_URL}/cart/update-bulk`,
    },
    address: {
        add: `${API_BASE_URL}/address`,
        get: `${API_BASE_URL}/address`,
    },
    coupons: {
        get: `${API_BASE_URL}/coupons`,
    },
    orders: '/orders',
    feedback: '/feedback',
    health: '/health'
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
} as const;

export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: 'Cash on Delivery',
  CARD: 'Credit/Debit Card',
  UPI: 'UPI',
  WALLET: 'Digital Wallet'
} as const;