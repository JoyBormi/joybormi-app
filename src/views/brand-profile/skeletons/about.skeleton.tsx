import { View } from 'react-native';

import { Skeleton } from '@/components/ui/skeleton';

export const BrandAboutSkeleton = () => (
  <View className="mb-6">
    <Skeleton />
    <View className="h-2" />
    <Skeleton />
    <View className="h-2" />
    <Skeleton />
  </View>
);
