import { Text } from '@/components/ui';
import React from 'react';
import { View } from 'react-native';
import type { Review } from '../worker-profile.d';
import { ReviewCard } from './review-card';

interface ReviewsSectionProps {
  reviews: Review[];
  maxDisplay?: number;
}

/**
 * Reviews Section Component
 * Displays list of reviews
 */
export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  maxDisplay = 2,
}) => {
  return (
    <View className="px-6">
      <Text className="font-title text-lg text-foreground mb-4">
        Recent Reviews ({reviews.length})
      </Text>
      <View className="gap-3">
        {reviews.slice(0, maxDisplay).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </View>
    </View>
  );
};
