import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import type { IService } from '@/types/worker.type';
import React from 'react';
import { Pressable, View } from 'react-native';

interface ServicesListProps {
  services: IService[];
  onAddService: () => void;
  onServicePress: (service: IService) => void;
}

/**
 * Services List Component
 * Displays list of worker services
 */
export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onAddService,
  onServicePress,
}) => {
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">
          My Services ({services.length})
        </Text>
        <Pressable onPress={onAddService}>
          <Icons.Plus size={20} className="text-primary" />
        </Pressable>
      </View>
      <View className="gap-3">
        {services.map((service) => (
          <Pressable
            key={service.id}
            onPress={() => onServicePress(service)}
            className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50"
          >
            <View className="flex-row items-start justify-between mb-3">
              <Text className="font-subtitle text-foreground flex-1">
                {service.name}
              </Text>
              <Text className="font-subtitle text-primary">
                {service.price}
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
