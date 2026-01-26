import React from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';

import type { IBrand } from '@/types/brand.type';

interface BrandAboutProps {
  brand: IBrand;
  canEdit: boolean;
  onEdit: () => void;
}

/**
 * Brand About Section Component
 * Displays brand description and contact information
 */
export const BrandAbout: React.FC<BrandAboutProps> = ({
  brand,
  canEdit,
  onEdit,
}) => {
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="font-title text-lg text-foreground">About</Text>
        {canEdit && (
          <Pressable onPress={onEdit}>
            <Icons.Pencil size={18} className="text-primary" />
          </Pressable>
        )}
      </View>
      <View className="bg-card/50 backdrop-blur-xl rounded-2xl p-5 border border-border/50">
        <Text className="font-body text-muted-foreground leading-6 mb-4">
          {brand.description}
        </Text>
        <View className="gap-3">
          <View className="flex-row items-center gap-3">
            <Icons.MapPin size={16} className="text-muted-foreground" />
            <Text className="font-body text-foreground">
              {brand.city}, {brand.state}
            </Text>
          </View>
          {brand.phone && (
            <View className="flex-row items-center gap-3">
              <Icons.Phone size={16} className="text-muted-foreground" />
              <Text className="font-body text-foreground">{brand.phone}</Text>
            </View>
          )}
          {brand.email && (
            <View className="flex-row items-center gap-3">
              <Icons.Mail size={16} className="text-muted-foreground" />
              <Text className="font-body text-foreground">{brand.email}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};
