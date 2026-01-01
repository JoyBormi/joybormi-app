import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { IBrand } from '@/types/brand.type';

interface BrandHeaderProps {
  brand: IBrand;
  onBack?: () => void;
  onShare?: () => void;
  onFavorite?: () => void;
  isOwner?: boolean;
}

export const BrandHeader: React.FC<BrandHeaderProps> = ({
  brand,
  onBack,
  onShare,
  onFavorite,
  isOwner = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'timing', duration: 400 }}
    >
      {/* Cover Image */}
      <View className="relative">
        <Image
          source={{ uri: brand.coverImage }}
          className="w-full h-56"
          resizeMode="cover"
        />

        {/* Gradient Overlay */}
        <View className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Top Actions */}
        <View
          className="absolute left-0 right-0 flex-row justify-between items-center px-4"
          style={{ top: insets.top + 8 }}
        >
          <Pressable
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl items-center justify-center"
          >
            <Icons.ChevronLeft size={24} className="text-foreground" />
          </Pressable>

          {onFavorite && (
            <Pressable
              onPress={onFavorite}
              className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-xl items-center justify-center"
            >
              {isOwner ? (
                <Icons.Pencil size={20} className="text-foreground" />
              ) : (
                <Icons.Heart size={20} className="text-foreground" />
              )}
            </Pressable>
          )}
        </View>
      </View>
      {/* Brand Info Card */}
      <View className="px-4 -mt-24">
        <View className="bg-card/50 backdrop-blur-xl rounded-3xl p-4 border border-border/50">
          <View className="flex-row items-start gap-3">
            {/* Logo */}
            <View className="w-16 h-16 rounded-2xl bg-background border-2 border-border overflow-hidden">
              <Image
                source={{ uri: brand.logo }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            {/* Brand Details */}
            <View className="flex-1">
              <View className="flex-row items-center gap-2 mb-1">
                <Text
                  className="font-title text-foreground flex-1"
                  numberOfLines={1}
                >
                  {brand.name}
                </Text>
                {brand.verified && (
                  <Icons.CheckCircle size={18} className="text-primary" />
                )}
              </View>

              <Text className="font-caption text-muted-foreground mb-2">
                {brand.category}
              </Text>

              {/* Rating & Reviews */}
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Icons.Star size={16} className="text-warning fill-warning" />
                  <Text className="font-caption text-foreground font-medium">
                    {brand.rating.toFixed(1)}
                  </Text>
                </View>
                <Text className="font-caption text-muted-foreground">
                  {brand.reviewCount.toLocaleString()} reviews
                </Text>
                <View
                  className={`px-2 py-0.5 rounded-full ${brand.isOpen ? 'bg-success/10' : 'bg-destructive/10'}`}
                >
                  <Text
                    className={`font-caption ${brand.isOpen ? 'text-success' : 'text-destructive'}`}
                  >
                    {brand.isOpen ? 'Open' : 'Closed'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Info */}
          <View className="mt-4 pt-4 border-t border-border/50 flex-row gap-2">
            <View className="flex-row items-center gap-1.5 flex-1">
              <Icons.MapPin size={14} className="text-muted-foreground" />
              <Text
                className="font-caption text-muted-foreground flex-1"
                numberOfLines={1}
              >
                {brand.location.address}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </MotiView>
  );
};
