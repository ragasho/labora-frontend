import { useOutletContext } from "react-router-dom";
import { HeroSection } from "./HeroSection";
import { CategoryGrid } from "./CategoryGrid";
import { ProductGrid } from "./ProductGrid";
import type { Product, Category } from "../types";

interface HomePageContext {
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
}

export function HomePage() {
    const context = useOutletContext<HomePageContext>();

    return (
        <>
            {!context.searchSet && (
                <>
                    <HeroSection />
                    <CategoryGrid
                        categories={context.categories}
                        onCategoryClick={context.handleCategoryClick}
                        isLoading={context.isFetching}
                        error={context.categoriesError}
                    />
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
