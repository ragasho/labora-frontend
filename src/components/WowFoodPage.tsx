import { useState } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "./ui/dialog";
import { Separator } from "./ui/separator";
import { TabNavigation } from "./TabNavigation";
import { ServiceSelector } from "./ServiceSelector";
import { restaurants } from "../data/restaurants";
import type { Restaurant, FoodItem } from "../types";

interface WowFoodPageProps {
    onServiceChange: (service: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip') => void;
    currentService: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip';
    language: "en" | "ta";
}

export function WowFoodPage({
                                onServiceChange,
                                currentService,
                                language,
                            }: WowFoodPageProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRestaurant, setSelectedRestaurant] =
        useState<Restaurant | null>(null);
    const [selectedCategory, setSelectedCategory] =
        useState<string>("");
    const [cart, setCart] = useState<{ [key: string]: number }>(
        {},
    );
    const [showTableBooking, setShowTableBooking] =
        useState(false);
    const [activeTab, setActiveTab] = useState('restaurants');

    // Define tabs for WowFood service
    const wowFoodTabs = [
        {
            id: 'restaurants',
            label: language === 'en' ? 'Restaurants' : 'உணவகங்கள்',
            icon: '🍽️',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
        {
            id: 'fast-food',
            label: language === 'en' ? 'Fast Food' : 'விரைவு உணவு',
            icon: '🍔',
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        },
        {
            id: 'healthy',
            label: language === 'en' ? 'Healthy' : 'ஆரோக்கியம்',
            icon: '🥗',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            id: 'beverages',
            label: language === 'en' ? 'Beverages' : 'பானங்கள்',
            icon: '🥤',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'desserts',
            label: language === 'en' ? 'Desserts' : 'இனிப்புகள்',
            icon: '🍰',
            color: 'text-pink-600',
            bgColor: 'bg-pink-50'
        }
    ];

    const filteredRestaurants = restaurants.filter(
        (restaurant) => {
            // First filter by search query
            const matchesSearch = !searchQuery.trim() || (
                restaurant.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                restaurant.nameTamil.includes(searchQuery) ||
                restaurant.cuisine.some((c) =>
                    c.toLowerCase().includes(searchQuery.toLowerCase()),
                )
            );

            // Then filter by active tab
            let matchesTab = true;
            if (activeTab !== 'restaurants') { // Default tab shows all
                switch (activeTab) {
                    case 'fast-food':
                        matchesTab = restaurant.cuisine.some(c =>
                            ['Fast Food', 'Burger', 'Pizza', 'Chinese', 'Snacks'].includes(c)
                        );
                        break;
                    case 'healthy':
                        matchesTab = restaurant.cuisine.some(c =>
                            ['Healthy', 'Salads', 'Juice', 'Organic'].includes(c)
                        ) || restaurant.name.toLowerCase().includes('healthy');
                        break;
                    case 'beverages':
                        matchesTab = restaurant.cuisine.some(c =>
                            ['Beverages', 'Coffee', 'Tea', 'Juice', 'Drinks'].includes(c)
                        );
                        break;
                    case 'desserts':
                        matchesTab = restaurant.cuisine.some(c =>
                            ['Desserts', 'Ice Cream', 'Sweets', 'Bakery'].includes(c)
                        );
                        break;
                    default:
                        matchesTab = true;
                }
            }

            return matchesSearch && matchesTab;
        }
    );

    const addToCart = (itemId: string) => {
        setCart((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));
    };

    const removeFromCart = (itemId: string) => {
        setCart((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] > 1) {
                newCart[itemId]--;
            } else {
                delete newCart[itemId];
            }
            return newCart;
        });
    };

    const getCartTotal = () => {
        if (!selectedRestaurant) return 0;
        let total = 0;
        selectedRestaurant.categories.forEach((category) => {
            category.items.forEach((item) => {
                if (cart[item.id]) {
                    total += item.finalPrice * cart[item.id];
                }
            });
        });
        return total;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <ServiceSelector
                            currentService={currentService}
                            onServiceChange={onServiceChange}
                            language={language}
                            variant="dropdown"
                        />

                        {getCartTotal() > 0 && (
                            <Button className="bg-orange-600 hover:bg-orange-700">
                                Cart: ₹{getCartTotal().toFixed(2)}
                            </Button>
                        )}
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-4">
                        <Input
                            placeholder={
                                language === "en"
                                    ? "Search restaurants, cuisines..."
                                    : "ரெஸ்டாரன்ட், உணவு வகைகளைத் தேடுங்கள்..."
                            }
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                        <span className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </span>
                    </div>

                    {/* Tab Navigation */}
                    <TabNavigation
                        tabs={wowFoodTabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        language={language}
                    />
                </div>
            </div>

            {/* Hero Section */}
            {!selectedRestaurant && (
                <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative px-6 py-12 text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            {language === "en" ? "Wow Food - Restaurant Delivery" : "வாவ் ஃபூட் - உணவக டெலிவரி"}
                        </h2>
                        <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
                            {language === "en"
                                ? "Discover amazing restaurants, order your favorite meals, and get them delivered hot to your doorstep in minutes."
                                : "அற்புதமான உணவகங்களைக் கண்டறியுங்கள், உங்களுக்கு பிடித்த உணவுகளை ஆர்டர் செய்யுங்கள், மற்றும் நிமிடங்களில் உங்கள் வீட்டு வாசலில் சூடாக பெறுங்கள்."
                            }
                        </p>

                        <div className="flex flex-wrap justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                <span>🍽️</span>
                                <span>{language === "en" ? "1000+ Restaurants" : "1000+ உணவகங்கள்"}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                <span>🚚</span>
                                <span>{language === "en" ? "30 Min Delivery" : "30 நிமிட டெலிவரி"}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                                <span>📅</span>
                                <span>{language === "en" ? "Table Booking" : "டேபிள் பூக்கிங்"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Decorative bottom wave */}
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-50 rounded-t-3xl"></div>
                </div>
            )}

            {selectedRestaurant ? (
                // Restaurant Detail View
                <div className="container mx-auto px-4 py-6">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
                        <div className="relative h-48">
                            <img
                                src={selectedRestaurant.image}
                                alt={selectedRestaurant.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 text-white">
                                <h2 className="text-2xl font-bold">
                                    {language === "en"
                                        ? selectedRestaurant.name
                                        : selectedRestaurant.nameTamil}
                                </h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-1">
                                        <span className="text-yellow-400">⭐</span>
                                        <span>{selectedRestaurant.rating}</span>
                                        <span className="text-gray-300">
                      ({selectedRestaurant.reviewCount})
                    </span>
                                    </div>
                                    <span>•</span>
                                    <span>{selectedRestaurant.deliveryTime}</span>
                                    <span>•</span>
                                    <span>{selectedRestaurant.distance}</span>
                                </div>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="absolute top-4 right-4 bg-white"
                                onClick={() => setSelectedRestaurant(null)}
                            >
                                ← Back
                            </Button>
                        </div>

                        <div className="p-4">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {selectedRestaurant.cuisine.map((c) => (
                                    <Badge key={c} variant="secondary">
                                        {c}
                                    </Badge>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                  <span className="font-medium">
                    Min Order:
                  </span>{" "}
                                    ₹{selectedRestaurant.minOrder}
                                </div>
                                <div>
                  <span className="font-medium">
                    Delivery Fee:
                  </span>{" "}
                                    ₹{selectedRestaurant.deliveryFee}
                                </div>
                                <div>
                                    <span className="font-medium">Status:</span>
                                    <Badge
                                        variant={
                                            selectedRestaurant.isOpen
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="ml-2"
                                    >
                                        {selectedRestaurant.isOpen
                                            ? "Open"
                                            : "Closed"}
                                    </Badge>
                                </div>
                            </div>

                            {selectedRestaurant.offers &&
                                selectedRestaurant.offers.length > 0 && (
                                    <div className="mt-4">
                                        <h4 className="font-medium mb-2">
                                            🎉 Offers
                                        </h4>
                                        <div className="space-y-2">
                                            {selectedRestaurant.offers.map(
                                                (offer, index) => (
                                                    <div
                                                        key={index}
                                                        className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm"
                                                    >
                                                        {offer}
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>
                                )}

                            {/* Table Booking Button */}
                            <div className="mt-4 flex gap-2">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowTableBooking(true)}
                                    className="flex-1"
                                >
                                    📅{" "}
                                    {language === "en"
                                        ? "Book Table"
                                        : "டேபிள் பூக் செய்யுங்கள்"}
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    🏪{" "}
                                    {language === "en"
                                        ? "Self Pickup"
                                        : "சுய எடுப்பு"}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex overflow-x-auto gap-4 mb-6 pb-2">
                        <Button
                            variant={
                                selectedCategory === "" ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setSelectedCategory("")}
                            className="whitespace-nowrap"
                        >
                            {language === "en"
                                ? "All Items"
                                : "எல்லா உணவுகள்"}
                        </Button>
                        {selectedRestaurant.categories.map((category) => (
                            <Button
                                key={category.id}
                                variant={
                                    selectedCategory === category.id
                                        ? "default"
                                        : "outline"
                                }
                                size="sm"
                                onClick={() => setSelectedCategory(category.id)}
                                className="whitespace-nowrap"
                            >
                                {language === "en"
                                    ? category.name
                                    : category.nameTamil}
                            </Button>
                        ))}
                    </div>

                    {/* Menu Items */}
                    <div className="space-y-6">
                        {selectedRestaurant.categories
                            .filter(
                                (category) =>
                                    !selectedCategory ||
                                    category.id === selectedCategory,
                            )
                            .map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-lg shadow-sm p-6"
                                >
                                    <h3 className="text-xl font-bold mb-4">
                                        {language === "en"
                                            ? category.name
                                            : category.nameTamil}
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {category.items.map((item) => (
                                            <FoodItemCard
                                                key={item.id}
                                                item={item}
                                                language={language}
                                                quantity={cart[item.id] || 0}
                                                onAdd={() => addToCart(item.id)}
                                                onRemove={() => removeFromCart(item.id)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            ) : (
                // Restaurant List View
                <div className="container mx-auto px-4 py-6">
                    {/* Filter Badges */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <Badge variant="outline">🍽️ All Restaurants</Badge>
                        <Badge variant="outline">🥗 Healthy</Badge>
                        <Badge variant="outline">🚚 Fast Delivery</Badge>
                        <Badge variant="outline">🏠 Cloud Kitchen</Badge>
                        <Badge variant="outline">🛣️ Highway</Badge>
                        <Badge variant="outline">🚂 Railway Platform</Badge>
                    </div>

                    {/* Restaurant Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredRestaurants.map((restaurant) => (
                            <RestaurantCard
                                key={restaurant.id}
                                restaurant={restaurant}
                                language={language}
                                onClick={() =>
                                    setSelectedRestaurant(restaurant)
                                }
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Table Booking Modal */}
            <Dialog
                open={showTableBooking}
                onOpenChange={setShowTableBooking}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            {language === "en"
                                ? "Book a Table"
                                : "டேபிள் பூக் செய்யுங்கள்"}
                        </DialogTitle>
                        <DialogDescription>
                            {language === "en"
                                ? "Reserve a table at the restaurant for your dining experience."
                                : "உங்கள் உணவு அனுபவத்திற்காக ரெஸ்டாரன்ட்டில் ஒரு டேபிளை முன்பதிவு செய்யுங்கள்."}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">
                                {language === "en" ? "Name" : "பெயர்"}
                            </label>
                            <Input
                                placeholder={
                                    language === "en"
                                        ? "Your name"
                                        : "உங்கள் பெயர்"
                                }
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                {language === "en" ? "Phone" : "தொலைபேசி"}
                            </label>
                            <Input
                                placeholder={
                                    language === "en"
                                        ? "Phone number"
                                        : "தொலைபேசி எண்"
                                }
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium">
                                    {language === "en" ? "Date" : "தேதி"}
                                </label>
                                <Input type="date" />
                            </div>
                            <div>
                                <label className="text-sm font-medium">
                                    {language === "en" ? "Time" : "நேரம்"}
                                </label>
                                <Input type="time" />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">
                                {language === "en"
                                    ? "Guests"
                                    : "விருந்தினர்கள்"}
                            </label>
                            <Input
                                type="number"
                                min="1"
                                max="20"
                                placeholder="2"
                            />
                        </div>
                        <Button className="w-full bg-orange-600 hover:bg-orange-700">
                            {language === "en"
                                ? "Book Table"
                                : "டேபிள் பூக் செய்யுங்கள்"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function RestaurantCard({
                            restaurant,
                            language,
                            onClick,
                        }: {
    restaurant: Restaurant;
    language: "en" | "ta";
    onClick: () => void;
}) {
    return (
        <Card
            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={onClick}
        >
            <div className="relative h-48">
                <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2">
                    <Badge
                        variant={
                            restaurant.isOpen ? "default" : "secondary"
                        }
                    >
                        {restaurant.isOpen ? "Open" : "Closed"}
                    </Badge>
                </div>
                <div className="absolute top-2 right-2 space-y-1">
                    {restaurant.isCloudKitchen && (
                        <Badge
                            variant="outline"
                            className="bg-purple-50 text-purple-700 border-purple-200"
                        >
                            🏠 Cloud Kitchen
                        </Badge>
                    )}
                    {restaurant.isHomemaker && (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200"
                        >
                            👩‍🍳 Home Chef
                        </Badge>
                    )}
                    {restaurant.location?.type === "highway" && (
                        <Badge
                            variant="outline"
                            className="bg-blue-50 text-blue-700 border-blue-200"
                        >
                            🛣️ Highway
                        </Badge>
                    )}
                    {restaurant.location?.type === "railway_platform" && (
                        <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                        >
                            🚂 Railway
                        </Badge>
                    )}
                </div>
                <div className="absolute bottom-2 left-2 text-white">
                    <div className="flex items-center gap-1 bg-black/50 rounded px-2 py-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-sm">{restaurant.rating}</span>
                    </div>
                </div>
            </div>

            <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-1">
                    {language === "en"
                        ? restaurant.name
                        : restaurant.nameTamil}
                </h3>
                <div className="flex flex-wrap gap-1 mb-2">
                    {restaurant.cuisine.slice(0, 2).map((c) => (
                        <Badge
                            key={c}
                            variant="secondary"
                            className="text-xs"
                        >
                            {c}
                        </Badge>
                    ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>{restaurant.deliveryTime}</span>
                    <span>{restaurant.distance}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span>₹{restaurant.minOrder} min</span>
                    <span>₹{restaurant.deliveryFee} delivery</span>
                </div>

                {restaurant.offers && restaurant.offers.length > 0 && (
                    <div className="mt-2 text-xs text-green-600 font-medium">
                        🎉 {restaurant.offers[0]}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function FoodItemCard({
                          item,
                          language,
                          quantity,
                          onAdd,
                          onRemove,
                      }: {
    item: FoodItem;
    language: "en" | "ta";
    quantity: number;
    onAdd: () => void;
    onRemove: () => void;
}) {
    return (
        <Card className="overflow-hidden">
            <div className="flex">
                <div className="flex-1 p-4">
                    <div className="flex items-start gap-2 mb-2">
                        <div
                            className={`w-3 h-3 rounded-sm ${item.isVeg ? "bg-green-500" : "bg-red-500"} mt-1`}
                        />
                        <div className="flex-1">
                            <h4 className="font-medium">
                                {language === "en" ? item.name : item.nameTamil}
                            </h4>
                            {item.isPopular && (
                                <Badge
                                    variant="outline"
                                    className="text-xs mt-1 border-orange-200 text-orange-600"
                                >
                                    ⭐ Popular
                                </Badge>
                            )}
                            {item.isFitness && (
                                <Badge
                                    variant="outline"
                                    className="text-xs mt-1 border-green-200 text-green-600"
                                >
                                    💪 Fitness
                                </Badge>
                            )}
                        </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                        {language === "en"
                            ? item.description
                            : item.descriptionTamil}
                    </p>

                    <div className="flex items-center gap-2 mb-2">
            <span className="font-bold">
              ₹{item.finalPrice}
            </span>
                        {item.price !== item.finalPrice && (
                            <span className="text-sm text-gray-500 line-through">
                ₹{item.price}
              </span>
                        )}
                        <span className="text-xs text-gray-500">
              (incl. {item.gstPercentage}% GST)
            </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>🌶️ {item.spiceLevel}</span>
                        <span>⏱️ {item.preparationTime}</span>
                        {item.calories && (
                            <span>🔥 {item.calories} cal</span>
                        )}
                    </div>
                </div>

                <div className="w-24 p-2 flex flex-col">
                    <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-20 object-cover rounded mb-2"
                    />

                    {quantity > 0 ? (
                        <div className="flex items-center justify-between border rounded px-2 py-1">
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onRemove}
                                className="h-6 w-6 p-0"
                            >
                                -
                            </Button>
                            <span className="text-sm font-medium">
                {quantity}
              </span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={onAdd}
                                className="h-6 w-6 p-0"
                            >
                                +
                            </Button>
                        </div>
                    ) : (
                        <Button
                            size="sm"
                            onClick={onAdd}
                            className="text-xs bg-orange-600 hover:bg-orange-700"
                        >
                            ADD
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}