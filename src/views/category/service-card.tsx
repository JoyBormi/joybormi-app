import { Major } from '@/constants/enum';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Service {
  id: string;
  name: string;
  provider: string;
  category: Major;
  priceRange: { min: number; max: number };
  durationRange: { min: number; max: number };
  rating: number;
  reviewCount: number;
  distance: number; // in km
  images: string[];
  hashtags: string[];
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

export function ServiceCard({ service, index }: ServiceCardProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const scale = useSharedValue(1);
  const heartScale = useSharedValue(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handlePress = () => {
    // Navigate to service detail
    // router.push(`/service/${service.id}`);
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    heartScale.value = withSequence(
      withSpring(1.3, { damping: 5 }),
      withSpring(1),
    );
  };

  // Determine how many images to show based on screen width
  const imagesToShow = SCREEN_WIDTH > 400 ? 4 : 3;
  const displayImages = service.images.slice(0, imagesToShow);

  return (
    <MotiView
      from={{ opacity: 0, translateX: -50 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{
        type: 'spring',
        delay: index * 150,
        damping: 20,
        stiffness: 90,
      }}
      className="mb-6"
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className="bg-card overflow-hidden rounded-2xl"
        >
          {/* Image Gallery */}
          <View className="relative">
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => {
                const index = Math.round(
                  e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - 32),
                );
                setCurrentImageIndex(index);
              }}
            >
              {displayImages.map((image, idx) => (
                <View
                  key={idx}
                  style={{ width: SCREEN_WIDTH - 32 }}
                  className="aspect-video bg-muted"
                >
                  <Image
                    source={{ uri: image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>

            {/* Favorite Button */}
            <Pressable
              onPress={handleFavoritePress}
              className="absolute top-3 right-3 w-9 h-9 bg-background/80 backdrop-blur-sm rounded-full items-center justify-center active:opacity-70"
            >
              <Animated.View style={heartAnimatedStyle}>
                <Icons.Heart
                  size={18}
                  className={cn(
                    isFavorite
                      ? 'text-destructive fill-destructive'
                      : 'text-foreground',
                  )}
                />
              </Animated.View>
            </Pressable>

            {/* Image Indicators */}
            {displayImages.length > 1 && (
              <View className="absolute bottom-3 left-0 right-0 flex-row justify-center gap-1.5">
                {displayImages.map((_, idx) => (
                  <View
                    key={idx}
                    className={cn(
                      'h-1.5 rounded-full transition-all',
                      idx === currentImageIndex
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/50',
                    )}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Content Section */}
          <View className="p-4">
            {/* Title and Rating */}
            <View className="flex-row items-start justify-between mb-2">
              <Text
                className="font-title text-foreground flex-1 mr-2"
                numberOfLines={1}
              >
                {service.name}
              </Text>
              <View className="flex-row items-center gap-1">
                <Icons.Star
                  size={14}
                  className="text-foreground fill-foreground"
                />
                <Text className="font-subtitle text-sm text-foreground">
                  {service.rating.toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Provider and Distance */}
            <View className="flex-row items-center gap-3 mb-3">
              <Text
                className="font-body text-muted-foreground"
                numberOfLines={1}
              >
                {service.provider}
              </Text>
              <View className="flex-row items-center gap-1">
                <Icons.MapPin size={12} className="text-muted-foreground" />
                <Text className="font-caption text-muted-foreground">
                  {service.distance.toFixed(1)} km
                </Text>
              </View>
            </View>

            {/* Reviews Count */}
            <Text className="font-caption text-muted-foreground mb-3">
              {service.reviewCount.toLocaleString()} {t('categories.reviews')}
            </Text>

            {/* Hashtags */}
            <View className="flex-row flex-wrap gap-2 mb-3">
              {service.hashtags.slice(0, 3).map((tag, idx) => (
                <View key={idx} className="bg-muted px-2.5 py-1 rounded-full">
                  <Text className="font-caption text-muted-foreground">
                    #{tag}
                  </Text>
                </View>
              ))}
            </View>

            {/* Price and Duration Range */}
            <View className="flex-row items-center justify-between pt-2 border-t border-border">
              <View>
                <Text className="font-caption text-muted-foreground mb-0.5">
                  {t('categories.duration')}
                </Text>
                <Text className="font-subtitle text-foreground">
                  {service.durationRange.min}-{service.durationRange.max}{' '}
                  {t('common.min')}
                </Text>
              </View>
              <View className="items-end">
                <Text className="font-caption text-muted-foreground mb-0.5">
                  {t('categories.price')}
                </Text>
                <Text className="font-title text-foreground">
                  ${service.priceRange.min}-${service.priceRange.max}
                </Text>
              </View>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    </MotiView>
  );
}
