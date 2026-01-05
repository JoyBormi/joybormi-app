import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

export const BrandQuickActionsSkeleton = () => (
  <View className="mb-6 flex-row gap-3">
    <Skeleton />
    <Skeleton />
    <Skeleton />
  </View>
);
