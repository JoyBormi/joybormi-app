import { CategoryHeader } from '@/views/category/category-header';
import { CategorySelector } from '@/views/category/category-selector';
import { ServiceGrid } from '@/views/category/service-grid';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, ScrollView } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

export default function CategoryScreen() {
  const { category } = useLocalSearchParams<{ category: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory === 'all') {
      router.setParams({ category: 'all' });
    } else {
      router.setParams({ category: newCategory });
    }
  };

  return (
    <SafeAreaView className="safe-area" edges={['top']}>
      <CategoryHeader
        category={category || 'all'}
        onBack={() => router.back()}
      />

      <ScrollView
        bounces={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 50 : 90),
        }}
        showsVerticalScrollIndicator={false}
      >
        <CategorySelector
          selectedCategory={category || 'all'}
          onCategoryChange={handleCategoryChange}
        />

        <ServiceGrid category={category || 'all'} />
      </ScrollView>
    </SafeAreaView>
  );
}
