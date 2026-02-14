import { Image } from 'expo-image';
import { GestureResponderEvent, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated from 'react-native-reanimated';

import Icons from '@/components/icons';
import { cn } from '@/lib/utils';

type BrandMediaProps = {
  brandId: string;
  profileImage?: string | null;
  images: string[];
  cardWidth: number;
  isFavorite: boolean;
  heartAnimatedStyle: object;
  onToggleFavorite: (e: GestureResponderEvent) => void;
  onPressBrand?: (brandId: string) => void;
};

const styles = StyleSheet.create({
  imageFill: {
    width: '100%',
    height: '100%',
  },
});

export function BrandMedia({
  brandId,
  profileImage,
  images,
  cardWidth,
  isFavorite,
  heartAnimatedStyle,
  onToggleFavorite,
  onPressBrand,
}: BrandMediaProps) {
  const VISIBLE_COUNT = 3;
  const imageSize = Math.floor(cardWidth / VISIBLE_COUNT);
  const mediaImages = [
    profileImage,
    ...images.filter((image) => image !== profileImage),
  ]
    .filter(Boolean)
    .slice(0, 5) as string[];

  return (
    <View style={{ height: imageSize }} className="relative w-full">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {mediaImages.map((image, idx) => (
          <Pressable
            key={`${brandId}-${idx}`}
            onPress={() => onPressBrand?.(brandId)}
            style={{ width: imageSize, height: imageSize }}
          >
            <Image source={{ uri: image }} style={styles.imageFill} contentFit="cover" />
          </Pressable>
        ))}
      </ScrollView>

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
