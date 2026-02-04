import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { Image, Pressable, View } from 'react-native';

import Icons from '@/components/icons';

import { Text } from '../ui';

interface ServiceCardProps {
  name: string;
  avatar: string;
  subtitle: string;
  rating?: number;
  id?: string;
}

export function ServiceCard({
  name,
  avatar,
  subtitle,
  rating,
  id,
}: ServiceCardProps) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => id && router.push(`/(screens)/(worker)/event/${id}`)}
      className="w-[180px] aspect-[3/4] bg-popover border border-ring/10 relative overflow-hidden rounded-xl mr-4"
    >
      <Image
        source={{ uri: avatar }}
        className="absolute w-full h-full object-cover"
      />

      {/* Top Right Rating */}
      {rating && (
        <View className="absolute top-2 right-2 z-10 bg-foreground/40 px-2 py-1 rounded-full flex-row items-center">
          <Icons.Star size={12} className="text-accent fill-accent mr-1" />
          <Text className="font-caption text-white">{rating.toFixed(1)}</Text>
        </View>
      )}

      {/* Bottom Overlay for Text */}
      <View className="absolute bottom-0 left-0 right-0">
        <BlurView
          intensity={3}
          tint="systemThickMaterialDark"
          className="p-1.5"
        >
          <Text className="font-subtitle text-white">{name}</Text>
          <Text className="text-white/90 font-caption" numberOfLines={2}>
            {subtitle}
          </Text>
          <View className="h-0.5 w-12 bg-primary mt-0.5 rounded-full" />
        </BlurView>
      </View>
    </Pressable>
  );
}
