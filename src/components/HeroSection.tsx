import { Clock, Truck, Star, Gift } from 'lucide-react';
import { Badge } from './ui/badge';

export function HeroSection() {
    return (
        <section className="bg-gradient-to-r from-green-50 via-blue-50 to-purple-50 py-4 border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between gap-4">
                    {/* Left Content */}
                    <div className="flex items-center gap-4">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 whitespace-nowrap">
                            🎉 8-min delivery!
                        </Badge>

                        <h2 className="text-lg md:text-xl text-gray-900 hidden sm:block">
                            Groceries in <span className="text-green-600">minutes</span>
                        </h2>
                    </div>

                    {/* Right Content - Features */}
                    <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <Clock className="w-4 h-4 text-green-500" />
                            <span className="text-xs md:text-sm">8-15 mins</span>
                        </div>

                        <div className="hidden md:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <Truck className="w-4 h-4 text-blue-500" />
                            <span className="text-xs md:text-sm">Free above ₹199</span>
                        </div>

                        <div className="hidden lg:flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-sm">
                            <Star className="w-4 h-4 text-yellow-500" />
                            <span className="text-xs md:text-sm">4.8 rating</span>
                        </div>

                        <div className="hidden xl:flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1.5 rounded-full shadow-sm">
                            <Gift className="w-4 h-4" />
                            <span className="text-xs md:text-sm">Welcome offer</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}