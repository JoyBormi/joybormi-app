import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import type { Service } from '../worker-profile.d';

interface ServiceCardProps {
  service: Service;
  onPress: (service: Service) => void;
}

/**
 * Service Card Component
 * Displays individual service information
 */
export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
}) => {
  return (
    <Pressable
      onPress={() => onPress(service)}
      className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50"
    >
      <View className="flex-row items-start justify-between mb-3">
        <Text className="font-subtitle text-foreground flex-1">
          {service.name}
        </Text>
        <Text className="font-subtitle text-primary">{service.price}</Text>
      </View>
      <Text className="font-body text-muted-foreground mb-3">
        {service.description}
      </Text>
      <View className="flex-row items-center gap-2">
        <Icons.Clock size={16} className="text-muted-foreground" />
        <Text className="font-caption text-muted-foreground">
          {service.duration_mins} minutes
        </Text>
      </View>
    </Pressable>
  );
};
