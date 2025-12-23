import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import React from 'react';
import { View } from 'react-native';

interface QuickStatsProps {
  servicesCount: number;
  workDaysCount: number;
  reviewsCount: number;
}

/**
 * Quick Stats Component
 * Displays statistics about services, work days, and reviews
 */
export const QuickStats: React.FC<QuickStatsProps> = ({
  servicesCount,
  workDaysCount,
  reviewsCount,
}) => {
  return (
    <View className="flex-row gap-3 mb-6">
      <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
        <Icons.Briefcase size={20} className="text-primary mb-2" />
        <Text className="font-heading text-lg text-foreground">
          {servicesCount}
        </Text>
        <Text className="font-caption text-muted-foreground">Services</Text>
      </View>
      <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
        <Icons.Calendar size={20} className="text-success mb-2" />
        <Text className="font-heading text-lg text-foreground">
          {workDaysCount}
        </Text>
        <Text className="font-caption text-muted-foreground">Work Days</Text>
      </View>
      <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
        <Icons.Star size={20} className="text-warning mb-2" />
        <Text className="font-heading text-lg text-foreground">
          {reviewsCount}
        </Text>
        <Text className="font-caption text-muted-foreground">Reviews</Text>
      </View>
    </View>
  );
};
