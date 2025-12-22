import {
  CategoryHeader,
  CategorySelector,
  ServiceGrid,
} from '@/views/category';
import {
  CategoryFilterSheet,
  CategoryFilters,
} from '@/views/category/category-filter';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform, ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function CategoryScreen() {
  const { category, query } = useLocalSearchParams<{
    category: string;
    query?: string;
  }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const filterSheetRef = useRef<BottomSheetModal>(null);
  const [filters, setFilters] = useState<CategoryFilters>({
    search: query || '',
    priceRange: { min: 0, max: 1000 },
    rating: [],
    distance: 20,
    sortBy: 'distance',
  });

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === 'all') {
      router.replace('/(category)/all');
    } else {
      router.replace(`/(category)/${newCategory}`);
    }
  };

  const handleFilterPress = () => {
    filterSheetRef.current?.present();
  };

  const handleApplyFilters = (newFilters: CategoryFilters) => {
    setFilters(newFilters);
  };

  return (
    <SafeAreaView className="safe-area relative" edges={['top']}>
      <CategoryHeader
        category={category || 'all'}
        onBack={() => router.back()}
        onFilterPress={handleFilterPress}
      />
      <CategorySelector
        selectedCategory={category || 'all'}
        onCategoryChange={handleCategoryChange}
      />
      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 50 : 90),
        }}
        showsVerticalScrollIndicator={false}
      >
        <ServiceGrid
          category={category || 'all'}
          searchQuery={query}
          filters={filters}
        />
      </ScrollView>
      <CategoryFilterSheet
        ref={filterSheetRef}
        filters={filters}
        onApply={handleApplyFilters}
        onClose={() => filterSheetRef.current?.dismiss()}
      />
    </SafeAreaView>
  );
}
