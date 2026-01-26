import { useTranslation } from 'react-i18next';
import { Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BrandCard } from '@/components/shared/brand-card';
import { ServiceCard } from '@/components/shared/service-card';
import {
  CategoryPills,
  Header,
  PromoOffers,
  SearchBar,
  SectionCard,
  mostBookedBrands,
  mostBookedWorkers,
  mostPopularBrands,
} from '@/views/home';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();

  const { t } = useTranslation();

  return (
    <ScrollView
      bounces={false}
      contentContainerStyle={{
        paddingBottom: insets.bottom + (Platform.OS === 'ios' ? 60 : 70),
        paddingTop: insets.top,
      }}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      className="safe-area"
    >
      <Header />

      <SearchBar />

      <CategoryPills />

      <PromoOffers />

      {/* Most Booked Brands */}
      <SectionCard title={t('home.mostBookedBrands')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="first:pl-4"
      >
        {mostBookedBrands.map((brand, index) => (
          <BrandCard key={brand.id} {...brand} index={index} />
        ))}
      </ScrollView>
      {/* Most Booked Workers */}

      <SectionCard title={t('home.mostBookedWorkers')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="first:pl-4"
      >
        {mostBookedWorkers.map((worker, index) => (
          <ServiceCard key={worker.id} {...worker} />
        ))}
      </ScrollView>
      {/* Most Popular Brands */}

      <SectionCard title={t('home.mostPopularBrands')} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="first:pl-4"
      >
        {mostPopularBrands.map((brand, index) => (
          <BrandCard key={brand.id} {...brand} index={index} />
        ))}
      </ScrollView>
    </ScrollView>
  );
}
