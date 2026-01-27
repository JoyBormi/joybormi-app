import { QueryObserverResult } from '@tanstack/react-query';
import LottieView from 'lottie-react-native';
import { AnimatePresence, MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { animations } from '@/constants/animations';
import { cn } from '@/lib/utils';
import { BrandStatus, IBrand } from '@/types/brand.type';

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

const BackgroundBlob = ({
  top,
  left,
  size,
  opacity,
}: {
  top: number;
  left: number;
  size: number;
  opacity: number;
}) => (
  <MotiView
    from={{ opacity, scale: 1 }}
    animate={{ opacity, scale: 1.15 }}
    transition={{
      type: 'timing',
      duration: rand(8000, 14000),
      loop: true,
      repeatReverse: true,
    }}
    className="absolute bg-primary/40 rounded-full blur-3xl"
    style={{ top, left, width: size, height: size }}
  />
);

export function PendingScreen({
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
      Array.from({ length: 3 }).map(() => ({
        top: rand(0, 400),
        left: rand(0, 300),
        size: rand(160, 280),
        opacity: rand(0.06, 0.12),
      })),
    [],
  );

  return (
    <View className="flex-1 bg-background overflow-hidden px-6 justify-center">
      {/* Soft background */}
      {blobs.map((b, i) => (
        <BackgroundBlob key={i} {...b} />
      ))}

      {/* Confetti */}
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

      {/* Card */}
      <MotiView
        from={{ opacity: 0, translateY: 16 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 260 }}
        className="items-center"
      >
        {/* Animation */}
        <View className="items-center mb-6">
          <LottieView
            source={animations.review}
            autoPlay
            loop
            style={{ width: 320, height: 320 }}
          />
        </View>

        {/* Copy */}
        <Text className="font-title text-foreground text-center mb-2">
          In review
        </Text>

        <Text className="font-body text-muted-foreground text-center leading-relaxed mb-8">
          We’re reviewing your brand details. This usually takes up to
          <Text className="font-semibold text-primary"> 12 hours</Text>.
        </Text>

        {/* Action */}
        <Pressable
          onPress={handleRefresh}
          disabled={refreshing}
          className={cn(
            'h-12 rounded-2xl items-center justify-center w-full',
            'bg-primary/90',
            refreshing && 'opacity-70',
          )}
        >
          {refreshing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="font-body text-primary-foreground ">
              Check status
            </Text>
          )}
        </Pressable>
      </MotiView>
    </View>
  );
}
