import { Image } from 'expo-image';
import { GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import Icons from '@/components/icons';
import { PaginationDot } from '@/components/shared/paginated-dots';
import { cn } from '@/lib/utils';

type BrandMediaProps = {
  brandId: string;
  images: string[];
  cardWidth: number;
  isFavorite: boolean;
  heartAnimatedStyle: object;
  onToggleFavorite: (e: GestureResponderEvent) => void;
};

const styles = StyleSheet.create({
  carouselItem: {
    width: '100%',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
});

export function BrandMedia({
  brandId,
  images,
  cardWidth,
  isFavorite,
  heartAnimatedStyle,
  onToggleFavorite,
}: BrandMediaProps) {
  const scrollX = useSharedValue(0);

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  return (
    <View className="relative h-56 w-full">
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScrollHandler}
        scrollEventThrottle={16}
        decelerationRate="fast"
      >
        {images.map((image, idx) => (
          <View
            key={`${brandId}-${idx}`}
            style={[styles.carouselItem, { width: cardWidth }]}
            className="h-full"
          >
            <Image source={{ uri: image }} style={styles.imageFill} contentFit="cover" />
          </View>
        ))}
      </Animated.ScrollView>

      <View className="absolute bottom-3 left-0 right-0 flex-row justify-center">
        {images.map((_, idx) => (
          <PaginationDot
            key={`${brandId}-dot-${idx}`}
            index={idx}
            scrollX={scrollX}
            CARD_WIDTH={cardWidth}
          />
        ))}
      </View>

      <Pressable
        onPress={onToggleFavorite}
        className="absolute right-3 top-3 h-9 w-9 items-center justify-center rounded-full bg-black/20"
      >
        <Animated.View style={heartAnimatedStyle}>
          <Icons.Heart
            size={18}
            className={cn(isFavorite ? 'fill-red-500 text-red-500' : 'text-white')}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

