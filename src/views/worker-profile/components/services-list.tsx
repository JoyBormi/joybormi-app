import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { NoData } from '@/components/status-screens';
import { Text } from '@/components/ui';

import type { IService } from '@/types/service.type';

interface ServicesListProps {
  services: IService[];
  onAddService?: () => void;
  onServicePress?: (service: IService) => void;
  canEdit?: boolean;
}

/**
 * Services List Component
 * Displays list of worker services
 */
export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onAddService,
  onServicePress,
  canEdit = true,
}) => {
  if (services.length === 0) {
    return (
      <NoData
        title="No Services"
        message="Create your first service to start accepting bookings."
        action={
          canEdit && onAddService
            ? {
                label: 'Add Service',
                onPress: onAddService,
              }
            : undefined
        }
      />
    );
  }

  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          My Services ({services.length})
        </Text>
        {canEdit && onAddService && (
          <Pressable onPress={onAddService}>
            <Icons.Plus size={20} className="text-primary" />
          </Pressable>
        )}
      </View>
      <View className="gap-3">
        {services.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => onServicePress?.(service)}
            disabled={!onServicePress}
            className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50"
          >
            <View className="flex-row items-start justify-between mb-3">
              <Text className="font-subtitle text-foreground flex-1">
                {service.name}
              </Text>
              <Text className="font-subtitle text-primary">
                ${service.price}
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
        ))}
      </View>
    </View>
  );
};
