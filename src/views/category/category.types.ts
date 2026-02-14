import { SearchService } from '@/hooks/search';

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
  businessCategory?: string;
  brandWorkingFields?: string[];
  brandProfileImage?:
    | string
    | { url?: string; uri?: string; path?: string }
    | null;
  brandImages?: Array<string | { url?: string; uri?: string; path?: string }>;
  services: SearchService[];
};

const SKELETON_ITEMS = [0, 1, 2];

export { BrandCardModel, CategoryGridProps, SKELETON_ITEMS };
