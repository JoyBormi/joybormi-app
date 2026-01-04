import { PackageOpen } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

interface NoDataScreenProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function NoDataScreen({
  title = 'No Data',
  message = 'There is no data to display at the moment.',
  actionLabel,
  onAction,
  icon,
}: NoDataScreenProps) {
  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-full max-w-sm"
      >
        <View
          className={cn(
            'overflow-hidden rounded-3xl border border-border',
            'bg-card/50 backdrop-blur-xl',
            'shadow-lg',
          )}
        >
          {/* Header Strip */}
          <View className="bg-muted/50 border-b border-border p-4 flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-muted-foreground" />
            <Text className="font-caption text-xs font-bold text-muted-foreground tracking-widest uppercase">
              Empty State
            </Text>
          </View>

          {/* Main Content */}
          <View className="p-6 items-center">
            {/* Icon */}
            <View className="w-24 h-24 rounded-full bg-muted/30 items-center justify-center mb-6">
              {icon || (
                <PackageOpen size={48} className="text-muted-foreground" />
              )}
            </View>

            {/* Typography */}
            <View className="w-full mb-6">
              <Text className="font-heading text-2xl text-foreground text-center mb-3">
                {title}
              </Text>
              <Text className="font-body text-sm text-muted-foreground text-center leading-relaxed">
                {message}
              </Text>
            </View>

            {/* Action Button */}
            {onAction && actionLabel && (
              <Pressable
                onPress={onAction}
                className={cn(
                  'w-full h-12 rounded-2xl flex-row items-center justify-center',
                  'bg-primary active:scale-[0.98]',
                )}
              >
                <Text className="font-title text-primary-foreground">
                  {actionLabel}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </MotiView>
    </View>
  );
}
