import { Check } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';

import { plans } from './data';

type PlanCardProps = {
  plan: (typeof plans)[0];
};

export const PlanCard = ({ plan }: PlanCardProps) => (
  <MotiView
    from={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ type: 'timing', duration: 500 }}
    className={cn(
      'p-6 mr-4 w-[80vw] rounded-3xl border-2',
      plan.recommended ? 'border-primary bg-primary/5' : 'border-border',
    )}
  >
    <View className="mb-4">
      <Text className="text-xl font-bold mb-1">{plan.name}</Text>
      <Text className="text-2xl font-bold text-primary">
        {plan.price}
        <Text className="text-sm text-muted-foreground"> /month</Text>
      </Text>
    </View>
    <View className="gap-2">
      {plan.features.map((f) => (
        <View key={f} className="flex-row items-center gap-2">
          <Check size={16} className="text-green-500" />
          <Text className="text-sm">{f}</Text>
        </View>
      ))}
    </View>
    {plan.recommended && (
      <View className="absolute top-1 right-1.5 bg-primary rounded-3xl px-3 py-1">
        <Text className="text-xs text-primary-foreground font-medium">
          Recommended
        </Text>
      </View>
    )}
  </MotiView>
);
