import { MotiView } from 'moti';
import React, { useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import Icons from '@/components/icons';
import { Major } from '@/constants/enum';
import { cn } from '@/lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 1.2;

interface Service {
  id: string;
  name: string;
  provider: string;
  category: Major;
  priceRange: { min: number; max: number };
  durationRange: { min: number; max: number };
  rating: number;
  reviewCount: number;
  distance: number;
  images: string[];
  hashtags: string[];
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

/**
 * Atomic Sub-component for Pagination Dots to fix Hook Rules
 */
const PaginationDot = ({
  index,
  scrollX,
}: {
  index: number;
  scrollX: SharedValue<number>;
}) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    return {
      width: interpolate(
        scrollX.value,
        inputRange,
        [6, 20, 6],
        Extrapolation.CLAMP,
      ),
      opacity: interpolate(
        scrollX.value,
        inputRange,
        [0.5, 1, 0.5],
        Extrapolation.CLAMP,
      ),
    };
  });

  return (
    <Animated.View
      style={animatedDotStyle}
      className="h-1.5 rounded-full bg-foreground mx-0.5"
    />
  );
};

export function ServiceCard({ service, index }: ServiceCardProps) {
  const scrollX = useSharedValue(0);
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const heartRotate = useSharedValue(0);
  const [isFavorite, setIsFavorite] = useState(false);

  // Reanimated Scroll Handler
  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: heartScale.value },
      { rotate: `${heartRotate.value}deg` },
    ],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const toggleFavorite = (e: GestureResponderEvent) => {
    e.stopPropagation(); // Prevent card navigation
    setIsFavorite(!isFavorite);
    heartScale.value = withSequence(withSpring(1.3), withSpring(1));
    heartRotate.value = withSequence(
      withTiming(-15),
      withTiming(15),
      withTiming(0),
    );
  };

  const imagesToShow =
    service.images.length > 0
      ? service.images
      : ['https://placehold.co/600x400/png'];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 100 }}
      className="mb-6"
    >
      <Animated.View
        style={[
          cardAnimatedStyle,
          {
            elevation: 5,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          },
        ]}
        className="bg-card rounded-3xl overflow-hidden"
      >
        {/* Top Section: Image Carousel */}
        <View className="relative h-56 w-full">
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScrollHandler}
            scrollEventThrottle={16}
            decelerationRate="fast"
          >
            {imagesToShow.map((image, idx) => (
              <View
                key={idx}
                style={{ width: CARD_WIDTH }}
                className="h-full border-r border-border"
              >
                <Image
                  source={{ uri: image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ))}
          </Animated.ScrollView>

          {/* Indicators */}
          {imagesToShow.length > 1 && (
            <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
              {imagesToShow.map((_, idx) => (
                <PaginationDot key={idx} index={idx} scrollX={scrollX} />
              ))}
            </View>
          )}

          {/* Favorite Button */}
          <Pressable
            onPress={toggleFavorite}
            className="absolute top-3 right-3 w-9 h-9 bg-black/20 backdrop-blur-md rounded-full items-center justify-center"
          >
            <Animated.View style={heartAnimatedStyle}>
              <Icons.Heart
                size={18}
                className={cn(
                  isFavorite ? 'text-red-500 fill-red-500' : 'text-white',
                )}
              />
            </Animated.View>
          </Pressable>
        </View>

        {/* Bottom Section: Clickable Content */}
        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            /* Navigate */
          }}
          className="p-4"
        >
          <View className="flex-row justify-between items-start mb-1">
            <Text
              className="font-bold text-lg text-foreground flex-1"
              numberOfLines={1}
            >
              {service.name}
            </Text>
            <View className="flex-row items-center bg-card-foreground px-2 py-1 rounded-md">
              <Icons.Star
                size={12}
                className="text-amber-500 fill-amber-500 mr-1"
              />
              <Text className="font-bold text-xs text-primary">
                {service.rating.toFixed(1)}
              </Text>
            </View>
          </View>
          <View className="flex flex-row items-center justify-between mb-3">
            <Text className="text-muted-foreground text-sm">
              {service.provider}
            </Text>

            <View className="flex-row items-center gap-1">
              <Icons.MapPin size={12} className="text-primary" />
              <Text className="text-xs font-medium text-muted-foreground">
                {service.distance.toFixed(1)} km
              </Text>
              <Text className="text-muted-foreground">•</Text>
              <Text className="text-xs text-muted-foreground">
                {service.reviewCount} reviews
              </Text>
            </View>
          </View>

          <View className="flex-row flex-wrap gap-1.5">
            {service.hashtags.slice(0, 3).map((tag, i) => (
              <View key={i} className="bg-secondary px-2 py-1 rounded-full">
                <Text className="text-[10px] font-semibold text-secondary-foreground">
                  #{tag}
                </Text>
              </View>
            ))}
          </View>
        </Pressable>
      </Animated.View>
    </MotiView>
  );
}
