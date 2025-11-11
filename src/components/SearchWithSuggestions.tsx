import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import type { Product, Category } from '../types';

interface SearchWithSuggestionsProps {
    categories?: Category[];
    products?: Product[];
    onSearch: (params: { query: string; type: 'product' | 'category' | 'recent' | 'popular' }) => void;
    onProductSelect?: (product: Product) => void;
    className?: string;
    placeholder?: string;
}

interface SearchSuggestion {
    type: 'product' | 'category' | 'recent' | 'popular';
    id: string;
    title: string;
    subtitle?: string;
    category?: string;
    icon?: string;
}

const POPULAR_SEARCHES = [
    'Tomatoes', 'Milk', 'Apples', 'Bread', 'Eggs', 'Rice', 'Onions', 'Bananas'
];

export function SearchWithSuggestions({
                                          categories,
                                          products,
                                          onSearch,
                                          onProductSelect,
                                          className = '',
                                          placeholder = 'Search for products...',
                                      }: SearchWithSuggestionsProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
    const [dropdownVisible, setDropdownVisible] = useState(false);

    // Load recent searches from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('quickmart-recent-searches');
        if (saved) {
            try {
                setRecentSearches(JSON.parse(saved));
            } catch (e) {
                console.error('Error loading recent searches:', e);
            }
        }
    }, []);

    // Generate suggestions
    useEffect(() => {
        const productList = products || [];
        const categoryList = categories || [];

        if (!query.trim()) {
            const defaultSuggestions: SearchSuggestion[] = [];
            const seenTitles = new Set<string>();

            // Recent
            recentSearches.slice(0, 3).forEach((search, index) => {
                if (!seenTitles.has(search.toLowerCase())) {
                    seenTitles.add(search.toLowerCase());
                    defaultSuggestions.push({
                        type: 'recent',
                        id: `recent-${index}-${search}`,
                        title: search,
                        icon: '🕐'
                    });
                }
            });

            // Popular
            POPULAR_SEARCHES.slice(0, 5).forEach((search, index) => {
                if (!seenTitles.has(search.toLowerCase())) {
                    seenTitles.add(search.toLowerCase());
                    defaultSuggestions.push({
                        type: 'popular',
                        id: `popular-${index}-${search}`,
                        title: search,
                        icon: '🔥'
                    });
                }
            });

            setSuggestions(defaultSuggestions);
            return;
        }

        const searchLower = query.toLowerCase();
        const newSuggestions: SearchSuggestion[] = [];
        const seenTitles = new Set<string>();

        // Products
        productList.filter(p =>
            p.name.toLowerCase().includes(searchLower) ||
            p.categoryId?.toLowerCase().includes(searchLower)
        ).slice(0, 4).forEach(p => {
            const key = `product-${p.name.toLowerCase()}`;
            if (!seenTitles.has(key)) {
                seenTitles.add(key);
                newSuggestions.push({
                    type: 'product',
                    id: `${p.id}`,
                    title: p.name,
                    subtitle: `₹${p.price} • ${p.unit}`,
                    category: p.categoryId
                });
            }
        });

        // Categories
        categoryList.filter(c =>
            c.name.toLowerCase().includes(searchLower)
        ).slice(0, 2).forEach(c => {
            const key = `category-${c.name.toLowerCase()}`;
            if (!seenTitles.has(key)) {
                seenTitles.add(key);
                newSuggestions.push({
                    type: 'category',
                    id: `${c.id}`,
                    title: c.name,
                    subtitle: 'Browse category',
                    icon: c.icon
                });
            }
        });

        setSuggestions(newSuggestions);
    }, [query, recentSearches, products, categories]);

    // Handle search execution
    const handleSearch = (searchTerm: string, type: SearchSuggestion['type']) => {
        if (!searchTerm.trim()) return;

        if(type !== 'category') {
            const newRecent = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
            setRecentSearches(newRecent);
            localStorage.setItem('quickmart-recent-searches', JSON.stringify(newRecent));
        }

        onSearch({ query: searchTerm, type });
        setQuery(searchTerm);
        setIsOpen(false);
        inputRef.current?.blur();
    };

    // Handle suggestion click
    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        if (suggestion.type === 'product') {
            const product = (products??[]).find(p => p.id === suggestion.id.replace('product-', ''));
            if (product && onProductSelect) {
                onProductSelect(product);
            }
        }
        handleSearch(suggestion.title, suggestion.type);
    };

    // Clear recent searches
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('quickmart-recent-searches');
    };

    // Close suggestions on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Dynamically adjust dropdown size and position based on search bar width
    useEffect(() => {
        if (!isOpen || !dropdownRef.current || !searchRef.current) return;

        const adjustDropdownPosition = () => {
            const container = searchRef.current;
            if (!container) return;

            const containerRect = container.getBoundingClientRect();
            const containerWidth = containerRect.width;
            const viewportWidth = window.innerWidth;

            // Minimum dropdown width for readability
            const minDropdownWidth = 320;
            // Maximum dropdown width
            const maxDropdownWidth = 480;

            let dropdownWidth: number;
            let leftOffset = 10;

            if (containerWidth >= minDropdownWidth) {
                // Search bar is wide enough: dropdown matches search bar width (up to max)
                dropdownWidth = Math.min(containerWidth, maxDropdownWidth);
                leftOffset = 0; // Align with search bar left edge
            } else {
                // Search bar is narrower: use minimum width and center the dropdown
                dropdownWidth = Math.min(minDropdownWidth, viewportWidth - 32);
                // Center the dropdown below the search bar
                leftOffset = (containerWidth - dropdownWidth) / 2;

                // Ensure dropdown doesn't overflow viewport
                const containerLeft = containerRect.left;
                const dropdownLeft = containerLeft + leftOffset;
                const dropdownRight = dropdownLeft + dropdownWidth;

                if (dropdownLeft < 16) {
                    // Too far left, adjust
                    leftOffset = 16 - containerLeft;
                } else if (dropdownRight > viewportWidth - 16) {
                    // Too far right, adjust
                    leftOffset = (viewportWidth - 16) - containerLeft - dropdownWidth;
                }
            }

            setDropdownStyle({
                width: `${dropdownWidth}px`,
                left: `${leftOffset}px`,
                right: 'auto'
            });
        };

        // Adjust position immediately and on resize
        adjustDropdownPosition();

        // Show dropdown with slight delay for smooth animation
        const showTimer = setTimeout(() => setDropdownVisible(true), 50);

        const handleResize = () => adjustDropdownPosition();
        window.addEventListener('resize', handleResize);

        return () => {
            clearTimeout(showTimer);
            window.removeEventListener('resize', handleResize);
            setDropdownVisible(false);
        };
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && query.trim()) {
            e.preventDefault();
            handleSearch(query, 'recent');
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    return (
        <div ref={searchRef} className={`relative search-container ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
                <Input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        setIsOpen(true);
                        setDropdownVisible(false); // Reset for smooth reopening
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="pl-12 bg-gray-50 border-0 h-12 placeholder:text-lg"
                />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    ref={dropdownRef}
                    style={{
                        ...dropdownStyle,
                        opacity: dropdownVisible ? 1 : 0,
                        transform: dropdownVisible ? 'scale(1)' : 'scale(0.98)'
                    }}
                    className="absolute top-full z-50 mt-1 max-h-1000 overflow-y-auto bg-gradient-to-b from-white to-gray-50
                               rounded-lg search-dropdown-adaptive">
                    {suggestions.length > 0 ? (
                        <>
                            {!query.trim() && recentSearches.length > 0 && (
                                <div className="p-3 border-b flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-gray-700">Recent Searches</h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearRecentSearches}
                                        className="text-xs text-gray-500 hover:text-gray-700"
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}

                            {!query.trim() && suggestions.some(s => s.type === 'popular') && (
                                <div className="p-3 border-b flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-4 h-4 text-gray-500" />
                                    <h4 className="text-sm font-medium text-gray-700">Popular Searches</h4>
                                </div>
                            )}

                            <div className="py-2">
                                {suggestions.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleSuggestionClick(s)}
                                        className="w-full px-3 sm:px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2 sm:gap-3 min-h-[3rem]"
                                    >
                                        <div className="flex-shrink-0">
                                            {s.type === 'product' && (
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                                                    <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600" />
                                                </div>
                                            )}
                                            {s.type === 'category' && (
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm sm:text-lg">
                                                    {s.icon}
                                                </div>
                                            )}
                                            {s.type === 'recent' && (
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                                                </div>
                                            )}
                                            {s.type === 'popular' && (
                                                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 rounded-full flex items-center justify-center">
                                                    <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 pr-2">
                                            <p className="text-sm font-medium text-gray-900 truncate leading-5">{s.title}</p>
                                            {s.subtitle && <p className="text-xs text-gray-500 truncate leading-4 mt-0.5">{s.subtitle}</p>}
                                        </div>

                                        {/* Badge for UI polish - hide on very small screens */}
                                        {s.type === 'product' && (
                                            <Badge variant="secondary" className="text-xs bg-emerald-50 hidden sm:inline-flex shrink-0">
                                                Product
                                            </Badge>
                                        )}
                                        {s.type === 'category' && (
                                            <Badge variant="secondary" className="text-xs bg-blue-50 hidden sm:inline-flex shrink-0">
                                                Category
                                            </Badge>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </>
                    ) : query.trim() ? (
                        <div className="p-4 text-center text-gray-500">
                            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No results found for "{query}"</p>
                            <p className="text-xs mt-1">Try searching for something else</p>
                        </div>
                    ) : (
                        <div className="p-4 text-center text-gray-500">
                            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">Start typing to search products</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
