import { useOutletContext } from "react-router-dom";
import { HeroSection } from "./HeroSection";
import { CategoryGrid } from "./CategoryGrid";
import { ProductGrid } from "./ProductGrid";
import type { Product, Category } from "../types";
import {UnifiedHeader} from "./UnifiedHeader.tsx";

interface GroceryPageContext {
    products: Product[];
    categories: Category[];
    language: 'en' | 'ta';
    cartItems: any[];
    selectedCategory: string | undefined;
    searchQuery: string;
    isFetching: boolean;
    categoriesError: Error | null;
    isProductsFetching: boolean;
    productsError: Error | null;
    searchSet: boolean;
    categoryName: string | undefined;
    handleCategoryClick: (categoryId: string) => void;
    addToCart: (id: string) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    handleProductClick: (product: Product) => void;
    setSelectedCategory: (id: string | undefined) => void;
    handleClearSearch: () => void;
    onCartClick: () => void;
    onServiceChange: (service: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip') => void;
    currentService: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip';
    setLanguage: (lang: 'en' | 'ta') => void;
    onAuthClick: () => void;
    onOrdersClick?: () => void;
    onWalletClick?: () => void;
    onSearch: (params: { query: string; type: "product" | "category" | "recent" | "popular" }) => void;
    onProductSelect: (product: Product) => void;
    totalCartItems: number;
}

export function GroceryPage() {
    const context = useOutletContext<GroceryPageContext>();

    return (
        <>
            <UnifiedHeader
                categories={context.categories}
                products={context.products}
                onServiceChange={context.onServiceChange}
                currentService={context.currentService}
                cartItemsCount={context.totalCartItems}
                onAuthClick={context.onAuthClick}
                onOrdersClick={context.onOrdersClick}
                onSearch={context.onSearch}
                onWalletClick={context.onWalletClick}
                onProductSelect={context.onProductSelect}
                onSubscriptionClick={() => {}}
                onCartClick={context.onCartClick}
                language={context.language}
                setLanguage={context.setLanguage}
            />
            {!context.searchSet && (
                <>
                    <CategoryGrid
                        categories={context.categories}
                        onCategoryClick={context.handleCategoryClick}
                        isLoading={context.isFetching}
                        error={context.categoriesError}
                    />
                    <HeroSection />
                </>
            )}
            <div data-section="products">
                <ProductGrid
                    products={context.products}
                    categoryName={context.categoryName}
                    language={context.language}
                    cartItems={context.cartItems}
                    selectedCategory={context.selectedCategory}
                    searchQuery={context.searchQuery}
                    onAddToCart={context.addToCart}
                    onRemoveFromCart={context.removeFromCart}
                    onUpdateQuantity={context.updateQuantity}
                    onProductClick={context.handleProductClick}
                    onClearCategory={() => context.setSelectedCategory(undefined)}
                    onClearSearch={context.handleClearSearch}
                    error={context.productsError}
                    isLoading={context.isProductsFetching}
                />
            </div>
        </>
    );
}
