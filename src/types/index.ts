export interface DeliveryLocation {
    id: string;
    name: string;
    address: string;
    deliveryTime: string;
}

export interface Category {
    id: string;
    name: string;
    image: string;
    icon: string;
}

export interface NutritionalInfo {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    fiber?: string;
    potassium?: string;
    vitaminC?: string;
    calcium?: string;
    vitaminD?: string;
    iron?: string;
    sodium?: string;
    folate?: string;
    sugar?: string;
    caffeine?: string;
    antioxidants?: string;
}

export interface ProductRatings {
    average: number;
    count: number;
}

export interface Product {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    categoryId: string; // changed from category_id
    unit: string;
    inStock: boolean;
    discount?: number;
    description?: string;
    brand?: string;
    weight?: string;
    nutritionalInfo?: NutritionalInfo;
    ingredients?: string[];
    allergens?: string[];
    storageInstructions?: string;
    manufacturingDate?: string;
    expiryDate?: string;
    countryOfOrigin?: string;
    ratings?: ProductRatings;
    features?: string[];
}

export interface CartItem extends Product {
    quantity: number;
}

export interface DeliveryAddress {
    name: string;
    address: string;
    phone: string;
    instructions?: string;
}

export interface TrackingStep {
    status: string;
    timestamp: string;
    description: string;
    completed: boolean;
}

export interface OrderItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    unit: string;
}

export interface OrderFeedback {
    rating: number;
    comment: string;
    submittedAt: string;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'outForDelivery' | 'delivered' | 'cancelled';
    deliveryAddress: DeliveryAddress;
    paymentMethod: string;
    deliveryFee: number;
    placedAt: string;
    estimatedDelivery: string;
    trackingSteps: TrackingStep[];
    canCancel: boolean;
    canReorder: boolean;
    feedback?: OrderFeedback;
}

export interface User {
    id: string;
    phone: string;
    name?: string;
}

export interface AuthContextType {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    loading: boolean;
    otpLoading: boolean;
    refreshWarning: boolean;
    sendOtp: (phone: string) => Promise<any>;
    verifyOtp: (phone: string, otp: string) => Promise<any>;
    updateName: (name: string) => Promise<{ error?: string; success?: boolean }>;
    signOut: () => void;
    extendSession: () => void;
}


