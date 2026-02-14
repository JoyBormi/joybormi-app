import { ScrollView, Text, View } from 'react-native';

import { useLocaleData } from '@/hooks/common/use-locale-data';
import { SearchService } from '@/hooks/search';
import { cn } from '@/lib/utils';

import { formatWorkingHours, isWorkerAvailableNow } from './working-time.utils';

type ServiceStripProps = {
  brandId: string;
  services: SearchService[];
};

export function ServiceStrip({ brandId, services }: ServiceStripProps) {
  const { getDayNameShort } = useLocaleData();

  if (services.length === 0) {
    return <Text className="font-base text-muted-foreground">Tap to view brand details</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
      {services.map((service) => {
        const hours = formatWorkingHours(service, getDayNameShort);
        const isOpenNow = isWorkerAvailableNow(service);

        return (
          <View
            key={service.id || `${brandId}-${service.serviceName}`}
            className="mr-2.5 w-[185px] rounded-xl border border-border bg-card p-3"
          >
            <Text className="font-subtitle text-card-foreground" numberOfLines={1}>
              {service.serviceName}
            </Text>

            <View className="mt-1 flex-row items-center gap-1.5">
              <View
                className={cn(
                  'h-2 w-2 rounded-full',
                  isOpenNow ? 'bg-green-500' : 'bg-red-500',
                )}
              />
              <Text className="font-caption text-muted-foreground" numberOfLines={1}>
                {service.workerName || 'Assigned Staff'}
              </Text>
            </View>

            <View className="my-3 h-px bg-border" />

            <View className="flex-row items-center justify-between">
              <Text className="font-subtitle text-primary">
                {service.currency} {service.price}
              </Text>
              <Text className="font-caption text-muted-foreground">{service.durationMins} mins</Text>
            </View>

            {hours ? (
              <Text className="mt-1.5 font-caption text-muted-foreground" numberOfLines={1}>
                {hours}
              </Text>
            ) : null}
          </View>
        );
      })}
    </ScrollView>
  );
}

