import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

export const BrandCardSkeleton = () => (
  <View className="mb-6">
    <Skeleton />
    <View className="h-4" />
    <Skeleton />
  </View>
);
