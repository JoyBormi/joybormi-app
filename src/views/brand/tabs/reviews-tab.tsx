import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { IBrand, IBrandReview } from '@/types/brand.type';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, View } from 'react-native';
import { ReviewCard } from '../components/review-card';

interface ReviewsTabProps {
  brand: IBrand;
  reviews: IBrandReview[];
  onHelpful?: (reviewId: string) => void;
  onWriteReview?: () => void;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({
  brand,
  reviews,
  onHelpful,
  onWriteReview,
}) => {
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r) => r.rating === rating).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { rating, count, percentage };
  });

  return (
    <View className="flex-1">
      {/* Rating Summary */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        className="px-4 mb-4"
      >
        <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
          <View className="flex-row items-center gap-4 mb-4">
            {/* Overall Rating */}
            <View className="items-center">
              <Text className="font-heading text-foreground mb-1">
                {brand.rating.toFixed(1)}
              </Text>
              <View className="flex-row gap-0.5 mb-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Icons.Star
                    key={i}
                    size={16}
                    className={
                      i < Math.round(brand.rating)
                        ? 'text-warning fill-warning'
                        : 'text-muted'
                    }
                  />
                ))}
              </View>
              <Text className="font-caption text-muted-foreground">
                {brand.reviewCount} reviews
              </Text>
            </View>

            {/* Rating Distribution */}
            <View className="flex-1">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <View key={rating} className="flex-row items-center gap-2 mb-1">
                  <Text className="font-caption text-muted-foreground w-3">
                    {rating}
                  </Text>
                  <Icons.Star size={12} className="text-warning fill-warning" />
                  <View className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <View
                      className="h-full bg-warning rounded-full"
                      style={{ width: `${percentage}%` }}
                    />
                  </View>
                  <Text className="font-caption text-muted-foreground w-8 text-right">
                    {count}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Write Review Button */}
          <Pressable
            onPress={onWriteReview}
            className="bg-primary rounded-full py-3 items-center"
          >
            <Text className="font-subtitle text-primary-foreground">
              Write a Review
            </Text>
          </Pressable>
        </View>
      </MotiView>

      {/* Reviews List */}
      <View className="px-4">
        {reviews.map((review, index) => (
          <ReviewCard
            key={review.id}
            review={review}
            onHelpful={() => onHelpful?.(review.id)}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};
