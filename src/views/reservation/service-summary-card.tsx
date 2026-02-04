import React from 'react';
import { Image, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { IBrand, IBrandService, IBrandWorker } from '@/types/brand.type';

interface ServiceSummaryCardProps {
  service: IBrandService;
  brand: IBrand;
  worker: IBrandWorker;
}

export const ServiceSummaryCard: React.FC<ServiceSummaryCardProps> = ({
  service,
  brand,
  worker,
}) => {
  return (
    <View className="bg-card rounded-3xl p-4 border border-border/50 shadow-sm">
      <View className="flex-row items-center gap-4">
        {service.image ? (
          <Image
            source={{ uri: service.image }}
            className="w-20 h-20 rounded-2xl"
          />
        ) : (
          <View className="w-20 h-20 rounded-2xl bg-muted items-center justify-center">
            <Icons.Scissors size={32} className="text-muted-foreground" />
          </View>
        )}
        <View className="flex-1">
          <Text className="font-title text-lg leading-tight">
            {service.name}
          </Text>
          <View className="flex-row items-center gap-1 mt-1">
            <Icons.Clock size={14} className="text-muted-foreground" />
            <Text className="font-caption text-muted-foreground">
              {service.duration} mins • {service.price} {service.currency}
            </Text>
          </View>
        </View>
      </View>

      <View className="h-[1px] bg-border/50 my-4" />

      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center gap-3">
          <Image
            source={{ uri: worker.avatar }}
            className="w-10 h-10 rounded-full"
          />
          <View>
            <Text className="font-subtitle text-sm">{worker.name}</Text>
            <Text className="font-caption text-xs text-muted-foreground">
              {worker.role}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text className="font-subtitle text-sm text-right">
            {brand.brandName}
          </Text>
          <View className="flex-row items-center gap-1">
            <Icons.MapPin size={12} className="text-muted-foreground" />
            <Text
              className="font-caption text-xs text-muted-foreground max-w-[120px]"
              numberOfLines={1}
            >
              {brand.city}, {brand.street}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
