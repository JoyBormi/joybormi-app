import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';

import type { IService } from '@/types/service.type';

interface ServicesListProps {
  services: IService[];
  onAddService?: () => void;
  onServicePress?: (service: IService) => void;
  canEdit?: boolean;
}

export const ServicesList: React.FC<ServicesListProps> = ({
  services,
  onAddService,
  onServicePress,
  canEdit = true,
}) => {
  if (services.length === 0) return null;

  return (
    <View className="px-2 mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        <Text className="font-title text-foreground">
          My Services ({services.length})
        </Text>

        {canEdit && onAddService && (
          <Pressable
            onPress={onAddService}
            className="flex-row items-center gap-1"
          >
            <Text className="font-body text-primary">Add</Text>
            <Icons.ChevronRight size={16} className="text-primary" />
          </Pressable>
        )}
      </View>

      {!canEdit && (
        <View className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <Text className="font-caption text-primary">
            Your worker profile services are automatically shown here for now.
          </Text>
        </View>
      )}

      {/* Grouped Card */}
      <View className="bg-card rounded-lg overflow-hidden">
        {services.map((service, index) => {
          const isPressable = !!onServicePress;

          const Container = isPressable ? Pressable : View;

          return (
            <View key={service.id}>
              <Container
                onPress={
                  isPressable ? () => onServicePress?.(service) : undefined
                }
                className="px-5 py-4"
              >
                <View className="gap-3">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-title text-foreground">
                      {service.name}
                    </Text>
                    <Text className="font-title text-primary">
                      {service.currency} {service.price}
                    </Text>
                  </View>

                  {service.description ? (
                    <Text className="font-body text-muted-foreground mt-1">
                      {service.description}
                    </Text>
                  ) : null}
                </View>

                <View className="flex-row items-center gap-2 mt-3">
                  <Icons.Clock size={14} className="text-muted-foreground" />
                  <Text className="font-caption text-muted-foreground">
                    {service.durationMins} min
                  </Text>
                </View>
              </Container>

              {index !== services.length - 1 && (
                <View className="h-px bg-border ml-5" />
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};
