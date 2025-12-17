import { Major } from '@/constants/enum';
import { cn } from '@/lib/utils';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const emojiMap: Record<string, string> = {
  all: '✨',
  [Major.Barber]: '💇‍♂️',
  [Major.HairSalon]: '💇‍♀️',
  [Major.Spa]: '🧖‍♀️',
  [Major.Dentist]: '🦷',
  [Major.PersonalTrainer]: '🏋️',
  [Major.YogaInstructor]: '🧘‍♂️',
  [Major.TattooArtist]: '🎨',
  [Major.GeneralDoctor]: '👨‍⚕️',
  [Major.MassageTherapist]: '💆',
  [Major.Pediatrician]: '👶',
  [Major.Dermatologist]: '🧴',
  [Major.Psychologist]: '🧠',
  [Major.Physiotherapist]: '🦴',
};

const CATEGORIES = ['all', ...Object.values(Major).slice(0, 12)] as const;

interface CategoryChipProps {
  category: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}

function CategoryChip({
  category,
  emoji,
  isSelected,
  onPress,
  index,
}: CategoryChipProps) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const label =
    category === 'all' ? t('categories.all') : t(`major.${category}`);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 40, type: 'timing', duration: 250 }}
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={cn(
            'px-4 py-2.5 mr-2 flex-row items-center gap-2',
            isSelected
              ? 'bg-foreground'
              : 'bg-transparent border-b-2 border-transparent',
          )}
        >
          <Text className="text-base">{emoji}</Text>
          <Text
            className={cn(
              'font-subtitle text-sm',
              isSelected ? 'text-background' : 'text-muted-foreground',
            )}
          >
            {label}
          </Text>
        </Pressable>
      </Animated.View>
    </MotiView>
  );
}

export function CategorySelector({
  selectedCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  return (
    <View className="py-3 border-b border-border">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {CATEGORIES.map((category, index) => (
          <CategoryChip
            key={category}
            category={category}
            emoji={emojiMap[category] || '📋'}
            isSelected={selectedCategory === category}
            onPress={() => onCategoryChange(category)}
            index={index}
          />
        ))}
      </ScrollView>
    </View>
  );
}
