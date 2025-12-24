import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import type { IBrand } from '@/types/brand.type';
import React from 'react';
import { Image, Pressable, View } from 'react-native';

interface BrandCardProps {
  brand: IBrand;
  servicesCount: number;
  workersCount: number;
  photosCount: number;
  canEdit: boolean;
  onEdit: () => void;
}

/**
 * Brand Profile Card Component
 * Displays brand avatar, stats, and edit button
 */
export const BrandCard: React.FC<BrandCardProps> = ({
  brand,
  servicesCount,
  workersCount,
  photosCount,
  canEdit,
  onEdit,
}) => {
  return (
    <>
      {/* Cover Image */}
      {brand.coverImage && (
        <Image
          source={{ uri: brand.coverImage }}
          className="w-full h-60 mb-4"
        />
      )}

      <View className="main-area">
        <View className="bg-card/50 backdrop-blur-xl px-6 pb-6">
          {/* Avatar and Basic Info */}
          <View className="items-center mb-6">
            <View className="relative mb-4 -mt-20">
              <Image
                source={{ uri: brand.logo }}
                className="w-32 h-32 rounded-3xl border-4 border-card"
              />
              {canEdit && (
                <Pressable
                  onPress={onEdit}
                  className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-primary items-center justify-center border-4 border-card shadow-lg"
                >
                  <Icons.Pencil size={20} className="text-primary-foreground" />
                </Pressable>
              )}
            </View>

            <Text className="font-heading text-2xl text-foreground mb-1">
              {brand.name}
            </Text>
            <Text className="font-subtitle text-muted-foreground mb-3">
              {brand.category}
            </Text>

            {/* Rating Badge */}
            <View className="flex-row items-center gap-2 bg-warning/10 px-4 py-2 rounded-full">
              <Icons.Star size={16} className="text-warning" fill="#f59e0b" />
              <Text className="font-subtitle text-foreground">
                {brand.rating}
              </Text>
              <Text className="font-caption text-muted-foreground">
                • {brand.reviewCount} reviews
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row gap-3 mb-6">
            <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
              <Icons.Briefcase size={20} className="text-primary mb-2" />
              <Text className="font-heading text-lg text-foreground">
                {servicesCount}
              </Text>
              <Text className="font-caption text-muted-foreground">
                Services
              </Text>
            </View>
            <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
              <Icons.Users size={20} className="text-success mb-2" />
              <Text className="font-heading text-lg text-foreground">
                {workersCount}
              </Text>
              <Text className="font-caption text-muted-foreground">Team</Text>
            </View>
            <View className="flex-1 bg-muted/20 rounded-2xl p-4 items-center">
              <Icons.Image size={20} className="text-warning mb-2" />
              <Text className="font-heading text-lg text-foreground">
                {photosCount}
              </Text>
              <Text className="font-caption text-muted-foreground">Photos</Text>
            </View>
          </View>

          {/* Edit Brand Button */}
          {canEdit && (
            <Button onPress={onEdit} className="bg-primary">
              <View className="flex-row items-center gap-2">
                <Icons.Pencil size={18} className="text-primary-foreground" />
                <Text className="font-subtitle text-primary-foreground">
                  Edit Brand
                </Text>
              </View>
            </Button>
          )}
        </View>
      </View>
    </>
  );
};
