import { Major } from '@/constants/enum';
import { cn } from '@/lib/utils';
import { AnimatePresence, MotiView } from 'moti';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

/** * Optimized Configuration
 */
const EMOJI_MAP: Record<string, string> = {
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

/**
 * Atomic Sub-component: CategoryChip
 */
function CategoryChip({
  category,
  emoji,
  isSelected,
  onPress,
  index,
}: {
  category: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

  // High-fidelity spring config for tactile feel
  const springConfig = {
    damping: 15,
    stiffness: 150,
    mass: 0.5,
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const label =
    category === 'all' ? t('categories.all') : t(`major.${category}`);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8, translateX: -10 }}
      animate={{ opacity: 1, scale: 1, translateX: 0 }}
      transition={{
        type: 'spring',
        delay: index * 30,
        ...springConfig,
      }}
      className="mr-2"
    >
      <Animated.View style={animatedStyle}>
        <Pressable
          onPress={onPress}
          onPressIn={() => (scale.value = withSpring(0.92, springConfig))}
          onPressOut={() => (scale.value = withSpring(1, springConfig))}
          // Using a subtle border or solid background based on selection
          className={cn(
            'px-4 py-2.5 rounded-2xl flex-row items-center gap-2 border transition-colors',
            isSelected
              ? 'bg-primary border-primary shadow-sm'
              : 'bg-card border-border',
          )}
        >
          <Text className="text-base">{emoji}</Text>
          <Text
            className={cn(
              'font-semibold text-sm tracking-tight',
              isSelected ? 'text-primary-foreground' : 'text-muted-foreground',
            )}
          >
            {label}
          </Text>

          {/* Animated Selection Dot (Optional UI Polish) */}
          <AnimatePresence>
            {isSelected && (
              <MotiView
                from={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50"
              />
            )}
          </AnimatePresence>
        </Pressable>
      </Animated.View>
    </MotiView>
  );
}

/**
 * Main Component: CategorySelector
 */
export function CategorySelector({
  selectedCategory,
  onCategoryChange,
}: {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <View className="bg-background">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          alignItems: 'center',
        }}
        // Enable snapping for a more premium feel
        decelerationRate="fast"
      >
        {CATEGORIES.map((category, index) => (
          <CategoryChip
            key={category}
            category={category}
            emoji={EMOJI_MAP[category] || '📋'}
            isSelected={selectedCategory === category}
            onPress={() => onCategoryChange(category)}
            index={index}
          />
        ))}
      </ScrollView>

      {/* Subtle bottom separator with gradient feel */}
      <View className="h-[1px] w-full bg-border/40" />
    </View>
  );
}
