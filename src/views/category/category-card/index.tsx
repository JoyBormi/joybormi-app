import { MotiView } from 'moti';
import { useMemo, useState } from 'react';
import { Dimensions, GestureResponderEvent, Pressable, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import { normalizeFileUrl } from '@/hooks/files';
import { BrandMedia } from './brand-media';
import { CardMeta } from './card-meta';
import { ServiceStrip } from './service-strip';
import { CategoryCardProps } from './types';

const styles = StyleSheet.create({
  cardShadow: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
});

const CARD_MARGIN = 16;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;

export function CategoryCard({ item, index, mode, onPress }: CategoryCardProps) {
  console.log("🚀 ~ CategoryCard ~ item:", item)
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const heartRotate = useSharedValue(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const imagesToShow = useMemo(() => {
    const merged = [
      ...(item.brandImages || []).map((img) => normalizeFileUrl(img)),
    ].filter(Boolean) as string[];

    const uniqueImages = Array.from(new Set(merged));
    if (uniqueImages.length > 0) return uniqueImages.slice(0, 5);
    return [];
  }, [item.brandImages, item.brandProfileImage]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }, { rotate: `${heartRotate.value}deg` }],
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
    heartRotate.value = withSequence(withTiming(-15), withTiming(15), withTiming(0));
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 80 }}
      className="mb-6"
    >
      <Animated.View
        style={[cardAnimatedStyle, styles.cardShadow]}
        className="overflow-hidden rounded-xl bg-muted/30"
      >
        <BrandMedia
          brandId={item.brandId}
          images={imagesToShow}
          cardWidth={CARD_WIDTH}
          isFavorite={isFavorite}
          heartAnimatedStyle={heartAnimatedStyle}
          onToggleFavorite={toggleFavorite}
        />

        <Pressable
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onPress?.(item.brandId)}
          className="p-4"
        >
          <CardMeta
            brandName={item.brandName}
            brandLocation={item.brandLocation}
            mode={mode}
            serviceCount={item.services.length}
          />

          {mode === 'services' ? (
            <ServiceStrip brandId={item.brandId} services={item.services} />
          ) : (
            <ServiceStrip brandId={item.brandId} services={[]} />
          )}
        </Pressable>
      </Animated.View>
    </MotiView>
  );
}
