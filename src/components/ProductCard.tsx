import { Plus, Minus } from 'lucide-react';
import type { Product } from '../types';
import { CardContent, Card } from "./ui/card";
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface ProductCardProps {
    product: Product;
    quantity?: number;
    onAddToCart: (productId: string, quantity?: number, variant?: string) => void;
    onRemoveFromCart: (productId: string) => void;
    onUpdateQuantity: (productId: string, quantity: number) => void;
    onProductClick: (product: Product) => void;
    language: 'en' | 'ta';
}

export function ProductCard({
                                product,
                                quantity = 0,
                                onAddToCart,
                                onRemoveFromCart,
                                onUpdateQuantity,
                                onProductClick,
                                language
                            }: ProductCardProps) {
    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity === 0) {
            onAddToCart(product.id, 1);
        } else {
            onUpdateQuantity(product.id, quantity + 1);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (quantity === 1) {
            onRemoveFromCart(product.id);
        } else {
            onUpdateQuantity(product.id, quantity - 1);
        }
    };

    return (
        <Card
            className="product-card-hover cursor-pointer group animate-fade-in h-full"
            onClick={() => onProductClick(product)}
        >
            <CardContent className="p-2 h-full flex flex-col">
                <div className="relative mb-1">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 object-cover rounded-lg group-hover:scale-105 transition-transform"
                    />
                    {product.discount && (
                        <Badge className="absolute top-1 right-1 bg-red-500 text-xs">
                            {product.discount}% OFF
                        </Badge>
                    )}
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-medium">{language === 'en' ? 'Out of Stock' : 'கிடைக்கவில்லை'}</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col">
                    <h3 className="font-medium text-sm line-clamp-2 flex-1">
                        {product.name}
                    </h3>

                    {/* Rating */}
                    {product.ratings && (
                        <div className="flex items-center gap-1">
                            <div className="flex">
                                <span className= "text-yellow-400">★</span>
                            </div>
                            <span className="text-xs text-gray-500">{product.ratings.average} ({product.ratings.count})</span>
                        </div>
                    )}

                    <div >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                {product.originalPrice && (
                                    <span className="text-xs text-gray-500 line-through">₹{product.originalPrice}</span>
                                )}
                                <span className="text-green-600 font-bold text-sm ml-1">₹{product.price}</span>
                                {product.unit && (
                                    <span className="text-xs text-gray-500 ml-1">per {product.unit}</span>
                                )}
                            </div>
                        </div>


                        {/* Add to Cart / Quantity Controls */}
                        <div className="mt-1">
                            {quantity === 0 ? (
                                <Button
                                    size="sm"
                                    onClick={handleAdd}
                                    disabled={!product.inStock}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                                >
                                    {language === 'en' ? 'ADD' : 'சேர்க்கவும்'}
                                </Button>
                            ) : (
                                <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleRemove}
                                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                                    >
                                        <Minus className="w-3 h-3" />
                                    </Button>
                                    <span className="font-medium text-green-600 min-w-[2rem] text-center">{quantity}</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleAdd}
                                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                                    >
                                        <Plus className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}