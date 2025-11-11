import { useState } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';

interface Service {
    id: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip';
    name: string;
    nameTamil: string;
    icon: string;
    color: string;
    bgColor: string;
    description: string;
    descriptionTamil: string;
}

interface ServiceSelectorProps {
    currentService: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip';
    onServiceChange: (service: 'grocery' | 'freshcarne' | 'wowfood' | 'fairtrip') => void;
    language: 'en' | 'ta';
    variant?: 'dropdown' | 'pills';
}

const services: Service[] = [
    {
        id: 'grocery',
        name: 'Laboraa Grocery',
        nameTamil: 'லபோராா கிராசரி',
        icon: '🛒',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        description: 'Groceries & Daily Essentials',
        descriptionTamil: 'கிராசரி & தினசரி தேவைகள்'
    },
    {
        id: 'freshcarne',
        name: 'FreshCarne',
        nameTamil: 'ஃப்ரெஷ்கார்னே',
        icon: '🥩',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        description: 'Fresh Meat & Seafood',
        descriptionTamil: 'புதிய இறைச்சி & கடல் உணவு'
    },
    {
        id: 'wowfood',
        name: 'Wow Food',
        nameTamil: 'வாவ் உணவு',
        icon: '🍕',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        description: 'Restaurant Delivery',
        descriptionTamil: 'உணவக டெலிவரி'
    },
    {
        id: 'fairtrip',
        name: 'Fair Trip',
        nameTamil: 'ஃபேர் டிரிப்',
        icon: '🚗',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        description: 'Ride Booking',
        descriptionTamil: 'ரைட் பூக்கிங்'
    }
];

export function ServiceSelector({
                                    currentService,
                                    onServiceChange,
                                    language,
                                    variant = 'dropdown'
                                }: ServiceSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const currentServiceData = services.find(s => s.id === currentService) || services[0];

    if (variant === 'pills') {
        return (
            <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-lg">
                {services.map((service) => (
                    <motion.button
                        key={service.id}
                        onClick={() => onServiceChange(service.id)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
              relative px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
              flex items-center gap-2 whitespace-nowrap
              ${currentService === service.id
                            ? `${service.color} ${service.bgColor} shadow-sm ring-1 ring-white/50`
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white/60'
                        }
            `}
                    >
                        <span className="text-lg">{service.icon}</span>
                        <span className="hidden sm:inline">
              {language === 'en' ? service.name : service.nameTamil}
            </span>

                        {currentService === service.id && (
                            <motion.div
                                layoutId="activeServicePill"
                                className="absolute inset-0 bg-white/20 rounded-md border border-white/30"
                                initial={false}
                                transition={{
                                    type: "spring",
                                    stiffness: 300,
                                    damping: 30
                                }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        );
    }

    // Dropdown variant (default)
    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="h-auto p-0 hover:bg-transparent group"
                >
                    <div className="flex items-center gap-3">
                        {/* Service Icon */}
                        <div className={`
              w-10 h-10 rounded-lg ${currentServiceData.bgColor} 
              flex items-center justify-center text-xl
              group-hover:scale-105 transition-transform duration-200
            `}>
                            {currentServiceData.icon}
                        </div>

                        {/* Service Info */}
                        <div className="text-left hidden sm:block">
                            <div className="flex items-center gap-2">
                                <h1 className={`font-bold text-lg ${currentServiceData.color}`}>
                                    {language === 'en' ? currentServiceData.name : currentServiceData.nameTamil}
                                </h1>
                                <ChevronDown className={`
                  w-4 h-4 transition-transform duration-200 
                  ${isOpen ? 'rotate-180' : ''} text-gray-400
                `} />
                            </div>
                            <p className="text-xs text-gray-500">
                                {language === 'en' ? currentServiceData.description : currentServiceData.descriptionTamil}
                            </p>
                        </div>

                        {/* Mobile: Show only icon and chevron */}
                        <div className="sm:hidden">
                            <ChevronDown className={`
                w-4 h-4 transition-transform duration-200 
                ${isOpen ? 'rotate-180' : ''} text-gray-400
              `} />
                        </div>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="start"
                className="w-64 p-2 bg-white"
                sideOffset={8}
            >
                <div className="space-y-1">
                    {services.map((service) => (
                        <DropdownMenuItem
                            key={service.id}
                            onClick={() => {
                                onServiceChange(service.id);
                                setIsOpen(false);
                            }}
                            className={`
                relative p-3 rounded-lg cursor-pointer transition-all duration-200
                hover:bg-gray-50 focus:bg-gray-50
                ${currentService === service.id ? service.bgColor : ''}
              `}
                        >
                            <div className="flex items-center gap-3 w-full">
                                {/* Service Icon */}
                                <div className={`
                  w-8 h-8 rounded-md ${service.bgColor} 
                  flex items-center justify-center text-lg
                `}>
                                    {service.icon}
                                </div>

                                {/* Service Details */}
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                    <span className={`font-medium ${service.color}`}>
                      {language === 'en' ? service.name : service.nameTamil}
                    </span>
                                        {currentService === service.id && (
                                            <Check className="w-4 h-4 text-green-600" />
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {language === 'en' ? service.description : service.descriptionTamil}
                                    </p>
                                </div>
                            </div>

                            {/* Active indicator */}
                            {currentService === service.id && (
                                <motion.div
                                    layoutId="activeServiceDropdown"
                                    className="absolute inset-0 bg-white/40 rounded-lg border border-white/60"
                                    initial={false}
                                    transition={{
                                        type: "spring",
                                        stiffness: 300,
                                        damping: 30
                                    }}
                                />
                            )}
                        </DropdownMenuItem>
                    ))}
                </div>

                {/* Footer */}
                <div className="mt-3 pt-2 border-t">
                    <p className="text-xs text-gray-400 text-center">
                        {language === 'en'
                            ? 'Switch between services anytime'
                            : 'எந்த நேரத்திலும் சேவைகளை மாற்றவும்'
                        }
                    </p>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}