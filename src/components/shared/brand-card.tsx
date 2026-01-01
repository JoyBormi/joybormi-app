import { Link } from 'expo-router';
import { MotiView } from 'moti';
import { Image, View } from 'react-native';

import { Text } from '../ui';

interface BrandCardProps {
  name: string;
  avatar: string;
  subtitle: string;
  rating?: number;
  onPress?: () => void;
  index?: number;
}

export function BrandCard({
  name,
  avatar,
  subtitle,
  rating,
  onPress,
  index = 0,
}: BrandCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateX: 120 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: index * 100 }}
    >
      <Link href="/(tabs)/calendar" className="mr-4 ">
        <View className="w-[320px] bg-card overflow-hidden rounded-lg shadow-md border border-border">
          <View className="flex-row h-fit min-h-40">
            <View className="w-1/2 p-2 justify-between">
              <View>
                <Text className="font-body mb-1">{name}</Text>
                <Text
                  className="text-muted-foreground font-caption"
                  numberOfLines={2}
                >
                  {subtitle}
                </Text>
              </View>
            </View>
            <View className="w-1/2 relative">
              <Image
                source={{ uri: avatar }}
                className="absolute inset-0 w-full h-full"
              />
              <View className="absolute inset-0 bg-gradient-to-l from-transparent to-card/20" />
            </View>
          </View>
        </View>
      </Link>
    </MotiView>
  );
}
