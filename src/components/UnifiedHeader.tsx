// UnifiedHeader.tsx - Unified header for all services
import { useState, useEffect, useCallback } from "react";
import { MapPin, ShoppingCart, User, LogOut, Package, Wallet, CalendarDays } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SearchWithSuggestions } from "./SearchWithSuggestions";
import { ServiceSelector } from "./ServiceSelector";
import { useAuth } from "../hooks/useAuth";
import type { Category, Product, CustomerAddress } from "../types";
import { LocationModal } from "./LocationModal";
import { toast } from "sonner";

interface UnifiedHeaderProps {
    onServiceChange?: (service: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip') => void;
    currentService: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip';
    categories: Category[];
    products: Product[];
    cartItemsCount: number;
    onCartClick: () => void;
    onWalletClick?: () => void;
    onAuthClick: () => void;
    onOrdersClick?: () => void;
    onSearch: (params: { query: string; type: "product" | "category" | "recent" | "popular" }) => void;
    onProductSelect: (product: Product) => void;
    onSubscriptionClick?: () => void;
    language: 'en' | 'ta';
    setLanguage: (lang: 'en' | 'ta') => void;
    showSubscription?: boolean; // Control whether to show subscription button
}

export function UnifiedHeader({
                                  onServiceChange,
                                  currentService,
                                  categories,
                                  products,
                                  cartItemsCount,
                                  onCartClick,
                                  onAuthClick,
                                  onOrdersClick,
                                  onWalletClick,
                                  onSearch,
                                  onProductSelect,
                                  onSubscriptionClick,
                                  language,
                                  setLanguage,
                                  showSubscription = true
                              }: UnifiedHeaderProps) {
    const { user, signOut } = useAuth();
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<CustomerAddress | null>(null);

    // Get service-specific styling
    const getServiceColors = () => {
        switch (currentService) {
            case 'grocery':
                return {
                    gradient: 'from-green-200 to-green-50',
                    iconBg: 'bg-green-500',
                    textColor: 'text-green-600',
                    icon: '🛒',
                    name: language === 'en' ? 'Laboraa Grocery' : 'லபோராா கிராசரி',
                    tagline: language === 'en' ? 'Fresh groceries & daily essentials' : 'புதிய கிராசரி & தினசரி தேவைகள்'
                };
            case 'freshcarne':
                return {
                    gradient: 'from-red-200 to-red-50',
                    iconBg: 'bg-red-500',
                    textColor: 'text-red-600',
                    icon: '🥩',
                    name: language === 'en' ? 'FreshCarne' : 'ஃப்ரெஷ்கார்னே',
                    tagline: language === 'en' ? 'Premium fresh meat & seafood' : 'சிறந்த புதிய இறைச்சி & கடல் உணவு'
                };
            case 'wowfood':
                return {
                    gradient: 'from-orange-200 to-orange-50',
                    iconBg: 'bg-orange-500',
                    textColor: 'text-orange-600',
                    icon: '🍕',
                    name: language === 'en' ? 'Wow Food' : 'வாவ் உணவு',
                    tagline: language === 'en' ? 'Delicious food delivered hot' : 'சுவையான உணவு சூடாக வழங்கப்படும்'
                };
            case 'fairtrip':
                return {
                    gradient: 'from-blue-200 to-blue-50',
                    iconBg: 'bg-blue-500',
                    textColor: 'text-blue-600',
                    icon: '🚗',
                    name: language === 'en' ? 'Fair Trip' : 'ஃபேர் டிரிப்',
                    tagline: language === 'en' ? 'Safe & affordable rides' : 'பாதுகாப்பான & மலிவு பயணங்கள்'
                };
            default:
                return {
                    gradient: 'from-green-200 to-green-50',
                    iconBg: 'bg-green-500',
                    textColor: 'text-green-600',
                    icon: '🛒',
                    name: language === 'en' ? 'Laboraa Grocery' : 'லபோராா கிராசரி',
                    tagline: language === 'en' ? 'Fresh groceries & daily essentials' : 'புதிய கிராசரி & தினசரி தேவைகள்'
                };
        }
    };

    const serviceColors = getServiceColors();

    const handleLocationClick = () => {
        if (!user) {
            onAuthClick();
            toast.info("Please sign in to select a location.");
            return;
        }
        setIsLocationModalOpen(true);
    };

    const syncLocationFromStorage = useCallback(() => {
        const savedLocation = localStorage.getItem("selected_location");
        setSelectedLocation(savedLocation ? JSON.parse(savedLocation) : null);
    }, []);

    // Sync location from storage on mount, when user changes, or when another component updates it
    useEffect(() => {
        if (user) {
            syncLocationFromStorage();
        } else {
            setSelectedLocation(null); // Clear location on logout
        }

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "selected_location" && user) {
                syncLocationFromStorage();
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [user, syncLocationFromStorage]);

    const formatPhoneNumber = (phone: string): string => {
        if (phone.startsWith("+91") && phone.length === 13) {
            const number = phone.slice(3);
            return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
        }
        return phone;
    };

    return (
        <header className={`sticky top-0 z-50 bg-gradient-to-b ${serviceColors.gradient}`}>
            <div className="container mx-auto px-2 py-2">
                <div className="flex items-center justify-between gap-1 md:gap-1">
                    {/* Service Selector */}
                    {onServiceChange ? (
                        <ServiceSelector
                            currentService={currentService}
                            onServiceChange={onServiceChange}
                            language={language}
                            variant="dropdown"
                        />
                    ) : (
                        <div className="flex items-center gap-1">
                            <div className={`${serviceColors.iconBg} text-white p-2 rounded-lg`}>
                                <div className="w-6 h-6 flex items-center justify-center">{serviceColors.icon}</div>
                            </div>
                            <div>
                                <h1 className={`text-lg ${serviceColors.textColor}`}>
                                    {serviceColors.name}
                                </h1>
                                <p className="text-xs text-gray-500">
                                    {serviceColors.tagline}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Location Button - Only show for grocery and freshcarne */}
                    {(currentService === 'grocery' || currentService === 'freshcarne') && (
                        <Button
                            className="flex flex-col items-start p-3 hover:shadow-lg transition-all"
                            onClick={handleLocationClick}
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <MapPin className={`w-5 h-5 ${serviceColors.textColor}`} />
                                <span className="text-sm text-gray-500 truncate">
                                    {selectedLocation ? [selectedLocation.area, selectedLocation.city].filter(Boolean).join(', ') : "Choose Location"}
                                </span>
                            </div>
                        </Button>
                    )}

                    {/* Location Modal */}
                    <LocationModal
                        isOpen={isLocationModalOpen}
                        onClose={() => setIsLocationModalOpen(false)}
                        selectedLocation={selectedLocation || undefined}
                        onLocationChange={syncLocationFromStorage}
                    />

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-4 hidden md:block">
                        <SearchWithSuggestions
                            categories={categories}
                            products={products}
                            onSearch={onSearch}
                            onProductSelect={onProductSelect}
                        />
                    </div>

                    {/* Right side buttons container */}
                    <div className="flex items-center gap-1 md:gap-1">
                        {/* Language Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                            className="px-2 md:px-2 text-xl font-bold"
                        >
                            {language === 'en' ? 'த' : 'EN'}
                        </Button>

                        {/* Subscription Button - Only show for grocery service */}
                        {showSubscription && currentService === 'grocery' && onSubscriptionClick && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={onSubscriptionClick}
                                className="flex items-center gap-1 md:gap-1 px-2 md:px-2"
                            >
                                <CalendarDays className="size-6" />
                                <span className="hidden xl:inline text-lg">{language === 'en' ? 'Subscriptions' : 'சந்தாக்கள்'}</span>
                            </Button>
                        )}

                        {/* User Dropdown */}
                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-12 w-12">
                                        <User className="size-6" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 bg-white">
                                    <div className="px-3 py-2 border-b">
                                        <p className="font-medium">{user.name || "User"}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatPhoneNumber(user.phone)}
                                        </p>
                                    </div>

                                    {onWalletClick && (
                                        <DropdownMenuItem onClick={onWalletClick}>
                                            <Wallet className="w-5 h-5 mr-2" />
                                            {language === 'en' ? 'My Wallet' : 'என் பணப்பை'}
                                        </DropdownMenuItem>
                                    )}

                                    {onOrdersClick && (
                                        <DropdownMenuItem onClick={onOrdersClick}>
                                            <Package className="w-4 h-4 mr-2" />
                                            {language === 'en' ? 'My Orders' : 'என் ஆர்டர்கள்'}
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={signOut}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        {language === 'en' ? 'Sign Out' : 'வெளியேறு'}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" className="h-12 w-12" onClick={onAuthClick}>
                                <User className="size-6" />
                            </Button>
                        )}

                        {/* Cart Button */}
                        <Button
                            variant="ghost"
                            className="relative h-12 w-12"
                            onClick={onCartClick}
                        >
                            <ShoppingCart className="size-6" />
                            {cartItemsCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-black text-xs"
                                >
                                    {cartItemsCount}
                                </Badge>
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Search Bar */}
                <div className="mt-3 md:hidden">
                    <SearchWithSuggestions
                        categories={categories}
                        products={products}
                        onSearch={onSearch}
                        onProductSelect={onProductSelect}
                        placeholder="Search for products..."
                    />
                </div>
            </div>
        </header>
    );
}
