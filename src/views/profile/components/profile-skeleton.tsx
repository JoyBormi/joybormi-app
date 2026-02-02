import React from 'react';
import { View } from 'react-native';
import { type Edge } from 'react-native-safe-area-context';

import { Skeleton } from '@/components/ui';

interface ProfileSkeletonProps {
  edges?: Edge[];
}

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({
  edges = ['top'],
}) => {
  return (
    <View className="safe-area">
      <View className="gap-6 pt-4">
        <View>
          <Skeleton className="h-56 rounded-3xl" />
          <View className="px-6 -mt-16">
            <View className="items-center gap-3">
              <Skeleton className="h-32 w-32 rounded-3xl" />
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-9 w-40 rounded-full" />
            </View>
            <View className="flex-row gap-3 mt-6">
              <Skeleton className="h-16 rounded-2xl flex-1" />
              <Skeleton className="h-16 rounded-2xl flex-1" />
              <Skeleton className="h-16 rounded-2xl flex-1" />
            </View>
            <Skeleton className="h-12 rounded-2xl mt-6" />
          </View>
        </View>

        <View className="gap-3 px-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-20 rounded-2xl" />
          <Skeleton className="h-20 rounded-2xl" />
        </View>

        <View className="gap-3 px-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-24 rounded-2xl" />
        </View>

        <View className="gap-3 px-6">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-32 rounded-2xl" />
        </View>
      </View>
    </View>
  );
};
