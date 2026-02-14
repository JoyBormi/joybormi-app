import { SearchService } from '@/hooks/search';

export type CategoryCardData = {
  brandId: string;
  brandName: string;
  brandLocation?: string;
  brandProfileImage?:
    | string
    | { url?: string; uri?: string; path?: string }
    | null;
  brandImages?: Array<string>;
  services: SearchService[];
};

export interface CategoryCardProps {
  item: CategoryCardData;
  index: number;
  mode: 'services' | 'brands';
  onPress?: (brandId: string) => void;
}

