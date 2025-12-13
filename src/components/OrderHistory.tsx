import {useState, useEffect} from 'react';
import {ArrowLeft, Package, Clock, CheckCircle, XCircle, Truck, Star, RotateCcw, Phone, MapPin} from 'lucide-react';
import {Button} from './ui/button';
import {Badge} from './ui/badge';
import {Card, CardContent, CardHeader, CardTitle} from './ui/card';
import {Separator} from './ui/separator';
import {ScrollArea} from './ui/scroll-area';
import {ImageWithFallback} from './figma/ImageWithFallback';
import {useAuth} from '../hooks/useAuth';
import {apiService} from '../services/api';
import {toast} from 'sonner';
import type {Order, OrderItem} from '../types';

interface OrderHistoryProps {
    onClose: () => void,
    onReorder: (orderItems: OrderItem[]) => void,
    onFeedback: (order: Order) => void,
    isOpen?: boolean
}

export function OrderHistory({onClose, onReorder, onFeedback, isOpen}: OrderHistoryProps) {
    if (!isOpen) return null; // <-- add this

    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const {getAccessToken} = useAuth();

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            const accessToken = await getAccessToken();
            if (accessToken) {
                const userOrders = await apiService.getOrders(accessToken);
                setOrders(userOrders);
            }
        } catch (error) {
            console.error('Error loading orders:', error);
            toast.error('Failed to load order history');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelOrder = async (orderId: string) => {
        try {
            const accessToken = await getAccessToken();
            if (accessToken) {
                await apiService.cancelOrder(orderId, accessToken);
                toast.success('Order cancelled successfully');
                loadOrders(); // Refresh orders
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error('Failed to cancel order');
        }
    };

    const getStatusColor = (status: Order['status']): string => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'preparing':
                return 'bg-purple-100 text-purple-800';
            case 'outForDelivery':
                return 'bg-orange-100 text-orange-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: Order['status']) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-4 h-4"/>;
            case 'confirmed':
                return <CheckCircle className="w-4 h-4"/>;
            case 'preparing':
                return <Package className="w-4 h-4"/>;
            case 'outForDelivery':
                return <Truck className="w-4 h-4"/>;
            case 'delivered':
                return <CheckCircle className="w-4 h-4"/>;
            case 'cancelled':
                return <XCircle className="w-4 h-4"/>;
            default:
                return <Clock className="w-4 h-4"/>;
        }
    };

    const formatStatus = (status: Order['status']): string => {
        return status.split('_').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    };

    if (selectedOrder) {
        return (
            <div className="fixed inset-0 bg-white z-50">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedOrder(null)}
                        >
                            <ArrowLeft className="w-5 h-5"/>
                        </Button>
                        <div>
                            <h2 className="font-semibold">Order Details</h2>
                            <p className="text-sm text-gray-500">#{selectedOrder.orderNumber}</p>
                        </div>
                    </div>
                </div>

                <ScrollArea className="h-[calc(100vh-64px)]">
                    <div className="p-4 space-y-6">
                        {/* Order Status */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="flex items-center gap-2">
                                        {getStatusIcon(selectedOrder.status)}
                                        {formatStatus(selectedOrder.status)}
                                    </CardTitle>
                                    <Badge className={getStatusColor(selectedOrder.status)}>
                                        {formatStatus(selectedOrder.status)}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {selectedOrder.trackingSteps.map((step, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`w-3 h-3 rounded-full mt-1 ${
                                                step.completed ? 'bg-green-500' : 'bg-gray-300'
                                            }`}/>
                                            <div className="flex-1">
                                                <p className={`text-sm font-medium ${
                                                    step.completed ? 'text-green-700' : 'text-gray-500'
                                                }`}>
                                                    {step.description}
                                                </p>
                                                {step.completed && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(step.timestamp).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Delivery Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5"/>
                                    Delivery Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div>
                                    <p className="font-medium">{selectedOrder.deliveryAddress.name}</p>
                                    <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress.address}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Phone className="w-4 h-4 text-gray-400"/>
                                        <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress.phone}</p>
                                    </div>
                                </div>
                                {selectedOrder.deliveryAddress.instructions && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-700">Delivery Instructions:</p>
                                        <p className="text-sm text-gray-600">{selectedOrder.deliveryAddress.instructions}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Order Items */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Items Ordered</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {selectedOrder.items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <ImageWithFallback
                                                src={item.image}
                                                alt={item.name}
                                                className="w-12 h-12 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">{item.unit}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">₹{item.price} × {item.quantity}</p>
                                                <p className="text-sm text-gray-500">₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <Separator className="my-4"/>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Subtotal</span>
                                        <span>₹{selectedOrder.totalAmount - selectedOrder.deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span>Delivery Fee</span>
                                        <span>₹{selectedOrder.deliveryFee}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>₹{selectedOrder.totalAmount}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="space-y-3">
                            {selectedOrder.canReorder && (
                                <Button
                                    onClick={() => {
                                        onReorder(selectedOrder.items);
                                        onClose();
                                        toast.success('Items added to cart!');
                                    }}
                                    className="w-full"
                                    variant="outline"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2"/>
                                    Reorder Items
                                </Button>
                            )}

                            {selectedOrder.status === 'delivered' && !selectedOrder.feedback && (
                                <Button
                                    onClick={() => {
                                        onFeedback(selectedOrder);
                                        setSelectedOrder(null);
                                    }}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600"
                                >
                                    <Star className="w-4 h-4 mr-2"/>
                                    Rate & Review
                                </Button>
                            )}

                            {selectedOrder.canCancel && (
                                <Button
                                    onClick={() => handleCancelOrder(selectedOrder.id)}
                                    variant="destructive"
                                    className="w-full"
                                >
                                    <XCircle className="w-4 h-4 mr-2"/>
                                    Cancel Order
                                </Button>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-white z-50">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-4 py-3">
                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                    >
                        <ArrowLeft className="w-5 h-5"/>
                    </Button>
                    <h2 className="font-semibold">Order History</h2>
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-64px)]">
                <div className="p-4">
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg"/>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"/>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"/>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="w-16 h-16 mx-auto text-gray-300 mb-4"/>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
                            <Button onClick={onClose}>Start Shopping</Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                    <CardContent
                                        className="p-4"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="flex-shrink-0">
                                                {order.items[0] && (
                                                    <ImageWithFallback
                                                        src={order.items[0].image}
                                                        alt={order.items[0].name}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div>
                                                        <p className="font-medium">Order #{order.orderNumber}</p>
                                                        <p className="text-sm text-gray-500">
                                                            {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                                        </p>
                                                    </div>
                                                    <Badge className={getStatusColor(order.status)}>
                                                        {formatStatus(order.status)}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(order.placedAt).toLocaleDateString()}
                                                    </p>
                                                    <p className="font-semibold">₹{order.totalAmount}</p>
                                                </div>

                                                {order.status === 'delivered' && !order.feedback && (
                                                    <div className="mt-2">
                                                        <Button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                onFeedback(order);
                                                            }}
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-yellow-600 border-yellow-300 hover:bg-yellow-50"
                                                        >
                                                            <Star className="w-3 h-3 mr-1"/>
                                                            Rate Order
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}