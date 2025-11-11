import {useState, useEffect, useCallback} from "react";
import { Header } from "./components/Header";
import { HeroSection } from "./components/HeroSection";
import { CategoryGrid } from "./components/CategoryGrid";
import { ProductGrid } from "./components/ProductGrid";
import ShoppingCart from "./components/ShoppingCart";
import { AuthModal } from "./components/AuthModal";
import { DailyFreshMeatPage } from './components/DailyFreshMeatPage';
import { PaymentPage } from './components/PaymentPage';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorPage, type ErrorType, type ServiceType } from './components/ErrorPage';
import { WalletPage } from './components/WalletPage';

import { ProductDetailModal } from "./components/ProductDetailModal";
import { OrderHistory } from "./components/OrderHistory";
import { FeedbackModal } from "./components/FeedbackModal";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import type {Product, Order, Category} from "./types";
import { apiRequest } from "./config/apiClient";
import { toast, Toaster } from "sonner";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import {CartProvider, useCart} from "./hooks/CartContext";
import {WowFoodPage} from "./components/WowFoodPage.tsx";
import {FairTripPage} from "./components/FairTripPage.tsx";
import {SubscriptionManagementPage} from "./components/SubscriptionManagementPage.tsx";

// Initialize React Query Client

const queryClient = new QueryClient();

