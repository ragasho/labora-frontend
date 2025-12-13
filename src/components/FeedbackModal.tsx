import { useState } from 'react';
import { X, Star, Send, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../hooks/useAuth';
import { apiService } from '../services/api';
import { toast } from 'sonner';
import type { Order } from '../types';

interface FeedbackModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onFeedbackSubmitted: () => void;
}

interface CategoryRatings {
  deliverySpeed: number;
  productQuality: number;
  packaging: number;
  customerService: number;
}

export function FeedbackModal({ order, isOpen, onClose, onFeedbackSubmitted }: FeedbackModalProps) {
  const [overallRating, setOverallRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [categoryRatings, setCategoryRatings] = useState<CategoryRatings>({
    deliverySpeed: 0,
    productQuality: 0,
    packaging: 0,
    customerService: 0
  });
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { getAccessToken } = useAuth();

  if (!isOpen || !order) return null;

  const handleCategoryRating = (category: keyof CategoryRatings, rating: number) => {
    setCategoryRatings(prev => ({
      ...prev,
      [category]: rating
    }));
  };

  const handleSubmit = async () => {
    if (overallRating === 0) {
      toast.error('Please provide an overall rating');
      return;
    }

    if (wouldRecommend === null) {
      toast.error('Please let us know if you would recommend us');
      return;
    }

    const feedbackData = {
      orderId: order.id,
      rating: overallRating,
      comment,
      categories: categoryRatings,
      wouldRecommend
    };

    setIsSubmitting(true);
    try {
      const accessToken = await getAccessToken();
      if (accessToken) {
        await apiService.submitFeedback(feedbackData, accessToken);
        toast.success('Thank you for your feedback!');
        onFeedbackSubmitted();
        onClose();
        
        // Reset form
        setOverallRating(0);
        setComment('');
        setCategoryRatings({
          deliverySpeed: 0,
          productQuality: 0,
          packaging: 0,
          customerService: 0
        });
        setWouldRecommend(null);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number, onRate: (rating: number) => void, hoveredValue?: number) => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;
      const isFilled = starIndex <= (hoveredValue ?? rating);
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => onRate(starIndex)}
          onMouseEnter={() => setHoveredRating && setHoveredRating(starIndex)}
          onMouseLeave={() => setHoveredRating && setHoveredRating(0)}
          className="focus:outline-none"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
            }`}
          />
        </button>
      );
    });
  };

  const renderCategoryStars = (category: keyof CategoryRatings, rating: number) => {
    return [...Array(5)].map((_, index) => {
      const starIndex = index + 1;
      const isFilled = starIndex <= rating;
      
      return (
        <button
          key={index}
          type="button"
          onClick={() => handleCategoryRating(category, starIndex)}
          className="focus:outline-none"
        >
          <Star
            className={`w-5 h-5 transition-colors ${
              isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
            }`}
          />
        </button>
      );
    });
  };

  const getCategoryLabel = (category: keyof CategoryRatings): string => {
    switch (category) {
      case 'deliverySpeed':
        return 'Delivery Speed';
      case 'productQuality':
        return 'Product Quality';
      case 'packaging':
        return 'Packaging';
      case 'customerService':
        return 'Customer Service';
      default:
        return category;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-semibold">Rate Your Experience</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order #{order.orderNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary">
                  {new Date(order.placedAt).toLocaleDateString()}
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  Delivered
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                {order.items.slice(0, 3).map((item, index) => (
                  <ImageWithFallback
                    key={item.id}
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ))}
                {order.items.length > 3 && (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-sm text-gray-600">+{order.items.length - 3}</span>
                  </div>
                )}
                <div className="ml-2">
                  <p className="font-medium">₹{order.totalAmount}</p>
                  <p className="text-sm text-gray-500">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Rating */}
          <div className="text-center space-y-4">
            <h3 className="text-lg font-medium">How was your overall experience?</h3>
            <div className="flex items-center justify-center gap-1">
              {renderStars(overallRating, setOverallRating, hoveredRating)}
            </div>
            {overallRating > 0 && (
              <p className="text-sm text-gray-600">
                {overallRating === 1 && "We're sorry to hear that. We'll do better next time."}
                {overallRating === 2 && "We appreciate your feedback and will work to improve."}
                {overallRating === 3 && "Thank you for your feedback. We're always working to improve."}
                {overallRating === 4 && "Great! We're glad you had a positive experience."}
                {overallRating === 5 && "Amazing! Thank you for choosing QuickMart!"}
              </p>
            )}
          </div>

          <Separator />

          {/* Category Ratings */}
          <div className="space-y-4">
            <h3 className="font-medium">Rate specific aspects:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryRatings).map(([category, rating]) => (
                <div key={category} className="space-y-2">
                  <p className="text-sm font-medium">{getCategoryLabel(category as keyof CategoryRatings)}</p>
                  <div className="flex items-center gap-1">
                    {renderCategoryStars(category as keyof CategoryRatings, rating)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Recommendation */}
          <div className="space-y-3">
            <h3 className="font-medium">Would you recommend QuickMart to others?</h3>
            <div className="flex items-center gap-4">
              <Button
                variant={wouldRecommend === true ? "default" : "outline"}
                onClick={() => setWouldRecommend(true)}
                className="flex items-center gap-2"
              >
                <ThumbsUp className="w-4 h-4" />
                Yes
              </Button>
              <Button
                variant={wouldRecommend === false ? "destructive" : "outline"}
                onClick={() => setWouldRecommend(false)}
                className="flex items-center gap-2"
              >
                <ThumbsDown className="w-4 h-4" />
                No
              </Button>
            </div>
          </div>

          <Separator />

          {/* Written Feedback */}
          <div className="space-y-3">
            <h3 className="font-medium">Share your thoughts (optional)</h3>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience, what went well, or how we can improve..."
              className="min-h-[100px]"
              maxLength={500}
            />
            <p className="text-xs text-gray-500 text-right">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={overallRating === 0 || wouldRecommend === null || isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Button>
        </div>
      </div>
    </div>
  );
}