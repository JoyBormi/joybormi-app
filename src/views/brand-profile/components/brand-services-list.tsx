import { router } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { formatCurrency } from '@/utils/helpers';

import type { IService } from '@/types/service.type';

interface BrandServicesListProps {
  services?: IService[];
  canEdit: boolean;
  ownerId: string;
}

/**
 * Brand Services List Component
 * Displays list of brand services with add button
 */
export const BrandServicesList: React.FC<BrandServicesListProps> = ({
  services,
  canEdit,
  ownerId,
}) => {
  console.log('🚀 ~ BrandServicesList ~ services:', services);
  if (!services || services.length === 0) return null;
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          Services ({services.length})
        </Text>
        {canEdit && (
          <Pressable
            onPress={() =>
              router.push(`/(slide-screens)/upsert-service?ownerId=${ownerId}`)
            }
          >
            <Icons.Plus size={20} className="text-primary" />
          </Pressable>
        )}
      </View>
      <View className="gap-3">
        {services.map((service, index) => (
          <MotiView
            key={service.id}
            from={{ opacity: 0, translateY: 6 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 250, delay: index * 60 }}
          >
            <Pressable
              onPress={() =>
                router.push(
                  `/(slide-screens)/upsert-service?serviceId=${service.id}&ownerId=${ownerId}`,
                )
              }
              className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50 active:scale-[0.98]"
            >
              <View className="flex-row items-start justify-between mb-3">
                <Text className="font-subtitle text-foreground flex-1">
                  {service.name}
                </Text>
                <Text className="font-subtitle text-primary">
                  {formatCurrency(service.price, service.currency)}
                </Text>
              </View>
              <Text className="font-body text-muted-foreground mb-3">
                {service.description}
              </Text>
              <View className="flex-row items-center gap-2">
                <Icons.Clock size={16} className="text-muted-foreground" />
                <Text className="font-caption text-muted-foreground">
                  {service.durationMins} minutes
                </Text>
              </View>
            </Pressable>
          </MotiView>
        ))}
      </View>
    </View>
  );
};
