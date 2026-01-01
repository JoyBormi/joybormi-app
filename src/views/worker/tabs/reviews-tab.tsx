import { MotiView } from 'moti';
import React from 'react';
import { Image, View } from 'react-native';

import { Text } from '@/components/ui';
import Icons from '@/lib/icons';

interface Review {
  id: string;
  customer_name: string;
  customer_avatar: string;
  rating: number;
  comment: string;
  created_at: string;
  service_name?: string;
}

interface MemberReviewsTabProps {
  reviews: Review[];
  averageRating: number;
  totalReviews: number;
}

export const MemberReviewsTab: React.FC<MemberReviewsTabProps> = ({
  reviews,
  averageRating,
  totalReviews,
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <View className="px-4">
      {/* Rating Summary */}
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 300 }}
        className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 border border-border/50 mb-4 items-center"
      >
        <Text className="font-heading text-4xl text-foreground mb-1">
          {averageRating.toFixed(1)}
        </Text>
        <View className="flex-row items-center gap-1 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Icons.Star
              key={star}
              size={20}
              className="text-warning"
              fill={star <= Math.round(averageRating) ? '#f59e0b' : 'none'}
            />
          ))}
        </View>
        <Text className="font-body text-muted-foreground">
          Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
        </Text>
      </MotiView>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <View className="items-center justify-center py-12">
          <Icons.MessageSquare
            size={48}
            className="text-muted-foreground mb-3"
          />
          <Text className="font-title text-foreground mb-1">
            No Reviews Yet
          </Text>
          <Text className="font-body text-muted-foreground text-center">
            Be the first to leave a review
          </Text>
        </View>
      ) : (
        reviews.map((review, index) => (
          <MotiView
            key={review.id}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
          >
            <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50 mb-3">
              {/* Reviewer Info */}
              <View className="flex-row items-start gap-3 mb-3">
                <Image
                  source={{ uri: review.customer_avatar }}
                  className="w-10 h-10 rounded-full"
                />
                <View className="flex-1">
                  <Text className="font-subtitle text-foreground">
                    {review.customer_name}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <View className="flex-row items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icons.Star
                          key={star}
                          size={14}
                          className="text-warning"
                          fill={star <= review.rating ? '#f59e0b' : 'none'}
                        />
                      ))}
                    </View>
                    <Text className="font-caption text-muted-foreground">
                      • {formatDate(review.created_at)}
                    </Text>
                  </View>
                </View>
              </View>

              {/* Service Name */}
              {review.service_name && (
                <View className="bg-muted/30 px-2 py-1 rounded-lg self-start mb-2">
                  <Text className="font-caption text-muted-foreground">
                    {review.service_name}
                  </Text>
                </View>
              )}

              {/* Review Comment */}
              <Text className="font-body text-muted-foreground leading-6">
                {review.comment}
              </Text>
            </View>
          </MotiView>
        ))
      )}
    </View>
  );
};
