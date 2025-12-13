import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import {
    CreditCard,
    Smartphone,
    Building,
    Banknote,
    Shield,
    ArrowLeft,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { toast } from 'sonner';

interface PaymentModalProps {
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
    totalAmount: number;
    onPaymentSuccess: () => void;
}

type PaymentMethod = 'upi' | 'netbanking' | 'debit' | 'credit' | 'cod';

interface PaymentFormData {
    upi: {
        id: string;
    };
    netbanking: {
        bank: string;
    };
    debit: {
        number: string;
        expiry: string;
        cvv: string;
        name: string;
    };
    credit: {
        number: string;
        expiry: string;
        cvv: string;
        name: string;
    };
}

const popularBanks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Kotak Mahindra Bank', 'Punjab National Bank'
];

const paymentMethods = [
    {
        id: 'upi' as PaymentMethod,
        name: 'UPI',
        description: 'Pay using GPay, PhonePe, Paytm',
        icon: Smartphone,
        color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
        iconColor: 'text-blue-600',
        popular: true
    },
    {
        id: 'debit' as PaymentMethod,
        name: 'Debit Card',
        description: 'Visa, Mastercard, RuPay',
        icon: CreditCard,
        color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
        iconColor: 'text-purple-600',
        popular: true
    },
    {
        id: 'credit' as PaymentMethod,
        name: 'Credit Card',
        description: 'Visa, Mastercard, Amex',
        icon: CreditCard,
        color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
        iconColor: 'text-orange-600',
        popular: false
    },
    {
        id: 'netbanking' as PaymentMethod,
        name: 'Net Banking',
        description: 'All major banks supported',
        icon: Building,
        color: 'bg-green-50 border-green-200 hover:bg-green-100',
        iconColor: 'text-green-600',
        popular: false
    },
    {
        id: 'cod' as PaymentMethod,
        name: 'Cash on Delivery',
        description: 'Pay when you receive',
        icon: Banknote,
        color: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
        iconColor: 'text-gray-600',
        popular: false
    }
];

