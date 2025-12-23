import { Text } from '@/components/ui';
import { IBrandPhoto } from '@/types/brand.type';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { PhotoGrid } from '../components/photo-grid';

interface PhotosTabProps {
  photos: IBrandPhoto[];
  onPhotoPress?: (photo: IBrandPhoto, index: number) => void;
}

export const PhotosTab: React.FC<PhotosTabProps> = ({
  photos,
  onPhotoPress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = [
    { key: 'all', label: 'All' },
    { key: 'interior', label: 'Interior' },
    { key: 'service', label: 'Services' },
    { key: 'team', label: 'Team' },
    { key: 'exterior', label: 'Exterior' },
  ];

  // Filter photos by category
  const filteredPhotos =
    selectedCategory === 'all'
      ? photos
      : photos.filter((p) => p.category === selectedCategory);

  return (
    <View className="flex-1">
      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="px-4 mb-4"
      >
        {categories.map((category) => (
          <Pressable
            key={category.key}
            onPress={() => setSelectedCategory(category.key)}
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedCategory === category.key
                ? 'bg-primary'
                : 'bg-card/30 backdrop-blur-sm border border-border/50'
            }`}
          >
            <Text
              className={`font-caption ${
                selectedCategory === category.key
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Photos Grid */}
      <PhotoGrid photos={filteredPhotos} onPhotoPress={onPhotoPress} />
    </View>
  );
};
