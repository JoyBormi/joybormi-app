import { AlertCircle } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

interface SuspendedScreenProps {
  title?: string;
  message?: string;
  reason?: string;
  contactEmail?: string;
  onContactSupport?: () => void;
}

export function SuspendedScreen({
  title = 'Account Suspended',
  message = 'Your account has been temporarily suspended.',
  reason,
  contactEmail = 'support@joybormi.com',
  onContactSupport,
}: SuspendedScreenProps) {
  return (
    <View className="flex-1 bg-background justify-center items-center p-6">
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
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
          <View className="bg-destructive/10 border-b border-border p-4 flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-destructive" />
            <Text className="font-caption text-xs font-bold text-destructive tracking-widest uppercase">
              Suspended
            </Text>
          </View>

          {/* Main Content */}
          <View className="p-6 items-center">
            {/* Icon */}
            <View className="w-24 h-24 rounded-full bg-destructive/10 items-center justify-center mb-6">
              <AlertCircle size={48} className="text-destructive" />
            </View>

            {/* Typography */}
            <View className="w-full mb-6">
              <Text className="font-heading text-2xl text-foreground text-center mb-3">
                {title}
              </Text>
              <Text className="font-body text-sm text-muted-foreground text-center leading-relaxed mb-4">
                {message}
              </Text>
              {reason && (
                <View className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20">
                  <Text className="font-caption text-xs font-bold text-destructive mb-1 uppercase tracking-wide">
                    Reason
                  </Text>
                  <Text className="font-body text-sm text-foreground">
                    {reason}
                  </Text>
                </View>
              )}
            </View>

            {/* Action Button */}
            {onContactSupport && (
              <Pressable
                onPress={onContactSupport}
                className={cn(
                  'w-full h-12 rounded-2xl flex-row items-center justify-center',
                  'bg-primary active:scale-[0.98]',
                )}
              >
                <Text className="font-title text-primary-foreground">
                  Contact Support
                </Text>
              </Pressable>
            )}

            {contactEmail && (
              <Text className="font-caption text-xs text-muted-foreground text-center mt-4">
                {contactEmail}
              </Text>
            )}
          </View>
        </View>
      </MotiView>
    </View>
  );
}