export interface CartContextType {
    cart: Record<string, number>;
    cartItems: CartItem[];
    addToCart: (productId: string) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export interface CustomerAddress {
    id: string;
    userId: string;
    latitude: number;
    longitude: number;
    flatInfo: string;
    buildingName: string;
    fullAddress: string;
    state: string;
    city: string;
    area: string;
    landmark: string;
    isDefault: boolean;
    label: string;
}

export interface FeedbackData {
    orderId: string;
    rating: number;
    comment: string;
    categories: {
        deliverySpeed: number;
        productQuality: number;
        packaging: number;
        customerService: number;
    };
    wouldRecommend: boolean;
}

export interface OrderData {
    items: CartItem[];
    totalAmount: number;
    deliveryAddress: DeliveryAddress;
    paymentMethod: string;
}

export interface ApiResponse<T = any> {
    success?: boolean;
    error?: string;
    data?: T;
}

export interface DatabaseConfig {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
}

export interface ApiConfig {
    baseUrl: string;
    jwtSecret: string;
}

export interface Coupon {
    couponId: string;
    code: string;
    title: string;
    description: string;
    discountType: 'percentage' | 'fixed' | 'free_delivery';
    discountValue: number;
    minCartValue: number;
    maxDiscount?: number;
    expiryDate: string;
    isActive: boolean;
    usageLimit?: number;
    usedCount?: number;
    category?: string;
    image?: string;
}

// New types for Laboraa Super Market multi-service platform

export interface TamilGroceryCategory {
    id: string;
    nameEnglish: string;
    nameTamil: string;
    image: string;
    icon: string;
    productCount: number;
}

export interface TamilProduct extends Product {
    nameTamil: string;
    descriptionTamil?: string;
    isSubscriptionAvailable?: boolean;
    subscriptionOptions?: SubscriptionOption[];
    weightVariants?: WeightVariant[];
}

export interface SubscriptionOption {
    id: string;
    name: string;
    nameTamil: string;
    duration: string;
    deliveryDays: number[];
    discount: number;
    price: number;
}

export interface WeightVariant {
    id: string;
    weight: string;
    price: number;
    unit: string;
}

export interface MilkSubscription {
    id: string;
    productId: string;
    quantity: string;
    deliveryTime: string;
    selectedDays: number[];
    startDate: string;
    endDate?: string;
    isActive: boolean;
    pricePerMonth: number;
    totalPrice: number;
    deliveryInstructions?: string;
}

export interface FlowerBox {
    id: string;
    name: string;
    nameTamil: string;
    image: string;
    price: number;
    description: string;
    descriptionTamil: string;
    occasionType: string;
    flowers: string[];
    size: 'small' | 'medium' | 'large';
    customizable: boolean;
}

export interface Restaurant {
    id: string;
    name: string;
    nameTamil: string;
    image: string;
    rating: number;
    reviewCount: number;
    cuisine: string[];
    deliveryTime: string;
    deliveryFee: number;
    minOrder: number;
    isOpen: boolean;
    distance: string;
    offers?: string[];
    categories: RestaurantCategory[];
    isCloudKitchen?: boolean;
    isHomemaker?: boolean;
    location?: {
        type: 'restaurant' | 'highway' | 'railway_platform' | 'cloud_kitchen';
        address: string;
    };
}

export interface RestaurantCategory {
    id: string;
    name: string;
    nameTamil: string;
    items: FoodItem[];
}

export interface FoodItem {
    id: string;
    name: string;
    nameTamil: string;
    description: string;
    descriptionTamil: string;
    price: number;
    originalPrice?: number;
    image: string;
    isVeg: boolean;
    spiceLevel: 'mild' | 'medium' | 'spicy';
    preparationTime: string;
    calories?: number;
    allergens?: string[];
    customizations?: Customization[];
    isPopular?: boolean;
    isFitness?: boolean;
    gstPercentage: number;
    gstAmount: number;
    finalPrice: number;
}

export interface Customization {
    id: string;
    name: string;
    nameTamil: string;
    type: 'radio' | 'checkbox';
    required: boolean;
    options: CustomizationOption[];
}

export interface CustomizationOption {
    id: string;
    name: string;
    nameTamil: string;
    price: number;
}

export interface TableBooking {
    id: string;
    restaurantId: string;
    customerName: string;
    customerPhone: string;
    date: string;
    time: string;
    guestCount: number;
    specialRequests?: string;
    status: 'confirmed' | 'pending' | 'cancelled';
}

export interface RideOption {
    id: string;
    type: 'bike' | 'auto' | 'cab';
    name: string;
    nameTamil: string;
    basePrice: number;
    perKmPrice: number;
    estimatedTime: string;
    vehicleDetails: {
        model: string;
        licensePlate: string;
        driverName: string;
        driverPhone: string;
        driverRating: number;
    };
}

export interface RideBooking {
    id: string;
    customerId: string;
    pickupLocation: {
        address: string;
        latitude: number;
        longitude: number;
    };
    dropLocation: {
        address: string;
        latitude: number;
        longitude: number;
    };
    rideType: string;
    estimatedPrice: number;
    actualPrice?: number;
    distance: number;
    estimatedTime: string;
    status: 'searching' | 'assigned' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';
    driverDetails?: RideOption['vehicleDetails'];
    bookingTime: string;
    notes?: string;
}

export interface DeliveryPartner {
    id: string;
    name: string;
    phone: string;
    vehicle: string;
    rating: number;
    isOnline: boolean;
    currentLocation?: {
        latitude: number;
        longitude: number;
    };
}

export interface BulkOrder {
    id: string;
    customerId: string;
    items: CartItem[];
    requestedDeliveryDate: string;
    notes?: string;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready';
    estimatedPrice: number;
    confirmedPrice?: number;
    prePaymentAmount: number;
    prePaymentStatus: 'pending' | 'paid' | 'refunded';
}

export interface MonthlyBasket {
    id: string;
    name: string;
    nameTamil: string;
    description: string;
    descriptionTamil: string;
    items: CartItem[];
    totalPrice: number;
    deliverySchedule: {
        frequency: 'weekly' | 'biweekly' | 'monthly';
        preferredDay: number;
        preferredTime: string;
    };
    customizable: boolean;
    image: string;
}

export interface ReminderNote {
    id: string;
    title: string;
    titleTamil: string;
    description: string;
    descriptionTamil: string;
    reminderTime: string;
    isActive: boolean;
    repeatType: 'once' | 'daily' | 'weekly' | 'monthly';
}

export interface NotificationSettings {
    orderUpdates: boolean;
    promotions: boolean;
    subscriptionReminders: boolean;
    lowWalletBalance: boolean;
    customTone: string;
    language: 'en' | 'ta';
    walletRefillThreshold: number; // Percentage when to remind (e.g., 60%)
}