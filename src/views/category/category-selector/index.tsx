import React, { useCallback, useEffect, useRef } from 'react';
import { ScrollView, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { EMOJI_MAP, Major } from '@/constants/enum';

import { CategoryChip } from './category-chip';
import { CategoryGridItem } from './category-grid-item';
import { DraggableKnob } from './handle-knob';

const CATEGORIES = ['all', ...Object.values(Major)] as const;
const COLLAPSED_HEIGHT = 0;
const EXPANDED_HEIGHT = 360;

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
  /* expandable height */
  const ref = useRef<FlatList>(null);
  const sheetHeight = useSharedValue(0);

  const index = CATEGORIES.indexOf(selectedCategory as Major);

  const isExpanded = useDerivedValue(
    () => sheetHeight.value === EXPANDED_HEIGHT,
  );

  /* horizontal list animation */
  const horizontalStyle = useAnimatedStyle(() => {
    const progress = interpolate(sheetHeight.value, [0, 80], [1, 0]);

    return {
      opacity: progress,
      transform: [{ scaleY: interpolate(progress, [0, 1], [0.9, 1]) }],
      display: progress > 0 ? 'flex' : 'none',
    };
  });

  /* expandable grid animation */
  const sheetStyle = useAnimatedStyle(() => ({
    height: sheetHeight.value,
    opacity: withTiming(sheetHeight.value > 0 ? 1 : 0, {
      duration: 200,
      easing: Easing.out(Easing.cubic),
    }),
  }));

  const scrollToCenter = useCallback((index: number) => {
    ref.current?.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0.5,
    });
  }, []);

  useEffect(() => {
    scrollToCenter(index);
  }, [index, scrollToCenter]);

  return (
    <View className="bg-background">
      {/* ================= EXPANDABLE GRID ================= */}
      <Animated.View style={[sheetStyle, { overflow: 'hidden' }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between px-4">
            {CATEGORIES.map((category) => (
              <CategoryGridItem
                key={category}
                category={category}
                emoji={EMOJI_MAP[category] || '📋'}
                isSelected={selectedCategory === category}
                onPress={() => {
                  onCategoryChange(category);
                  sheetHeight.value = withTiming(COLLAPSED_HEIGHT, {
                    duration: 200,
                    easing: Easing.out(Easing.cubic),
                  });
                }}
              />
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* ================= HORIZONTAL LIST ================= */}
      <Animated.View style={horizontalStyle}>
        <FlatList
          ref={ref}
          data={CATEGORIES}
          horizontal
          scrollEnabled={!isExpanded.value}
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 py-3"
          onScrollToIndexFailed={(info) => {
            ref.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });

            // retry after layout settles
            requestAnimationFrame(() => {
              ref.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5,
              });
            });
          }}
          renderItem={({ item }) => (
            <CategoryChip
              key={item}
              category={item}
              emoji={EMOJI_MAP[item] || '📋'}
              isSelected={selectedCategory === item}
              onPress={() => onCategoryChange(item)}
            />
          )}
        />
      </Animated.View>

      {/* ================= DRAG HANDLE ================= */}
      <DraggableKnob height={sheetHeight} sheetHeight={sheetHeight} />

      <View className="h-[1px] w-full bg-border/40 shadow-lg" />
    </View>
  );
}
