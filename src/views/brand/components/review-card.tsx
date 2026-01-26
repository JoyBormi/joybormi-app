import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { IBrandReview } from '@/types/brand.type';

interface ReviewCardProps {
  review: IBrandReview;
  onHelpful?: () => void;
  index?: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  review,
  onHelpful,
  index = 0,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Icons.Star
        key={i}
        size={14}
        className={i < rating ? 'text-warning fill-warning' : 'text-muted'}
      />
    ));
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 100 }}
    >
      <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50 mb-3">
        {/* User Info */}
        <View className="flex-row items-start gap-3 mb-3">
          <Image
            source={{ uri: review.userAvatar }}
            className="w-12 h-12 rounded-full border border-border"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text className="font-subtitle text-foreground mb-1">
              {review.userName}
            </Text>
            <View className="flex-row items-center gap-2 mb-1">
              <View className="flex-row gap-0.5">
                {renderStars(review.rating)}
              </View>
              <Text className="font-caption text-muted-foreground">
                {new Date(review.createdAt).toLocaleDateString()}
              </Text>
            </View>
            {review.serviceName && (
              <View className="bg-primary/10 self-start px-2 py-0.5 rounded-full">
                <Text className="font-caption text-primary text-xs">
                  {review.serviceName}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Review Content */}
        <Text className="font-body text-foreground mb-3">{review.comment}</Text>

        {/* Review Images */}
        {review.images && review.images.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-3 -mx-1"
          >
            {review.images.map((image, idx) => (
              <View
                key={idx}
                className="w-24 h-24 rounded-xl overflow-hidden mx-1 bg-muted"
              >
                <Image
                  source={{ uri: image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
        )}

        {/* Helpful Button */}
        <Pressable
          onPress={onHelpful}
          className="flex-row items-center gap-1.5 self-start"
        >
          <Icons.ThumbsUp size={14} className="text-muted-foreground" />
          <Text className="font-caption text-muted-foreground">
            Helpful ({review.helpful})
          </Text>
        </Pressable>
      </View>
    </MotiView>
  );
};
