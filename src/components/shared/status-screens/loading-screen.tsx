import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Text, View } from 'react-native';

import { animations } from '@/constants/animations';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  title?: string;
  message?: string;
}

export function LoadingScreen({
  title = 'Loading',
  message = 'Please wait while we load your content...',
}: LoadingScreenProps) {
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
          {/* Main Content */}
          <View className="p-6 items-center">
            {/* Lottie Animation */}
            <View className="w-48 h-48 items-center justify-center mb-4">
              <LottieView
                source={animations.review}
                autoPlay
                loop
                style={{ width: 200, height: 200 }}
              />
            </View>

            {/* Typography */}
            <View className="w-full">
              <Text className="font-heading text-xl text-foreground text-center mb-2">
                {title}
              </Text>
              <Text className="font-body text-sm text-muted-foreground text-center leading-relaxed">
                {message}
              </Text>
            </View>
          </View>
        </View>
      </MotiView>
    </View>
  );
}
