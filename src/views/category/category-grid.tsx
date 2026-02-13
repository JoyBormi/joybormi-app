import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useCallback, useMemo } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import { routes } from '@/constants/routes';
import {
  SearchService,
  useSearchBrands,
  useSearchServices,
} from '@/hooks/search';

import { CategoryCard } from './category-card';
import { CategoryFilters } from './category-filter';

interface CategoryGridProps {
  category: string;
  searchQuery?: string;
  searchTarget?: 'services' | 'brands';
  filters?: CategoryFilters;
}

type BrandCardModel = {
  brandId: string;
  brandName: string;
  brandLocation?: string;
  brandProfileImage?:
    | string
    | { url?: string; uri?: string; path?: string }
    | null;
  brandImages?: Array<string | { url?: string; uri?: string; path?: string }>;
  services: SearchService[];
};

export function CategoryGrid({
  category,
  searchQuery,
  searchTarget = 'services',
  filters,
}: CategoryGridProps) {
  const router = useRouter();

  const activeSearch = useMemo(
    () => filters?.search?.trim() || searchQuery?.trim() || '',
    [filters?.search, searchQuery],
  );
  const activeLocation = useMemo(
    () => filters?.location?.trim() || '',
    [filters?.location],
  );
  const activeCategory = useMemo(
    () => (category !== 'all' ? category : undefined),
    [category],
  );

  const {
    data: serviceData,
    isPending: isServicesPending,
    isFetching: isServicesFetching,
    isFetchingNextPage: isServicesFetchingNextPage,
    hasNextPage: hasServicesNextPage,
    fetchNextPage: fetchServicesNextPage,
  } = useSearchServices({
    q: activeSearch,
    category: activeCategory,
    location: activeLocation,
    enabled:
      searchTarget === 'services' &&
      Boolean(activeSearch || activeCategory || activeLocation),
  });

  console.log(`STRINGIFIED 👉:`, JSON.stringify(serviceData, null, 2));

  const services = useMemo(() => {
    return serviceData?.pages.flatMap((page) => page.services.data) ?? [];
  }, [serviceData?.pages]);

  const {
    data: brandData,
    isPending: isBrandsPending,
    isFetching: isBrandsFetching,
    isFetchingNextPage: isBrandsFetchingNextPage,
    hasNextPage: hasBrandsNextPage,
    fetchNextPage: fetchBrandsNextPage,
  } = useSearchBrands({
    q: activeSearch,
    category: activeCategory,
    location: activeLocation,
    enabled:
      searchTarget === 'brands' &&
      Boolean(activeSearch || activeCategory || activeLocation),
  });

  const brands = useMemo(() => {
    return brandData?.pages.flatMap((page) => page.brands.data) ?? [];
  }, [brandData?.pages]);

  const brandCards = useMemo<BrandCardModel[]>(() => {
    if (searchTarget === 'brands') {
      return brands
        .map((brand) => ({
          brandId: brand.brandId || brand.id || '',
          brandName: brand.brandName,
          brandLocation: brand.brandLocation,
          brandProfileImage: brand.brandProfileImage,
          brandImages: brand.brandImages,
          services: [],
        }))
        .filter((item) => item.brandId.length > 0);
    }

    const grouped = new Map<string, SearchService[]>();
    services.forEach((service) => {
      const key = service.brandId;
      const current = grouped.get(key);
      if (current) {
        current.push(service);
      } else {
        grouped.set(key, [service]);
      }
    });

    return Array.from(grouped.values()).map((serviceItems) => {
      const first = serviceItems[0];

      return {
        brandId: first.brandId,
        brandName: first.brandName,
        brandLocation: first.brandLocation,
        brandProfileImage: first.brandProfileImage,
        brandImages: first.brandImages,
        services: serviceItems,
      };
    });
  }, [brands, searchTarget, services]);

  const isPending =
    searchTarget === 'brands' ? isBrandsPending : isServicesPending;
  const isFetching =
    searchTarget === 'brands' ? isBrandsFetching : isServicesFetching;
  const isFetchingNextPage =
    searchTarget === 'brands'
      ? isBrandsFetchingNextPage
      : isServicesFetchingNextPage;
  const hasNextPage =
    searchTarget === 'brands' ? hasBrandsNextPage : hasServicesNextPage;

  const loadMore = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    if (searchTarget === 'brands') {
      fetchBrandsNextPage();
      return;
    }

    fetchServicesNextPage();
  }, [
    fetchBrandsNextPage,
    fetchServicesNextPage,
    hasNextPage,
    isFetchingNextPage,
    searchTarget,
  ]);

  const renderItem = useCallback(
    ({ item, index }: { item: BrandCardModel; index: number }) => {
      return (
        <CategoryCard
          item={item}
          index={index}
          mode={searchTarget}
          onPress={(brandId) => router.push(routes.brand.details(brandId))}
        />
      );
    },
    [router, searchTarget],
  );

  if (!activeSearch && !activeCategory && !activeLocation) {
    return (
      <View className="flex-1 items-center justify-center px-4 py-20">
        <Text className="font-body text-center text-muted-foreground">
          {searchTarget === 'brands'
            ? 'Type a keyword to search brands.'
            : 'Type a keyword to search services.'}
        </Text>
      </View>
    );
  }

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center py-20">
        <ActivityIndicator />
      </View>
    );
  }

  if (brandCards.length === 0 && !isFetching) {
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'timing', duration: 300 }}
        className="flex-1 items-center justify-center px-4 py-20"
      >
        <Text className="mb-2 font-title text-foreground">
          {searchTarget === 'brands' ? 'No brands found' : 'No services found'}
        </Text>
        <Text className="font-body text-center text-muted-foreground">
          Try a different search keyword.
        </Text>
      </MotiView>
    );
  }

  return (
    <FlatList
      data={brandCards}
      renderItem={renderItem}
      keyExtractor={(item) => item.brandId}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 24 }}
      onEndReached={loadMore}
      onEndReachedThreshold={0.45}
      ListFooterComponent={
        isFetchingNextPage ? (
          <View className="items-center py-4">
            <ActivityIndicator />
          </View>
        ) : null
      }
      showsVerticalScrollIndicator={false}
    />
  );
}
