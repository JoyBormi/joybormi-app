import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Feedback } from '@/lib/haptics';
import {
  CategoryFooter,
  CategoryGrid,
  CategorySelector,
} from '@/views/category';
import {
  CategoryFilterSheet,
  CategoryFilters,
} from '@/views/category/category-filter';

export default function CategoryScreen() {
  const { category, query, location, searchTarget } = useLocalSearchParams<{
    category: string;
    query?: string;
    location?: string;
    searchTarget?: 'services' | 'brands';
  }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const filterSheetRef = useRef<BottomSheetModal>(null);
  const categoryValue = useMemo(() => category || 'all', [category]);

  const routeQuery = useMemo(() => {
    if (Array.isArray(query)) return query[0]?.trim() || '';
    return query?.trim() || '';
  }, [query]);
  const routeLocation = useMemo(() => {
    if (Array.isArray(location)) return location[0]?.trim() || '';
    return location?.trim() || '';
  }, [location]);
  const targetValue = useMemo(
    () => (searchTarget === 'brands' ? 'brands' : 'services'),
    [searchTarget],
  );

  const [filters, setFilters] = useState<CategoryFilters>({
    search: routeQuery,
    location: routeLocation,
    priceRange: { min: 0, max: 1000 },
    rating: [],
    distance: 20,
    sortBy: 'distance',
  });

  useEffect(() => {
    setFilters((prev) => {
      if (prev.search === routeQuery && prev.location === routeLocation) {
        return prev;
      }

      return { ...prev, search: routeQuery, location: routeLocation };
    });
  }, [routeLocation, routeQuery]);

  const handleCategoryChange = useCallback(
    (newCategory: string) => {
      const nextCategory = newCategory === 'all' ? 'all' : newCategory;
      const trimmedSearch = filters.search.trim();
      const trimmedLocation = filters.location.trim();

      router.replace({
        pathname: '/(category)/[category]',
        params: {
          category: nextCategory,
          searchTarget: targetValue,
          ...(trimmedSearch ? { query: trimmedSearch } : {}),
          ...(trimmedLocation ? { location: trimmedLocation } : {}),
        },
      });
    },
    [filters.location, filters.search, router, targetValue],
  );

  const handleFilterPress = useCallback(() => {
    filterSheetRef.current?.present();
  }, []);

  const handleApplyFilters = useCallback((newFilters: CategoryFilters) => {
    setFilters(newFilters);
  }, []);

  const handleChangeSearch = useCallback((text: string) => {
    setFilters((prev) => ({ ...prev, search: text }));
  }, []);

  const handleSubmitSearch = useCallback(() => {
    const trimmedSearch = filters.search.trim();
    const trimmedLocation = filters.location.trim();

    Feedback.light();
    router.replace({
      pathname: '/(category)/[category]',
      params: {
        category: categoryValue,
        searchTarget: targetValue,
        ...(trimmedSearch ? { query: trimmedSearch } : {}),
        ...(trimmedLocation ? { location: trimmedLocation } : {}),
      },
    });
  }, [categoryValue, filters.location, filters.search, router, targetValue]);

  return (
    <SafeAreaView className="safe-area relative" edges={['top']}>
      <CategorySelector
        selectedCategory={categoryValue}
        onCategoryChange={handleCategoryChange}
      />
      <CategoryGrid
        category={categoryValue}
        searchQuery={filters.search}
        searchTarget={targetValue}
        filters={filters}
      />
      <CategoryFooter
        value={filters.search}
        onFilterPress={handleFilterPress}
        onChangeText={handleChangeSearch}
        onSubmitEditing={handleSubmitSearch}
        bottomInset={insets.bottom}
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
