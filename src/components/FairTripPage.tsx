import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { TabNavigation } from './TabNavigation';
import { ServiceSelector } from './ServiceSelector';

interface FairTripPageProps {
    onServiceChange: (service: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip') => void;
    currentService: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip';
    language: 'en' | 'ta';
}

interface RideOption {
    id: string;
    type: 'bike' | 'auto' | 'cab';
    name: string;
    nameTamil: string;
    icon: string;
    basePrice: number;
    perKmPrice: number;
    estimatedTime: string;
    capacity: string;
    description: string;
    descriptionTamil: string;
}

const rideOptions: RideOption[] = [
    {
        id: 'bike',
        type: 'bike',
        name: 'Bike Ride',
        nameTamil: 'பைக் ரைட்',
        icon: '🏍️',
        basePrice: 15,
        perKmPrice: 8,
        estimatedTime: '5-10 mins',
        capacity: '1 person',
        description: 'Quick and affordable bike rides',
        descriptionTamil: 'விரைவான மற்றும் மலிவு பைக் பயணங்கள்'
    },
    {
        id: 'auto',
        type: 'auto',
        name: 'Auto Rickshaw',
        nameTamil: 'ஆட்டோ ரிக்ஷா',
        icon: '🛺',
        basePrice: 25,
        perKmPrice: 12,
        estimatedTime: '8-15 mins',
        capacity: '3 persons',
        description: 'Comfortable auto rickshaw rides',
        descriptionTamil: 'வசதியான ஆட்டோ ரிக்ஷா பயணங்கள்'
    },
    {
        id: 'cab',
        type: 'cab',
        name: 'Cab',
        nameTamil: 'கேப்',
        icon: '🚗',
        basePrice: 50,
        perKmPrice: 20,
        estimatedTime: '10-20 mins',
        capacity: '4 persons',
        description: 'Premium cab service with AC',
        descriptionTamil: 'ஏசி உடன் பிரீமியம் கேப் சேவை'
    }
];

const quickDestinations = [
    { name: 'Airport', nameTamil: 'விமான நிலையம்', icon: '✈️', distance: '12 km' },
    { name: 'Railway Station', nameTamil: 'ரயில் நிலையம்', icon: '🚂', distance: '5 km' },
    { name: 'Bus Stand', nameTamil: 'பஸ் நிறுத்தம்', icon: '🚌', distance: '3 km' },
    { name: 'Hospital', nameTamil: 'மருத்துவமனை', icon: '🏥', distance: '2 km' },
    { name: 'Mall', nameTamil: 'மால்', icon: '🏬', distance: '4 km' },
    { name: 'School', nameTamil: 'பள்ளி', icon: '🏫', distance: '1.5 km' }
];

export function FairTripPage({ onServiceChange, currentService, language }: FairTripPageProps) {
    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [selectedRide, setSelectedRide] = useState<RideOption | null>(null);
    const [showBooking, setShowBooking] = useState(false);
    const [estimatedDistance, setEstimatedDistance] = useState(5); // km
    const [isSearching, setIsSearching] = useState(false);
    const [rideBooked, setRideBooked] = useState(false);
    const [activeTab, setActiveTab] = useState('rides');

    // Define tabs for FairTrip service
    const fairTripTabs = [
        {
            id: 'rides',
            label: language === 'en' ? 'Book Ride' : 'ரைட் பூக்',
            icon: '🚗',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'bike',
            label: language === 'en' ? 'Bike' : 'பைக்',
            icon: '🏍️',
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            id: 'auto',
            label: language === 'en' ? 'Auto' : 'ஆட்டோ',
            icon: '🛺',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50'
        },
        {
            id: 'cab',
            label: language === 'en' ? 'Cab' : 'கேப்',
            icon: '🚙',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            id: 'scheduled',
            label: language === 'en' ? 'Scheduled' : 'திட்டமிட்ட',
            icon: '📅',
            color: 'text-indigo-600',
            bgColor: 'bg-indigo-50'
        }
    ];

    const calculatePrice = (ride: RideOption) => {
        return ride.basePrice + (ride.perKmPrice * estimatedDistance);
    };

    const handleBookRide = () => {
        if (!pickup || !destination || !selectedRide) return;

        setIsSearching(true);
        setTimeout(() => {
            setIsSearching(false);
            setRideBooked(true);
        }, 3000);
    };

    const handleQuickDestination = (dest: typeof quickDestinations[0]) => {
        setDestination(`${dest.name} - ${dest.distance}`);
        setEstimatedDistance(parseFloat(dest.distance));
    };

    if (rideBooked) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-6 text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-green-600 mb-2">
                            {language === 'en' ? 'Ride Booked!' : 'ரைட் பூக் ஆனது!'}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {language === 'en'
                                ? `Your ${selectedRide?.name} is on the way!`
                                : `உங்கள் ${selectedRide?.nameTamil} வழியில் உள்ளது!`
                            }
                        </p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Driver:</span>
                                <span>Raj Kumar</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Vehicle:</span>
                                <span>TN 01 AB 1234</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">ETA:</span>
                                <span className="text-green-600 font-medium">3 mins</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="font-medium">Fare:</span>
                                <span className="text-blue-600 font-bold">₹{calculatePrice(selectedRide!)}</span>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                                📞 {language === 'en' ? 'Call Driver' : 'டிரைவரை அழைக்கவும்'}
                            </Button>
                            <Button variant="outline" className="flex-1">
                                💬 {language === 'en' ? 'Chat' : 'செய்தி'}
                            </Button>
                        </div>

                        <Button
                            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                                setRideBooked(false);
                                setSelectedRide(null);
                                setPickup('');
                                setDestination('');
                            }}
                        >
                            {language === 'en' ? 'Book New Ride' : 'புதிய ரைட் பூக் செய்யுங்கள்'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isSearching) {
        return (
            <div className="min-h-screen bg-blue-50 flex items-center justify-center">
                <Card className="max-w-md w-full mx-4">
                    <CardContent className="p-6 text-center">
                        <div className="animate-spin text-6xl mb-4">🔄</div>
                        <h2 className="text-xl font-bold mb-2">
                            {language === 'en' ? 'Searching for drivers...' : 'டிரைவர்களைத் தேடுகிறது...'}
                        </h2>
                        <p className="text-gray-600 mb-4">
                            {language === 'en'
                                ? 'Please wait while we find the best ride for you'
                                : 'உங்களுக்கு சிறந்த ரைடை நாங்கள் கண்டுபிடிக்கும் வரை காத்திருக்கவும்'
                            }
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span>{language === 'en' ? 'From:' : 'இருந்து:'}</span>
                                <span className="font-medium">{pickup}</span>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                                <span>{language === 'en' ? 'To:' : 'வரை:'}</span>
                                <span className="font-medium">{destination}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>{language === 'en' ? 'Ride Type:' : 'ரைட் வகை:'}</span>
                                <span className="font-medium">
                  {selectedRide && (language === 'en' ? selectedRide.name : selectedRide.nameTamil)}
                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-blue-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-3 mb-4">
                        <ServiceSelector
                            currentService={currentService}
                            onServiceChange={onServiceChange}
                            language={language}
                            variant="dropdown"
                        />
                    </div>

                    {/* Location Inputs */}
                    <div className="space-y-3 mb-4">
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-green-600">📍</span>
                            <Input
                                placeholder={language === 'en' ? 'Pickup location' : 'எடுக்கும் இடம்'}
                                value={pickup}
                                onChange={(e) => setPickup(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-red-600">📍</span>
                            <Input
                                placeholder={language === 'en' ? 'Destination' : 'சேருமிடம்'}
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    {/* Tab Navigation */}
                    <TabNavigation
                        tabs={fairTripTabs}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        language={language}
                    />
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative px-6 py-12 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        {language === 'en' ? 'Fair Trip - Your Reliable Ride Partner' : 'ஃபேர் ட்ரிப் - உங்கள் நம்பகமான பயண பங்குதாரர்'}
                    </h2>
                    <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                        {language === 'en'
                            ? "Book affordable rides with transparent pricing. Choose from bikes, autos, and cabs with verified drivers and real-time tracking."
                            : "வெளிப்படையான விலையுடன் மலிவு பயணங்களை பூக் செய்யுங்கள். சரிபார்க்கப்பட்ட டிரைவர்கள் மற்றும் உடனடி கண்காணிப்புடன் பைக், ஆட்டோ மற்றும் கேப்களில் இருந்து தேர்ந்தெடுக்கவும்."
                        }
                    </p>

                    <div className="flex flex-wrap justify-center gap-6 text-sm">
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <span>💰</span>
                            <span>{language === 'en' ? "Fair Pricing" : "நியாயமான விலை"}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <span>⚡</span>
                            <span>{language === 'en' ? "Quick Booking" : "விரைவு பூக்கிங்"}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                            <span>🛡️</span>
                            <span>{language === 'en' ? "Safe & Secure" : "பாதுகாப்பான"}</span>
                        </div>
                    </div>
                </div>

                {/* Decorative bottom wave */}
                <div className="absolute bottom-0 left-0 right-0 h-8 bg-blue-50 rounded-t-3xl"></div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Quick Destinations */}
                <div className="mb-6">
                    <h3 className="font-bold mb-3">
                        {language === 'en' ? 'Quick Destinations' : 'விரைவு இலக்குகள்'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {quickDestinations.map((dest, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                className="h-auto p-3 flex flex-col items-center gap-2"
                                onClick={() => handleQuickDestination(dest)}
                            >
                                <span className="text-2xl">{dest.icon}</span>
                                <div className="text-center">
                                    <div className="font-medium text-sm">
                                        {language === 'en' ? dest.name : dest.nameTamil}
                                    </div>
                                    <div className="text-xs text-gray-500">{dest.distance}</div>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Ride Options */}
                {pickup && destination && (
                    <div className="space-y-4">
                        <h3 className="font-bold">
                            {language === 'en' ? 'Choose Your Ride' : 'உங்கள் ரைடைத் தேர்ந்தெடுக்கவும்'}
                        </h3>

                        {rideOptions
                            .filter(ride => activeTab === 'rides' || ride.type === activeTab)
                            .map((ride) => (
                                <Card
                                    key={ride.id}
                                    className={`cursor-pointer transition-all ${
                                        selectedRide?.id === ride.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                                    }`}
                                    onClick={() => setSelectedRide(ride)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="text-3xl">{ride.icon}</div>
                                                <div>
                                                    <h4 className="font-bold">
                                                        {language === 'en' ? ride.name : ride.nameTamil}
                                                    </h4>
                                                    <p className="text-sm text-gray-600">
                                                        {language === 'en' ? ride.description : ride.descriptionTamil}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-1">
                                                        <span className="text-xs text-gray-500">⏱️ {ride.estimatedTime}</span>
                                                        <span className="text-xs text-gray-500">👥 {ride.capacity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-blue-600">
                                                    ₹{calculatePrice(ride)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {estimatedDistance} km
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                        {selectedRide && (
                            <div className="mt-6">
                                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <h4 className="font-bold text-lg">
                                                    {language === 'en' ? 'Trip Summary' : 'பயண சுருக்கம்'}
                                                </h4>
                                                <p className="text-blue-100">
                                                    {language === 'en' ? 'Review your trip details' : 'உங்கள் பயண விவரங்களை மதிப்பாய்வு செய்யுங்கள்'}
                                                </p>
                                            </div>
                                            <div className="text-2xl">{selectedRide.icon}</div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span>{language === 'en' ? 'From:' : 'இருந்து:'}</span>
                                                <span className="font-medium">{pickup}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{language === 'en' ? 'To:' : 'வரை:'}</span>
                                                <span className="font-medium">{destination}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{language === 'en' ? 'Distance:' : 'தூரம்:'}</span>
                                                <span className="font-medium">{estimatedDistance} km</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>{language === 'en' ? 'Vehicle:' : 'வாகனம்:'}</span>
                                                <span className="font-medium">
                          {language === 'en' ? selectedRide.name : selectedRide.nameTamil}
                        </span>
                                            </div>
                                            <Separator className="bg-blue-400 my-3" />
                                            <div className="flex justify-between font-bold text-lg">
                                                <span>{language === 'en' ? 'Total Fare:' : 'மொத்த கட்டணம்:'}</span>
                                                <span>₹{calculatePrice(selectedRide)}</span>
                                            </div>
                                        </div>

                                        <Button
                                            className="w-full mt-4 bg-white text-blue-600 hover:bg-gray-100 font-bold"
                                            onClick={handleBookRide}
                                        >
                                            {language === 'en' ? 'Book Ride Now' : 'இப்போது ரைட் பூக் செய்யுங்கள்'}
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}

                {/* Features */}
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">⚡</div>
                            <h4 className="font-bold mb-1">
                                {language === 'en' ? 'Quick Booking' : 'விரைவு பூக்கிங்'}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {language === 'en'
                                    ? 'Book your ride in under 30 seconds'
                                    : '30 வினாடிகளில் உங்கள் ரைடை பூக் செய்யுங்கள்'
                                }
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">💰</div>
                            <h4 className="font-bold mb-1">
                                {language === 'en' ? 'Fair Pricing' : 'நியாயமான விலை'}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {language === 'en'
                                    ? 'Transparent pricing with no hidden charges'
                                    : 'மறைவான கட்டணங்கள் இல்லாமல் வெளிப்படையான விலை'
                                }
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-3xl mb-2">🛡️</div>
                            <h4 className="font-bold mb-1">
                                {language === 'en' ? 'Safe & Secure' : 'பாதுகாப்பான'}
                            </h4>
                            <p className="text-sm text-gray-600">
                                {language === 'en'
                                    ? 'Verified drivers and real-time tracking'
                                    : 'சரிபார்க்கப்பட்ட டிரைவர்கள் மற்றும் உடனடி கண்காணிப்பு'
                                }
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}