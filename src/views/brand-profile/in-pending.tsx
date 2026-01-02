import { QueryObserverResult } from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { animations } from '@/constants/animations';
import { cn } from '@/lib/utils';
import { BrandStatus, IBrand } from '@/types/brand.type';

// A subtle background mesh/gradient to make the "Glass" effect visible

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const BackgroundBlob = ({
  top,
  left,
  size,
  opacity,
}: {
  top: number;
  left: number;
  size: number;
  opacity: number;
}) => {
  const driftX = rand(-30, 30);
  const driftY = rand(-30, 30);
  const scaleTo = rand(1.05, 1.25);
  const duration = rand(6000, 12000);
  const delay = rand(0, 2000);

  return (
    <MotiView
      from={{
        opacity,
        scale: 1,
        translateX: 0,
        translateY: 0,
      }}
      animate={{
        opacity,
        scale: scaleTo,
        translateX: driftX,
        translateY: driftY,
      }}
      transition={{
        type: 'timing',
        duration,
        loop: true,
        repeatReverse: true,
        delay,
      }}
      className="absolute bg-primary rounded-full blur-3xl"
      style={{ top, left, width: size, height: size }}
    />
  );
};

export function BrandProfilePendingScreen({
  onRefresh,
}: {
  onRefresh: () => Promise<QueryObserverResult<IBrand, Error>>;
}) {
  const [refreshing, setRefreshing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  async function handleRefresh() {
    if (refreshing) return;
    setRefreshing(true);
    setShowConfetti(false);

    const result = await onRefresh();

    if (result.data?.status === BrandStatus.ACTIVE) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2500);
    }
    setRefreshing(false);
  }

  const blobs = useMemo(
    () =>
      Array.from({ length: 5 }).map(() => ({
        top: rand(0, 300),
        left: rand(0, 300),
        size: rand(80, 220),
        opacity: rand(0.08, 0.18),
      })),
    [],
  );

  return (
    <View className="flex-1 bg-background relative overflow-hidden justify-center items-center p-6">
      {blobs.map((blob, index) => (
        <BackgroundBlob
          key={index}
          top={blob.top}
          left={blob.left}
          size={blob.size}
          opacity={blob.opacity}
        />
      ))}

      {/* Optional: Secondary blob for balance */}
      <View className="absolute bottom-20 -right-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

      {/* Confetti overlay */}
      <AnimatePresence>
        {showConfetti && (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none"
          >
            <LottieView
              source={animations.confetti}
              autoPlay
              loop={false}
              style={{ width: '100%', height: '100%' }}
            />
          </MotiView>
        )}
      </AnimatePresence>

      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-full max-w-sm"
      >
        {/* GLASS CARD CONTAINER 
            - Uses semantic border
            - High radius (rounded-3xl)
            - Glassy background (bg-card/60 + blur)
            - Soft Shadow
        */}
        <View
          className={cn(
            'overflow-hidden rounded-[32px] border-2 border-border',
            'bg-card/60 backdrop-blur-xl', // The Glass Effect
            'shadow-2xl shadow-primary/10', // Themed Shadow
          )}
        >
          {/* Header Strip */}
          <View className="bg-muted/50 border-b border-border p-4 flex-row justify-between items-center">
            <View className="flex-row items-center space-x-2">
              <View className="w-2.5 h-2.5 rounded-full bg-yellow-500 animate-pulse" />
              <Text className="text-xs ml-1 font-bold text-muted-foreground tracking-widest uppercase">
                System Review
              </Text>
            </View>
            <Text className="text-[10px] font-mono text-muted-foreground opacity-70">
              #ID-8821
            </Text>
          </View>

          {/* Main Content Area */}
          <View className="p-6 items-center">
            {/* Lottie Container - "Inset" look */}
            <View className="w-full aspect-square bg-background/50 rounded-2xl border border-border items-center justify-center mb-6 overflow-hidden shadow-inner">
              <LottieView
                source={animations.review}
                autoPlay
                loop
                style={{ width: 300, height: 300 }}
              />
            </View>

            {/* Typography */}
            <View className="w-full mb-6">
              <Text className="text-3xl font-bold text-foreground text-center mb-2">
                In Review
              </Text>
              <Text className="text-sm text-muted-foreground text-center leading-relaxed">
                We are currently verifying your business details. This usually
                takes
                <Text className="font-bold text-primary"> 24 hours</Text>.
              </Text>
            </View>

            {/* Action Button */}
            <Pressable
              onPress={handleRefresh}
              disabled={refreshing}
              className={cn(
                'w-full h-14 rounded-2xl flex-row items-center justify-center overflow-hidden relative',
                'bg-primary', // Uses brand primary color
                'shadow-lg shadow-primary/20',
                refreshing && 'opacity-80',
              )}
            >
              {({ pressed }) => (
                <>
                  {/* Button Inner Gradient/Highlight */}
                  <View
                    className={cn(
                      'absolute inset-0 bg-white/20',
                      pressed ? 'opacity-30' : 'opacity-0',
                    )}
                  />

                  {refreshing ? (
                    <ActivityIndicator color="white" /> // Assumes primary-foreground is light
                  ) : (
                    <View className="flex-row items-center">
                      <Text className="text-primary-foreground text-base font-bold mr-2">
                        Refresh Status
                      </Text>
                      <Text className="text-primary-foreground text-xl">↻</Text>
                    </View>
                  )}
                </>
              )}
            </Pressable>
          </View>
        </View>
      </MotiView>
    </View>
  );
}
