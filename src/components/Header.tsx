// Header.tsx
import { useState, useEffect, useCallback } from "react";
import { MapPin, ShoppingCart, User, LogOut, Package, Wallet, CalendarDays, Home, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { SearchWithSuggestions } from "./SearchWithSuggestions";
import { ServiceSelector } from "./ServiceSelector";
import { useAuth } from "../hooks/useAuth";
import type { Category, Product, CustomerAddress } from "../types";
import { LocationModal } from "./LocationModal";
import { toast } from "sonner";

interface HeaderProps {
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
}

export function Header({
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
                           setLanguage
                       }: HeaderProps) {
    const { user, signOut } = useAuth();
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<CustomerAddress | null>(null);

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

    const getLocationIcon = () => {
        const iconProps = { className: "size-6 text-green-600" };
        if (!selectedLocation?.label) {
            return <MapPin {...iconProps} />;
        }
        switch (selectedLocation.label) {
            case "Home":
                return <Home {...iconProps} />;
            case "Work":
                return <Building2 {...iconProps} />;
            case "Other":
                return <MapPin {...iconProps} />;
            default:
                return <MapPin {...iconProps} />;
        }
    };

    const formatPhoneNumber = (phone: string): string => {
        if (phone.startsWith("+91") && phone.length === 13) {
            const number = phone.slice(3);
            return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
        }
        return phone;
    };

    return (
        <header className="sticky top-0 z-50 bg-gradient-to-b from-green-200 to-green-50 border-b shadow-sm">
            <div className="container mx-auto px-3 py-4">
                <div className="flex items-center justify-between gap-2 md:gap-4">
                    {/* Service Selector */}
                    {onServiceChange ? (
                            <ServiceSelector
                                currentService={currentService}
                                onServiceChange={onServiceChange}
                                language={language}
                                variant="dropdown"
                            />
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="bg-green-500 text-white p-2 rounded-lg">
                                <div className="w-6 h-6 flex items-center justify-center">🛒</div>
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-green-600">
                                    {language === 'en' ? 'Laboraa Grocery' : 'லபோராா கிராசரி'}
                                </h1>
                                <p className="text-xs text-gray-500">
                                    {language === 'en' ? 'Fresh groceries & daily essentials' : 'புதிய கிராசரி & தினசரி தேவைகள்'}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Trigger button */}
                    <Button
                        className="flex flex-col items-start  p-3 hover:shadow-lg transition-all"
                        onClick={handleLocationClick}
                    >
                        <div className="flex items-center gap-2">
                            {getLocationIcon()}
                            <span className="text-lg text-gray-500 truncate">
                                {selectedLocation ? [selectedLocation.area, selectedLocation.city].filter(Boolean).join(', ') : "Choose Location"}
                            </span>
                        </div>
                    </Button>

                    {/* Location Selector */}
                    <LocationModal
                        isOpen={isLocationModalOpen}
                        onClose={() => setIsLocationModalOpen(false)}
                        selectedLocation={selectedLocation || undefined}
                        onLocationChange={syncLocationFromStorage}
                    />

                    {/* Search Bar */}
                    <div className="flex-1 max-w-lg mx-4  hidden md:block">
                        <SearchWithSuggestions
                            categories={categories}
                            products={products}
                            onSearch={onSearch}
                            onProductSelect={onProductSelect}
                        />
                    </div>

                    {/* Right side buttons container */}
                    <div className="flex items-center gap-1 md:gap-2">
                        {/* Language Toggle */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
                            className="px-2 md:px-3 text-xl font-bold"
                        >
                            {language === 'en' ? 'த' : 'EN'}
                        </Button>

                        {/* Subscription Button */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onSubscriptionClick}
                            className="flex items-center gap-1 md:gap-2 px-2 md:px-3 "
                        >
                            <CalendarDays className="size-6" />
                            {/* hide label on small screens, show on md+ */}
                            <span className="hidden xl:inline text-lg">{language === 'en' ? 'Subscriptions' : 'சந்তாக்கள்'}</span>
                        </Button>

                        {/* User + Cart */}
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
                                            My Wallet
                                        </DropdownMenuItem>
                                    )}

                                    {onOrdersClick && (
                                        <DropdownMenuItem onClick={onOrdersClick}>
                                            <Package className="w-4 h-4 mr-2" />
                                            My Orders
                                        </DropdownMenuItem>
                                    )}

                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem onClick={signOut}>
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Sign Out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button variant="ghost" className="h-12 w-12" onClick={onAuthClick}>
                                <User className="size-6" />
                            </Button>
                        )}

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
