import { motion } from 'motion/react';
import { ShoppingCart, Beef, UtensilsCrossed, Car, Sparkles, Leaf, Flame, Zap } from 'lucide-react';

interface LoadingScreenProps {
    service?: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip' | 'flowers' | 'milk-subscription' | 'payment' | 'general';
    language?: 'en' | 'ta';
}

export function LoadingScreen({ service = 'grocery', language = 'en' }: LoadingScreenProps) {
    // Service configurations
    const serviceConfig = {
        grocery: {
            name: language === 'en' ? 'Laboraa Grocery' : 'லபோராா கிராசரி',
            tagline: language === 'en' ? 'Fresh groceries loading...' : 'புதிய கிராசரி ஏற்றுகிறது...',
            primaryColor: '#22c55e',
            secondaryColor: '#16a34a',
            lightColor: '#86efac',
            bgGradient: 'from-green-50 via-emerald-50 to-green-100',
            icon: ShoppingCart,
            accentIcon: Leaf,
            particles: ['🥬', '🥕', '🍅', '🥒', '🌽', '🥑']
        },
        freshcarne: {
            name: language === 'en' ? 'FreshCarne' : 'ஃப்ரெஷ்கார்னே',
            tagline: language === 'en' ? 'Premium meat loading...' : 'சிறந்த இறைச்சி ஏற்றுகிறது...',
            primaryColor: '#ef4444',
            secondaryColor: '#dc2626',
            lightColor: '#fca5a5',
            bgGradient: 'from-red-50 via-rose-50 to-red-100',
            icon: Beef,
            accentIcon: Flame,
            particles: ['🥩', '🍗', '🐟', '🦐', '🥓', '🍖']
        },
        wowfood: {
            name: language === 'en' ? 'Wow Food' : 'வாவ் உணவு',
            tagline: language === 'en' ? 'Delicious food loading...' : 'சுவையான உணவு ஏற்றுகிறது...',
            primaryColor: '#f97316',
            secondaryColor: '#ea580c',
            lightColor: '#fdba74',
            bgGradient: 'from-orange-50 via-amber-50 to-orange-100',
            icon: UtensilsCrossed,
            accentIcon: Sparkles,
            particles: ['🍕', '🍔', '🍜', '🍛', '🌮', '🍱']
        },
        fairtrip: {
            name: language === 'en' ? 'Fair Trip' : 'ஃபேர் டிரிப்',
            tagline: language === 'en' ? 'Your ride is loading...' : 'உங்கள் பயணம் ஏற்றுகிறது...',
            primaryColor: '#3b82f6',
            secondaryColor: '#2563eb',
            lightColor: '#93c5fd',
            bgGradient: 'from-blue-50 via-sky-50 to-blue-100',
            icon: Car,
            accentIcon: Zap,
            particles: ['🚗', '🏍️', '🛺', '🚕', '🚙', '🚐']
        }
    };

    const config = serviceConfig[service] || serviceConfig.grocery;
    const MainIcon = config.icon;
    const AccentIcon = config.accentIcon;

    return (
        <div className={`min-h-screen bg-gradient-to-br ${config.bgGradient} flex items-center justify-center overflow-hidden relative`}>
            {/* Animated Background Particles */}
            <div className="absolute inset-0 overflow-hidden">
                {config.particles.map((particle, index) => (
                    <motion.div
                        key={index}
                        className="absolute text-4xl opacity-20"
                        initial={{
                            x: Math.random() * window.innerWidth,
                            y: -50,
                            rotate: 0,
                            scale: 0.5
                        }}
                        animate={{
                            y: window.innerHeight + 50,
                            rotate: 360,
                            scale: [0.5, 1, 0.5],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.5
                        }}
                    >
                        {particle}
                    </motion.div>
                ))}
            </div>

            {/* Gradient Orbs */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-30"
                    style={{ background: config.primaryColor }}
                    animate={{
                        x: ['-25%', '125%'],
                        y: ['-25%', '75%'],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-20"
                    style={{ background: config.secondaryColor }}
                    animate={{
                        x: ['125%', '-25%'],
                        y: ['75%', '-25%'],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 text-center px-4">
                {/* Animated Logo Container */}
                <motion.div
                    className="relative mb-8"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 200,
                        damping: 15,
                        duration: 0.8
                    }}
                >
                    {/* Outer Rotating Ring */}
                    <motion.div
                        className="absolute inset-0 w-40 h-40 mx-auto rounded-full border-4 border-dashed opacity-30"
                        style={{ borderColor: config.primaryColor }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Middle Pulsing Ring */}
                    <motion.div
                        className="absolute inset-0 w-32 h-32 mx-auto mt-4 rounded-full"
                        style={{
                            background: `radial-gradient(circle, ${config.lightColor}40, transparent)`,
                            boxShadow: `0 0 40px ${config.primaryColor}60`
                        }}
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Main Icon */}
                    <motion.div
                        className="relative w-40 h-40 mx-auto rounded-full flex items-center justify-center"
                        style={{
                            background: `linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor})`,
                            boxShadow: `0 10px 40px ${config.primaryColor}40`
                        }}
                        animate={{
                            boxShadow: [
                                `0 10px 40px ${config.primaryColor}40`,
                                `0 10px 60px ${config.primaryColor}60`,
                                `0 10px 40px ${config.primaryColor}40`
                            ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <motion.div
                            animate={{
                                scale: [1, 1.1, 1],
                                rotate: [0, 5, -5, 0]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <MainIcon className="w-20 h-20 text-white" />
                        </motion.div>

                        {/* Corner Accent Icons */}
                        <motion.div
                            className="absolute -top-2 -right-2 w-12 h-12 rounded-full flex items-center justify-center text-white"
                            style={{ background: config.secondaryColor }}
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <AccentIcon className="w-6 h-6" />
                        </motion.div>
                    </motion.div>
                </motion.div>

                {/* Service Name */}
                <motion.h1
                    className="text-4xl mb-3"
                    style={{ color: config.primaryColor }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    {config.name}
                </motion.h1>

                {/* Tagline */}
                <motion.p
                    className="text-gray-600 mb-8 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    {config.tagline}
                </motion.p>

                {/* Animated Progress Bar */}
                <motion.div
                    className="w-64 mx-auto mb-6"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="h-2 bg-white/50 rounded-full overflow-hidden backdrop-blur-sm">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: `linear-gradient(90deg, ${config.primaryColor}, ${config.lightColor}, ${config.primaryColor})`,
                                boxShadow: `0 0 10px ${config.primaryColor}80`
                            }}
                            animate={{
                                x: ['-100%', '100%'],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        />
                    </div>
                </motion.div>

                {/* Loading Dots */}
                <div className="flex justify-center gap-2">
                    {[0, 1, 2].map((index) => (
                        <motion.div
                            key={index}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: config.primaryColor }}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3],
                            }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: index * 0.2,
                            }}
                        />
                    ))}
                </div>

                {/* Service-Specific Animation Elements */}
                <ServiceSpecificAnimation service={service} config={config} />
            </div>

            {/* Bottom Wave Animation */}
            <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
                <svg
                    className="w-full h-32"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                >
                    <motion.path
                        d="M0,50 Q300,100 600,50 T1200,50 L1200,120 L0,120 Z"
                        fill={config.primaryColor}
                        fillOpacity="0.1"
                        animate={{
                            d: [
                                "M0,50 Q300,100 600,50 T1200,50 L1200,120 L0,120 Z",
                                "M0,70 Q300,30 600,70 T1200,70 L1200,120 L0,120 Z",
                                "M0,50 Q300,100 600,50 T1200,50 L1200,120 L0,120 Z",
                            ]
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                    <motion.path
                        d="M0,70 Q300,30 600,70 T1200,70 L1200,120 L0,120 Z"
                        fill={config.secondaryColor}
                        fillOpacity="0.05"
                        animate={{
                            d: [
                                "M0,70 Q300,30 600,70 T1200,70 L1200,120 L0,120 Z",
                                "M0,50 Q300,100 600,50 T1200,50 L1200,120 L0,120 Z",
                                "M0,70 Q300,30 600,70 T1200,70 L1200,120 L0,120 Z",
                            ]
                        }}
                        transition={{
                            duration: 5,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    />
                </svg>
            </div>
        </div>
    );
}

// Service-specific additional animations
function ServiceSpecificAnimation({
                                      service,
                                      config
                                  }: {
    service: string;
    config: any;
}) {
    if (service === 'grocery') {
        return (
            <motion.div
                className="mt-8 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    🌱 Fresh & Organic 🌱
                </motion.div>
            </motion.div>
        );
    }

    if (service === 'freshcarne') {
        return (
            <motion.div
                className="mt-8 flex justify-center gap-4 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                {['🥩 Premium', '✂️ Fresh Cut', '❄️ Cold Chain'].map((text, i) => (
                    <motion.div
                        key={i}
                        animate={{ y: [0, -5, 0] }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.3
                        }}
                    >
                        {text}
                    </motion.div>
                ))}
            </motion.div>
        );
    }

    if (service === 'wowfood') {
        return (
            <motion.div
                className="mt-8 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    className="flex justify-center gap-2"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    <span>🔥</span>
                    <span>Hot & Delicious</span>
                    <span>🔥</span>
                </motion.div>
            </motion.div>
        );
    }

    if (service === 'fairtrip') {
        return (
            <motion.div
                className="mt-8 text-sm text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
            >
                <motion.div
                    animate={{ x: [-10, 10, -10] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    ⚡ Fast & Safe Rides ⚡
                </motion.div>
            </motion.div>
        );
    }

    return null;
}
