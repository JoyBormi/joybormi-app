import Icons from '@/lib/icons';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CategoryHeaderProps {
  category: string;
  onBack: () => void;
  onFilterPress?: () => void;
}

export function CategoryHeader({
  category,
  onBack,
  onFilterPress,
}: CategoryHeaderProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const title =
    category === 'all' ? t('categories.all') : t(`major.${category}`);

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      className="px-4 pb-3 bg-background fixed top-0 left-0 right-0 z-50"
      style={{ paddingTop: insets.top > 0 ? 0 : 12 }}
    >
      <View className="flex-row items-center justify-between">
        {/* Back Button */}
        <Pressable
          onPress={onBack}
          hitSlop={20}
          onLongPress={() => router.replace('/(tabs)')}
          className="w-10 h-10 items-center justify-center active:opacity-60"
        >
          <Icons.ChevronLeft size={24} className="text-foreground" />
        </Pressable>

        {/* Category Title */}
        <View className="flex-1 items-center">
          <Text className="font-title text-foreground text-lg">{title}</Text>
        </View>

        {/* Filter Button */}
        {onFilterPress && (
          <Pressable
            onPress={onFilterPress}
            className="w-10 h-10 items-center justify-center active:opacity-60"
          >
            <Icons.SlidersHorizontal size={22} className="text-foreground" />
          </Pressable>
        )}
      </View>
    </MotiView>
  );
}
