import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import React from 'react';
import { Pressable, View } from 'react-native';
import type { Service } from '../worker-profile.d';
import { ServiceCard } from './service-card';

interface ServicesSectionProps {
  services: Service[];
  onAddService: () => void;
  onServicePress: (service: Service) => void;
}

/**
 * Services Section Component
 * Displays list of worker services
 */
export const ServicesSection: React.FC<ServicesSectionProps> = ({
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
          <ServiceCard
            key={service.id}
            service={service}
            onPress={onServicePress}
          />
        ))}
      </View>
    </View>
  );
};
