import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Platform } from 'react-native';
import Animated from 'react-native-reanimated';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { routes } from '@/constants/routes';
import { Feedback } from '@/lib/haptics';
import {
  CategoryFooter,
  CategorySelector,
  ServiceGrid,
} from '@/views/category';
import {
  CategoryFilterSheet,
  CategoryFilters,
} from '@/views/category/category-filter';

export default function CategoryScreen() {
  const { category, query } = useLocalSearchParams<{
    category: string;
    query?: string;
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
      router.replace(routes.category.view('all'));
    } else {
      router.replace(routes.category.view(newCategory));
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
      <CategorySelector
        selectedCategory={category || 'all'}
        onCategoryChange={handleCategoryChange}
      />
      <Animated.ScrollView
        bounces={false}
        scrollEventThrottle={16}
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
      </Animated.ScrollView>
      <CategoryFooter
        value={filters.search}
        onFilterPress={handleFilterPress}
        onChangeText={(text) => setFilters({ ...filters, search: text })}
        onSubmitEditing={() => {
          if (!filters.search.trim()) return;
          Feedback.light();
          router.push({
            pathname: routes.category.view(category || 'all').pathname,
            params: {
              category: category || 'all',
              query: filters.search,
            },
          });
        }}
      />
      <CategoryFilterSheet
        ref={filterSheetRef}
        filters={filters}
        onApply={handleApplyFilters}
        onClose={() => filterSheetRef.current?.dismiss()}
      />
    </SafeAreaView>
  );
}
