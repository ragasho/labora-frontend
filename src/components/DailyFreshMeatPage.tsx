import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Star, Plus, Minus, Clock, Shield, Award, ChefHat } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { TabNavigation } from './TabNavigation';
import { UnifiedHeader } from './UnifiedHeader';
import type { Product, CartItem, Category } from '../types';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface DailyFreshMeatPageContext {
    cartItems: CartItem[];
    onAddToCart: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onCartClick: () => void;
    onServiceChange: (service: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip') => void;
    currentService: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip';
    language: 'en' | 'ta';
    setLanguage: (lang: 'en' | 'ta') => void;
    onAuthClick: () => void;
    onOrdersClick?: () => void;
    onWalletClick?: () => void;
    onSearch: (params: { query: string; type: "product" | "category" | "recent" | "popular" }) => void;
    onProductSelect: (product: Product) => void;
    categories: Category[];
    products: Product[];
}

interface MeatVariant {
    id: string;
    name: string;
    priceModifier: number; // percentage modifier
    description: string;
    icon: string;
}

const meatVariants: Record<string, MeatVariant[]> = {
    '13': [ // Chicken Breast
        { id: 'whole', name: 'Whole Piece', priceModifier: 0, description: 'Whole chicken breast piece', icon: '🍗' },
        { id: 'strips', name: 'Cut into Strips', priceModifier: 5, description: 'Cut into thin strips for stir-fry', icon: '🥢' },
        { id: 'cubes', name: 'Cut into Cubes', priceModifier: 8, description: 'Diced into small cubes for curry', icon: '🔲' },
        { id: 'minced', name: 'Minced', priceModifier: 10, description: 'Finely minced for keema', icon: '🍖' }
    ],
    '14': [ // Mutton Leg
        { id: 'bone-in', name: 'Bone-in Pieces', priceModifier: 0, description: 'Traditional bone-in cuts', icon: '🦴' },
        { id: 'boneless', name: 'Boneless Pieces', priceModifier: 15, description: 'Premium boneless cuts', icon: '🥩' },
        { id: 'curry-cut', name: 'Curry Cut', priceModifier: 5, description: 'Cut into curry-sized pieces', icon: '🍛' },
        { id: 'chops', name: 'Chops', priceModifier: 20, description: 'Thick chops for grilling', icon: '🔥' }
    ],
    '15': [ // Fish
        { id: 'whole', name: 'Whole Fish', priceModifier: 0, description: 'Whole cleaned fish', icon: '🐟' },
        { id: 'fillets', name: 'Fillets', priceModifier: 25, description: 'Boneless fillets', icon: '🔪' },
        { id: 'steaks', name: 'Fish Steaks', priceModifier: 15, description: 'Thick steaks with bone', icon: '🥩' },
        { id: 'curry-cut', name: 'Curry Cut', priceModifier: 10, description: 'Cut into curry pieces', icon: '🍛' }
    ],
    '16': [ // Chicken Wings
        { id: 'whole', name: 'Whole Wings', priceModifier: 0, description: 'Complete wing with drumette', icon: '🍗' },
        { id: 'drumettes', name: 'Drumettes Only', priceModifier: 8, description: 'Just the drumette part', icon: '🥁' },
        { id: 'wingettes', name: 'Wingettes Only', priceModifier: 8, description: 'Just the wingette part', icon: '🪶' },
        { id: 'tips-removed', name: 'Tips Removed', priceModifier: 5, description: 'Wings with tips cut off', icon: '✂️' }
    ],
    '17': [ // Prawns
        { id: 'shell-on', name: 'Shell On', priceModifier: 0, description: 'With shell, head removed', icon: '🦐' },
        { id: 'peeled', name: 'Peeled', priceModifier: 15, description: 'Shell removed, tail on', icon: '🍤' },
        { id: 'peeled-deveined', name: 'Peeled & Deveined', priceModifier: 25, description: 'Ready to cook', icon: '✨' },
        { id: 'butterfly', name: 'Butterfly Cut', priceModifier: 30, description: 'Butterfly cut for frying', icon: '🦋' }
    ],
    '18': [ // Boneless Chicken
        { id: 'medium', name: 'Medium Pieces', priceModifier: 0, description: 'Standard curry cut size', icon: '🍖' },
        { id: 'small', name: 'Small Pieces', priceModifier: 3, description: 'Smaller pieces for quick cooking', icon: '🔹' },
        { id: 'large', name: 'Large Pieces', priceModifier: 5, description: 'Larger pieces for roasting', icon: '🔶' },
        { id: 'strips', name: 'Strips', priceModifier: 8, description: 'Cut into strips for stir-fry', icon: '🥢' }
    ]
};

const quantityOptions = [
    { value: '250g', label: '250g', modifier: 0.5, popular: false },
    { value: '500g', label: '500g', modifier: 1, popular: true },
    { value: '750g', label: '750g', modifier: 1.5, popular: false },
    { value: '1kg', label: '1kg', modifier: 2, popular: true }
];

const features = [
    { icon: <Shield className="w-4 h-4" />, text: "Fresh & Safe", color: "text-green-600" },
    { icon: <Award className="w-4 h-4" />, text: "Premium Quality", color: "text-blue-600" },
    { icon: <Clock className="w-4 h-4" />, text: "Cut to Order", color: "text-orange-600" },
    { icon: <ChefHat className="w-4 h-4" />, text: "Chef Recommended", color: "text-purple-600" }
];

export function DailyFreshMeatPage() {
    const {
        cartItems,
        addToCart,
        updateQuantity,
        onCartClick,
        onServiceChange,
        currentService,
        language,
        setLanguage,
        onAuthClick,
        onOrdersClick,
        onWalletClick,
        onSearch,
        onProductSelect,
        categories,
        products: allProducts
    } = useOutletContext<DailyFreshMeatPageContext>();

    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
    const [selectedQuantities, setSelectedQuantities] = useState<Record<string, string>>({});
    const [tempQuantities, setTempQuantities] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [activeTab, setActiveTab] = useState('chicken');

    // Define tabs for meat categories
    const meatTabs = [
        {
            id: 'chicken',
            label: 'Chicken',
            icon: '🐔',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            id: 'mutton',
            label: 'Mutton',
            icon: '🐑',
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            id: 'seafood',
            label: 'Seafood',
            icon: '🐟',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'marinated',
            label: 'Marinated',
            icon: '🌶️',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            id: 'ready-to-cook',
            label: 'Ready to Cook',
            icon: '🍳',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        }
    ];

    const allMeatProducts = allProducts.filter(product => product.category === 'Daily Fresh & Meat');

    // Define meat categories based on product types
    const meatCategories = [
        { id: 'chicken', name: 'Chicken', icon: '🐔', products: ['Fresh Chicken Breast', 'Chicken Wings', 'Boneless Chicken Curry Cut'] },
        { id: 'mutton', name: 'Mutton & Lamb', icon: '🐑', products: ['Mutton Leg Cut'] },
        { id: 'seafood', name: 'Fish & Seafood', icon: '🐟', products: ['Fresh Fish (Pomfret)', 'Prawns (Large)'] },
    ];

    // Filter meat products based on search query, selected category, and active tab
    const meatProducts = allMeatProducts.filter(product => {
        // First filter by search query
        const matchesSearch = !searchQuery.trim() || (
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Then filter by selected category
        const matchesCategory = !selectedCategory ||
            meatCategories.find(cat => cat.id === selectedCategory)?.products.includes(product.name);

        // Filter by active tab
        let matchesTab = true;
        if (activeTab !== 'chicken') { // Default tab shows all, others filter specifically
            switch (activeTab) {
                case 'mutton':
                    matchesTab = product.name.toLowerCase().includes('mutton') ||
                        product.name.toLowerCase().includes('lamb') ||
                        product.name.toLowerCase().includes('goat');
                    break;
                case 'seafood':
                    matchesTab = product.name.toLowerCase().includes('fish') ||
                        product.name.toLowerCase().includes('prawn') ||
                        product.name.toLowerCase().includes('crab') ||
                        product.name.toLowerCase().includes('seafood');
                    break;
                case 'marinated':
                    matchesTab = product.name.toLowerCase().includes('marinated') ||
                        product.description?.toLowerCase().includes('marinated') ||
                        product.features?.some(f => f.toLowerCase().includes('marinated'));
                    break;
                case 'ready-to-cook':
                    matchesTab = product.name.toLowerCase().includes('ready') ||
                        product.description?.toLowerCase().includes('ready to cook') ||
                        product.features?.some(f => f.toLowerCase().includes('ready'));
                    break;
                default:
                    matchesTab = product.name.toLowerCase().includes('chicken') ||
                        product.name.toLowerCase().includes('poultry');
            }
        }

        return matchesSearch && matchesCategory && matchesTab;
    });

    const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const getCartQuantity = (productId: string) => {
        return cartItems.find(item => item.id === productId)?.quantity || 0;
    };

    const getAdjustedPrice = (product: Product, variant?: string, quantity?: string) => {
        let price = product.price;

        // Apply variant modifier
        if (variant) {
            const variants = meatVariants[product.id];
            const selectedVariant = variants?.find(v => v.id === variant);
            if (selectedVariant) {
                price = price * (1 + selectedVariant.priceModifier / 100);
            }
        }

        // Apply quantity modifier
        if (quantity) {
            const quantityOption = quantityOptions.find(q => q.value === quantity);
            if (quantityOption) {
                price = price * quantityOption.modifier;
            }
        }

        return Math.round(price);
    };

    const handleVariantChange = (productId: string, variant: string) => {
        setSelectedVariants(prev => ({ ...prev, [productId]: variant }));
    };

    const handleQuantityChange = (productId: string, quantity: string) => {
        setSelectedQuantities(prev => ({ ...prev, [productId]: quantity }));
    };

    const handleTempQuantityChange = (productId: string, change: number) => {
        setTempQuantities(prev => ({
            ...prev,
            [productId]: Math.max(0, (prev[productId] || 1) + change)
        }));
    };

    const handleAddToCart = (product: Product) => {
        addToCart(product.id);
        setTempQuantities(prev => ({ ...prev, [product.id]: 1 }));
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        if (query.trim()) {
            setSelectedCategory(''); // Clear category when searching
        }
    };

    const handleProductSelect = (product: Product) => {
        // Add to cart with visual feedback when product is selected from search
        handleAddToCart(product);
    };

    const handleCategorySelect = (categoryId: string) => {
        setSelectedCategory(categoryId);
        setSearchQuery(''); // Clear search when selecting category
    };

    const handleClearFilters = () => {
        setSelectedCategory('');
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50">
            {/* Unified Header */}
            <UnifiedHeader
                onServiceChange={onServiceChange}
                currentService={currentService}
                categories={categories}
                products={allProducts}
                cartItemsCount={totalCartItems}
                onCartClick={onCartClick}
                onWalletClick={onWalletClick}
                onAuthClick={onAuthClick}
                onOrdersClick={onOrdersClick}
                onSearch={onSearch}
                onProductSelect={onProductSelect}
                language={language}
                setLanguage={setLanguage}
                showSubscription={false}
            />

            {/* Meat Category Navigation */}
            <div className="container mx-auto px-4 pt-4 pb-4">
                <TabNavigation
                    tabs={meatTabs}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    language="en"
                />
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-pink-600 to-orange-600 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative px-6 py-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">Premium Fresh Meat & Seafood</h2>
                    <p className="text-red-100 mb-6 max-w-2xl mx-auto">
                        Hand-picked, fresh daily. Cut to perfection by our expert butchers.
                        Delivered to your doorstep with guaranteed freshness.
                    </p>

                    {/* Features */}
                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                <div className="text-white">{feature.icon}</div>
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 rounded-t-3xl"></div>
            </div>

            {/* Content */}
            <div className="px-4 py-8 max-w-6xl mx-auto">
                {/* Category Navigation */}
                {!searchQuery && (
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-800">Browse by Category</h2>
                            {selectedCategory && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleClearFilters}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
                                >
                                    ← View All Categories
                                </Button>
                            )}
                        </div>

                        {!selectedCategory ? (
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                {meatCategories.map((category) => (
                                    <Card
                                        key={category.id}
                                        className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-md"
                                        onClick={() => handleCategorySelect(category.id)}
                                    >
                                        <div className="p-6 text-center">
                                            <div className="text-4xl mb-3">{category.icon}</div>
                                            <h3 className="font-semibold text-gray-800">{category.name}</h3>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {category.products.length} item{category.products.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="text-3xl">
                                        {meatCategories.find(cat => cat.id === selectedCategory)?.icon}
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-800">
                                            {meatCategories.find(cat => cat.id === selectedCategory)?.name}
                                        </h2>
                                        <p className="text-gray-600">
                                            {meatProducts.length} item{meatProducts.length !== 1 ? 's' : ''} available
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Search Results Header */}
                {searchQuery && (
                    <div className="mb-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                Search results for "{searchQuery}"
                                <span className="text-gray-500 font-normal ml-2">
                  ({meatProducts.length} item{meatProducts.length !== 1 ? 's' : ''})
                </span>
                            </h2>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleClearFilters}
                                className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                                Clear Search
                            </Button>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
                    {meatProducts.map((product) => {
                        const cartQuantity = getCartQuantity(product.id);
                        const selectedVariant = selectedVariants[product.id];
                        const selectedQuantity = selectedQuantities[product.id] || '500g';
                        const tempQty = tempQuantities[product.id] || 1;
                        const adjustedPrice = getAdjustedPrice(product, selectedVariant, selectedQuantity);
                        const variants = meatVariants[product.id] || [];

                        return (
                            <Card key={product.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                                <div className="relative">
                                    {/* Product Image */}
                                    <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                                        <ImageWithFallback
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        />

                                        {/* Overlay badges */}
                                        <div className="absolute top-3 left-3 flex gap-2">
                                            <Badge className="bg-green-500 text-white text-xs">
                                                Fresh Today
                                            </Badge>
                                            {product.discount && (
                                                <Badge className="bg-red-500 text-white text-xs">
                                                    {product.discount}% OFF
                                                </Badge>
                                            )}
                                        </div>

                                        {/* Rating */}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span className="text-xs font-medium">{product.ratings?.average}</span>
                                        </div>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6 space-y-4">
                                        {/* Header */}
                                        <div className="space-y-2">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-800 leading-tight">{product.name}</h3>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-0">
                                                            {product.brand}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
                                        </div>

                                        {/* Features */}
                                        <div className="flex flex-wrap gap-1">
                                            {product.features?.slice(0, 3).map((feature, index) => (
                                                <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                                                    {feature}
                                                </Badge>
                                            ))}
                                        </div>

                                        {/* Quantity Selection */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700">Weight</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {quantityOptions.map((option) => (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => handleQuantityChange(product.id, option.value)}
                                                        className={`relative p-2 text-xs rounded-lg border transition-all ${
                                                            selectedQuantity === option.value
                                                                ? 'border-red-500 bg-red-50 text-red-700'
                                                                : 'border-gray-200 bg-white text-gray-600 hover:border-red-300 hover:bg-red-50'
                                                        }`}
                                                    >
                                                        {option.label}
                                                        {option.popular && (
                                                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Variant Selection */}
                                        {variants.length > 0 && (
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Cut & Preparation</label>
                                                <Select
                                                    value={selectedVariant}
                                                    onValueChange={(value) => handleVariantChange(product.id, value)}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Choose your cut" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {variants.map((variant) => (
                                                            <SelectItem key={variant.id} value={variant.id}>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg">{variant.icon}</span>
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{variant.name}</span>
                                                                        <span className="text-xs text-gray-500">
                                      {variant.description}
                                                                            {variant.priceModifier > 0 && ` (+${variant.priceModifier}%)`}
                                    </span>
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}

                                        {/* Price and Add to Cart */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-2xl font-bold text-gray-900">₹{adjustedPrice}</span>
                                                        {product.originalPrice && adjustedPrice < product.originalPrice && (
                                                            <span className="text-sm text-gray-500 line-through">
                                ₹{Math.round(product.originalPrice * (selectedQuantities[product.id] ? quantityOptions.find(q => q.value === selectedQuantities[product.id])?.modifier || 1 : 1))}
                              </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-500">for {selectedQuantity}</p>
                                                </div>
                                            </div>

                                            {/* Add to Cart Controls */}
                                            {cartQuantity > 0 ? (
                                                <div className="flex items-center justify-center gap-3 p-2 bg-red-50 rounded-lg">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(product.id, cartQuantity - 1)}
                                                        className="w-8 h-8 p-0 border-red-200 hover:bg-red-100"
                                                    >
                                                        <Minus className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                    <span className="min-w-12 text-center font-semibold text-red-700">{cartQuantity}</span>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => updateQuantity(product.id, cartQuantity + 1)}
                                                        className="w-8 h-8 p-0 border-red-200 hover:bg-red-100"
                                                    >
                                                        <Plus className="w-4 h-4 text-red-600" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <div className="flex items-center justify-center gap-2 p-1 bg-gray-50 rounded-lg">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleTempQuantityChange(product.id, -1)}
                                                            className="w-7 h-7 p-0"
                                                            disabled={tempQty <= 1}
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        <span className="min-w-8 text-center text-sm font-medium">{tempQty}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleTempQuantityChange(product.id, 1)}
                                                            className="w-7 h-7 p-0"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                    <Button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        {/* Storage Instructions */}
                                        {product.storageInstructions && (
                                            <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                                                <p className="text-xs text-blue-800 flex items-start gap-2">
                                                    <Shield className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                                    {product.storageInstructions}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>

                {/* Empty State */}
                {meatProducts.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🥩</div>
                        {searchQuery ? (
                            <>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No results found</h3>
                                <p className="text-gray-500 mb-4">
                                    No meat products match your search for "{searchQuery}"
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                    className="hover:bg-red-50 hover:border-red-200"
                                >
                                    Clear search
                                </Button>
                            </>
                        ) : selectedCategory ? (
                            <>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products in this category</h3>
                                <p className="text-gray-500 mb-4">
                                    No products found in "{meatCategories.find(cat => cat.id === selectedCategory)?.name}"
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={handleClearFilters}
                                    className="hover:bg-red-50 hover:border-red-200"
                                >
                                    View all categories
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No meat products available</h3>
                                <p className="text-gray-500">Check back later for fresh meat and seafood.</p>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
