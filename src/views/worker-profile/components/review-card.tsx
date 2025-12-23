import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import React from 'react';
import { Image, View } from 'react-native';
import type { Review } from '../worker-profile.d';

interface ReviewCardProps {
  review: Review;
}

/**
 * Review Card Component
 * Displays individual review
 */
export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <View className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50">
      <View className="flex-row items-start gap-3 mb-3">
        <Image
          source={{ uri: review.customer_avatar }}
          className="w-10 h-10 rounded-full"
        />
        <View className="flex-1">
          <Text className="font-subtitle text-foreground mb-1">
            {review.customer_name}
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
      <Text className="font-body text-muted-foreground">{review.comment}</Text>
    </View>
  );
};
