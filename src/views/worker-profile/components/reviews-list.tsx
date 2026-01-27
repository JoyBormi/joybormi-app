import React from 'react';
import { Image, View } from 'react-native';

import Icons from '@/components/icons';
import { NoData } from '@/components/status-screens';
import { Text } from '@/components/ui';

import type { IReview } from '@/types/worker.type';

interface ReviewsListProps {
  reviews: IReview[];
  maxDisplay?: number;
}

/**
 * Reviews List Component
 * Displays list of reviews
 */
export const ReviewsList: React.FC<ReviewsListProps> = ({
  reviews,
  maxDisplay = 2,
}) => {
  if (reviews.length === 0) {
    return (
      <NoData
        title="No Reviews Yet"
        message="Reviews from customers will show up here."
      />
    );
  }

  return (
    <View className="px-6">
      <Text className="font-title text-lg text-foreground mb-4">
        Recent Reviews ({reviews.length})
      </Text>
      <View className="gap-3">
        {reviews.slice(0, maxDisplay).map((review) => (
          <View
            key={review.id}
            className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50"
          >
            <View className="flex-row items-start gap-3 mb-3">
              <Image
                source={{ uri: review.customerAvatar }}
                className="w-10 h-10 rounded-full"
              />
              <View className="flex-1">
                <Text className="font-subtitle text-foreground mb-1">
                  {review.customerName}
                </Text>
                <View className="flex-row items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icons.Star
                      key={star}
                      size={14}
                      className="text-warning"
                      fill={star <= review.rating ? '#f59e0b' : 'none'}
                    />
                  ))}
                </View>
              </View>
            </View>
            <Text className="font-body text-muted-foreground">
              {review.comment}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
