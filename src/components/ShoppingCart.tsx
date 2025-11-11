import { useState, useCallback, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, MapPin, Clock, CreditCard, ChevronDown, Tag, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Card, CardContent } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LocationModal } from './LocationModal';
import { CouponDialog } from './CouponDialog';
import { toast } from 'sonner';
import type { CustomerAddress, Coupon } from "../types";
import { useAuth } from '../hooks/useAuth';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: {
    id: string;
    name: string;
    price: number;
    image: string;
    unit: string;
    quantity: number;
  }[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onAuthClick: () => void;
  onCheckout: () => void;
}

function ShoppingCart({
  isOpen,
  onClose, cartItems,
    onRemoveFromCart,
  onUpdateQuantity, onAuthClick,
  onCheckout
}: ShoppingCartProps) {

    const calculateCouponDiscount = (coupon: Coupon, total: number, currentDeliveryFee: number) => {
        if (total < coupon.minCartValue) return 0;

        switch (coupon.discountType) {
            case 'percentage':
                const percentDiscount = (total * coupon.discountValue) / 100;
                return coupon.maxDiscount ? Math.min(percentDiscount, coupon.maxDiscount) : percentDiscount;
            case 'fixed':
                return coupon.discountValue;
            case 'free_delivery':
                return currentDeliveryFee; // Return the delivery fee as discount
            default:
                return 0;
        }
    };

    const { user } = useAuth();
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
    const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

    const [selectedLocation, setSelectedLocation] = useState<CustomerAddress | null>(null);

    const syncLocationFromStorage = useCallback(() => {
        if (!user) {
            setSelectedLocation(null);
            return;
        }
        const saved = localStorage.getItem("selected_location");
        setSelectedLocation(saved ? (JSON.parse(saved) as CustomerAddress) : null);
    }, [user]);

    // Sync location from storage on mount, when user changes, or when another component updates it
    useEffect(() => {
        syncLocationFromStorage();

        const handleStorageChange = (event: StorageEvent) => {
            if (event.key === "selected_location") {
                syncLocationFromStorage();
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [syncLocationFromStorage]);

    const [applyCashback, setApplyCashback] = useState(false);
    const totalAmount = cartItems.reduce((sum: number, item: { price: number; quantity: number; }) => sum + (item.price * item.quantity), 0);
    const totalItems = cartItems.reduce((sum: any, item: { quantity: any; }) => sum + item.quantity, 0);
    const baseDeliveryFee = totalAmount >= 199 ? 0 : 25;
    const deliveryFee = appliedCoupon?.discountType === 'free_delivery' ? 0 : baseDeliveryFee;
    const cashbackDiscount = applyCashback ? 25 : 0;
    const couponDiscount = appliedCoupon ? calculateCouponDiscount(appliedCoupon, totalAmount, baseDeliveryFee) : 0;
    const finalAmount = totalAmount + deliveryFee - cashbackDiscount - couponDiscount;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleApplyCoupon = (coupon: Coupon) => {
        setAppliedCoupon(coupon);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        toast.success('Coupon removed successfully');
    };

    const handleLocationClick = () => {
        if (!user) {
            onAuthClick();
            toast.info("Please sign in to select a location.");
            return;
        }
        setIsLocationModalOpen(true);
    };

    const handleProceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please sign in to place an order');
            return;
        }
        if (cartItems.length === 0) {
            toast.error('Your cart is empty');
            return;
        }

        if (!selectedLocation) {
            toast.error('Please select a delivery location');
            setIsLocationModalOpen(true);
            return;
        }

        onCheckout();
    };

  if (!isOpen) return null;

  return (
      <>
          {/* Backdrop */}
          <div
              className="fixed inset-0 bg-black/50 z-50"
              onClick={onClose}
          />

          {/* Cart Sidebar */}
          <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
                  <div className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-green-600" />
                      <h2 className="text-lg font-bold">My Cart ({totalItems})</h2>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                      <X className="w-5 h-5" />
                  </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto scrollbar-none">
                  {cartItems.length === 0 ? (
                      <div className="text-center py-12 px-4">
                          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-gray-500 text-lg mb-2 font-medium">Your cart is empty</h3>
                          <p className="text-gray-400">Add some products to get started</p>
                      </div>
                  ) : (
                      <div className="p-4 space-y-6">
                          {/* Cart Items List */}
                          <div className="space-y-4">
                              {cartItems.map((item) => (
                                  <div key={item.id} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                                          <ImageWithFallback
                                              src={item.image}
                                              alt={item.name}
                                              className="w-full h-full object-cover"
                                          />
                                      </div>

                                      <div className="flex-1">
                                          <h4 className="font-medium text-gray-900 mb-1">{item.name}</h4>
                                          <p className="text-sm text-gray-500 mb-2">{item.unit}</p>
                                          <p className="font-bold text-gray-900">₹{item.price}</p>
                                      </div>

                                      <div className="flex items-center gap-2">
                                          <Button
                                              onClick={() => {
                                                  if (item.quantity === 1) {
                                                      onRemoveFromCart(item.id);
                                                  } else {
                                                      onUpdateQuantity(item.id, item.quantity - 1);
                                                  }
                                              }}
                                              size="sm"
                                              variant="outline"
                                              className="h-8 w-8 p-0"
                                          >
                                              <Minus className="w-4 h-4" />
                                          </Button>

                                          <span className="font-medium px-2">{item.quantity}</span>

                                          <Button
                                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                              size="sm"
                                              variant="outline"
                                              className="h-8 w-8 p-0"
                                          >
                                              <Plus className="w-4 h-4" />
                                          </Button>
                                      </div>
                                  </div>
                              ))}
                          </div>

                          {/* Coupon Selection */}
                          <Card className="border-orange-200 bg-orange-50/50">
                              <CardContent className="p-4">
                                  <div
                                      className="flex items-center justify-between cursor-pointer"
                                      onClick={() => setIsCouponDialogOpen(true)}
                                  >
                                      <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                              <Tag className="w-4 h-4 text-white" />
                                          </div>
                                          <div>
                                              {appliedCoupon ? (
                                                  <div>
                                                      <p className="font-medium text-gray-900">
                                                          {appliedCoupon.code} Applied
                                                      </p>
                                                      <p className="text-sm text-green-600">
                                                          You saved ₹{couponDiscount}
                                                      </p>
                                                  </div>
                                              ) : (
                                                  <div>
                                                      <p className="font-medium text-gray-900">Apply Coupon</p>
                                                      <p className="text-sm text-gray-600">Save more on this order</p>
                                                  </div>
                                              )}
                                          </div>
                                      </div>

                                      <div className="flex items-center gap-2">
                                          {appliedCoupon && (
                                              <Button
                                                  onClick={(e) => {
                                                      e.stopPropagation();
                                                      handleRemoveCoupon();
                                                  }}
                                                  variant="ghost"
                                                  size="sm"
                                                  className="text-red-600 hover:text-red-700 h-auto p-1"
                                              >
                                                  <X className="w-4 h-4" />
                                              </Button>
                                          )}
                                          <ChevronRight className="w-4 h-4 text-gray-400" />
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>

                          {/* Bill Summary */}
                          <Card className="border-green-200 bg-green-50/50">
                              <CardContent className="p-4">
                                  <div className="space-y-3">
                                      <div className="flex justify-between text-sm">
                                          <span>Subtotal ({totalItems} items)</span>
                                          <span className="font-medium">{formatCurrency(totalAmount)}</span>
                                      </div>

                                      <div className="flex justify-between text-sm">
                                          <span>Delivery Fee</span>
                                          <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : ""}`}>{deliveryFee === 0 ? "FREE!" : formatCurrency(deliveryFee)}</span>
                                      </div>

                                      {appliedCoupon && couponDiscount > 0 && (
                                          <div className="flex justify-between text-sm">
                                              <span>Coupon Discount ({appliedCoupon.code})</span>
                                              <span className="font-medium text-green-600">-{formatCurrency(couponDiscount)}</span>
                                          </div>
                                      )}

                                      {applyCashback && (
                                          <div className="flex justify-between text-sm">
                                              <span>Cashback Applied</span>
                                              <span className="font-medium text-green-600">-{formatCurrency(cashbackDiscount)}</span>
                                          </div>
                                      )}

                                      {totalAmount < 199 && !applyCashback && (
                                          <p className="text-xs text-green-600 font-medium">
                                              Add {formatCurrency(199 - totalAmount)} more for free delivery
                                          </p>
                                      )}

                                      <Separator className="my-2" />

                                      <div className="flex justify-between text-lg font-bold">
                                          <span>Total</span>
                                          <span className="text-green-600">{formatCurrency(finalAmount)}</span>
                                      </div>
                                  </div>
                              </CardContent>
                          </Card>

                          {/* Delivery Time */}
                          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                              <div className="flex items-center justify-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium text-blue-700">
                    Delivery in 8-12 minutes
                  </span>
                                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              </div>
                          </div>
                      </div>
                  )}
              </div>

              {/* Checkout Section */}
              {cartItems.length > 0 && (
                  <div className="border-t bg-white p-4 space-y-4">
                      {/* Delivery Location */}
                      <div
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-green-400 transition-colors"
                          onClick={handleLocationClick}
                      >
                          <div className="flex items-center gap-3 min-w-0">
                              <MapPin className="w-5 h-5 text-gray-600 flex-shrink-0" />
                              <div className="min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                      {selectedLocation ? `Delivering to ${selectedLocation.label}` : "Select delivery location"}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">
                                      {selectedLocation ? selectedLocation.flatInfo + ', ' + selectedLocation.buildingName + ', ' + selectedLocation.fullAddress : "No address selected"}
                                  </p>
                              </div>
                          </div>
                          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </div>

                      {/* Cashback Option */}
                      <div className="flex items-center gap-3 p-2">
                          <Checkbox
                              id="cashback"
                              checked={applyCashback}
                              onCheckedChange={(checked) => setApplyCashback(checked as boolean)}
                          />
                          <label
                              htmlFor="cashback"
                              className="text-sm font-medium cursor-pointer flex-1"
                          >
                              Apply ₹25 Free Cash
                          </label>
                          <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-xs text-gray-600">i</span>
                          </div>
                      </div>

                      {/* Pay Button */}
                      <Button
                          className="w-full h-14 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-400 text-white text-lg font-bold rounded-xl shadow-lg"
                          onClick={handleProceedToPayment}
                      >
                          <CreditCard className="w-5 h-5 mr-2" />
                          Click to Pay {formatCurrency(finalAmount)}
                      </Button>
                  </div>
              )}
          </div>

          {/* Location Modal */}
          <LocationModal
              isOpen={isLocationModalOpen}
              onClose={() => setIsLocationModalOpen(false)}
              selectedLocation={selectedLocation || undefined}
              onLocationChange={syncLocationFromStorage}
          />

          {/* Coupon Dialog */}
          <CouponDialog
              isOpen={isCouponDialogOpen}
              onClose={() => setIsCouponDialogOpen(false)}
              onApplyCoupon={handleApplyCoupon}
              appliedCoupon={appliedCoupon}
              cartTotal={totalAmount}
          />

      </>
  );
}

export default ShoppingCart