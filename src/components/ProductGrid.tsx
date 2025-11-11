import {ProductCard} from './ProductCard';
import type {CartItem, Product} from '../types';
import { Button } from './ui/button';
import { LoadingScreen } from './LoadingScreen';

interface ProductGridProps {
  products: Product[];
  language: 'en' | 'ta';
  cartItems: CartItem[];
  categoryName?: string;
  selectedCategory?: string;
  searchQuery?: string;
  onAddToCart: (productId: string) => void;
  onRemoveFromCart: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onProductClick?: (product: Product) => void;
  onClearCategory?: () => void;
  onClearSearch?: () => void;
  error?: Error | null;
  isLoading?: boolean;
}

export function ProductGrid({
  products, categoryName, language, cartItems,
  selectedCategory,
  searchQuery,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
  onProductClick, onClearCategory, onClearSearch,
  isLoading
}: ProductGridProps) {
  if (isLoading) return <LoadingScreen />;

  // Filter products based on category and search query
    const filteredProducts = products.filter(product => {
        const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
        const matchesSearch = !searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Get quantity from cartItems
    const getCartQuantity = (productId: string) => {
        const item = cartItems.find(ci => ci.id === productId);
        return item ? item.quantity : 0;
    };


    if (filteredProducts.length === 0) {
    return (
      <section className="py-6 px-4">
        <div className="container mx-auto">
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <div className="text-4xl text-gray-400">🔍</div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              {searchQuery ? `No results for "${searchQuery}"` : `No products in ${categoryName}`}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchQuery
                ? "Try searching with different keywords or browse our categories."
                : "Check out other categories for amazing products."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 px-12">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery
                ? `Search results for "${searchQuery}"`
                : selectedCategory
                  ? categoryName
                  : 'All Products'
              }
            </h2>
            <p className="text-gray-600 mt-1">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClearSearch?.();
              }}
            >
              {language === 'en' ? 'Back' : 'பின் செல்'}
            </Button>
          )}
          {selectedCategory && !searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClearCategory?.();
              }}
            >
              {language === 'en' ? 'View All' : 'அனைத்தையும் பார்க்கவும்'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              quantity={getCartQuantity(product.id)}
              onAddToCart={() => onAddToCart(product.id)}
              onRemoveFromCart={() => onRemoveFromCart(product.id)}
              onUpdateQuantity={onUpdateQuantity}
              onProductClick={onProductClick ? onProductClick : undefined}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
}