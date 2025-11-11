import { ImageWithFallback } from './figma/ImageWithFallback';
import type {Category} from "../types";
import { LoadingScreen } from './LoadingScreen';
import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryGridProps {
    categories: Category[];
    onCategoryClick: (categoryId: string) => void;
    isLoading?: boolean;
    error?: Error | null;
}

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

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            setShowLeftArrow(scrollLeft > 0);
            setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
        }
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300;
            const newScrollLeft = direction === 'left'
                ? scrollContainerRef.current.scrollLeft - scrollAmount
                : scrollContainerRef.current.scrollLeft + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    // Helper function to format category name with line break at "&" or space
    const formatCategoryName = (name: string) => {
        // First priority: break at "&"
        if (name.includes('&')) {
            const parts = name.split('&');
            return (
                <>
                    {parts[0].trim()}&<br />{parts[1].trim()}
                </>
            );
        }

        // Second priority: break at space
        if (name.includes(' ')) {
            const lastSpaceIndex = name.lastIndexOf(' ');
            const firstPart = name.substring(0, lastSpaceIndex);
            const secondPart = name.substring(lastSpaceIndex + 1);
            return (
                <>
                    {firstPart}<br />{secondPart}
                </>
            );
        }

        return name;
    };

    return (
        <section className="py-3 bg-white">
            <div className="container mx-auto px-4">
                {/* Horizontal scrollable container */}
                <div className="relative group">
                    {/* Left Arrow */}
                    {showLeftArrow && (
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-green-200 hover:bg-green-400 shadow-lg rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                            aria-label="Scroll left"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                        </button>
                    )}

                    {/* Right Arrow */}
                    {showRightArrow && (
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-green-200 hover:bg-green-400 shadow-lg rounded-full p-2 transition-all duration-300 opacity-0 group-hover:opacity-100"
                            aria-label="Scroll right"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-700" />
                        </button>
                    )}

                    <div
                        ref={scrollContainerRef}
                        onScroll={handleScroll}
                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((category) => {
                            const isSelected = selectedCategoryId === category.id;
                            return (
                                <button
                                    key={category.id}
                                    onClick={() => handleCategoryClick(category.id)}
                                    className={`flex-shrink-0 flex flex-col items-center min-w-[100px] px-3 py-3 rounded-2xl transition-all duration-300 ${
                                        isSelected
                                            ? 'bg-green-50 border-b-4 border-green-600'
                                            : 'bg-white hover:bg-gray-50'
                                    }`}
                                >
                                    {/* Icon/Image container */}
                                    <div className={`relative w-16 h-16 mb-2 rounded-xl overflow-hidden flex items-center justify-center ${
                                        isSelected ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                        <ImageWithFallback
                                            src={category.image}
                                            alt={category.name}
                                            className="w-16 h-16 object-cover rounded-lg"
                                        />
                                    </div>
                                    {/* Category name */}
                                    <span className={`text-sm text-center leading-tight font-bold ${
                                        isSelected ? 'text-green-700 font-bold' : 'text-gray-700'
                                    }`}>
                                        {formatCategoryName(category.name)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
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
