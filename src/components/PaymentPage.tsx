import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { 
  CreditCard, 
  Smartphone, 
  Building, 
  Banknote, 
  Shield, 
  ArrowLeft,
  CheckCircle,
  Loader2,
  Wallet,
  Star,
  Lock,
  Zap
} from 'lucide-react';
import type {CartItem} from '../types';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { toast } from 'sonner';

interface PaymentPageProps {
  onClose: () => void;
  cartItems: CartItem[];
  totalAmount: number;
  onPaymentSuccess: () => void;
}

type PaymentMethod = 'wallet' | 'upi' | 'netbanking' | 'debit' | 'credit' | 'cod';

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
    id: 'wallet' as PaymentMethod,
    name: 'Wallet',
    description: 'Pay from your wallet balance',
    icon: Wallet,
    gradient: 'from-emerald-400 to-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    iconColor: 'text-emerald-600',
    popular: true,
    badge: 'Instant'
  },
  {
    id: 'upi' as PaymentMethod,
    name: 'UPI',
    description: 'GPay, PhonePe, Paytm & more',
    icon: Smartphone,
    gradient: 'from-blue-400 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconColor: 'text-blue-600',
    popular: true,
    badge: 'Most Popular'
  },
  {
    id: 'debit' as PaymentMethod,
    name: 'Debit Card',
    description: 'Visa, Mastercard, RuPay',
    icon: CreditCard,
    gradient: 'from-purple-400 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconColor: 'text-purple-600',
    popular: true,
    badge: 'Secure'
  },
  {
    id: 'credit' as PaymentMethod,
    name: 'Credit Card',
    description: 'Visa, Mastercard, Amex',
    icon: CreditCard,
    gradient: 'from-orange-400 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconColor: 'text-orange-600',
    popular: false,
    badge: 'Rewards'
  },
  {
    id: 'netbanking' as PaymentMethod,
    name: 'Net Banking',
    description: 'All major banks supported',
    icon: Building,
    gradient: 'from-green-400 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    iconColor: 'text-green-600',
    popular: false,
    badge: ''
  },
  {
    id: 'cod' as PaymentMethod,
    name: 'Cash on Delivery',
    description: 'Pay when you receive',
    icon: Banknote,
    gradient: 'from-gray-400 to-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconColor: 'text-gray-600',
    popular: false,
    badge: 'No Advance'
  }
];

