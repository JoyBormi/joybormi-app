import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, View } from 'react-native';

interface Service {
  id: string;
  name: string;
  description: string;
  duration_mins: number;
  price: string;
}

interface MemberServicesTabProps {
  services: Service[];
  isOwner: boolean;
  onServicePress?: (service: Service) => void;
  onAddService?: () => void;
}

export const MemberServicesTab: React.FC<MemberServicesTabProps> = ({
  services,
  isOwner,
  onServicePress,
  onAddService,
}) => {
  return (
    <View className="px-4">
      {/* Add Service Button - Only for owner */}
      {isOwner && (
        <Button
          onPress={onAddService}
          className="mb-4 bg-primary/10 border border-primary/20"
        >
          <View className="flex-row items-center gap-2">
            <Icons.Plus size={20} className="text-primary" />
            <Text className="font-subtitle text-primary">Add New Service</Text>
          </View>
        </Button>
      )}

      {/* Services List */}
      {services.length === 0 ? (
        <View className="items-center justify-center py-12">
          <Icons.Briefcase size={48} className="text-muted-foreground mb-3" />
          <Text className="font-title text-foreground mb-1">
            No Services Yet
          </Text>
          <Text className="font-body text-muted-foreground text-center">
            {isOwner
              ? 'Add your first service to get started'
              : 'This member has not added any services yet'}
          </Text>
        </View>
      ) : (
        services.map((service, index) => (
          <MotiView
            key={service.id}
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: index * 100 }}
          >
            <Pressable
              onPress={() => onServicePress?.(service)}
              className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50 mb-3"
            >
              <View className="flex-row items-start justify-between mb-2">
                <Text className="font-title text-foreground flex-1">
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
                  {service.duration_mins} mins
                </Text>
              </View>

              {isOwner && (
                <View className="flex-row gap-2 mt-3 pt-3 border-t border-border/30">
                  <Pressable className="flex-1 flex-row items-center justify-center gap-2 bg-muted/30 py-2 rounded-xl">
                    <Icons.Pencil size={16} className="text-foreground" />
                    <Text className="font-caption text-foreground">Edit</Text>
                  </Pressable>
                  <Pressable className="flex-1 flex-row items-center justify-center gap-2 bg-destructive/10 py-2 rounded-xl">
                    <Icons.Trash2 size={16} className="text-destructive" />
                    <Text className="font-caption text-destructive">
                      Delete
                    </Text>
                  </Pressable>
                </View>
              )}
            </Pressable>
          </MotiView>
        ))
      )}
    </View>
  );
};
