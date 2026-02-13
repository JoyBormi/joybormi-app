import { Image } from 'expo-image';
import { MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  Pressable,
  ScrollView,
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
import { SearchService } from '@/hooks/search';
import { cn } from '@/lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 1.2;

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
];

type CategoryCardData = {
  brandId: string;
  brandName: string;
  brandLocation?: string;
  brandProfileImage?:
    | string
    | { url?: string; uri?: string; path?: string }
    | null;
  brandImages?: Array<string | { url?: string; uri?: string; path?: string }>;
  services: SearchService[];
};

interface CategoryCardProps {
  item: CategoryCardData;
  index: number;
  mode: 'services' | 'brands';
  onPress?: (brandId: string) => void;
}

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
      className="mx-0.5 h-1.5 rounded-full bg-foreground"
    />
  );
};

const asImageUrl = (
  value:
    | string
    | { url?: string; uri?: string; path?: string }
    | null
    | undefined,
) => {
  if (!value) return null;
  if (typeof value === 'string') {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  const raw = value.url || value.uri || value.path;
  if (!raw) return null;
  const normalized = raw.trim();
  return normalized.length > 0 ? normalized : null;
};

const dayNameToIndex = (value: string) => {
  const normalized = value.toLowerCase();
  if (normalized.startsWith('sun')) return 0;
  if (normalized.startsWith('mon')) return 1;
  if (normalized.startsWith('tue')) return 2;
  if (normalized.startsWith('wed')) return 3;
  if (normalized.startsWith('thu')) return 4;
  if (normalized.startsWith('fri')) return 5;
  if (normalized.startsWith('sat')) return 6;
  return -1;
};

const timeToMinutes = (value: string) => {
  const [h, m] = value.split(':').map((part) => Number(part));
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
};

const formatWorkingHours = (service: SearchService) => {
  const firstSlot = service.workerWorkingHours?.[0];
  if (!firstSlot) {
    return null;
  }

  return `${firstSlot.dayOfWeek} ${firstSlot.startTime}-${firstSlot.endTime}`;
};

const isWorkerAvailableNow = (service: SearchService) => {
  const schedule = service.workerWorkingHours || [];
  if (schedule.length === 0) {
    return false;
  }

  const now = new Date();
  const today = now.getDay();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  return schedule.some((slot) => {
    const day = dayNameToIndex(slot.dayOfWeek);
    if (day !== today) return false;

    const start = timeToMinutes(slot.startTime);
    const end = timeToMinutes(slot.endTime);
    if (start === null || end === null) return false;

    return nowMinutes >= start && nowMinutes <= end;
  });
};

export function CategoryCard({
  item,
  index,
  mode,
  onPress,
}: CategoryCardProps) {
  const scrollX = useSharedValue(0);
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const heartRotate = useSharedValue(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const imagesToShow = useMemo(() => {
    const merged = [
      asImageUrl(item.brandProfileImage),
      ...(item.brandImages || []).map((img) => asImageUrl(img)),
    ].filter(Boolean) as string[];

    if (merged.length > 0) {
      return merged.slice(0, 5);
    }

    return FALLBACK_IMAGES;
  }, [item.brandImages, item.brandProfileImage]);

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
    e.stopPropagation();
    setIsFavorite((prev) => !prev);
    heartScale.value = withSequence(withSpring(1.3), withSpring(1));
    heartRotate.value = withSequence(
      withTiming(-15),
      withTiming(15),
      withTiming(0),
    );
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 80 }}
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
        className="overflow-hidden rounded-xl bg-muted/30"
      >
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
                key={`${item.brandId}-${idx}`}
                style={{ width: CARD_WIDTH }}
                className="h-full border-r border-border"
              >
                <Image
                  source={{ uri: image }}
                  className="h-full w-full"
                  contentFit="cover"
                />
              </View>
            ))}
          </Animated.ScrollView>

          <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
            {imagesToShow.map((_, idx) => (
              <PaginationDot
                key={`${item.brandId}-dot-${idx}`}
                index={idx}
                scrollX={scrollX}
              />
            ))}
          </View>

          <Pressable
            onPress={toggleFavorite}
            className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-black/20"
          >
            <Animated.View style={heartAnimatedStyle}>
              <Icons.Heart
                size={18}
                className={cn(
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-white',
                )}
              />
            </Animated.View>
          </Pressable>
        </View>

        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onPress?.(item.brandId)}
          className="p-4"
        >
          <View className="mb-2 flex-row items-start justify-between">
            <Text
              className="flex-1 text-lg font-bold text-foreground"
              numberOfLines={1}
            >
              {item.brandName}
            </Text>
            <View className="rounded-md bg-card-foreground px-2 py-1">
              <Text className="text-xs font-bold text-primary">
                {mode === 'services'
                  ? `${item.services.length} services`
                  : 'brand'}
              </Text>
            </View>
          </View>

          <View className="mb-3 flex-row items-center justify-between">
            <Text
              className="mr-3 flex-1 text-sm text-muted-foreground"
              numberOfLines={1}
            >
              {item.brandLocation || 'Location not specified'}
            </Text>
            <View className="flex-row items-center gap-1">
              <Icons.MapPin size={12} className="text-primary" />
              <Text
                className="text-xs font-medium text-muted-foreground"
                numberOfLines={1}
              >
                {mode === 'services' ? 'Matches found' : 'Brand result'}
              </Text>
            </View>
          </View>
          {mode === 'services' && item.services.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 8 }}
            >
              {item.services.map((service) => {
                const hours = formatWorkingHours(service);
                const isOpenNow = isWorkerAvailableNow(service);

                return (
                  <View
                    key={service.id || `${item.brandId}-${service.serviceName}`}
                    className="mr-3 w-[240px] rounded-2xl border border-border bg-card p-4"
                  >
                    {/* Service Name */}
                    <Text
                      className="font-title text-card-foreground"
                      numberOfLines={1}
                    >
                      {service.serviceName}
                    </Text>

                    {/* Worker + Availability */}
                    <View className="mt-1 flex-row items-center gap-1.5">
                      <View
                        className={cn(
                          'h-2 w-2 rounded-full',
                          isOpenNow ? 'bg-green-500' : 'bg-red-500',
                        )}
                      />
                      <Text
                        className="font-caption text-muted-foreground"
                        numberOfLines={1}
                      >
                        {service.workerName || 'Assigned Staff'}
                      </Text>
                    </View>

                    {/* Divider */}
                    <View className="my-3 h-px bg-border" />

                    {/* Price + Duration Row */}
                    <View className="flex-row items-center justify-between">
                      <Text className="font-subtitle text-primary">
                        {service.currency} {service.price}
                      </Text>

                      <Text className="font-base text-muted-foreground">
                        {service.durationMins} mins
                      </Text>
                    </View>

                    {/* Working Hours */}
                    {hours ? (
                      <Text
                        className="mt-2 font-base text-muted-foreground"
                        numberOfLines={1}
                      >
                        {hours}
                      </Text>
                    ) : null}
                  </View>
                );
              })}
            </ScrollView>
          ) : (
            <Text className="font-base text-muted-foreground">
              Tap to view brand details
            </Text>
          )}
        </Pressable>
      </Animated.View>
    </MotiView>
  );
}
