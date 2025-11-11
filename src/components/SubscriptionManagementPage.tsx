import { useState, memo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
    ArrowLeft,
    Check,
    Calendar,
    Clock,
    Milk,
    ShoppingBasket,
    Shield,
    Zap,
    Star,
    TrendingUp,
    Gift,
    Package,
    Sparkles,
    Crown,
    Truck,
    CreditCard,
    HelpCircle,
    Mail,
    Phone,
    ChevronRight,
    AlertCircle,
    X,
    RefreshCw,
    CheckCircle,
    XCircle,
    ArrowUpCircle,
    PauseCircle,
    PlayCircle,
    Plus,
    Minus
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SubscriptionManagementPageProps {
    onBack: () => void;
    language: 'en' | 'ta';
}

// Milk types
const milkTypes = [
    { id: 'cow', name: 'Cow Milk', nameTamil: 'பசு பால்', icon: '🐄' },
    { id: 'buffalo', name: 'Buffalo Milk', nameTamil: 'எருமை பால்', icon: '🐃' },
    { id: 'a2', name: 'A2 Milk', nameTamil: 'A2 பால்', icon: '🥛' }
];

// Milk subscription plans
const milkPlans = [
    {
        id: 'milk-daily',
        name: 'Daily Plan',
        nameTamil: 'தினசரி திட்டம்',
        price: 1950,
        period: 'month',
        features: [
            { text: 'Fresh milk every morning', icon: Milk },
            { text: 'Free delivery', icon: Truck },
            { text: 'Pause anytime', icon: Clock },
            { text: 'Quality guaranteed', icon: Shield }
        ],
        popular: true
    },
    {
        id: 'milk-weekly',
        name: 'Weekly Plan',
        nameTamil: 'வாராந்திர திட்டம்',
        price: 899,
        period: 'month',
        features: [
            { text: '4 deliveries per month', icon: Calendar },
            { text: 'Flexible schedule', icon: Clock },
            { text: 'Free delivery', icon: Truck },
            { text: 'Premium quality', icon: Star }
        ],
        popular: false
    },
    {
        id: 'milk-monthly',
        name: 'Monthly Bundle',
        nameTamil: 'மாதாந்திர மூட்டை',
        price: 1799,
        period: 'month',
        features: [
            { text: '30L bulk delivery', icon: Package },
            { text: 'Best value pricing', icon: TrendingUp },
            { text: 'Storage friendly', icon: Shield },
            { text: 'Save 15%', icon: Gift }
        ],
        popular: false
    }
];

// Grocery subscription plans
const groceryPlans = [
    {
        id: 'grocery-basic',
        name: 'Basic',
        nameTamil: 'அடிப்படை',
        price: 999,
        period: 'month',
        features: [
            { text: '4 deliveries/month', icon: Calendar },
            { text: 'Standard delivery', icon: Truck },
            { text: '1% cashback', icon: CreditCard },
            { text: 'Order up to ₹5,000', icon: ShoppingBasket }
        ],
        tier: 'basic'
    },
    {
        id: 'grocery-plus',
        name: 'Plus',
        nameTamil: 'பிளஸ்',
        price: 2499,
        period: 'month',
        features: [
            { text: '8 deliveries/month', icon: Calendar },
            { text: 'Priority delivery', icon: Zap },
            { text: '3% cashback', icon: CreditCard },
            { text: 'Order up to ₹15,000', icon: ShoppingBasket }
        ],
        tier: 'plus',
        popular: true
    },
    {
        id: 'grocery-premium',
        name: 'Premium',
        nameTamil: 'பிரீமியம்',
        price: 4999,
        period: 'month',
        features: [
            { text: 'Unlimited deliveries', icon: Calendar },
            { text: 'Express delivery (2hrs)', icon: Zap },
            { text: '5% cashback', icon: CreditCard },
            { text: 'Unlimited orders', icon: Crown }
        ],
        tier: 'premium'
    }
];

// Recommended add-ons
const addOns = [
    {
        id: 'addon-1',
        name: 'Fresh Bread Daily',
        nameTamil: 'தினசரி புதிய ரொட்டி',
        price: 399,
        period: 'month',
        image: '🍞',
        description: 'Freshly baked bread delivered with your milk'
    },
    {
        id: 'addon-2',
        name: 'Fruit Box',
        nameTamil: 'பழ பெட்டி',
        price: 899,
        period: 'month',
        image: '🍎',
        description: 'Seasonal fresh fruits, 2kg per week'
    },
    {
        id: 'addon-3',
        name: 'Snack Pack',
        nameTamil: 'சிற்றுண்டி பேக்',
        price: 599,
        period: 'month',
        image: '🍪',
        description: 'Healthy snacks and beverages monthly'
    },
    {
        id: 'addon-4',
        name: 'Beverage Bundle',
        nameTamil: 'பானம் மூட்டை',
        price: 699,
        period: 'month',
        image: '☕',
        description: 'Coffee, tea, and juice variety pack'
    }
];

// Active Subscription Card Component
const ActiveSubscriptionCard = memo(({ subscription, language, onCancel, onUpgrade, onPause, onResume }: any) => {
    const isPaused = subscription.status === 'paused';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`border-2 ${isPaused ? 'border-orange-200 bg-gradient-to-br from-white to-orange-50/30' : 'border-green-200 bg-gradient-to-br from-white to-green-50/30'} shadow-lg hover:shadow-xl transition-all overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-32 h-32 ${isPaused ? 'bg-orange-400' : 'bg-green-400'} rounded-full blur-3xl opacity-10`}></div>
                <CardContent className="p-6 relative">
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className={`w-14 h-14 bg-gradient-to-br ${isPaused ? 'from-orange-400 to-orange-500' : 'from-green-400 to-green-500'} rounded-2xl flex items-center justify-center text-3xl shadow-lg`}>
                                {subscription.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{subscription.planName}</h3>
                                <p className="text-sm text-gray-600">
                                    {subscription.quantity || subscription.deliveries}
                                </p>
                                {subscription.milkType && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {milkTypes.find(t => t.id === subscription.milkType)?.[language === 'en' ? 'name' : 'nameTamil']}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Badge className={`${isPaused ? 'bg-orange-100 text-orange-700 border-orange-300' : 'bg-green-100 text-green-700 border-green-300'}`}>
                            {isPaused ? (
                                <>
                                    <PauseCircle className="w-3 h-3 mr-1" />
                                    {language === 'en' ? 'Paused' : 'இடைநிறுத்தப்பட்டது'}
                                </>
                            ) : (
                                <>
                                    <Check className="w-3 h-3 mr-1" />
                                    {language === 'en' ? 'Active' : 'செயலில்'}
                                </>
                            )}
                        </Badge>
                    </div>

                    <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                  {language === 'en' ? 'Next Renewal' : 'அடுத்த புதுப்பிப்பு'}
              </span>
                            <span className="font-semibold">{subscription.nextRenewal}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                  {language === 'en' ? 'Amount' : 'தொகை'}
              </span>
                            <span className={`font-bold ${isPaused ? 'text-orange-600' : 'text-green-600'} text-lg`}>₹{subscription.price}</span>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {isPaused ? (
                            <Button
                                variant="outline"
                                className="flex-1 border-green-200 text-green-600 hover:bg-green-50"
                                onClick={() => onResume(subscription)}
                            >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Resume' : 'மீண்டும் தொடங்கு'}
                            </Button>
                        ) : (
                            <Button
                                variant="outline"
                                className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                                onClick={() => onPause(subscription)}
                            >
                                <PauseCircle className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Pause' : 'இடைநிறுத்து'}
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                            onClick={() => onCancel(subscription)}
                        >
                            <X className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Cancel' : 'ரத்து'}
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                            onClick={() => onUpgrade(subscription)}
                        >
                            <TrendingUp className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Upgrade' : 'மேம்படுத்து'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
});

ActiveSubscriptionCard.displayName = 'ActiveSubscriptionCard';

// Active Add-on Card Component
const ActiveAddOnCard = memo(({ addon, language, onRemove }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
    >
        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-white to-yellow-50/20 shadow hover:shadow-md transition-all overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex items-center justify-center text-3xl shadow-sm flex-shrink-0">
                        {addon.image}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm truncate">
                            {language === 'en' ? addon.name : addon.nameTamil}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-1">{addon.description}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                        <span className="text-lg font-bold text-yellow-600">₹{addon.price}</span>
                        <span className="text-xs text-gray-500">/mo</span>
                    </div>
                    <Button
                        size="sm"
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 h-8"
                        onClick={() => onRemove(addon)}
                    >
                        <X className="w-3 h-3" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    </motion.div>
));

ActiveAddOnCard.displayName = 'ActiveAddOnCard';

// Milk Plan Card
const MilkPlanCard = memo(({ plan, language, onSubscribe, isUpgrade = false }: any) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
    >
        <Card className="relative overflow-hidden border-2 border-gray-200 hover:border-blue-300 hover:shadow-2xl transition-all h-full">
            {plan.popular && (
                <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 border-yellow-500 shadow-lg">
                        <Star className="w-3 h-3 mr-1 fill-yellow-900" />
                        {language === 'en' ? 'Popular' : 'பிரபலமான'}
                    </Badge>
                </div>
            )}

            <div className="h-32 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 flex items-center justify-center relative overflow-hidden">
                <motion.div
                    className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full blur-2xl opacity-20"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                />
                <span className="text-6xl">🥛</span>
            </div>

            <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2">
                    {language === 'en' ? plan.name : plan.nameTamil}
                </h3>

                <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-blue-600">₹{plan.price}</span>
                        <span className="text-gray-500">/{language === 'en' ? plan.period : 'மாதம்'}</span>
                    </div>
                </div>

                <div className="space-y-3 mb-6">
                    {plan.features.map((feature: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <feature.icon className="w-4 h-4 text-blue-600" />
                            </div>
                            <span>{feature.text}</span>
                        </div>
                    ))}
                </div>

                <Button
                    onClick={() => onSubscribe(plan)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white h-11 shadow-lg"
                >
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isUpgrade
                        ? (language === 'en' ? 'Select Plan' : 'திட்டத்தை தேர்ந்தெடு')
                        : (language === 'en' ? 'Subscribe' : 'சந்தா செய்')
                    }
                </Button>
            </CardContent>
        </Card>
    </motion.div>
));

MilkPlanCard.displayName = 'MilkPlanCard';

// Grocery Plan Card
const GroceryPlanCard = memo(({ plan, language, onSubscribe, isUpgrade = false }: any) => {
    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'basic': return { from: 'from-gray-400', to: 'to-gray-500', icon: 'text-gray-600', bg: 'bg-gray-100' };
            case 'plus': return { from: 'from-green-400', to: 'to-emerald-500', icon: 'text-green-600', bg: 'bg-green-100' };
            case 'premium': return { from: 'from-purple-400', to: 'to-pink-500', icon: 'text-purple-600', bg: 'bg-purple-100' };
            default: return { from: 'from-gray-400', to: 'to-gray-500', icon: 'text-gray-600', bg: 'bg-gray-100' };
        }
    };

    const colors = getTierColor(plan.tier);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.3 }}
        >
            <Card className={`relative overflow-hidden border-2 ${plan.popular ? 'border-green-400 shadow-xl shadow-green-100' : 'border-gray-200'} hover:shadow-2xl transition-all h-full`}>
                {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-emerald-500" />
                )}

                {plan.popular && (
                    <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-500 shadow-lg">
                            <Crown className="w-3 h-3 mr-1 fill-white" />
                            {language === 'en' ? 'Best Value' : 'சிறந்த மதிப்பு'}
                        </Badge>
                    </div>
                )}

                <div className={`h-32 bg-gradient-to-br ${colors.from} ${colors.to} flex items-center justify-center relative overflow-hidden`}>
                    <motion.div
                        className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl opacity-20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <span className="text-6xl">🛒</span>
                </div>

                <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">
                        {language === 'en' ? plan.name : plan.nameTamil}
                    </h3>

                    <div className="mb-4">
                        <div className="flex items-baseline gap-1">
                            <span className={`text-3xl font-bold ${colors.icon}`}>₹{plan.price}</span>
                            <span className="text-gray-500">/{language === 'en' ? plan.period : 'மாதம்'}</span>
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        {plan.features.map((feature: any, index: number) => (
                            <div key={index} className="flex items-center gap-3 text-sm">
                                <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                                    <feature.icon className={`w-4 h-4 ${colors.icon}`} />
                                </div>
                                <span>{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    <Button
                        onClick={() => onSubscribe(plan)}
                        className={`w-full ${plan.popular ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700' : 'bg-gradient-to-r ' + colors.from + ' ' + colors.to} text-white h-11 shadow-lg`}
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        {isUpgrade
                            ? (language === 'en' ? 'Select Plan' : 'திட்டத்தை தேர்ந்தெடு')
                            : (language === 'en' ? 'Subscribe' : 'சந்தா செய்')
                        }
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );
});

GroceryPlanCard.displayName = 'GroceryPlanCard';

// Add-on Card
const AddOnCard = memo(({ addon, language, onAdd, isAdded }: any) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.03 }}
        transition={{ duration: 0.2 }}
    >
        <Card className={`border-2 ${isAdded ? 'border-green-300 bg-green-50/50' : 'border-gray-200 hover:border-yellow-300'} hover:shadow-lg transition-all overflow-hidden`}>
            <CardContent className="p-5">
                <div className="flex items-start gap-4 mb-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-4xl shadow-md flex-shrink-0">
                        {addon.image}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold mb-1 truncate">
                            {language === 'en' ? addon.name : addon.nameTamil}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2">{addon.description}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-yellow-600">₹{addon.price}</span>
                        <span className="text-xs text-gray-500">/mo</span>
                    </div>
                    {isAdded ? (
                        <Badge className="bg-green-100 text-green-700 border-green-300">
                            <Check className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'Added' : 'சேர்க்கப்பட்டது'}
                        </Badge>
                    ) : (
                        <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-400 text-yellow-700 hover:bg-yellow-50"
                            onClick={() => onAdd(addon)}
                        >
                            <Plus className="w-3 h-3 mr-1" />
                            {language === 'en' ? 'Add' : 'சேர்'}
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    </motion.div>
));

