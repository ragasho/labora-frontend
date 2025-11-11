import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription 
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Card, CardContent } from './ui/card';
import { 
  Percent, 
  Truck, 
  Gift, 
  Clock,
  Tag,
  CheckCircle,
  Loader2,
  AlertCircle
} from 'lucide-react';
import  { API_ENDPOINTS } from "../config/constants.ts";
import type {Coupon} from '../types';
import { toast } from 'sonner';

interface CouponDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (coupon: Coupon) => void;
  appliedCoupon: Coupon | null;
  cartTotal: number;
}

export function CouponDialog({ 
  isOpen, 
  onClose, 
  onApplyCoupon, 
  appliedCoupon,
  cartTotal 
}: CouponDialogProps) {
  const [couponCode, setCouponCode] = useState('');
  //const [searchQuery, setSearchQuery] = useState('');
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("auth_token") || "";

  useEffect(() => {
    if (isOpen) {
      const fetchCoupons = async () => {
        setLoading(true);
        setError(null);
        try {
          // Pass cartTotal to the backend to potentially get more relevant coupons
          const res = await fetch(`${API_ENDPOINTS.coupons.get}?cartTotal=${cartTotal}`, {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          });
          const data = await res.json();
          if (!res.ok || !data.success) {
            throw new Error(data.message || 'Failed to fetch coupons');
          }
          setCoupons(data.coupons);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          setLoading(false);
        }
      };

      fetchCoupons();
    }
  }, [isOpen, cartTotal, token]);


  /*
  const filteredCoupons = coupons.filter(coupon =>
    coupon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  */

  const getCouponIcon = (type: Coupon['discountType']) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-5 h-5 text-green-600" />;
      case 'fixed':
        return <Tag className="w-5 h-5 text-blue-600" />;
      case 'free_delivery':
        return <Truck className="w-5 h-5 text-purple-600" />;
      default:
        return <Gift className="w-5 h-5 text-orange-600" />;
    }
  };

  const calculateDiscount = (coupon: Coupon, total: number) => {
    if (total < coupon.minCartValue) return 0;

    switch (coupon.discountType) {
      case 'percentage':
        const percentDiscount = (total * coupon.discountValue) / 100;
        return coupon.maxDiscount ? Math.min(percentDiscount, coupon.maxDiscount) : percentDiscount;
      case 'fixed':
        return coupon.discountValue;
      case 'free_delivery':
        return coupon.discountValue;
      default:
        return 0;
    }
  };

  const isEligible = (coupon: Coupon) => {
    return cartTotal >= coupon.minCartValue;
  };

  const handleApplyCoupon = (coupon: Coupon) => {
    if (!isEligible(coupon)) {
      toast.error(`Add ₹${coupon.minCartValue - cartTotal} more to use this coupon`);
      return;
    }
    
    onApplyCoupon(coupon);
    onClose();
    toast.success(`Coupon ${coupon.code} applied successfully!`);
  };

  const handleManualApply = () => {
    const coupon = coupons.find(c =>
      c.code.toLowerCase() === couponCode.toLowerCase()
    );
    
    if (!coupon) {
      toast.error('Invalid coupon code');
      return;
    }
    
    handleApplyCoupon(coupon);
    setCouponCode('');
  };

  const getDaysLeft = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Return null if expiryDate is not set or invalid
    return isNaN(diffDays) ? null : diffDays;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-green-600" />
            Available Coupons
          </DialogTitle>
          <DialogDescription>
            Choose from available coupons to save on your order or enter a coupon code manually.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Manual Coupon Code Entry */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Have a coupon code?</label>
            <div className="flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button 
                onClick={handleManualApply}
                disabled={!couponCode.trim()}
                variant="outline"
              >
                Apply
              </Button>
            </div>
          </div>

          {/*
          Search
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          */}

          <Separator />

          {/* Coupon List */}
          <ScrollArea className="h-80">
            <div className="space-y-3 pr-2">
              {loading && (
                  <div className="flex justify-center items-center p-8">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
              )}
              {error && !loading && (
                  <div className="flex flex-col items-center text-center p-8 text-red-600 bg-red-50 rounded-lg">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <p className="font-semibold">Oops! Something went wrong.</p>
                    <p className="text-sm">{error}</p>
                  </div>
              )}
              {!loading && !error && coupons.map((coupon) => {
                const discount = calculateDiscount(coupon, cartTotal);
                const eligible = isEligible(coupon);
                const isApplied = appliedCoupon?.couponId === coupon.couponId;
                const daysLeft = coupon.expiryDate ? getDaysLeft(coupon.expiryDate) : null;

                return (
                  <Card 
                    key={coupon.couponId}
                    className={`relative ${!eligible ? 'opacity-60' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          {getCouponIcon(coupon.discountType)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-gray-900">{coupon.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{coupon.description}</p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="text-xs font-bold"
                            >
                              {coupon.code}
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <p className="text-xs text-gray-500">
                                Min order: ₹{coupon.minCartValue}
                              </p>
                              {eligible && discount > 0 && (
                                <p className="text-xs text-green-600 font-medium">
                                  You save: ₹{discount}
                                </p>
                              )}
                              {daysLeft !== null && daysLeft <= 7 && (
                                <div className="flex items-center gap-1 text-xs text-orange-600">
                                  <Clock className="w-3 h-3" />
                                  {daysLeft === 1 ? 'Expires today' : `${daysLeft} days left`}
                                </div>
                              )}
                            </div>

                            <Button
                              onClick={() => handleApplyCoupon(coupon)}
                              disabled={!eligible || isApplied}
                              size="sm"
                              variant={isApplied ? "default" : "outline"}
                              className={isApplied ? "bg-green-600 hover:bg-green-700" : ""}
                            >
                              {isApplied ? (
                                <>
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Applied
                                </>
                              ) : eligible ? (
                                'Apply'
                              ) : (
                                'Not Eligible'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {!loading && !error && coupons.length > 0 && coupons.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Gift className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No coupons found</p>
                </div>
              )}
              {!loading && !error && coupons.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Gift className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No coupons available at the moment.</p>
                  </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}