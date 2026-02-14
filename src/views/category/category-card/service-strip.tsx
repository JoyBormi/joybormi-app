import { Image } from 'expo-image';
import { ScrollView, Text, View } from 'react-native';

import Icons from '@/components/icons';
import { normalizeFileUrl } from '@/hooks/files';
import { SearchService } from '@/hooks/search';

type ServiceStripProps = {
  brandId: string;
  services: SearchService[];
};

const formatWorkerDisplayName = (workerName?: string) => {
  const normalized = workerName?.trim();
  if (!normalized) return 'Assigned Staff';

  const parts = normalized.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return normalized;

  const firstName = parts[0];
  const lastName = parts[parts.length - 1];
  const lastInitial = lastName.charAt(0).toUpperCase();

  return `${lastInitial}. ${firstName}`;
};

const normalizeImageValue = (value: unknown): string | null => {
  if (!value) return null;

  if (typeof value === 'string') {
    const raw = value.trim();
    if (!raw) return null;
    if (/^(https?:\/\/|file:\/\/|content:\/\/|data:|asset:)/i.test(raw)) {
      return raw;
    }
    try {
      return normalizeFileUrl(raw);
    } catch {
      return raw;
    }
  }

  if (typeof value !== 'object') return null;

  const candidate = value as Record<string, unknown>;
  return (
    normalizeImageValue(candidate.url) ||
    normalizeImageValue(candidate.uri) ||
    normalizeImageValue(candidate.path) ||
    null
  );
};

export function ServiceStrip({ brandId, services }: ServiceStripProps) {
  if (services.length === 0) {
    return <Text className="font-base text-muted-foreground">Tap to view brand details</Text>;
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingRight: 8 }}
      onStartShouldSetResponder={() => true}
    >
      {services.map((service) => {
        const workerProfilePic = normalizeImageValue(service.workerProfilePic);

        return (
          <View
            key={service.serviceId || service.id || `${brandId}-${service.serviceName}`}
            className="mr-2.5 w-[185px] rounded-md border border-border bg-card p-3"
          >
            <Text className="font-body text-card-foreground" numberOfLines={1}>
              {service.serviceName}
            </Text>

            <View className="mt-0.5 flex-row items-center gap-1.5">
              <View className="h-5 w-5 overflow-hidden rounded-full bg-muted items-center justify-center">
                {workerProfilePic ? (
                  <Image
                    source={{ uri: workerProfilePic }}
                    style={{ width: 20, height: 20 }}
                    contentFit="cover"
                  />
                ) : (
                  <Icons.User size={12} className="text-muted-foreground" />
                )}
              </View>
              <Text className="font-caption text-muted-foreground" numberOfLines={1}>
                {formatWorkerDisplayName(service.workerName)}
              </Text>
            </View>

            <View className="my-1.5 h-px bg-border" />

            <View className="flex-row items-center justify-between">
              <Text className="font-caption text-primary">
                {service.currency} {service.price}
              </Text>
              <Text className="font-caption text-muted-foreground">{service.durationMins} mins</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
