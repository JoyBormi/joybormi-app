import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { animations } from '@/constants/animations';

interface NotFoundScreenProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function NotFoundScreen({
  title = 'Nothing here',
  message = 'We couldn’t find what you were looking for.',
  actionLabel = 'Go back',
  onAction,
}: NotFoundScreenProps) {
  return (
    <View className="flex-1 bg-background px-6">
      <MotiView
        from={{ opacity: 0, translateY: 12 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 220 }}
        className="flex-1 items-center justify-center"
      >
        {/* Animation */}
        <View className="mb-6">
          <LottieView
            source={animations.emptyBox}
            autoPlay
            loop
            style={{ width: 220, height: 220 }}
          />
        </View>

        {/* Copy */}
        <View className="items-center max-w-xs mb-8">
          <Text className="font-heading text-xl text-foreground mb-2 text-center">
            {title}
          </Text>

          <Text className="font-body text-sm text-muted-foreground text-center leading-relaxed">
            {message}
          </Text>
        </View>

        {/* Action */}
        {onAction && (
          <Pressable
            onPress={onAction}
            className="h-12 px-10 rounded-2xl bg-primary items-center justify-center active:scale-[0.98]"
          >
            <Text className="font-title text-primary-foreground">
              {actionLabel}
            </Text>
          </Pressable>
        )}
      </MotiView>
    </View>
  );
}