function AppContent() {
    const [language, setLanguage] = useState<'en' | 'ta'>('en');
    const [currentPage, setCurrentPage] = useState<'landing' | 'flowers' | 'milk-subscription' | 'subscriptions' | 'orders' | 'wallet'>('landing');
    const [currentService, setCurrentService] = useState<'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip'>('grocery');
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedOrderForFeedback, setSelectedOrderForFeedback] = useState<Order | null>(null);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isPaymentPageOpen, setIsPaymentPageOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
    const [isSubscriptionPageOpen, setIsSubscriptionPageOpen] = useState(false);
    const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [isWalletOpen, setIsWalletOpen] = useState(false);
    const [searchSet, setSearchSet] = useState(false);
    const [error, setError] = useState<{
        type: ErrorType;
        message?: string;
        code?: string | number;
    } | null>(null);

    const { user } = useAuth();
    const { cartItems, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();

    // Fetch categories using React Query v5
    const { data: categories = [], isFetching, error: categoriesError } = useQuery({
        queryKey: ["categories"],
        queryFn: () => apiRequest<Category[]>("/categories"),
    });

    // Fetch products using React Query v5
    const { data: products = [], isFetching: isProductsFetching, error: productsError } = useQuery({
        queryKey: ["products"],
        queryFn: () => apiRequest<Product[]>("/products"),
    });

    /*useEffect(() => {
        if (isFetching || isProductsFetching) {
            setLoading(true);
        } else {
            const timer = setTimeout(() => {
                setLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [isFetching, isProductsFetching]);

     */

    useEffect(() => {
        const savedService = localStorage.getItem("current_service");
        const savedPage = localStorage.getItem("current_page");
        if (savedService) {
            setCurrentService(JSON.parse(savedService));
        }
        if (savedPage) {
            setCurrentPage(JSON.parse(savedPage));
        }
    }, []);


    const handleServiceChange = useCallback( (service: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip') => {
        localStorage.setItem("current_service", JSON.stringify(service))
        setCurrentService(service);
        // Reset to landing page when switching services
        localStorage.setItem("current_page", JSON.stringify(currentPage));
        setCurrentPage(currentPage);
    }, [currentPage]);

    // Main landing page with service pages
    /*
    const renderServicePage = () => {
        if (currentService === 'freshcarne') {
            return (
                <DailyFreshMeatPage
                    onServiceChange={handleServiceChange}
                    cartItems={cartItems}
                    onAddToCart={(id) => addToCart(id)}
                    onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                    onCartClick={() => setIsCartOpen(true)}
                    onTabChange={(tab) => setCurrentTab(tab as any)}
                />
            );
        }


        if (currentService === 'wowfood') {
            return (
                <WowFoodPage
                    onServiceChange={handleServiceChange}
                    currentService={currentService}
                    language={language}
                />
            );
        }
    }
     */



    const handleCategoryClick = (categoryId: string) => {
        const category = categories.find(c => c.id === categoryId);
        setSelectedCategory(category?.id);
        setSearchQuery(''); // Clear search when selecting category
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

        // normal search
        setSearchSet(true);
        setSearchQuery(query);
        setSelectedCategory(undefined);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchSet(false);
    };


    const handleProductSelect = (product: Product) => {
        // Scroll to product grid and highlight the product
        const productGrid = document.querySelector('[data-section="products"]');
        if (productGrid) {
            productGrid.scrollIntoView({ behavior: 'smooth' });
        }

        // Add to cart with visual feedback
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
        setIsPaymentPageOpen(true);
    };

    const handlePaymentSuccess = () => {
        setIsPaymentPageOpen(false);
        clearCart();
        toast.success('Order placed successfully!');
    };

    const handleSubscriptionClick = () => {
        setIsSubscriptionPageOpen(true);
    }

    const handleOrdersClick = () => {
        if (!user) {
            toast.error('Please sign in to view orders');
            setIsAuthModalOpen(true);
            return;
        }
        setIsOrderHistoryOpen(true);
    };

    const handleWalletClick = () => {
        if (!user) {
            toast.error('Please sign in to access wallet');
            setIsAuthModalOpen(true);
            return;
        }
        setIsWalletOpen(true);
    };

    const handleReorder = (orderItems: Order['items']) => {
        orderItems.forEach(orderItem => {
            for (let i = 0; i < orderItem.quantity; i++) {
                addToCart(orderItem.id);
            }
        });
        setIsOrderHistoryOpen(false);
    };

    const handleFeedbackClick = (order: Order) => {
        setSelectedOrderForFeedback(order);
        setIsFeedbackModalOpen(true);
    };

    const handleFeedbackSubmitted = () => {
        // Optionally refresh order history or show success message
        toast.success('Thank you for your feedback!');
    };

    const getCartQuantity = (productId: string) => {
        return cartItems.find(item => item.id === productId)?.quantity || 0;
    };

    // Error handling functions
    const handleError = (type: ErrorType, message?: string, code?: string | number) => {
        setError({ type, message, code });
        setLoading(false);
    };

    const handleRetry = () => {
        setError(null);
        setLoading(true);
        // Simulate retry logic
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    const handleGoBack = () => {
        setError(null);
        setCurrentPage(currentPage);
    };

    const handleGoHome = () => {
        setError(null);
        setCurrentPage(currentPage);
        setCurrentService(currentService);
    };

    const handleContactSupport = () => {
        // In a real app, this would open support chat or redirect to support page
        toast.info(language === 'en' ? 'Support will contact you shortly!' : 'ஆதரவு விரைவில் உங்களைத் தொடர்பு கொள்ளும்!');
    };

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Handle loading state
    if (loading) {
        return <LoadingScreen
            service={currentService}
            language={language}
        />;
    }

    // Handle error state
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

    if (isSubscriptionPageOpen) {
        return (
            <SubscriptionManagementPage
                onBack={() => setIsSubscriptionPageOpen(false)}
                language={language}
            />
        );
    }

    // Show Daily Fresh & Meat page
    if (currentService === 'freshcarne') {
        return (
            <div className="min-h-screen bg-white">
                <DailyFreshMeatPage
                    cartItems={cartItems}
                    onAddToCart={(id) => addToCart(id)}
                    onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                    onCartClick={() => setIsCartOpen(true)}
                    onServiceChange={handleServiceChange}
                    language={language}
                    currentService={currentService}
                />

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

                {isPaymentPageOpen && (
                    <PaymentPage
                        onClose={() => setIsPaymentPageOpen(false)}
                        cartItems={cartItems}
                        totalAmount={totalAmount}
                        onPaymentSuccess={handlePaymentSuccess}
                    />
                )}

                <Toaster position="top-right" />
            </div>
        );
    }
    if (currentService === 'wowfood') {
        return (
            <WowFoodPage
                onServiceChange={handleServiceChange}
                currentService={currentService}
                language={language}
            />
        );
    }

    if (currentService === 'fairtrip') {
        return (
            <FairTripPage
                onServiceChange={handleServiceChange}
                currentService={currentService}
                language={language}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Header
                categories={categories}
                products={products}
                onServiceChange={handleServiceChange}
                currentService={currentService}
                cartItemsCount={totalCartItems}
                onAuthClick={() => setIsAuthModalOpen(true)}
                onOrdersClick={handleOrdersClick}
                onSearch={handleSearch}
                onWalletClick={handleWalletClick}
                onProductSelect={handleProductSelect}
                onSubscriptionClick={handleSubscriptionClick}
                onCartClick={() => setIsCartOpen(true)}
                language={language}
                setLanguage={setLanguage}
            />

            <main>
                {!searchSet  && (
                    <>
                        <HeroSection />
                        <CategoryGrid
                            categories={categories}
                            onCategoryClick={handleCategoryClick}
                            isLoading={isFetching}
                            error={categoriesError}
                        />
                    </>
                )}

                <div data-section="products">
                    <ProductGrid
                        products={products}
                        categoryName={categoryName}
                        language={language}
                        cartItems={cartItems}
                        selectedCategory={selectedCategory}
                        searchQuery={searchQuery}
                        onAddToCart={(id) => addToCart(id)}
                        onRemoveFromCart={(id) => removeFromCart(id)}
                        onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
                        onProductClick={handleProductClick}
                        onClearCategory={() => setSelectedCategory(undefined)}
                        onClearSearch={handleClearSearch}
                        error={productsError}
                        isLoading={isProductsFetching}
                    />
                </div>
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

            <OrderHistory
                onClose={() => setIsOrderHistoryOpen(false)}
                onReorder={handleReorder}
                onFeedback={handleFeedbackClick}
                isOpen={isOrderHistoryOpen}
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

            {isPaymentPageOpen && (
                <PaymentPage
                    onClose={() => setIsPaymentPageOpen(false)}
                    cartItems={cartItems}
                    totalAmount={totalAmount}
                    onPaymentSuccess={handlePaymentSuccess}
                />
            )}

            {isWalletOpen && (
                <WalletPage onClose={() => setIsWalletOpen(false)} />
            )}

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
                    <AppContent/>
                </CartProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
