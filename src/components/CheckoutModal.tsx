import { useState } from 'react';
import { X, MapPin, Clock, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import type { CartItem } from '../types';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { toast } from 'sonner';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    cartItems: CartItem[];
    totalAmount: number;
    onOrderSuccess: () => void;
}

export function CheckoutModal({
                                  isOpen,
                                  onClose,
                                  cartItems,
                                  totalAmount,
                                  onOrderSuccess
                              }: CheckoutModalProps) {
    const [loading, setLoading] = useState(false);
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const { user, getAccessToken } = useAuth();

    if (!isOpen) return null;

    const deliveryFee = totalAmount >= 199 ? 0 : 25;
    const finalAmount = totalAmount + deliveryFee;

    const handleProceedToPayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please sign in to place an order');
            return;
        }

        if (!deliveryAddress.trim()) {
            toast.error('Please enter a delivery address');
            return;
        }

        // Store delivery details and proceed to payment
        onOrderSuccess();
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
                        <h2 className="text-xl font-bold">Checkout</h2>
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X className="w-5 h-5" />
                        </Button>
                    </div>

                    <form onSubmit={handleProceedToPayment} className="p-6 space-y-6">
                        {/* Order Summary */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Order Summary
                            </h3>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                {cartItems.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span>{item.name} × {item.quantity}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}

                                <div className="border-t pt-2 space-y-1">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{totalAmount}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Delivery Fee</span>
                                        <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                    </span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>₹{finalAmount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Details */}
                        <div className="space-y-3">
                            <h3 className="font-semibold flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Delivery Details
                            </h3>

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address">Delivery Address *</Label>
                                    <Textarea
                                        id="address"
                                        placeholder="Enter your complete delivery address"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        required
                                        rows={3}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="Enter your phone number"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Time */}
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Estimated delivery: 8-12 minutes</span>
                            </div>
                            <p className="text-sm text-green-600 mt-1">
                                Your order will be delivered super fast!
                            </p>
                        </div>

                        {/* Proceed to Payment Button */}
                        <Button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 py-3"
                            disabled={loading}
                            size="lg"
                        >
                            {loading ? 'Processing...' : `Proceed to Payment - ₹${finalAmount}`}
                        </Button>

                        <p className="text-xs text-gray-500 text-center">
                            By placing this order, you agree to our terms and conditions.
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}