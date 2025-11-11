import { useState, useCallback, useRef } from "react";
import { Navigation, MapPin, Plus, Minus, ArrowLeft, Home, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "./ui/dialog";
import { toast } from "sonner";
import {
    GoogleMap,
    useJsApiLoader,
} from "@react-google-maps/api";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import type { CustomerAddress } from "../types";
import { API_ENDPOINTS } from "../config/constants";

interface DeliveryDetails {
    flatInfo: string;
    buildingName: string;
    landmark: string;
    additionalInfo: string;
}

interface LocationSelectorProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: CustomerAddress) => void; // callback after saving
}

const defaultCenter = { lat: 12.9716, lng: 77.6412 }; // Bangalore center
const mapContainerStyle = { width: "100%", height: "100%" };

function LocationSelector({ isOpen, onClose, onSave }: LocationSelectorProps) {
    const [step, setStep] = useState<"map" | "details">("map");
    const [mapCenter, setMapCenter] = useState(defaultCenter);
    const [selectedAddress, setSelectedAddress] = useState<string>("");
    const [label, setLabel] = useState<"Home" | "Work" | "Other">("Other");
    const [addressComponents, setAddressComponents] = useState<{ state: string, city: string, area: string }>({ state: '', city: '', area: '' });

    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
        flatInfo: "",
        buildingName: "",
        landmark: "",
        additionalInfo: "",
    });
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);
    const mapRef = useRef<google.maps.Map | null>(null);

    const token = localStorage.getItem("auth_token") || "";

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
        libraries: ["places"],
    });

    const mapOptions: google.maps.MapOptions = {
        disableDefaultUI: true,
        zoomControl: false,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        scrollwheel: false,
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [{ visibility: "off" }],
            },
            {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#e8e8e8" }],
            },
            {
                featureType: "water",
                elementType: "geometry.fill",
                stylers: [{ color: "#cce7ff" }],
            },
        ],
    };

    const onMapLoad = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const onMapIdle = useCallback(() => {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            if (newCenter) {
                const lat = newCenter.lat();
                const lng = newCenter.lng();
                setMapCenter({ lat, lng });

                const geocoder = new window.google.maps.Geocoder();
                geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                    if (status === "OK" && results?.[0]) {
                        setSelectedAddress(results[0].formatted_address);

                        let state = "";
                        let city = "";
                        let area = "";
                        let area2 = "";

                        results[0].address_components.forEach(component => {
                            if (component.types.includes("administrative_area_level_1")) {
                                state = component.long_name;
                            }
                            if (component.types.includes("locality")) {
                                city = component.long_name;
                            }
                            if (component.types.includes("sublocality_level_1")) {
                                area = component.long_name;
                            }
                            if (component.types.includes("sublocality_level_2")) {
                                area2 = component.long_name;
                            }
                        });
                        setAddressComponents({ state, city, area: area||area2 });
                    }
                });
            }
        }
    }, []);

    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            toast.error("Geolocation not supported by this browser");
            return;
        }
        setIsLoadingLocation(true);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                if (mapRef.current) {
                    mapRef.current.panTo({ lat: latitude, lng: longitude });
                }
                setIsLoadingLocation(false);
                toast.success("Current location detected");
            },
            (error) => {
                toast.error("Failed to get current location");
                console.error("Geolocation error:", error);
                setIsLoadingLocation(false);
            }
        );
    }, []);

    const handleConfirmMap = () => {
        if (!selectedAddress) {
            toast.error("Please select a location");
            return;
        }
        setStep("details");
    };

    const handleConfirmLocation = async () => {
        try {
            const res = await fetch(API_ENDPOINTS.address.add, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    latitude: mapCenter.lat,
                    longitude: mapCenter.lng,
                    fullAddress: selectedAddress,
                    flatInfo: deliveryDetails.flatInfo,
                    buildingName: deliveryDetails.buildingName,
                    landmark: deliveryDetails.landmark,
                    label: label,
                    isDefault: false,
                    state: addressComponents.state,
                    city: addressComponents.city,
                    area: addressComponents.area,
                }),
            });

            const data = await res.json();

            if (!data.success) {
                toast.error(data.message || "Failed to save address");
                return;
            }

            onSave(data.address);
            toast.success("Address saved successfully");
            onClose();
            setStep("map");
        } catch (err) {
            toast.error("Something went wrong");
        }
    };

    const handleDetailChange = (field: keyof DeliveryDetails, value: string) => {
        setDeliveryDetails((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleZoomIn = () => {
        if (mapRef.current) {
            const currentZoom = mapRef.current.getZoom() || 0;
            mapRef.current.setZoom(currentZoom + 1);
        }
    };

    const handleZoomOut = () => {
        if (mapRef.current) {
            const currentZoom = mapRef.current.getZoom() || 0;
            mapRef.current.setZoom(currentZoom - 1);
        }
    };

    if (!isLoaded) return <p>Loading map...</p>;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl w-full h-[80vh] p-0 overflow-hidden flex flex-col">
                {step === "map" ? (
                    <div className="relative h-full w-full">
                        <GoogleMap
                            mapContainerStyle={mapContainerStyle}
                            center={mapCenter}
                            zoom={16}
                            options={mapOptions}
                            onLoad={onMapLoad}
                            onIdle={onMapIdle}
                        />

                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <MapPin className="w-10 h-10 text-red-600 animate-bounce" />
                        </div>

                        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                             <Button
                                variant="outline"
                                size="sm"
                                onClick={getCurrentLocation}
                                disabled={isLoadingLocation}
                                className="flex items-center gap-2 bg-white hover:bg-gray-100 shadow-md p-2"
                            >
                                <Navigation
                                    className={`w-5 h-5 ${isLoadingLocation ? "animate-spin" : ""}`}
                                />
                                {isLoadingLocation ? "Getting..." : "Use Current Location"}
                            </Button>
                            <div className="flex flex-col gap-1 mt-2">
                                <Button size="icon" onClick={handleZoomIn} className="bg-white text-gray-800 hover:bg-gray-100 rounded-full shadow-md h-10 w-10">
                                    <Plus className="w-5 h-5" />
                                </Button>
                                <Button size="icon" onClick={handleZoomOut} className="bg-white text-gray-800 hover:bg-gray-100 rounded-full shadow-md h-10 w-10">
                                    <Minus className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="absolute bottom-4 left-4 right-4 z-20">
                            <div className="bg-white rounded-xl shadow-2xl p-4 space-y-3">
                                <div>
                                    <p className="font-bold text-gray-800">Select delivery location</p>
                                    <p className="text-sm text-gray-600 mt-1">{selectedAddress}</p>
                                </div>
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3"
                                    disabled={!selectedAddress}
                                    onClick={handleConfirmMap}
                                >
                                    Confirm Location
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full bg-gray-50">
                        <div className="flex items-center justify-between p-4 border-b bg-white relative">
                            <Button variant="ghost" onClick={() => setStep('map')} className="absolute left-4 p-2">
                                <ArrowLeft className="w-6 h-6" />
                            </Button>
                            <DialogTitle className="text-lg font-semibold text-center w-full">Enter Address Details</DialogTitle>
                        </div>
                        <div className="p-6 space-y-5 overflow-y-auto flex-1">
                            <div className="space-y-2">
                                <Label htmlFor="flatInfo" className="font-medium">Flat / House No *</Label>
                                <Input
                                    id="flatInfo"
                                    placeholder="e.g., 123A, Tower B, 4th Floor"
                                    value={deliveryDetails.flatInfo}
                                    onChange={(e) =>
                                        handleDetailChange("flatInfo", e.target.value)
                                    }
                                    required
                                    className="bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="buildingName" className="font-medium">Building Name *</Label>
                                <Input
                                    id="buildingName"
                                    placeholder="e.g., Tower B, 4th Floor"
                                    value={deliveryDetails.buildingName}
                                    onChange={(e) =>
                                        handleDetailChange("buildingName", e.target.value)
                                    }
                                    required
                                    className="bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="landmark" className="font-medium">Landmark (optional)</Label>
                                <Input
                                    id="landmark"
                                    placeholder="e.g., Near City Mall, Opposite Park"
                                    value={deliveryDetails.landmark}
                                    onChange={(e) =>
                                        handleDetailChange("landmark", e.target.value)
                                    }
                                     className="bg-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="additionalInfo" className="font-medium">
                                    Delivery Instructions (optional)
                                </Label>
                                <Textarea
                                    id="additionalInfo"
                                    placeholder="e.g., Ring the bell twice, leave at the door"
                                    value={deliveryDetails.additionalInfo}
                                    onChange={(e) =>
                                        handleDetailChange("additionalInfo", e.target.value)
                                    }
                                    rows={3}
                                     className="bg-white"
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="font-medium">Save As</Label>
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant={label === "Home" ? "default" : "outline"}
                                        onClick={() => setLabel("Home")}
                                        className="flex-1 bg-white"
                                    >
                                        <Home/>
                                        Home
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={label === "Work" ? "default" : "outline"}
                                        onClick={() => setLabel("Work")}
                                        className="flex-1 bg-white"
                                    >
                                        <Building2/>
                                        Work
                                    </Button>
                                    <Button
                                        type="button"
                                        variant={label === "Other" ? "default" : "outline"}
                                        onClick={() => setLabel("Other")}
                                        className="flex-1 bg-white"
                                    >
                                        <MapPin/>
                                        Other
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className="p-3 bg-white border-t">
                            <Button
                                onClick={handleConfirmLocation}
                                className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg"
                            >
                                Save Address
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default LocationSelector
