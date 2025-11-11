import { useState, useEffect } from "react";
import { API_ENDPOINTS } from "../config/constants";
import type { CustomerAddress } from "../types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Separator } from "./ui/separator";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
    MapPin,
    MapPinned,
    Home,
    Building2,
    Plus,
    ArrowLeft,
    Trash2,
} from "lucide-react";
import { toast } from "sonner";
import LocationSelector from "./LocationSelector.tsx";

interface LocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    selectedLocation: CustomerAddress | undefined;
    onLocationChange: () => void;
}

export function LocationModal({
                                  isOpen,
                                  onClose,
                                  selectedLocation,
                                  onLocationChange,
                              }: LocationModalProps) {
    const [step, setStep] = useState<"select" | "details" | "add">("select");
    const [locations, setLocations] = useState<CustomerAddress[]>([]);
    const [isLocationSelectedOpen, setIsLocationSelectedOpen] = useState(false);
    const token = localStorage.getItem("auth_token") || "";

    // when user selects a location
    useEffect(() => {
        if (locations.length > 0) {
            localStorage.setItem("locations", JSON.stringify(locations));
        }
    }, [locations]);

    // 🔹 Load addresses from backend
    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem("locations");
            if (saved) {
                setLocations(JSON.parse(saved));
            } else {
                fetch(API_ENDPOINTS.address.get, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then(res => res.json())
                    .then(data => {
                        if (data.success) setLocations(data.addresses);
                    })
                    .catch(() => toast.error("Failed to load addresses"));
            }
        }
    }, [isOpen]);

    const handleLocationSelect = (location: CustomerAddress) => {
        localStorage.setItem("selected_location", JSON.stringify(location));
        // Dispatch a storage event to notify other components on the same page
        window.dispatchEvent(new StorageEvent("storage", { key: "selected_location" }));
        onLocationChange();
        onClose();
    };

    const handleDeleteAddress = async (addressId: string) => {
        try {
            const res = await fetch(`${API_ENDPOINTS.address.get}/${addressId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to delete address");
            }

            setLocations((prev) => prev.filter((loc) => loc.id !== addressId));
            toast.success("Address deleted successfully");

            // If the deleted address was the selected one, clear it from storage
            const currentSelected = localStorage.getItem("selected_location");
            if (currentSelected) {
                const selected = JSON.parse(currentSelected) as CustomerAddress;
                if (selected.id === addressId) {
                    localStorage.removeItem("selected_location");
                    // Dispatch a storage event to notify other components on the same page
                    window.dispatchEvent(new StorageEvent("storage", { key: "selected_location" }));
                }
            }
            onLocationChange();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unknown error occurred");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="p-6 pb-4 border-b">
                    <div className="flex items-center gap-3">
                        {(step === "details" || step === "add") && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setStep("select")}
                                className="h-8 w-8"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <div className="flex items-center gap-2">
                            <MapPinned className="w-5 h-5 text-green-600" />
                            <DialogTitle className="text-lg">Select Location</DialogTitle>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-6">
                    {step === "select" && (
                        <div className="space-y-4">
                            {/* Saved Locations */}
                            {locations.map((location) => {
                                const isSelected = selectedLocation?.id === location.id; // check match
                                return (
                                    <Card
                                        key={location.id}
                                        className={`relative group cursor-pointer border-2 transition-colors ${
                                            isSelected ? "border-green-600 bg-green-50" : "hover:border-green-400"
                                        }`}
                                    >
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="absolute top-2 right-2 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-red-100 hover:text-red-600"
                                                    onClick={(e) => e.stopPropagation()} // Prevent card click
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your
                                                        address.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-600 hover:bg-red-700"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteAddress(location.id);
                                                        }}
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <CardContent className="p-4" onClick={() => handleLocationSelect(location)}>
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1">
                                                    {location.label === "Home" && <Home className="w-5 h-5 text-green-600" />}
                                                    {location.label === "Work" && <Building2 className="w-5 h-5 text-blue-600" />}
                                                    {location.label === "Other" && <MapPin className="w-5 h-5 text-gray-600" />}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold capitalize">{location.label}</h4>
                                                    <p className="text-sm text-gray-600 pr-8">{location.flatInfo}, {location.buildingName}, {location.fullAddress}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}


                            <Separator />

                            {/* Add New */}
                            <Button
                                variant="outline"
                                className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-green-400"
                                onClick={() => setIsLocationSelectedOpen(true)}
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Add New Address
                            </Button>

                            <LocationSelector isOpen={isLocationSelectedOpen}
                                              onClose={() => setIsLocationSelectedOpen(false)}
                                              onSave={(newAddress) => setLocations((prev) => [...prev, newAddress])}
                            />
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
