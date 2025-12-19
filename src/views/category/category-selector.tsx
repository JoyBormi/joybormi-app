import { Major } from '@/constants/enum';
import { useColorScheme } from '@/hooks/common/use-color-scheme';
import { cn } from '@/lib/utils';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

/**
 * Optimized Configuration
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

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const label =
    category === 'all' ? t('categories.all') : t(`major.${category}`);

  return (
    <Animated.View style={animatedContainerStyle} className="mr-2">
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.92, springConfig))}
        onPressOut={() => (scale.value = withSpring(1, springConfig))}
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

        {/* Animated Selection Dot */}
        {isSelected && (
          <Animated.View className="w-1.5 h-1.5 rounded-full bg-primary-foreground/50" />
        )}
      </Pressable>
    </Animated.View>
  );
}

/**
 * Grid Category Item for Bottom Sheet
 */
function CategoryGridItem({
  category,
  emoji,
  isSelected,
  onPress,
}: {
  category: string;
  emoji: string;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { t } = useTranslation();
  const scale = useSharedValue(1);

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
    <Animated.View style={animatedStyle} className="w-[31%] mb-3">
      <Pressable
        onPress={onPress}
        onPressIn={() => (scale.value = withSpring(0.92, springConfig))}
        onPressOut={() => (scale.value = withSpring(1, springConfig))}
        className={cn(
          'aspect-square items-center justify-center rounded-2xl border-2',
          isSelected ? 'bg-primary border-primary' : 'bg-card border-border',
        )}
      >
        <Text className="text-3xl mb-2">{emoji}</Text>
        <Text
          numberOfLines={2}
          className={cn(
            'font-semibold text-xs text-center px-2',
            isSelected ? 'text-primary-foreground' : 'text-muted-foreground',
          )}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Draggable Knob Component
 */
function DraggableKnob({
  onDrag,
  isSheetOpen,
}: {
  onDrag: () => void;
  isSheetOpen: boolean;
}) {
  const scale = useSharedValue(1);

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withSpring(0.95);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      onDrag();
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${isSheetOpen ? 180 : 0}deg` },
    ],
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={animatedStyle}
        className="items-center justify-center py-3"
      >
        <View className="w-12 h-1.5 bg-muted-foreground/40 rounded-full" />
      </Animated.View>
    </GestureDetector>
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
  const { colors, isDarkColorScheme } = useColorScheme();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['65%', '90%'], []);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const scrollViewOpacity = useSharedValue(1);
  const scrollViewHeight = useSharedValue(1);

  const handleSheetToggle = useCallback(() => {
    if (isSheetOpen) {
      bottomSheetRef.current?.close();
    } else {
      bottomSheetRef.current?.expand();
    }
  }, [isSheetOpen]);

  const handleCategorySelect = useCallback(
    (category: string) => {
      onCategoryChange(category);
      bottomSheetRef.current?.close();
    },
    [onCategoryChange],
  );

  const handleSheetChange = useCallback(
    (index: number) => {
      const isOpen = index >= 0;
      setIsSheetOpen(isOpen);

      // Animate horizontal scroll visibility
      scrollViewOpacity.value = withTiming(isOpen ? 0 : 1, { duration: 200 });
      scrollViewHeight.value = withTiming(isOpen ? 0 : 1, { duration: 200 });
    },
    [scrollViewOpacity, scrollViewHeight],
  );

  const renderBackdrop = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const animatedScrollViewStyle = useAnimatedStyle(() => ({
    opacity: scrollViewOpacity.value,
    height: scrollViewHeight.value === 0 ? 0 : undefined,
    overflow: 'hidden',
  }));

  return (
    <View className="bg-background">
      {/* Horizontal Scroll Categories */}
      <Animated.View style={animatedScrollViewStyle}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingTop: 12,
            alignItems: 'center',
          }}
          decelerationRate="fast"
        >
          {CATEGORIES.slice(0, 6).map((category, index) => (
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
      </Animated.View>

      {/* Draggable Knob */}
      <DraggableKnob onDrag={handleSheetToggle} isSheetOpen={isSheetOpen} />

      {/* Subtle bottom separator */}
      <View className="h-[1px] w-full bg-border/40" />

      {/* Bottom Sheet with All Categories */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        onChange={handleSheetChange}
        handleIndicatorStyle={{
          backgroundColor: colors.border,
          width: 40,
        }}
        backgroundStyle={{
          backgroundColor: colors.background,
        }}
        style={{
          shadowColor: isDarkColorScheme ? '#ffffff' : '#000000',
          shadowOffset: {
            width: 0,
            height: -4,
          },
          shadowOpacity: isDarkColorScheme ? 0.1 : 0.25,
          shadowRadius: 8,
          elevation: 10,
        }}
      >
        <BottomSheetView style={{ flex: 1, paddingHorizontal: 16 }}>
          <Text className="font-heading text-xl mb-4 text-center">
            All Categories
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 20,
            }}
          >
            <View className="flex-row flex-wrap justify-between">
              {CATEGORIES.map((category) => (
                <CategoryGridItem
                  key={category}
                  category={category}
                  emoji={EMOJI_MAP[category] || '📋'}
                  isSelected={selectedCategory === category}
                  onPress={() => handleCategorySelect(category)}
                />
              ))}
            </View>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}
