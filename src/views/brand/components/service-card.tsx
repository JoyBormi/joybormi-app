import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { IBrandService } from '@/types/brand.type';

interface ServiceCardProps {
  service: IBrandService;
  onPress?: () => void;
  index?: number;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onPress,
  index = 0,
}) => {
  const hasDiscount = service.discount && service.discount.percentage > 0;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 400, delay: index * 100 }}
    >
      <Pressable
        onPress={onPress}
        className="bg-card/30 backdrop-blur-sm rounded-2xl overflow-hidden border border-border/50 mb-3"
      >
        <View className="flex-row">
          {/* Service Image */}
          {service.image && (
            <View className="w-24 h-24 bg-muted">
              <Image
                source={{ uri: service.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
              {hasDiscount && (
                <View className="absolute top-2 left-2 bg-destructive px-2 py-0.5 rounded-full">
                  <Text className="font-caption text-destructive-foreground text-xs">
                    -{service.discount!.percentage}%
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* Service Info */}
          <View className="flex-1 p-3 justify-between">
            <View>
              <View className="flex-row items-center gap-2 mb-1">
                <Text
                  className="font-subtitle text-foreground flex-1"
                  numberOfLines={1}
                >
                  {service.name}
                </Text>
                {service.popular && (
                  <View className="bg-warning/10 px-2 py-0.5 rounded-full">
                    <Text className="font-caption text-warning text-xs">
                      Popular
                    </Text>
                  </View>
                )}
              </View>
              <Text
                className="font-caption text-muted-foreground"
                numberOfLines={2}
              >
                {service.description}
              </Text>
            </View>

            <View className="flex-row items-center justify-between mt-2">
              <View className="flex-row items-center gap-1">
                <Icons.Clock size={14} className="text-muted-foreground" />
                <Text className="font-caption text-muted-foreground">
                  {service.duration} min
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                {hasDiscount && (
                  <Text className="font-caption text-muted-foreground line-through">
                    ₩{service.price.toLocaleString()}
                  </Text>
                )}
                <Text className="font-subtitle text-primary font-medium">
                  ₩
                  {hasDiscount
                    ? Math.round(
                        service.price *
                          (1 - service.discount!.percentage / 100),
                      ).toLocaleString()
                    : service.price.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </MotiView>
  );
};
