import { useState } from 'react';
import { X, Star, Plus, Minus, Heart, Share2, Shield, Truck, Clock, Award } from 'lucide-react';
import type { Product } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductDetailModalProps {
  product: Product | null;
  categoryName?: string;
  isOpen: boolean;
  onClose: () => void;
  quantity: number;
  onAddToCart: () => void;
  onRemoveFromCart: () => void;
  onUpdateQuantity: (quantity: number) => void;
  language: 'en' | 'ta';
}

export function ProductDetailModal({
  product, categoryName,
  isOpen,
  onClose,
  quantity,
  onAddToCart,
  onRemoveFromCart,
  onUpdateQuantity,
    language
}: ProductDetailModalProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    if (quantity === 0) {
      onAddToCart();
    } else {
      onUpdateQuantity(quantity + 1);
    }
  };

  const handleRemove = () => {
    if (quantity === 1) {
      onRemoveFromCart();
    } else {
      onUpdateQuantity(quantity - 1);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on QuickMart`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col relative">
        {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsFavorite(!isFavorite)}
              className="text-gray-500 hover:text-red-500"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="text-gray-500 hover:text-blue-500"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
            <div className="p-4 sm:p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 64px)' }}>
                <div className="grid sm:grid-cols-2 gap-4 sm:gap-4 md:gap-8">
                    {/* Product Image */}
                    <div className="space-y-3 sm:space-y-4">
                        <div className="relative  md:aspect-square rounded-xl overflow-hidden bg-gray-50 max-w-xs sm:max-w-xs mx-auto md:max-w-none md:mx-0">
                            <ImageWithFallback
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.discount && (
                    <Badge variant="destructive" className="text-sm">
                      {product.discount}% OFF
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="secondary" className="bg-gray-800 text-white">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Features */}
              {product.features && product.features.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <Award className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-700">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
                {product.brand && (
                  <p className="text-sm text-gray-600 mb-2">by {product.brand}</p>
                )}

                {product.ratings && (
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">{renderStars(product.ratings.average)}</div>
                    <span className="text-sm font-medium">{product.ratings.average}</span>
                    <span className="text-sm text-gray-500">({product.ratings.count} reviews)</span>
                  </div>
                )}

                <Badge variant="secondary" className="mb-4">
                  {categoryName}
                </Badge>
              </div>

              {/* Price */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{product.unit}</p>
                {product.originalPrice && (
                  <p className="text-sm text-green-600 font-medium">
                    You save ₹{product.originalPrice - product.price}
                  </p>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              {/* Delivery Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700">Free Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-600">Delivered in 8-15 mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="text-sm text-blue-600">Quality Guaranteed</span>
                  </div>
                </div>
              </div>

                {/* Desktop Add to Cart - Hidden on mobile */}
                <div className="hidden sm:block space-y-3 pt-2">
                    {quantity === 0 ? (
                        <Button
                            onClick={handleAdd}
                            disabled={!product.inStock}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        >
                    <Plus className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                ) : (
                  <div className="flex items-center justify-between bg-green-600 text-white rounded-lg p-2">
                    <Button
                      onClick={handleRemove}
                      size="lg"
                      variant="ghost"
                      className="h-10 w-10 p-0 text-white hover:bg-green-700"
                    >
                      <Minus className="w-5 h-5" />
                    </Button>

                    <span className="font-semibold text-lg px-4">{quantity} in cart</span>

                    <Button
                      onClick={handleAdd}
                      size="lg"
                      variant="ghost"
                      className="h-10 w-10 p-0 text-white hover:bg-green-700"
                    >
                      <Plus className="w-5 h-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
                {/* Detailed Information Tabs */}
                <div className="mt-8">
                    <Tabs defaultValue="nutrition" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="nutrition">
                                {language === 'en' ? 'Nutrition' : 'ஊட்டச்சத்து'}
                            </TabsTrigger>
                            <TabsTrigger value="ingredients">
                                {language === 'en' ? 'Ingredients' : 'பொருட்கள்'}
                            </TabsTrigger>
                            <TabsTrigger value="storage">
                                {language === 'en' ? 'Storage' : 'சேமிப்பு'}
                            </TabsTrigger>
                            <TabsTrigger value="details">
                                {language === 'en' ? 'Details' : 'விவரங்கள்'}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="nutrition" className="mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Nutritional Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {product.nutritionalInfo ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {Object.entries(product.nutritionalInfo)
                                        .filter(([_, value]) => value != null) // ✅ skip null or undefined
                                        .map(([key, value]) => (
                                            <div key={key} className="text-center p-3 bg-gray-50 rounded-lg">
                                                <p className="text-sm text-gray-600 capitalize">{key}</p>
                                                <p className="font-semibold text-gray-900">{value}</p>
                                            </div>
                                        ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Nutritional information not available</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>


                <TabsContent value="ingredients" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ingredients & Allergens</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {product.ingredients && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Ingredients:</h4>
                        <p className="text-gray-600">{product.ingredients.join(', ')}</p>
                      </div>
                    )}

                    {product.allergens && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Allergen Information:</h4>
                        <p className="text-gray-600">{product.allergens.join(', ')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="storage" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Storage Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {product.storageInstructions ? (
                      <p className="text-gray-600">{product.storageInstructions}</p>
                    ) : (
                      <p className="text-gray-500">Storage instructions not available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {product.weight && (
                        <div>
                          <p className="text-sm text-gray-600">Weight/Size</p>
                          <p className="font-medium">{product.weight}</p>
                        </div>
                      )}

                      {product.countryOfOrigin && (
                        <div>
                          <p className="text-sm text-gray-600">Country of Origin</p>
                          <p className="font-medium">{product.countryOfOrigin}</p>
                        </div>
                      )}

                      {product.manufacturingDate && (
                        <div>
                          <p className="text-sm text-gray-600">Manufactured</p>
                          <p className="font-medium">{new Date(product.manufacturingDate).toLocaleDateString()}</p>
                        </div>
                      )}

                      {product.expiryDate && (
                        <div>
                          <p className="text-sm text-gray-600">Best Before</p>
                          <p className="font-medium">{new Date(product.expiryDate).toLocaleDateString()}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

                {/* Mobile Fixed Bottom Add to Cart */}
                <div className="sm:hidden absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 rounded-b-2xl">
                    {quantity === 0 ? (
                        <Button
                            onClick={handleAdd}
                            disabled={!product.inStock}
                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:opacity-50 h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                        >
                            <Plus className="w-5 h-5 mr-2" />
                            Add to Cart
                        </Button>
                    ) : (
                        <div className="flex items-center justify-between bg-green-600 text-white rounded-lg p-2">
                            <Button
                                onClick={handleRemove}
                                size="lg"
                                variant="ghost"
                                className="h-10 w-10 p-0 text-white hover:bg-green-700"
                            >
                                <Minus className="w-5 h-5" />
                            </Button>

                            <span className="font-semibold text-lg px-4">{quantity} in cart</span>

                            <Button
                                onClick={handleAdd}
                                size="lg"
                                variant="ghost"
                                className="h-10 w-10 p-0 text-white hover:bg-green-700"
                            >
                                <Plus className="w-5 h-5" />
                            </Button>
                        </div>
                    )}
                </div>
        </div>
      </div>
    </div>
  );
}