export function PaymentPage({ onClose, cartItems, totalAmount, onPaymentSuccess }: PaymentPageProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('wallet');
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
      case 'wallet':
        const walletBalance = 2450.75;
        if (walletBalance < totalAmount) {
          toast.error('Insufficient wallet balance. Please add money to your wallet.');
          return false;
        }
        return true;
        
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
      // Simulate payment processing
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
      
      const paymentMethodName = selectedMethod === 'wallet' ? 'Wallet' 
        : selectedMethod === 'upi' ? 'UPI' 
        : selectedMethod === 'cod' ? 'Cash on Delivery'
        : selectedMethod.charAt(0).toUpperCase() + selectedMethod.slice(1) + ' Card';
      
      toast.success(`Payment successful via ${paymentMethodName}!`);
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

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const finalAmount = totalAmount + (selectedMethod === 'cod' ? 10 : 0);

  return (
    <div className="fixed inset-0 bg-gray-50 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex items-center gap-2 hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-gray-900">Choose Payment Method</h1>
              <p className="text-sm text-gray-600">Complete your order securely</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-green-600">{formatCurrency(finalAmount)}</div>
              {selectedMethod === 'cod' && (
                <div className="text-xs text-gray-500">Includes ₹10 COD charges</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Payment Options
                </h2>
                
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const isSelected = selectedMethod === method.id;
                    return (
                      <Card
                        key={method.id}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                          isSelected
                            ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50'
                            : `${method.bgColor} ${method.borderColor} hover:shadow-lg`
                        }`}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${method.gradient} flex items-center justify-center flex-shrink-0`}>
                              <method.icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm text-gray-900">{method.name}</h4>
                                {method.badge && (
                                  <Badge 
                                    variant="secondary" 
                                    className="text-xs px-2 py-0.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0"
                                  >
                                    {method.badge}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5">{method.description}</p>
                            </div>
                            {isSelected && (
                              <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-100">
                  <div className="flex items-center gap-2 text-sm text-green-700 mb-2">
                    <Shield className="w-4 h-4" />
                    <span className="font-medium">100% Secure Payment</span>
                  </div>
                  <p className="text-xs text-green-600">
                    Your payment information is encrypted and protected by industry-standard security measures.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                {/* Selected Method Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-r ${selectedMethodData?.gradient} shadow-lg mb-4`}>
                    {selectedMethodData && (
                      <selectedMethodData.icon className="w-10 h-10 text-white" />
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedMethodData?.name}</h3>
                  <p className="text-gray-600">{selectedMethodData?.description}</p>
                </div>

                <Separator className="mb-8" />

                {/* Payment Forms */}
                {selectedMethod === 'wallet' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                        <Wallet className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-emerald-800 mb-4">Pay from Wallet</h4>
                      
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Available Balance:</span>
                            <span className="text-xl font-bold text-emerald-600">₹2,450.75</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">Order Amount:</span>
                            <span className="font-semibold">₹{totalAmount.toFixed(2)}</span>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <span className="text-gray-900 font-medium">Remaining Balance:</span>
                            <span className="text-lg font-bold text-emerald-600">
                              ₹{(2450.75 - totalAmount).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Zap className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Instant Payment</p>
                        <p className="text-xs text-gray-600">Process in seconds</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Shield className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">Secure & Safe</p>
                        <p className="text-xs text-gray-600">Bank-grade security</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg text-center">
                        <Star className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                        <p className="text-sm font-medium text-gray-900">No Extra Charges</p>
                        <p className="text-xs text-gray-600">Zero transaction fee</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMethod === 'upi' && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Label htmlFor="upi-id" className="text-lg font-medium">Enter your UPI ID</Label>
                      <p className="text-sm text-gray-600 mt-1">We support all UPI apps</p>
                    </div>
                    
                    <div className="max-w-md mx-auto">
                      <Input
                        id="upi-id"
                        placeholder="yourname@paytm"
                        value={paymentData.upi.id}
                        onChange={(e) => handleInputChange('upi', 'id', e.target.value)}
                        className="text-center text-lg py-4 border-2 focus:border-blue-400"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Lock className="w-4 h-4" />
                      <span>Secured with bank-grade encryption</span>
                    </div>

                    <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
                      {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map((app) => (
                        <div key={app} className="bg-gray-50 p-3 rounded-lg text-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded mx-auto mb-2"></div>
                          <p className="text-xs font-medium text-gray-700">{app}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedMethod === 'netbanking' && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <Label className="text-lg font-medium">Select Your Bank</Label>
                      <p className="text-sm text-gray-600 mt-1">Choose from popular banks</p>
                    </div>
                    
                    <div className="grid gap-3 max-w-lg mx-auto">
                      {popularBanks.map((bank) => (
                        <Button
                          key={bank}
                          variant={paymentData.netbanking.bank === bank ? "default" : "outline"}
                          className="h-auto p-4 justify-start text-left hover:shadow-md transition-shadow"
                          onClick={() => handleInputChange('netbanking', 'bank', bank)}
                        >
                          <Building className="w-5 h-5 mr-3 flex-shrink-0" />
                          <span className="font-medium">{bank}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedMethod === 'debit' || selectedMethod === 'credit') && (
                  <div className="space-y-6 max-w-lg mx-auto">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="card-number" className="text-sm font-medium">Card Number</Label>
                        <Input
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          value={paymentData[selectedMethod].number}
                          onChange={(e) => handleInputChange(selectedMethod, 'number', formatCardNumber(e.target.value))}
                          maxLength={19}
                          className="text-lg py-4 mt-2 border-2 focus:border-purple-400"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry" className="text-sm font-medium">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            value={paymentData[selectedMethod].expiry}
                            onChange={(e) => handleInputChange(selectedMethod, 'expiry', formatExpiry(e.target.value))}
                            maxLength={5}
                            className="py-4 mt-2 border-2 focus:border-purple-400"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv" className="text-sm font-medium">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            value={paymentData[selectedMethod].cvv}
                            onChange={(e) => handleInputChange(selectedMethod, 'cvv', e.target.value.replace(/[^0-9]/g, ''))}
                            maxLength={4}
                            className="py-4 mt-2 border-2 focus:border-purple-400"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="card-name" className="text-sm font-medium">Cardholder Name</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={paymentData[selectedMethod].name}
                          onChange={(e) => handleInputChange(selectedMethod, 'name', e.target.value.toUpperCase())}
                          className="py-4 mt-2 border-2 focus:border-purple-400"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Shield className="w-4 h-4" />
                      <span>Your card details are encrypted and secure</span>
                    </div>
                  </div>
                )}

                {selectedMethod === 'cod' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-8 text-center">
                      <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Banknote className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-yellow-800 mb-4">Cash on Delivery</h4>
                      <p className="text-gray-700 mb-6">
                        Pay with cash when your order is delivered to your doorstep.
                      </p>
                      
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <div className="space-y-3 text-left">
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">No advance payment required</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Pay only when you receive your order</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-orange-500 flex-shrink-0" />
                            <span className="text-sm text-gray-700">Additional COD charges: ₹10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="bg-white border-t border-gray-200 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="text-sm text-gray-600">Total Amount</div>
              <div className="text-xl font-bold text-gray-900">{formatCurrency(finalAmount)}</div>
            </div>
            <Button
              onClick={handlePayment}
              disabled={isProcessing}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5 mr-2" />
                  Pay Securely
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}