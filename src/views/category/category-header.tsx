import Icons from '@/lib/icons';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CategoryHeaderProps {
  category: string;
  onBack: () => void;
}

export function CategoryHeader({ category, onBack }: CategoryHeaderProps) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  const title =
    category === 'all' ? t('categories.all') : t(`major.${category}`);

  return (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      className="px-4 pb-3 bg-background"
      style={{ paddingTop: insets.top > 0 ? 0 : 12 }}
    >
      <View className="flex-row items-center">
        {/* Back Button */}
        <Pressable
          onPress={onBack}
          className="w-10 h-10 items-center justify-center active:opacity-60"
        >
          <Icons.ChevronLeft size={24} className="text-foreground" />
        </Pressable>

        {/* Category Title */}
        <View className="flex-1 items-center mr-10">
          <Text className="font-title text-foreground text-xl">{title}</Text>
        </View>
      </View>
    </MotiView>
  );
}
