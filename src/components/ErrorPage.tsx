import { motion } from 'motion/react';
import {
    AlertTriangle,
    Wifi,
    Server,
    Search,
    Lock,
    CreditCard,
    ShoppingCart,
    RefreshCw,
    ArrowLeft,
    MessageCircle,
    Home,
    Phone,
    Mail,
    Clock,
    Truck,
    Utensils,
    Car,
    Flower
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

export type ErrorType =
    | 'network'
    | 'server'
    | 'not-found'
    | 'unauthorized'
    | 'forbidden'
    | 'payment'
    | 'service-unavailable'
    | 'timeout'
    | 'validation'
    | 'general';

export type ServiceType = 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip' | 'flowers' | 'milk-subscription' | 'general';

interface ErrorPageProps {
    errorType: ErrorType;
    service?: ServiceType;
    language?: 'en' | 'ta';
    errorMessage?: string;
    errorCode?: string | number;
    onRetry?: () => void;
    onGoBack?: () => void;
    onGoHome?: () => void;
    onContactSupport?: () => void;
}

export function ErrorPage({
                              errorType,
                              service = 'general',
                              language = 'en',
                              errorMessage,
                              errorCode,
                              onRetry,
                              onGoBack,
                              onGoHome,
                              onContactSupport
                          }: ErrorPageProps) {

    const getServiceIcon = () => {
        switch (service) {
            case 'grocery':
                return <ShoppingCart className="w-16 h-16 text-green-500" />;
            case 'freshcarne':
                return <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-8 h-8 bg-red-500 rounded" />
                </div>;
            case 'wowfood':
                return <Utensils className="w-16 h-16 text-orange-500" />;
            case 'fairtrip':
                return <Car className="w-16 h-16 text-blue-500" />;
            case 'flowers':
                return <Flower className="w-16 h-16 text-pink-500" />;
            case 'milk-subscription':
                return <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-10 h-12 bg-blue-500 rounded-t-full" />
                </div>;
            default:
                return <Truck className="w-16 h-16 text-green-500" />;
        }
    };

    const getErrorIcon = () => {
        switch (errorType) {
            case 'network':
                return <Wifi className="w-20 h-20 text-red-500" />;
            case 'server':
                return <Server className="w-20 h-20 text-red-500" />;
            case 'not-found':
                return <Search className="w-20 h-20 text-gray-500" />;
            case 'unauthorized':
            case 'forbidden':
                return <Lock className="w-20 h-20 text-yellow-500" />;
            case 'payment':
                return <CreditCard className="w-20 h-20 text-red-500" />;
            case 'service-unavailable':
                return <Clock className="w-20 h-20 text-orange-500" />;
            case 'timeout':
                return <Clock className="w-20 h-20 text-red-500" />;
            case 'validation':
                return <AlertTriangle className="w-20 h-20 text-yellow-500" />;
            default:
                return <AlertTriangle className="w-20 h-20 text-red-500" />;
        }
    };

    const getErrorTitle = () => {
        const titles = {
            en: {
                network: 'Connection Problem',
                server: 'Server Error',
                'not-found': 'Page Not Found',
                unauthorized: 'Authentication Required',
                forbidden: 'Access Denied',
                payment: 'Payment Failed',
                'service-unavailable': 'Service Temporarily Unavailable',
                timeout: 'Request Timeout',
                validation: 'Invalid Information',
                general: 'Something Went Wrong'
            },
            ta: {
                network: 'இணைப்பு பிரச்சினை',
                server: 'சர்வர் பிழை',
                'not-found': 'பக்கம் கிடைக்கவில்லை',
                unauthorized: 'அங்கீகாரம் தேவை',
                forbidden: 'அணுகல் மறுக்கப்பட்டது',
                payment: 'பணம் செலுத்துதல் தோல்வி',
                'service-unavailable': 'சேவை தற்காலிகமாக கிடைக்கவில்லை',
                timeout: 'கோரிக்கை நேரம் முடிந்தது',
                validation: 'தவறான தகவல்',
                general: 'ஏதோ தவறு நடந்துள்ளது'
            }
        };
        return titles[language][errorType];
    };

    const getErrorDescription = () => {
        const descriptions = {
            en: {
                network: "We're having trouble connecting to our servers. Please check your internet connection and try again.",
                server: "Our servers are experiencing some issues. Our team is working to fix this as quickly as possible.",
                'not-found': "The page you're looking for doesn't exist or may have been moved. Let's get you back on track.",
                unauthorized: "You need to sign in to access this feature. Please log in to continue.",
                forbidden: "You don't have permission to access this resource. Contact support if you think this is an error.",
                payment: "Your payment couldn't be processed. Please check your payment details and try again.",
                'service-unavailable': "This service is temporarily down for maintenance. We'll be back shortly!",
                timeout: "The request took too long to complete. Please try again.",
                validation: "Some information you provided is invalid. Please check and try again.",
                general: "We encountered an unexpected error. Don't worry, we're working to fix it."
            },
            ta: {
                network: "எங்கள் சர்வர்களுடன் இணைப்பில் சிக்கல் உள்ளது. உங்கள் இணைய இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
                server: "எங்கள் சர்வர்களில் சில சிக்கல்கள் உள்ளன. எங்கள் குழு இதை விரைவாக சரிசெய்ய வேலை செய்து வருகிறது.",
                'not-found': "நீங்கள் தேடும் பக்கம் இல்லை அல்லது நகர்த்தப்பட்டிருக்கலாம். உங்களை மீண்டும் சரியான பாதையில் கொண்டு வருவோம்.",
                unauthorized: "இந்த அம்சத்தை அணுக நீங்கள் உள்நுழைய வேண்டும். தொடர உள்நுழைக.",
                forbidden: "இந்த வளத்தை அணுக உங்களுக்கு அனுமதி இல்லை. இது பிழை என்று நினைத்தால் ஆதரவைத் தொடர்பு கொள்ளவும்.",
                payment: "உங்கள் பணம் செயலாக்க முடியவில்லை. உங்கள் பணம் செலுத்தும் விவரங்களைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
                'service-unavailable': "இந்த சேவை பராமரிப்புக்காக தற்காலிகமாக நிறுத்தப்பட்டுள்ளது. நாங்கள் விரைவில் திரும்பி வருவோம்!",
                timeout: "கோரிக்கை முடிக்க அதிக நேரம் எடுத்தது. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
                validation: "நீங்கள் வழங்கிய சில தகவல்கள் தவறானவை. தயவுசெய்து சரிபார்த்து மீண்டும் முயற்சிக்கவும்.",
                general: "நாங்கள் எதிர்பாராத பிழையை சந்தித்தோம். கவலைப்பட வேண்டாம், நாங்கள் அதை சரிசெய்ய வேலை செய்கிறோம்."
            }
        };
        return descriptions[language][errorType];
    };

    const getActionButtons = () => {
        const buttons = {
            en: {
                retry: 'Try Again',
                goBack: 'Go Back',
                goHome: 'Go Home',
                contactSupport: 'Contact Support'
            },
            ta: {
                retry: 'மீண்டும் முயற்சிக்கவும்',
                goBack: 'திரும்பிப் போகவும்',
                goHome: 'முகப்புக்கு செல்லவும்',
                contactSupport: 'ஆதரவைத் தொடர்பு கொள்ளவும்'
            }
        };
        return buttons[language];
    };

    const getSupportInfo = () => {
        const support = {
            en: {
                title: 'Need Help?',
                phone: 'Call: +91 99999 99999',
                email: 'Email: support@laboraa.com',
                hours: 'Available 24/7'
            },
            ta: {
                title: 'உதவி தேவையா?',
                phone: 'அழை: +91 99999 99999',
                email: 'மின்னஞ்சல்: support@laboraa.com',
                hours: '24/7 கிடைக்கும்'
            }
        };
        return support[language];
    };

    const buttonLabels = getActionButtons();
    const supportInfo = getSupportInfo();

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Animation */}
            <div className="absolute inset-0">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-red-200 rounded-full opacity-20"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, -50, 0],
                            scale: [1, 0.5, 1],
                        }}
                        transition={{
                            duration: 6 + i * 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.8,
                        }}
                        style={{
                            left: `${15 + i * 20}%`,
                            top: `${30 + i * 15}%`,
                        }}
                    />
                ))}
            </div>

            <div className="max-w-2xl w-full relative z-10">
                <Card className="shadow-2xl border-0 overflow-hidden">
                    <CardContent className="p-8 sm:p-12 text-center">
                        {/* Service Branding */}
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="flex items-center justify-center gap-4 mb-8"
                        >
                            <div className="relative">
                                {getServiceIcon()}
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute -top-2 -right-2"
                                >
                                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                        >
                                            <AlertTriangle className="w-3 h-3 text-white" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Laboraa Super Market</h1>
                                <p className="text-gray-600 text-sm">
                                    {language === 'en' ? 'Your Everything Marketplace' : 'உங்கள் அனைத்து சந்தை'}
                                </p>
                            </div>
                        </motion.div>

                        {/* Error Icon Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mb-6"
                        >
                            <div className="flex justify-center">
                                <motion.div
                                    animate={{
                                        rotate: errorType === 'network' ? [0, -10, 10, 0] : 0,
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: errorType === 'network' ? 1 : 2,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    {getErrorIcon()}
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Error Code Badge */}
                        {errorCode && (
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="mb-4"
                            >
                                <Badge variant="destructive" className="text-sm px-3 py-1">
                                    Error {errorCode}
                                </Badge>
                            </motion.div>
                        )}

                        {/* Error Title */}
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="text-xl sm:text-2xl font-bold text-gray-900 mb-4"
                        >
                            {getErrorTitle()}
                        </motion.h2>

                        {/* Error Description */}
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.7 }}
                            className="text-gray-600 mb-2 leading-relaxed"
                        >
                            {getErrorDescription()}
                        </motion.p>

                        {/* Custom Error Message */}
                        {errorMessage && (
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.8 }}
                                className="text-sm text-gray-500 mb-8 bg-gray-50 p-3 rounded-lg"
                            >
                                {errorMessage}
                            </motion.p>
                        )}

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.9 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
                        >
                            {onRetry && (
                                <Button
                                    onClick={onRetry}
                                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                                >
                                    <RefreshCw className="w-5 h-5 mr-2" />
                                    {buttonLabels.retry}
                                </Button>
                            )}

                            {onGoBack && (
                                <Button
                                    variant="outline"
                                    onClick={onGoBack}
                                    className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                                >
                                    <ArrowLeft className="w-5 h-5 mr-2" />
                                    {buttonLabels.goBack}
                                </Button>
                            )}

                            {onGoHome && (
                                <Button
                                    variant="outline"
                                    onClick={onGoHome}
                                    className="px-8 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
                                >
                                    <Home className="w-5 h-5 mr-2" />
                                    {buttonLabels.goHome}
                                </Button>
                            )}
                        </motion.div>

                        {/* Support Information */}
                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 1.1 }}
                            className="border-t pt-6"
                        >
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                {supportInfo.title}
                            </h3>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{supportInfo.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    <span>{supportInfo.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{supportInfo.hours}</span>
                                </div>
                            </div>

                            {onContactSupport && (
                                <Button
                                    variant="ghost"
                                    onClick={onContactSupport}
                                    className="mt-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                >
                                    {buttonLabels.contactSupport}
                                </Button>
                            )}
                        </motion.div>

                        {/* Error ID for Support Reference */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 1.3 }}
                            className="mt-6 pt-4 border-t"
                        >
                            <p className="text-xs text-gray-400">
                                {language === 'en' ? 'Error ID:' : 'பிழை ID:'} {Date.now().toString(36).toUpperCase()}
                            </p>
                        </motion.div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}