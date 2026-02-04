import { MotiView } from 'moti';
import React from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

interface TimeSlotGridProps {
  slots: string[];
  selectedSlot: string | null;
  onSlotSelect: (slot: string) => void;
  isLoading?: boolean;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  slots,
  selectedSlot,
  onSlotSelect,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View className="py-8 items-center">
        <Text className="text-muted-foreground">Loading time slots...</Text>
      </View>
    );
  }

  if (slots.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-muted-foreground">
          No available slots for this day.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row flex-wrap gap-3">
      {slots.map((slot, index) => {
        const isSelected = selectedSlot === slot;
        return (
          <MotiView
            key={slot}
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 50 }}
            style={{ width: '30%' }}
          >
            <Pressable
              onPress={() => onSlotSelect(slot)}
              className={cn(
                'py-3 rounded-2xl border items-center justify-center',
                isSelected
                  ? 'bg-primary border-primary'
                  : 'bg-card border-border/50',
              )}
            >
              <Text
                className={cn(
                  'font-subtitle',
                  isSelected ? 'text-primary-foreground' : 'text-foreground',
                )}
              >
                {slot}
              </Text>
            </Pressable>
          </MotiView>
        );
      })}
    </View>
  );
};
