import { useState, useEffect, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ShoppingCart from "./components/ShoppingCart";
import { AuthModal } from "./components/AuthModal";
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorPage, type ErrorType, type ServiceType } from './components/ErrorPage';
import { ProductDetailModal } from "./components/ProductDetailModal";
import { FeedbackModal } from "./components/FeedbackModal";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import type { Product, Order, Category } from "./types";
import { apiRequest } from "./config/apiClient";
import { toast, Toaster } from "sonner";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { CartProvider, useCart } from "./hooks/CartContext";

const queryClient = new QueryClient();

function AppContent() {
    const [language, setLanguage] = useState<'en' | 'ta'>('en');
    const [currentService, setCurrentService] = useState<'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip'>('grocery');
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState<Order | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [searchSet, setSearchSet] = useState(false);
    const [error, setError] = useState<{
        type: ErrorType;
        message?: string;
        code?: string | number;
    } | null>(null);

    const { user } = useAuth();
    const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
    const navigate = useNavigate();

    const { data: categories = [], isFetching, error: categoriesError } = useQuery({
        queryKey: ["categories"],
        queryFn: () => apiRequest<Category[]>("/categories"),
    });

    const { data: products = [], isFetching: isProductsFetching, error: productsError } = useQuery({
        queryKey: ["products"],
        queryFn: () => apiRequest<Product[]>("/products"),
    });

    useEffect(() => {
        const savedService = localStorage.getItem("current_service");
        if (savedService) {
            const service = JSON.parse(savedService);
            setCurrentService(service);
            if (service !== 'grocery') {
                navigate(`/${service}`);
            }
        }
    }, [navigate]);

    const handleServiceChange = useCallback((service: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip') => {
        localStorage.setItem("current_service", JSON.stringify(service));
        setCurrentService(service);
        if (service === 'grocery') {
            navigate('/');
        } else {
            navigate(`/${service}`);
        }
    }, [navigate]);

    const handleCategoryClick = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        setSelectedCategory(category?.id);
        setSearchQuery('');
    };
    const categoryName = categories.find(c => c.id === selectedCategory)?.name;

    const handleSearch = ({ query, type }: { query: string; type: string }) => {
        if (type === 'category') {
            const matchedCategory = categories.find(
                c => c.name.toLowerCase() === query.toLowerCase()
            );
            if (matchedCategory) {
                setSelectedCategory(matchedCategory.id);
                setSearchQuery('');
                setSearchSet(true);
                return;
            }
        }
        setSearchSet(true);
        setSearchQuery(query);
        setSelectedCategory(undefined);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchSet(false);
    };

    const handleProductSelect = (product: Product) => {
        const productGrid = document.querySelector('[data-section="products"]');
        if (productGrid) {
            productGrid.scrollIntoView({ behavior: 'smooth' });
        }
        addToCart(product.id);
        toast.success(`${product.name} added to cart!`);
    };

    const handleProductClick = (product: Product) => {
        setSelectedProduct(product);
        setIsProductDetailOpen(true);
    };

    const handleCheckout = () => {
        if (!user) {
            toast.error('Please sign in to checkout');
            setIsAuthModalOpen(true);
            return;
        }
        setIsCartOpen(false);
        navigate('/payment');
    };

    const handlePaymentSuccess = () => {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/');
    };

    const handleOrdersClick = () => {
        if (!user) {
            toast.error('Please sign in to view orders');
            setIsAuthModalOpen(true);
            return;
        }
        navigate('/orders');
    };

    const handleWalletClick = () => {
        if (!user) {
            toast.error('Please sign in to access wallet');
            setIsAuthModalOpen(true);
            return;
        }
        navigate('/wallet');
    };

    const handleReorder = (orderItems: Order['items']) => {
        orderItems.forEach(orderItem => {
            for (let i = 0; i < orderItem.quantity; i++) {
                addToCart(orderItem.id);
            }
        });
    };

    const handleFeedbackClick = (order: Order) => {
        setSelectedOrderForFeedback(order);
        setIsFeedbackModalOpen(true);
    };

    const handleFeedbackSubmitted = () => {
        toast.success('Thank you for your feedback!');
    };

    const getCartQuantity = (productId: string) => {
        return cartItems.find(item => item.id === productId)?.quantity || 0;
    };

    const handleError = (type: ErrorType, message?: string, code?: string | number) => {
        setError({ type, message, code });
        setLoading(false);
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const handleGoBack = () => {
        setError(null);
        navigate(-1);
    };

    const handleGoHome = () => {
        setError(null);
        navigate('/');
    };

    const handleContactSupport = () => {
        toast.info(language === 'en' ? 'Support will contact you shortly!' : 'ஆதரவு விரைவில் உங்களைத் தொடர்பு கொள்ளும்!');
    };

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) {
        return <LoadingScreen service={currentService} language={language} />;
    }

    if (error) {
        return (
            <ErrorPage
                errorType={error.type}
                service={currentService as ServiceType}
                language={language}
                errorMessage={error.message}
                errorCode={error.code}
                onRetry={handleRetry}
                onGoBack={handleGoBack}
                onGoHome={handleGoHome}
                onContactSupport={handleContactSupport}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <main>
                <Outlet context={{
                    products,
                    categories,
                    language,
                    cartItems,
                    selectedCategory,
                    searchQuery,
                    isFetching,
                    categoriesError,
                    isProductsFetching,
                    productsError,
                    searchSet,
                    categoryName,
                    handleCategoryClick,
                    addToCart,
                    removeFromCart,
                    updateQuantity,
                    handleProductClick,
                    setSelectedCategory,
                    handleClearSearch,
                    onCartClick: () => setIsCartOpen(true),
                    onServiceChange: handleServiceChange,
                    currentService,
                    setLanguage,
                    onAuthClick: () => setIsAuthModalOpen(true),
                    onOrdersClick: handleOrdersClick,
                    onWalletClick: handleWalletClick,
                    onSearch: handleSearch,
                    onProductSelect: handleProductSelect,
                    totalCartItems,
                    onSubscriptionClick: () => navigate('/subscriptions'),
                }} />
            </main>

            <ShoppingCart
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onRemoveFromCart={(id) => removeFromCart(id)}
                onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                onAuthClick={() => setIsAuthModalOpen(true)}
                onCheckout={handleCheckout}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <FeedbackModal
                order={selectedOrderForFeedback}
                isOpen={isFeedbackModalOpen}
                onClose={() => {
                    setIsFeedbackModalOpen(false);
                    setSelectedOrderForFeedback(null);
                }}
                onFeedbackSubmitted={handleFeedbackSubmitted}
            />

            <ProductDetailModal
                product={selectedProduct}
                categoryName={categoryName}
                isOpen={isProductDetailOpen}
                onClose={() => setIsProductDetailOpen(false)}
                quantity={selectedProduct ? getCartQuantity(selectedProduct.id) : 0}
                onAddToCart={() => selectedProduct && addToCart(selectedProduct.id)}
                onRemoveFromCart={() => selectedProduct && removeFromCart(selectedProduct.id)}
                onUpdateQuantity={(q) => selectedProduct && updateQuantity(selectedProduct.id, q)}
                language={language}
            />

            <Toaster position="top-center" />
        </div>
    );
}

export function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <CartProvider>
                    <AppContent />
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
