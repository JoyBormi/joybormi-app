import { Text } from '@/components/ui';
import { IBrandService } from '@/types/brand.type';
import React, { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { ServiceCard } from '../components/service-card';

interface ServicesTabProps {
  services: IBrandService[];
  onServicePress?: (service: IBrandService) => void;
}

export const ServicesTab: React.FC<ServicesTabProps> = ({
  services,
  onServicePress,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Get unique categories
  const categories = [
    'All',
    ...Array.from(new Set(services.map((s) => s.category))),
  ];

  // Filter services by category
  const filteredServices =
    selectedCategory === 'All'
      ? services
      : services.filter((s) => s.category === selectedCategory);

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
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`mr-2 px-4 py-2 rounded-full ${
              selectedCategory === category
                ? 'bg-primary'
                : 'bg-card/30 backdrop-blur-sm border border-border/50'
            }`}
          >
            <Text
              className={`font-caption ${
                selectedCategory === category
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground'
              }`}
            >
              {category}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Services List */}
      <View className="px-4">
        {filteredServices.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            onPress={() => onServicePress?.(service)}
            index={index}
          />
        ))}
      </View>
    </View>
  );
};