AddOnCard.displayName = 'AddOnCard';

export function SubscriptionManagementPage({ onBack, language }: SubscriptionManagementPageProps) {
    // Refs for scrolling
    const milkSectionRef = useRef<HTMLDivElement>(null);
    const grocerySectionRef = useRef<HTMLDivElement>(null);

    // State for active subscriptions and add-ons
    const [activeSubscriptions, setActiveSubscriptions] = useState<any[]>([]);
    const [activeAddOns, setActiveAddOns] = useState<any[]>([]);

    // Dialog states
    const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
    const [subscribeDialogOpen, setSubscribeDialogOpen] = useState(false);
    const [addOnDialogOpen, setAddOnDialogOpen] = useState(false);
    const [removeAddonDialogOpen, setRemoveAddonDialogOpen] = useState(false);
    const [pauseDialogOpen, setPauseDialogOpen] = useState(false);
    const [resumeDialogOpen, setResumeDialogOpen] = useState(false);

    // Selected items
    const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [selectedAddon, setSelectedAddon] = useState<any>(null);
    const [selectedMilkType, setSelectedMilkType] = useState<string>('cow');
    const [selectedLiters, setSelectedLiters] = useState<number>(1);

    // Other states
    const [cancelReason, setCancelReason] = useState('');
    const [pauseDuration, setPauseDuration] = useState('7');
    const [processing, setProcessing] = useState(false);
    const [upgrading, setUpgrading] = useState(false);

    const handleCancel = useCallback((subscription: any) => {
        setSelectedSubscription(subscription);
        setCancelDialogOpen(true);
    }, []);

    const confirmCancel = async () => {
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Remove subscription
        setActiveSubscriptions(prev => prev.filter(sub => sub.id !== selectedSubscription.id));

        setCancelDialogOpen(false);
        setProcessing(false);
        setCancelReason('');

        toast.success(
            language === 'en'
                ? `${selectedSubscription.planName} cancelled successfully!`
                : `${selectedSubscription.planName} வெற்றிகரமாக ரத்து செய்யப்பட்டது!`,
            {
                description: language === 'en'
                    ? 'You will receive a refund for unused days within 5-7 business days.'
                    : 'பயன்படுத்தப்படாத நாட்களுக்கு 5-7 வணிக நாட்களுக்குள் பணத்தைத் திரும்பப் பெறுவீர்கள்.'
            }
        );
    };

    const handlePause = useCallback((subscription: any) => {
        setSelectedSubscription(subscription);
        setPauseDialogOpen(true);
    }, []);

    const confirmPause = async () => {
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update subscription status
        setActiveSubscriptions(prev =>
            prev.map(sub =>
                sub.id === selectedSubscription.id
                    ? { ...sub, status: 'paused', pausedUntil: new Date(Date.now() + parseInt(pauseDuration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
                    : sub
            )
        );

        setPauseDialogOpen(false);
        setProcessing(false);

        toast.success(
            language === 'en'
                ? `${selectedSubscription.planName} paused successfully!`
                : `${selectedSubscription.planName} வெற்றிகரமாக இடைநிறுத்தப்பட்டது!`,
            {
                description: language === 'en'
                    ? `Subscription will resume after ${pauseDuration} days.`
                    : `${pauseDuration} நாட்களுக்குப் பிறகு சந்தா மீண்டும் தொடங்கும்.`,
                icon: <PauseCircle className="w-5 h-5 text-orange-600" />
            }
        );
    };

    const handleResume = useCallback((subscription: any) => {
        setSelectedSubscription(subscription);
        setResumeDialogOpen(true);
    }, []);

    const confirmResume = async () => {
        setProcessing(true);
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update subscription status
        setActiveSubscriptions(prev =>
            prev.map(sub =>
                sub.id === selectedSubscription.id
                    ? { ...sub, status: 'active', pausedUntil: undefined }
                    : sub
            )
        );

        setResumeDialogOpen(false);
        setProcessing(false);

        toast.success(
            language === 'en'
                ? `${selectedSubscription.planName} resumed successfully!`
                : `${selectedSubscription.planName} வெற்றிகரமாக மீண்டும் தொடங்கப்பட்டது!`,
            {
                description: language === 'en'
                    ? 'Your deliveries will continue as scheduled.'
                    : 'உங்கள் டெலிவரிகள் திட்டமிட்டபடி தொடரும்.',
                icon: <PlayCircle className="w-5 h-5 text-green-600" />
            }
        );
    };

    const handleUpgrade = useCallback((subscription: any) => {
        setSelectedSubscription(subscription);
        setUpgrading(true);

        // Scroll to the appropriate section based on subscription type
        const targetRef = subscription.type === 'milk' ? milkSectionRef : grocerySectionRef;

        if (targetRef.current) {
            targetRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }

        toast.info(
            language === 'en'
                ? 'Select a plan below to upgrade'
                : 'மேம்படுத்த கீழே ஒரு திட்டத்தைத் தேர்ந்தெடுக்கவும்',
            {
                description: language === 'en'
                    ? 'Scroll down to view available plans'
                    : 'கிடைக்கும் திட்டங்களைப் பார்க்க கீழே உருட்டவும்',
                icon: <ArrowUpCircle className="w-5 h-5 text-green-600" />
            }
        );
    }, [language]);

    const selectUpgradePlan = (plan: any) => {
        if (!selectedSubscription) return;

        setSelectedPlan(plan);

        // For milk plans, show the subscription dialog to select liters
        if (plan.id.startsWith('milk-')) {
            if (selectedSubscription.milkType) {
                setSelectedMilkType(selectedSubscription.milkType);
            } else {
                setSelectedMilkType('cow');
            }
            if (selectedSubscription.liters) {
                setSelectedLiters(selectedSubscription.liters);
            } else {
                setSelectedLiters(1);
            }
            setSubscribeDialogOpen(true);
        } else {
            // For grocery plans, directly upgrade
            performUpgrade(plan);
        }
    };

    const performUpgrade = async (plan: any) => {
        if (!selectedSubscription) return;

        setProcessing(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        // Update subscription
        setActiveSubscriptions(prev =>
            prev.map(sub =>
                sub.id === selectedSubscription.id
                    ? {
                        ...sub,
                        planName: `${language === 'en' ? plan.name : plan.nameTamil}${plan.id.startsWith('milk-') ? ` - ${milkTypes.find(t => t.id === selectedMilkType)?.[language === 'en' ? 'name' : 'nameTamil']}` : ''}`,
                        price: plan.price,
                        deliveries: plan.tier ? `${plan.features[0].text}` : undefined,
                        quantity: plan.id.startsWith('milk-') ? `${selectedLiters}L per day` : undefined,
                        milkType: plan.id.startsWith('milk-') ? selectedMilkType : undefined,
                        liters: plan.id.startsWith('milk-') ? selectedLiters : undefined
                    }
                    : sub
            )
        );

        setSelectedSubscription(null);
        setProcessing(false);

        toast.success(
            language === 'en'
                ? `Upgraded to ${plan.name} successfully!`
                : `${plan.nameTamil} க்கு வெற்றிகரமாக மேம்படுத்தப்பட்டது!`,
            {
                description: language === 'en'
                    ? 'Your new plan will be active immediately.'
                    : 'உங்கள் புதிய திட்டம் உடனடியாக செயல்படும்.',
                icon: <ArrowUpCircle className="w-5 h-5 text-green-600" />
            }
        );

        // Scroll back to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubscribe = useCallback((plan: any) => {
        setSelectedPlan(plan);
        // Determine if it's a milk plan based on the plan id
        if (plan.id.startsWith('milk-')) {
            setSelectedMilkType('cow'); // Default to cow milk
        }
        setSubscribeDialogOpen(true);
    }, []);

    const confirmSubscribe = async () => {
        setProcessing(true);

        await new Promise(resolve => setTimeout(resolve, 2000));

        // Add new subscription
        const newSubscription = {
            id: `sub-${Date.now()}`,
            type: selectedPlan.id.startsWith('milk-') ? 'milk' : 'grocery',
            planName: `${language === 'en' ? selectedPlan.name : selectedPlan.nameTamil}${selectedPlan.id.startsWith('milk-') ? ` - ${milkTypes.find(t => t.id === selectedMilkType)?.[language === 'en' ? 'name' : 'nameTamil']}` : ''}`,
            price: selectedPlan.price,
            nextRenewal: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'active',
            quantity: selectedPlan.id.startsWith('milk-') ? `${selectedLiters}L per day` : undefined,
            deliveries: selectedPlan.tier ? selectedPlan.features[0].text : undefined,
            milkType: selectedPlan.id.startsWith('milk-') ? selectedMilkType : undefined,
            liters: selectedPlan.id.startsWith('milk-') ? selectedLiters : undefined,
            icon: selectedPlan.id.startsWith('milk-') ? '🥛' : '🛒'
        };

        setActiveSubscriptions(prev => [...prev, newSubscription]);

        setSubscribeDialogOpen(false);
        setProcessing(false);

        toast.success(
            language === 'en'
                ? `Subscribed to ${selectedPlan.name} successfully!`
                : `${selectedPlan.nameTamil} க்கு வெற்றிகரமாக சந்தா செய்யப்பட்டது!`,
            {
                description: language === 'en'
                    ? 'Your first delivery will arrive within 24 hours.'
                    : 'உங்கள் முதல் டெலிவரி 24 மணி நேரத்திற்குள் வரும்.',
                icon: <CheckCircle className="w-5 h-5 text-green-600" />
            }
        );
    };

    const handleAddAddon = useCallback((addon: any) => {
        setSelectedAddon(addon);
        setAddOnDialogOpen(true);
    }, []);

    const confirmAddAddon = async () => {
        setProcessing(true);

        await new Promise(resolve => setTimeout(resolve, 1500));

        // Add to active add-ons
        setActiveAddOns(prev => [...prev, { ...selectedAddon, id: `addon-active-${Date.now()}` }]);

        setAddOnDialogOpen(false);
        setProcessing(false);

        toast.success(
            language === 'en'
                ? `${selectedAddon.name} added successfully!`
                : `${selectedAddon.nameTamil} வெற்றிகரமாக சேர்க்கப்பட்டது!`,
            {
                description: language === 'en'
                    ? 'The add-on will be included in your next delivery.'
                    : 'இந்த கூடுதல் உங்கள் அடுத்த டெலிவரியில் சேர்க்கப்படும்.'
            }
        );
    };

    const handleRemoveAddon = useCallback((addon: any) => {
        setSelectedAddon(addon);
        setRemoveAddonDialogOpen(true);
    }, []);

    const confirmRemoveAddon = async () => {
        setProcessing(true);

        await new Promise(resolve => setTimeout(resolve, 1000));

        setActiveAddOns(prev => prev.filter(a => a.id !== selectedAddon.id));

        setRemoveAddonDialogOpen(false);
        setProcessing(false);

        toast.success(
            language === 'en'
                ? `${selectedAddon.name} removed successfully!`
                : `${selectedAddon.nameTamil} வெற்றிகரமாக அகற்றப்பட்டது!`,
            {
                description: language === 'en'
                    ? 'This add-on will no longer be included in your deliveries.'
                    : 'இந்த கூடுதல் இனி உங்கள் டெலிவரிகளில் சேர்க்கப்படாது.'
            }
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50/30">
            {/* Header */}
            <motion.div
                className="bg-white/90 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, type: "spring" }}
            >
                <div className="container mx-auto px-4 py-5">
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" onClick={onBack} className="hover:bg-green-50">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'Back' : 'பின்னால்'}
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-green-500 to-yellow-500 bg-clip-text text-transparent">
                                {language === 'en' ? 'Manage Your Subscriptions' : 'உங்கள் சந்தாக்களை நிர்வக���க்கவும்'}
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                {language === 'en' ? 'Convenient deliveries, flexible plans, amazing savings' : 'வசதியான டெலிவரி, நெகிழ்வான திட்டங்கள், அற்புதமான சேமிப்பு'}
                            </p>
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Active Subscriptions Section */}
                {(activeSubscriptions.length > 0 || activeAddOns.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                                <RefreshCw className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {language === 'en' ? 'Your Active Subscriptions' : 'உங்கள் செயலில் உள்ள சந்தாக்கள்'}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {language === 'en' ? 'Manage and track your current plans' : 'உங்கள் தற்போதைய திட்டங்களை நிர்வகிக்கவும்'}
                                </p>
                            </div>
                        </div>

                        {/* Main Subscriptions */}
                        {activeSubscriptions.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {activeSubscriptions.map((sub) => (
                                    <ActiveSubscriptionCard
                                        key={sub.id}
                                        subscription={sub}
                                        language={language}
                                        onCancel={handleCancel}
                                        onUpgrade={handleUpgrade}
                                        onPause={handlePause}
                                        onResume={handleResume}
                                    />
                                ))}
                            </div>
                        )}

                        {/* Active Add-ons */}
                        {activeAddOns.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                                    <Gift className="w-5 h-5 text-yellow-600" />
                                    {language === 'en' ? 'Active Add-ons' : 'செயலில் உள்ள கூடுதல்கள்'}
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {activeAddOns.map((addon) => (
                                        <ActiveAddOnCard
                                            key={addon.id}
                                            addon={addon}
                                            language={language}
                                            onRemove={handleRemoveAddon}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Empty State */}
                {activeSubscriptions.length === 0 && activeAddOns.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="mb-12"
                    >
                        <Card className="border-2 border-dashed border-gray-300 bg-gray-50/50">
                            <CardContent className="p-12 text-center">
                                <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Package className="w-10 h-10 text-gray-500" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">
                                    {language === 'en' ? 'No Active Subscriptions' : 'செயலில் உள்ள சந்தாக்கள் இல்லை'}
                                </h3>
                                <p className="text-gray-600 mb-6">
                                    {language === 'en'
                                        ? 'Start saving with our convenient subscription plans below'
                                        : 'கீழே உள்ள எங்கள் வசதியான சந்தா திட்டங்களுடன் சேமிக்கத் தொடங்குங்கள்'}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Milk Subscription Section - Only show if not upgrading or upgrading a milk subscription */}
                {(!upgrading || (selectedSubscription && selectedSubscription.type === 'milk')) && (
                    <motion.div
                        ref={milkSectionRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-12 scroll-mt-24 rounded-2xl transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Milk className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {language === 'en' ? 'Milk Subscription Plans' : 'பால் சந்தா திட்டங்கள்'}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {language === 'en' ? 'Fresh milk delivered to your doorstep' : 'புதிய பால் உங்கள் வீட்டு வாசலில்'}
                                </p>
                            </div>
                            {upgrading && selectedSubscription && selectedSubscription.type === 'milk' && (
                                <Button className="bg-gradient-to-r from-red-400 to-red-500 text-white text-md hover:bg-red-800 shadow-lg"
                                        onClick={() => { // The hover effect is not changing the color because the hover:bg-green-600 class is incorrectly applied. It should be hover:bg-red-600 to match the button's current color scheme.
                                            setSelectedSubscription(null);
                                            setUpgrading(false);
                                            toast.info(
                                                language === 'en' ? 'Upgrade cancelled' : 'மேம்படுத்தல் ரத்து செய்யப்பட்டது'
                                            );
                                        }}
                                >
                                    <X className="size-6 mr-1" />

                                    {language === 'en' ? 'Cancel' : 'மேம்படுத்துதல்'}
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {milkPlans.map((plan) => (
                                <MilkPlanCard
                                    key={plan.id}
                                    plan={plan}
                                    language={language}
                                    onSubscribe={selectedSubscription ? selectUpgradePlan : handleSubscribe}
                                    isUpgrade={!!selectedSubscription}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Grocery Subscription Section - Only show if not upgrading or upgrading a grocery subscription */}
                {(!upgrading || (selectedSubscription && selectedSubscription.type === 'grocery')) && (
                    <motion.div
                        ref={grocerySectionRef}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-12 scroll-mt-24 rounded-2xl transition-all duration-300"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                <ShoppingBasket className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {language === 'en' ? 'Grocery Subscription Plans' : 'மளிகை சந்தா ���ிட்டங்கள்'}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {language === 'en' ? 'Save time and money with our grocery plans' : 'எங்கள் மளிகை திட்டங்களுடன் நேரத்தையும் பணத்தையும் சேமிக்கவும்'}
                                </p>
                            </div>
                            {upgrading && selectedSubscription && selectedSubscription.type === 'grocery' && (
                                <Badge className=" bg-gradient-to-r from-green-400 to-emerald-500 text-white border-green-500 shadow-lg">
                                    <X className="w-3 h-3 mr-1" />
                                    {language === 'en' ? 'Cancel' : 'மேம்படுத்துதல்'}
                                </Badge>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {groceryPlans.map((plan) => (
                                <GroceryPlanCard
                                    key={plan.id}
                                    plan={plan}
                                    language={language}
                                    onSubscribe={selectedSubscription ? selectUpgradePlan : handleSubscribe}
                                    isUpgrade={!!selectedSubscription}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recommended Add-ons Section - Hide when upgrading */}
                {!upgrading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mb-12"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Gift className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {language === 'en' ? 'Recommended Add-ons' : 'பரிந்துரைக்கப்பட்ட கூடுதல்கள்'}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    {language === 'en' ? 'Enhance your subscription with these extras' : 'இந்த கூடுதல்களுடன் உங்கள் சந்தாவை மேம்படுத்துங்கள்'}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {addOns.map((addon) => {
                                const isAdded = activeAddOns.some(a =>
                                    a.name === addon.name || a.nameTamil === addon.nameTamil
                                );
                                return (
                                    <AddOnCard
                                        key={addon.id}
                                        addon={addon}
                                        language={language}
                                        onAdd={handleAddAddon}
                                        isAdded={isAdded}
                                    />
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Cancel Upgrade Button - Show when upgrading
                {upgrading && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-12 text-center"
                    >
                        <Alert className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-green-50 border-2 border-green-300">
                            <AlertCircle className="h-5 w-5 text-green-600" />
                            <AlertDescription className="ml-2">
                                <div className="flex items-center justify-between">
                  <span className="text-gray-700">
                    {language === 'en'
                        ? `Upgrading: ${selectedSubscription.planName}`
                        : `மேம்படுத்துதல்: ${selectedSubscription.planName}`}
                  </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedSubscription(null);
                                            toast.info(
                                                language === 'en' ? 'Upgrade cancelled' : 'மேம்படுத்தல் ரத்து செய்யப்பட்டது'
                                            );
                                        }}
                                        className="ml-4 border-red-300 text-red-600 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4 mr-1" />
                                        {language === 'en' ? 'Cancel Upgrade' : 'மேம்படுத்தலை ரத்து செய்'}
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    </motion.div>
                )}*/}

                {/* Footer Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="border-t border-gray-200 pt-8 mt-12"
                >
                    <div className="bg-gradient-to-br from-gray-50 to-green-50/30 rounded-3xl p-8 shadow-inner">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Support Section */}
                            <div>
                                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <HelpCircle className="w-5 h-5 text-green-600" />
                                    {language === 'en' ? 'Need Help?' : 'உதவி தேவையா?'}
                                </h3>
                                <div className="space-y-3">
                                    <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                        <Phone className="w-4 h-4" />
                                        <span>1800-123-4567</span>
                                    </a>
                                    <a href="#" className="flex items-center gap-3 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                        <Mail className="w-4 h-4" />
                                        <span>support@laboraa.com</span>
                                    </a>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">
                                    {language === 'en' ? 'Quick Links' : 'விரைவு இணைப்புகள்'}
                                </h3>
                                <div className="space-y-2">
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                        {language === 'en' ? 'FAQs' : 'அடிக்கடி கேட்கப்படும் கேள்விகள்'}
                                    </a>
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                        {language === 'en' ? 'Terms & Conditions' : 'விதிமுறைகள்'}
                                    </a>
                                    <a href="#" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                                        <ChevronRight className="w-4 h-4" />
                                        {language === 'en' ? 'Refund Policy' : 'திருப்பிச் செலுத்தும் கொள்கை'}
                                    </a>
                                </div>
                            </div>

                            {/* About Section */}
                            <div>
                                <h3 className="font-bold text-lg mb-4">
                                    {language === 'en' ? 'About Subscriptions' : 'சந்தாக்கள் பற்றி'}
                                </h3>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {language === 'en'
                                        ? 'Enjoy hassle-free regular deliveries with our flexible subscription plans. Pause, upgrade, or cancel anytime.'
                                        : 'எங்கள் நெகிழ்வான சந்தா திட்டங்களுடன் தொந்தரவு இல்லாத வழக்கமான டெலிவரிகளை அனுபவியுங்கள்.'}
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
                            © 2025 Laboraa Super Market. {language === 'en' ? 'All rights reserved.' : 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.'}
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Cancel Subscription Dialog */}
            <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <XCircle className="w-6 h-6 text-red-600" />
                            {language === 'en' ? 'Cancel Subscription' : 'சந்தாவை ரத்து செய்'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'en'
                                ? `Are you sure you want to cancel ${selectedSubscription?.planName}?`
                                : `${selectedSubscription?.planName} ஐ ரத்து செய்ய விரும்புகிறீர்களா?`
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Alert className="border-yellow-200 bg-yellow-50">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800 text-sm">
                                {language === 'en'
                                    ? 'You will lose all benefits and any unused subscription days will be refunded.'
                                    : 'நீங்கள் அனைத்து நன்மைகளையும் இழப்பீர்கள் மற்றும் பயன்படுத்தப்படாத நாட்களுக்கு பணம் திரும்பக் கிடைக்கும்.'}
                            </AlertDescription>
                        </Alert>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {language === 'en' ? 'Reason for cancellation (optional)' : 'ரத்து செய்வதற்கான காரணம் (விரும்பினால்)'}
                            </label>
                            <Textarea
                                placeholder={language === 'en' ? 'Help us improve...' : 'எங்களை மேம்படுத்த உதவுங்கள்...'}
                                value={cancelReason}
                                onChange={(e) => setCancelReason(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setCancelDialogOpen(false)}
                            disabled={processing}
                        >
                            {language === 'en' ? 'Keep Subscription' : 'சந்தாவை வைத்திரு'}
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={confirmCancel}
                            disabled={processing}
                        >
                            {processing
                                ? (language === 'en' ? 'Processing...' : 'செயலாக்கப்படுகிறது...')
                                : (language === 'en' ? 'Cancel Subscription' : 'சந்தாவை ரத்து செய்')
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Pause Subscription Dialog */}
            <Dialog open={pauseDialogOpen} onOpenChange={setPauseDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <PauseCircle className="w-6 h-6 text-orange-600" />
                            {language === 'en' ? 'Pause Subscription' : 'சந்தாவை இடைநிறுத்து'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'en'
                                ? `Temporarily pause ${selectedSubscription?.planName}`
                                : `${selectedSubscription?.planName} ஐ தற்காலிகமாக இடைநிறுத்து`
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Alert className="border-blue-200 bg-blue-50">
                            <Clock className="h-4 w-4 text-blue-600" />
                            <AlertDescription className="text-blue-800 text-sm">
                                {language === 'en'
                                    ? 'Your subscription will automatically resume after the selected duration.'
                                    : 'தேர்ந்தெடுக்கப்பட்ட காலத்திற்குப் பிறகு உங்கள் சந்தா தானாகவே மீண்டும் தொடங்கும்.'}
                            </AlertDescription>
                        </Alert>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {language === 'en' ? 'Pause Duration' : 'இடைநிறுத்த காலம்'}
                            </label>
                            <Select value={pauseDuration} onValueChange={setPauseDuration}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="7">{language === 'en' ? '7 Days' : '7 நாட்கள்'}</SelectItem>
                                    <SelectItem value="14">{language === 'en' ? '14 Days' : '14 நாட்கள்'}</SelectItem>
                                    <SelectItem value="30">{language === 'en' ? '30 Days' : '30 நாட்கள்'}</SelectItem>
                                    <SelectItem value="60">{language === 'en' ? '60 Days' : '60 நாட்கள்'}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setPauseDialogOpen(false)}
                            disabled={processing}
                        >
                            {language === 'en' ? 'Cancel' : 'ரத்து'}
                        </Button>
                        <Button
                            className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                            onClick={confirmPause}
                            disabled={processing}
                        >
                            {processing
                                ? (language === 'en' ? 'Processing...' : 'செயலாக்கப்படுகிறது...')
                                : (language === 'en' ? 'Pause Subscription' : 'சந்தாவை இடைநிறுத்து')
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Resume Subscription Dialog */}
            <Dialog open={resumeDialogOpen} onOpenChange={setResumeDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <PlayCircle className="w-6 h-6 text-green-600" />
                            {language === 'en' ? 'Resume Subscription' : 'சந்தாவை மீண்டும் தொடங்கு'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'en'
                                ? `Resume deliveries for ${selectedSubscription?.planName}`
                                : `${selectedSubscription?.planName} க்கான டெலிவரிகளை மீண்டும் தொடங்கு`
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <Alert className="border-green-200 bg-green-50">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-800 text-sm">
                                {language === 'en'
                                    ? 'Your deliveries will continue from tomorrow as per your subscription schedule.'
                                    : 'உங்கள் சந்தா அட்டவணைப்படி நாளை முதல் டெலிவரிகள் தொடரும்.'}
                            </AlertDescription>
                        </Alert>

                        {selectedSubscription?.pausedUntil && (
                            <div className="text-sm text-gray-600">
                                <p>
                                    {language === 'en' ? 'Originally paused until: ' : 'முதலில் இடைநிறுத்தப்பட்டது: '}
                                    <span className="font-semibold">{selectedSubscription.pausedUntil}</span>
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setResumeDialogOpen(false)}
                            disabled={processing}
                        >
                            {language === 'en' ? 'Cancel' : 'ரத்து'}
                        </Button>
                        <Button
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                            onClick={confirmResume}
                            disabled={processing}
                        >
                            {processing
                                ? (language === 'en' ? 'Processing...' : 'செயலாக்கப்படுகிறது...')
                                : (language === 'en' ? 'Resume Now' : 'இப்போது மீண்டும் தொடங்கு')
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>



            {/* Subscribe Dialog */}
            <Dialog open={subscribeDialogOpen} onOpenChange={(open) => {
                setSubscribeDialogOpen(open);
                if (!open && selectedSubscription) {
                    // Clear the selected subscription if dialog is closed without confirming
                    setSelectedSubscription(null);
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            {selectedSubscription ? (
                                <>
                                    <ArrowUpCircle className="w-5 h-5 text-green-600" />
                                    {language === 'en' ? 'Confirm Upgrade' : 'மேம்படுத்தலை உறுதிப்படுத்து'}
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                    {language === 'en' ? 'Confirm Subscription' : 'சந்தாவை உறுதிப்படுத்து'}
                                </>
                            )}
                        </DialogTitle>
                        <DialogDescription className="text-sm">
                            {selectedSubscription ? (
                                language === 'en'
                                    ? 'Review and confirm your upgrade details.'
                                    : 'உங்கள் மேம்படுத்தல் விவரங்களை மதிப்பாய்வு செய்து உறுதிப்படுத்தவும்.'
                            ) : (
                                language === 'en'
                                    ? 'Review details and confirm to start deliveries.'
                                    : 'விவரங்களை மதிப்பாய்வு செய்து டெலிவரிகளைத் தொடங்க உறுதிப்படுத்தவும்.'
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-3">
                        {/* Milk Type Selector for Milk Plans */}
                        {selectedPlan?.id?.startsWith('milk-') && (
                            <>
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {language === 'en' ? 'Select Milk Type' : 'பால் வகையைத் தேர்ந்தெடுக்கவும்'}
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {milkTypes.map((type) => (
                                            <button
                                                key={type.id}
                                                onClick={() => setSelectedMilkType(type.id)}
                                                className={`p-3 rounded-lg border-2 transition-all ${
                                                    selectedMilkType === type.id
                                                        ? 'border-blue-500 bg-blue-50 shadow-md'
                                                        : 'border-gray-200 hover:border-blue-200'
                                                }`}
                                            >
                                                <div className="text-2xl mb-1">{type.icon}</div>
                                                <div className="text-xs font-semibold">
                                                    {language === 'en' ? type.name : type.nameTamil}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Liter Selector for Milk Plans */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {language === 'en' ? 'Select Quantity (Liters per day)' : 'அளவைத் தேர்ந்தெடுக்கவும் (லிட்டர் / நாள்)'}
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => setSelectedLiters(prev => Math.max(0.5, prev - 0.5))}
                                            disabled={selectedLiters <= 0.5}
                                            className={`p-3 rounded-lg border-2 transition-all ${
                                                selectedLiters <= 0.5
                                                    ? 'border-gray-200 bg-gray-100 text-gray-400'
                                                    : 'border-green-500 bg-white text-green-600 hover:bg-green-50'
                                            }`}
                                        >
                                            <Minus className="w-5 h-5" />
                                        </button>

                                        <div className="flex-1 text-center py-3 px-4 bg-green-50 rounded-lg border-2 border-green-200">
                                            <div className="text-2xl font-bold text-green-600">{selectedLiters}</div>
                                            <div className="text-xs text-gray-600">
                                                {language === 'en' ? (selectedLiters === 1 ? 'Liter/day' : 'Liters/day') : 'லிட்டர்/நாள்'}
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedLiters(prev => Math.min(5, prev + 0.5))}
                                            disabled={selectedLiters >= 5}
                                            className={`p-3 rounded-lg border-2 transition-all ${
                                                selectedLiters >= 5
                                                    ? 'border-gray-200 bg-gray-100 text-gray-400 '
                                                    : 'border-green-500 bg-white text-green-600 hover:bg-green-50'
                                            }`}
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <h3 className="font-bold mb-1">
                                        {language === 'en' ? selectedPlan?.name : selectedPlan?.nameTamil}
                                    </h3>
                                    {selectedPlan?.id?.startsWith('milk-') && (
                                        <p className="text-xs text-gray-600">
                                            {milkTypes.find(t => t.id === selectedMilkType)?.[language === 'en' ? 'name' : 'nameTamil']} - {selectedLiters}L/{language === 'en' ? 'day' : 'நாள்'}
                                        </p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-green-600">₹{selectedPlan?.price}</div>
                                    <div className="text-xs text-gray-600">/{language === 'en' ? selectedPlan?.period : 'மாதம்'}</div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {selectedPlan?.features?.slice(0, 3).map((feature: any, index: number) => (
                                    <div key={index} className="flex items-center gap-2 text-xs">
                                        <Check className="w-3 h-3 text-green-600 flex-shrink-0" />
                                        <span>{feature.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Alert className="border-blue-200 bg-blue-50 py-2">
                            <Sparkles className="h-3 w-3 text-blue-600" />
                            <AlertDescription className="text-blue-800 text-xs">
                                {selectedSubscription ? (
                                    language === 'en'
                                        ? 'Changes will be reflected in your next delivery.'
                                        : 'மாற்றங்கள் அடுத்த டெலிவரியில் பிரதிபலிக்கும்.'
                                ) : (
                                    language === 'en'
                                        ? 'First delivery arrives within 24 hours.'
                                        : 'முதல் டெலிவரி 24 மணி நேரத்திற்குள் வரும்.'
                                )}
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                                setSubscribeDialogOpen(false);
                                if (selectedSubscription) {
                                    // Clear the selected subscription if cancelling upgrade
                                    setSelectedSubscription(null);
                                }
                            }}
                            disabled={processing}
                        >
                            {language === 'en' ? 'Cancel' : 'ரத்து'}
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                            onClick={confirmSubscribe}
                            disabled={processing}
                        >
                            {processing
                                ? (language === 'en' ? 'Processing...' : 'செயலாக்கப்படுகிறது...')
                                : selectedSubscription
                                    ? (language === 'en' ? 'Confirm Upgrade' : 'மேம்படுத்தலை உறுதிப்படுத்து')
                                    : (language === 'en' ? 'Confirm & Subscribe' : 'உறுதிப்படுத்து & சந்தா செய்')
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Add-on Dialog */}
            <Dialog open={addOnDialogOpen} onOpenChange={setAddOnDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <Gift className="w-6 h-6 text-yellow-600" />
                            {language === 'en' ? 'Add to Subscription' : 'சந்தாவில் சேர்'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'en'
                                ? 'Enhance your subscription with this premium add-on.'
                                : 'இந்த பிரீமியம் கூடுதலுடன் உங்கள் சந்தாவை மேம்படுத்துங்கள்.'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-5xl shadow-md">
                                {selectedAddon?.image}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">
                                    {language === 'en' ? selectedAddon?.name : selectedAddon?.nameTamil}
                                </h3>
                                <p className="text-sm text-gray-600">{selectedAddon?.description}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  {language === 'en' ? 'Monthly Cost:' : 'மாத செலவு:'}
                </span>
                                <span className="text-2xl font-bold text-yellow-600">₹{selectedAddon?.price}</span>
                            </div>
                            <p className="text-xs text-gray-600">
                                {language === 'en'
                                    ? 'This will be added to your subscription and billed monthly.'
                                    : 'இது உங்கள் சந்தாவில் சேர்க்கப்பட்டு மாதாந்திர கட்டணம் விதிக்கப்படும்.'}
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setAddOnDialogOpen(false)}
                            disabled={processing}
                        >
                            {language === 'en' ? 'Cancel' : 'ரத்து'}
                        </Button>
                        <Button
                            className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                            onClick={confirmAddAddon}
                            disabled={processing}
                        >
                            {processing
                                ? (language === 'en' ? 'Adding...' : 'சேர்க்கப்படுகிறது...')
                                : (language === 'en' ? 'Add to Subscription' : 'சந்தாவில் சேர்')
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Remove Add-on Confirmation Dialog */}
            <Dialog open={removeAddonDialogOpen} onOpenChange={setRemoveAddonDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <XCircle className="w-6 h-6 text-red-600" />
                            {language === 'en' ? 'Remove Add-on' : 'கூடுதலை அகற்று'}
                        </DialogTitle>
                        <DialogDescription>
                            {language === 'en'
                                ? 'Are you sure you want to remove this add-on from your subscription?'
                                : 'இந்த கூடுதலை உங்கள் சந்தாவிலிருந்து அகற்ற விரும்புகிறீர்களா?'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {selectedAddon && (
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div className="w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-4xl shadow-md">
                                    {selectedAddon.image}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-base mb-1">
                                        {language === 'en' ? selectedAddon.name : selectedAddon.nameTamil}
                                    </h4>
                                    <p className="text-sm text-gray-600">{selectedAddon.description}</p>
                                    <p className="text-lg font-bold text-yellow-600 mt-1">₹{selectedAddon.price}/mo</p>
                                </div>
                            </div>
                        )}

                        <Alert className="border-yellow-200 bg-yellow-50">
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                            <AlertDescription className="text-yellow-800 text-sm">
                                {language === 'en'
                                    ? 'This add-on will be removed from your next billing cycle.'
                                    : 'இந்த கூடுதல் உங்கள் அடுத்த பில்லிங் சுழற்சியிலிருந்து அகற்றப்படும்.'}
                            </AlertDescription>
                        </Alert>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setRemoveAddonDialogOpen(false)}
                            disabled={processing}
                        >
                            {language === 'en' ? 'Keep Add-on' : 'க���டுதலை வைத்திரு'}
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={confirmRemoveAddon}
                            disabled={processing}
                        >
                            {processing
                                ? (language === 'en' ? 'Removing...' : 'அகற்றப்படுகிறது...')
                                : (language === 'en' ? 'Remove Add-on' : 'கூடுதலை அகற்று')
                            }
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