export function PaymentModal({ isOpen, onClose, cartItems, totalAmount, onPaymentSuccess }: PaymentModalProps) {
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('upi');
    const [isProcessing, setIsProcessing] = useState(false);
    const { user, token } = useAuth();

    const [paymentData, setPaymentData] = useState<PaymentFormData>({
        upi: { id: '' },
        netbanking: { bank: '' },
        debit: { number: '', expiry: '', cvv: '', name: '' },
        credit: { number: '', expiry: '', cvv: '', name: '' }
    });

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    const handleInputChange = (method: keyof PaymentFormData, field: string, value: string) => {
        setPaymentData(prev => ({
            ...prev,
            [method]: {
                ...prev[method],
                [field]: value
            }
        }));
    };

    const validatePaymentForm = (): boolean => {
        switch (selectedMethod) {
            case 'upi':
                if (!paymentData.upi.id.trim()) {
                    toast.error('Please enter UPI ID');
                    return false;
                }
                if (!paymentData.upi.id.includes('@')) {
                    toast.error('Please enter a valid UPI ID');
                    return false;
                }
                break;

            case 'netbanking':
                if (!paymentData.netbanking.bank) {
                    toast.error('Please select a bank');
                    return false;
                }
                break;

            case 'debit':
            case 'credit':
                const cardData = paymentData[selectedMethod];
                if (!cardData.number.trim() || cardData.number.length < 16) {
                    toast.error('Please enter a valid card number');
                    return false;
                }
                if (!cardData.expiry.trim() || !/^\d{2}\/\d{2}$/.test(cardData.expiry)) {
                    toast.error('Please enter expiry in MM/YY format');
                    return false;
                }
                if (!cardData.cvv.trim() || cardData.cvv.length < 3) {
                    toast.error('Please enter a valid CVV');
                    return false;
                }
                if (!cardData.name.trim()) {
                    toast.error('Please enter cardholder name');
                    return false;
                }
                break;

            case 'cod':
                break;

            default:
                return false;
        }
        return true;
    };

    const handlePayment = async () => {
        if (!validatePaymentForm()) return;

        if (!user) {
            toast.error('Please sign in to complete payment');
            return;
        }

        setIsProcessing(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));

            const accessToken = await token();
            if (!accessToken) {
                toast.error('Authentication error. Please sign in again.');
                return;
            }

            const finalAmount = totalAmount + (selectedMethod === 'cod' ? 10 : 0);
            const deliveryAddress = "Default delivery address";

            const orderData = await apiService.createOrder(
                cartItems,
                deliveryAddress,
                finalAmount,
                accessToken
            );

            toast.success(`Payment successful via ${selectedMethod.toUpperCase()}!`);
            onPaymentSuccess();
        } catch (error) {
            console.error('Payment/Order error:', error);
            toast.error('Payment failed. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const formatCardNumber = (value: string) => {
        const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const match = cleaned.match(/\d{4,16}/g);
        const cardNumber = match && match[0] || '';
        const parts = [];

        for (let i = 0, len = cardNumber.length; i < len; i += 4) {
            parts.push(cardNumber.substring(i, i + 4));
        }

        return parts.length ? parts.join(' ') : cleaned;
    };

    const formatExpiry = (value: string) => {
        const cleaned = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    const renderPaymentForm = () => {
        const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

        return (
            <div className="space-y-6">
                <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${selectedMethodData?.color} mb-4`}>
                        {selectedMethodData && (
                            <selectedMethodData.icon className={`w-8 h-8 ${selectedMethodData.iconColor}`} />
                        )}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{selectedMethodData?.name}</h3>
                    <p className="text-gray-600">{selectedMethodData?.description}</p>
                </div>

                <Separator />

                {selectedMethod === 'upi' && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <Label htmlFor="upi-id" className="text-lg">Enter your UPI ID</Label>
                        </div>
                        <Input
                            id="upi-id"
                            placeholder="yourname@paytm"
                            value={paymentData.upi.id}
                            onChange={(e) => handleInputChange('upi', 'id', e.target.value)}
                            className="text-center text-lg py-4"
                        />
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Shield className="w-4 h-4" />
                            <span>Secured with bank-grade encryption</span>
                        </div>
                    </div>
                )}

                {selectedMethod === 'netbanking' && (
                    <div className="space-y-4">
                        <div className="text-center">
                            <Label className="text-lg">Select Your Bank</Label>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            {popularBanks.map((bank) => (
                                <Button
                                    key={bank}
                                    variant={paymentData.netbanking.bank === bank ? "default" : "outline"}
                                    className="h-auto p-4 justify-start text-left"
                                    onClick={() => handleInputChange('netbanking', 'bank', bank)}
                                >
                                    <Building className="w-5 h-5 mr-3" />
                                    {bank}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {(selectedMethod === 'debit' || selectedMethod === 'credit') && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="card-number">Card Number</Label>
                            <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                                value={paymentData[selectedMethod].number}
                                onChange={(e) => handleInputChange(selectedMethod, 'number', formatCardNumber(e.target.value))}
                                maxLength={19}
                                className="text-lg py-4"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="expiry">Expiry Date</Label>
                                <Input
                                    id="expiry"
                                    placeholder="MM/YY"
                                    value={paymentData[selectedMethod].expiry}
                                    onChange={(e) => handleInputChange(selectedMethod, 'expiry', formatExpiry(e.target.value))}
                                    maxLength={5}
                                    className="py-4"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                    id="cvv"
                                    placeholder="123"
                                    type="password"
                                    value={paymentData[selectedMethod].cvv}
                                    onChange={(e) => handleInputChange(selectedMethod, 'cvv', e.target.value.replace(/[^0-9]/g, ''))}
                                    maxLength={4}
                                    className="py-4"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="card-name">Cardholder Name</Label>
                            <Input
                                id="card-name"
                                placeholder="John Doe"
                                value={paymentData[selectedMethod].name}
                                onChange={(e) => handleInputChange(selectedMethod, 'name', e.target.value.toUpperCase())}
                                className="py-4"
                            />
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                            <Shield className="w-4 h-4" />
                            <span>Your card details are encrypted and secure</span>
                        </div>
                    </div>
                )}

                {selectedMethod === 'cod' && (
                    <div className="space-y-4">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <Banknote className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                            <h4 className="font-medium text-yellow-800 mb-2">Cash on Delivery</h4>
                            <p className="text-sm text-yellow-700">
                                Pay with cash when your order is delivered to your doorstep.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="text-sm text-gray-600 space-y-2">
                                <p>✓ No advance payment required</p>
                                <p>✓ Pay only when you receive your order</p>
                                <p>✓ Additional COD charges: ₹10</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const finalAmount = totalAmount + (selectedMethod === 'cod' ? 10 : 0);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0">
                <DialogHeader className="sr-only">
                    <DialogTitle>Choose Payment Method</DialogTitle>
                    <DialogDescription>Select how you'd like to pay for your order</DialogDescription>
                </DialogHeader>
                <div className="p-6 border-b bg-gray-50">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold">Choose Payment Method</h2>
                        <p className="text-gray-600 mt-1">Select how you'd like to pay for your order</p>
                    </div>

                    {/* Total Amount Display */}
                    <div className="mt-6 bg-white rounded-lg p-4 border-2 border-green-200">
                        <div className="flex items-center justify-between">
                            <span className="text-lg font-medium text-gray-700">Total Amount</span>
                            <span className="text-2xl font-bold text-green-600">{formatCurrency(finalAmount)}</span>
                        </div>
                        {selectedMethod === 'cod' && (
                            <p className="text-sm text-gray-500 mt-1">Includes ₹10 COD charges</p>
                        )}
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Payment Method Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {paymentMethods.map((method) => (
                            <Card
                                key={method.id}
                                className={`cursor-pointer transition-all duration-200 ${
                                    selectedMethod === method.id
                                        ? 'ring-2 ring-green-500 border-green-200 bg-green-50'
                                        : `${method.color} border-2`
                                }`}
                                onClick={() => setSelectedMethod(method.id)}
                            >
                                <CardContent className="p-4 text-center">
                                    <method.icon className={`w-8 h-8 mx-auto mb-2 ${
                                        selectedMethod === method.id ? 'text-green-600' : method.iconColor
                                    }`} />
                                    <h4 className="font-medium text-sm">{method.name}</h4>
                                    {method.popular && (
                                        <span className="inline-block mt-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      Popular
                    </span>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Payment Form */}
                    {renderPaymentForm()}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={onClose} className="flex-1 py-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <Button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="flex-1 bg-green-600 hover:bg-green-700 py-6 text-lg"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                    Pay {formatCurrency(finalAmount)}
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}