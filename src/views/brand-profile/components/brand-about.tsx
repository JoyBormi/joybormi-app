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

export const BrandAbout: React.FC<BrandAboutProps> = ({
  brand,
  canEdit,
  onEdit,
}) => {
  const hasContacts = brand.phone || brand.email;

  return (
    <View className="px-2 mb-8">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4 px-2">
        <Text className="font-title text-foreground">About</Text>

        {canEdit && (
          <Pressable onPress={onEdit} className="flex-row items-center gap-1">
            <Text className="font-body text-primary">Edit</Text>
            <Icons.ChevronRight size={16} className="text-primary" />
          </Pressable>
        )}
      </View>

      {/* Grouped Card */}
      <View className="bg-card rounded-lg overflow-hidden">
        {/* Description */}
        <View className="px-5 py-5">
          <Text className="font-body text-muted-foreground">
            {brand.description}
          </Text>
        </View>

        <View className="h-px bg-border ml-5" />

        {/* Location */}
        <View className="px-5 py-4 flex-row items-center gap-3">
          <Icons.MapPin size={16} className="text-muted-foreground" />
          <Text className="font-body text-foreground">
            {brand.city}, {brand.state}
          </Text>
        </View>

        {/* Contact Info */}
        {hasContacts ? (
          <View className="px-5 gap-3 pb-5">
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
        ) : null}
      </View>
    </View>
  );
};
