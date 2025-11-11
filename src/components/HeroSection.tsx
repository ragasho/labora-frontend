import { Clock, Truck, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

export function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-green-50 to-blue-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <Badge className="mb-4 bg-green-100 text-green-700 hover:bg-green-100">
              🎉 Now delivering in 8 minutes!
            </Badge>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Groceries delivered in <span className="text-green-600">minutes</span>, not hours
            </h2>
            
            <p className="text-lg text-gray-600 mb-6 max-w-lg">
              Get fresh groceries, daily essentials, and more delivered to your doorstep in just minutes. 
              Quality products at great prices.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start mb-6">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Clock className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">8-15 min delivery</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Truck className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Free delivery above ₹199</span>
              </div>
              
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                <Star className="w-5 h-5 text-yellow-500" />
                <span className="text-sm font-medium">4.8 rating</span>
              </div>
            </div>

            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              Start Shopping
            </Button>
          </div>

          {/* Right Content - Delivery Illustration */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="text-center">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Super Fast Delivery</h3>
                  <p className="text-gray-600 mb-4">Your order will be delivered in just 8-15 minutes</p>
                  
                  <div className="flex justify-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Packed</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">On the way</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span className="text-xs text-gray-500">Delivered</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}