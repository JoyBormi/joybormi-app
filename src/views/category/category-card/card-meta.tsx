import { Text, View } from 'react-native';

import Icons from '@/components/icons';

type CardMetaProps = {
  brandName: string;
  brandLocation?: string;
  mode: 'services' | 'brands';
  serviceCount: number;
};

export function CardMeta({
  brandName,
  brandLocation,
  mode,
  serviceCount,
}: CardMetaProps) {
  return (
    <>
      <View className="mb-2 flex-row items-start justify-between">
        <Text className="flex-1 text-lg font-bold text-foreground" numberOfLines={1}>
          {brandName}
        </Text>
        <View className="rounded-md bg-card-foreground px-2 py-1">
          <Text className="text-xs font-bold text-primary">
            {mode === 'services' ? `${serviceCount} services` : 'brand'}
          </Text>
        </View>
      </View>

      <View className="mb-3 flex-row items-center justify-between">
        <Text className="mr-3 flex-1 text-sm text-muted-foreground" numberOfLines={1}>
          {brandLocation || 'Location not specified'}
        </Text>
        <View className="flex-row items-center gap-1">
          <Icons.MapPin size={12} className="text-primary" />
          <Text className="text-xs font-medium text-muted-foreground" numberOfLines={1}>
            {mode === 'services' ? 'Matches found' : 'Brand result'}
          </Text>
        </View>
      </View>
    </>
  );
}

