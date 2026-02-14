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
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800',
];

const normalizeImageValue = (value: unknown): string | null => {
  if (!value) return null;

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return null;
    if (/^(https?:\/\/|file:\/\/|content:\/\/|data:|asset:)/i.test(raw)) {
      return raw;
    }
    try {
      return normalizeFileUrl(raw);
    } catch {
      return raw;
    }
  }

  if (typeof value !== 'object') return null;

  const candidate = value as Record<string, unknown>;
  const urls = [
    candidate.url,
    candidate.uri,
    candidate.path,
    candidate.src,
    candidate.imageUrl,
    candidate.fileUrl,
  ];

  for (const url of urls) {
    const parsed = normalizeImageValue(url);
    if (parsed) return parsed;
  }

  return normalizeImageValue(candidate.file) || normalizeImageValue(candidate.data);
};

export function CategoryCard({ item, index, mode, onPress }: CategoryCardProps) {
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const heartRotate = useSharedValue(0);
  const [isFavorite, setIsFavorite] = useState(false);

  const imagesToShow = useMemo(() => {
    const merged = [
      normalizeImageValue(item.brandProfileImage),
      ...(item.brandImages || []).map((img) => normalizeImageValue(img)),
    ].filter(Boolean) as string[];

    const uniqueImages = Array.from(new Set(merged));
    if (uniqueImages.length > 0) return uniqueImages.slice(0, 5);
    return FALLBACK_IMAGES;
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
          profileImage={normalizeImageValue(item.brandProfileImage)}
          images={imagesToShow}
          cardWidth={CARD_WIDTH}
          isFavorite={isFavorite}
          heartAnimatedStyle={heartAnimatedStyle}
          onToggleFavorite={toggleFavorite}
          onPressBrand={onPress}
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
            businessCategory={item.businessCategory}
            brandWorkingFields={item.brandWorkingFields}
            mode={mode}
            serviceCount={item.services.length}
          />
        </Pressable>

        <Animated.View className="px-4 pb-4">
          {mode === 'services' ? (
            <ServiceStrip brandId={item.brandId} services={item.services} />
          ) : (
            <ServiceStrip brandId={item.brandId} services={[]} />
          )}
        </Animated.View>
      </Animated.View>
    </MotiView>
  );
}
