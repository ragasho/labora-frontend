import type {Category} from "../types";
import { LoadingScreen } from './LoadingScreen';
import { useState, useRef, useEffect } from 'react';
import {
    ShoppingBag,
    Coffee,
    Home,
    Gift,
    Apple,
    Smartphone,
    Monitor,
    Sparkles,
    Shirt,
    Package,
    Milk,
    Beef,
    Flower2,
    UtensilsCrossed,
    Car,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface CategoryGridProps {
    categories: Category[];
    onCategoryClick: (categoryId: string) => void;
    isLoading?: boolean;
    error?: Error | null;
}

// Map category names to icons
const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();

    if (name.includes('all')) return ShoppingBag;
    if (name.includes('cafe') || name.includes('coffee')) return Coffee;
    if (name.includes('home') || name.includes('household')) return Home;
    if (name.includes('toy') || name.includes('gift')) return Gift;
    if (name.includes('fresh') || name.includes('fruit') || name.includes('vegetable')) return Apple;
    if (name.includes('mobile') || name.includes('phone')) return Smartphone;
    if (name.includes('electronic')) return Monitor;
    if (name.includes('beauty') || name.includes('cosmetic')) return Sparkles;
    if (name.includes('fashion') || name.includes('clothing')) return Shirt;
    if (name.includes('grocery') || name.includes('staple') || name.includes('packaged')) return Package;
    if (name.includes('dairy') || name.includes('milk')) return Milk;
    if (name.includes('meat') || name.includes('chicken') || name.includes('fish')) return Beef;
    if (name.includes('flower')) return Flower2;
    if (name.includes('food') || name.includes('restaurant')) return UtensilsCrossed;
    if (name.includes('ride') || name.includes('cab')) return Car;

    return ShoppingBag; // Default icon
};

export function CategoryGrid({ categories, onCategoryClick, isLoading }: CategoryGridProps) {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [showLeftArrow, setShowLeftArrow] = useState(false);
    const [showRightArrow, setShowRightArrow] = useState(true);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    if (isLoading) return <LoadingScreen />;

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategoryId(categoryId);
        onCategoryClick(categoryId);
    };

    // Add "All" category at the beginning
    const allCategories = [
        { id: 'all', name: 'All', nameEnglish: 'All', nameTamil: 'அனைத்தும்', image: '', icon: '🛍️', productCount: 0 },
        ...categories
    ];

   // Check if arrows should be shown
    const checkScrollArrows = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft + clientWidth < scrollWidth - 1);
        }
    };

    // Scroll functions
    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -400, behavior: 'smooth' });
            setTimeout(checkScrollArrows, 300);
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 400, behavior: 'smooth' });
            setTimeout(checkScrollArrows, 300);
        }
    };

    return (
        <section className="py-3 bg-white border-t top-16 z-50 sticky border-gray-100 border-b shadow-md">
            <div className="container mx-auto px-4 relative">
                {/* Left Arrow */}
                {showLeftArrow && (
                    <button
                        onClick={scrollLeft}
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>
                )}

                {/* Right Arrow */}
                {showRightArrow && (
                    <button
                        onClick={scrollRight}
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-50 transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                )}

                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-8"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    onScroll={checkScrollArrows}
                >
                    {allCategories.map((category) => {
                        const isSelected = selectedCategoryId === category.id;
                        const Icon = getCategoryIcon(category.name || '');

                        return (
                            <button
                                key={category.id}
                                onClick={() => handleCategoryClick(category.id)}
                                className={`flex-shrink-0 flex items-center gap-2 px-1 py-2.5 rounded-lg transition-all duration-200 ${
                                    isSelected
                                        ? 'bg-green-50 text-green-700'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`}
                            >
                                <Icon className={`w-5 h-5 ${isSelected ? 'text-green-600' : 'text-gray-500'}`} />
                                <span className="whitespace-nowrap">
                                    {category.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Hide scrollbar CSS */}
            <style>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
