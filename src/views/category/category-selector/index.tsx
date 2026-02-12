import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { FlatList, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { EMOJI_MAP, Major } from '@/constants/enum';
import { Feedback } from '@/lib/haptics';

import { CategoryChip } from './category-chip';
import { CategoryGridItem } from './category-grid-item';
import { DraggableKnob } from './handle-knob';

const CATEGORIES = ['all', ...Object.values(Major)] as const;
const COLLAPSED_HEIGHT = 0;

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
  const categories = useMemo(() => [...CATEGORIES], []);
  const isExpandedRef = useRef(false);

  const index = categories.indexOf(selectedCategory as Major);

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

  const handleSelectCategory = useCallback(
    (category: string) => {
      onCategoryChange(category);
    },
    [onCategoryChange],
  );

  const handleSelectGridCategory = useCallback(
    (category: string) => {
      handleSelectCategory(category);
      sheetHeight.value = withTiming(COLLAPSED_HEIGHT, {
        duration: 200,
        easing: Easing.out(Easing.cubic),
      });
      if (isExpandedRef.current) {
        Feedback.selection();
        isExpandedRef.current = false;
      }
    },
    [handleSelectCategory, sheetHeight],
  );

  const handleExpandedChange = useCallback((expanded: boolean) => {
    if (isExpandedRef.current === expanded) return;
    isExpandedRef.current = expanded;
    Feedback.selection();
  }, []);

  const renderGridItem = useCallback(
    (category: string) => (
      <CategoryGridItem
        key={category}
        category={category}
        emoji={EMOJI_MAP[category] || '📋'}
        isSelected={selectedCategory === category}
        onPress={() => handleSelectGridCategory(category)}
      />
    ),
    [handleSelectGridCategory, selectedCategory],
  );

  const renderHorizontalItem = useCallback(
    ({ item }: { item: string }) => (
      <CategoryChip
        category={item}
        emoji={EMOJI_MAP[item] || '📋'}
        isSelected={selectedCategory === item}
        onPress={() => handleSelectCategory(item)}
      />
    ),
    [handleSelectCategory, selectedCategory],
  );

  const keyExtractor = useCallback((item: string) => item, []);

  const handleScrollToIndexFailed = useCallback(
    (info: { averageItemLength: number; index: number }) => {
      ref.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: true,
      });

      requestAnimationFrame(() => {
        ref.current?.scrollToIndex({
          index: info.index,
          animated: true,
          viewPosition: 0.5,
        });
      });
    },
    [],
  );

  useEffect(() => {
    scrollToCenter(index);
  }, [index, scrollToCenter]);

  return (
    <View className="bg-background">
      {/* ================= EXPANDABLE GRID ================= */}
      <Animated.View style={[sheetStyle, { overflow: 'hidden' }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-row flex-wrap justify-between px-4">
            {categories.map(renderGridItem)}
          </View>
        </ScrollView>
      </Animated.View>

      {/* ================= HORIZONTAL LIST ================= */}
      <Animated.View style={horizontalStyle}>
        <FlatList
          ref={ref}
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-4 py-3"
          keyExtractor={keyExtractor}
          onScrollToIndexFailed={handleScrollToIndexFailed}
          renderItem={renderHorizontalItem}
        />
      </Animated.View>

      {/* ================= DRAG HANDLE ================= */}
      <DraggableKnob
        height={sheetHeight}
        sheetHeight={sheetHeight}
        onExpandedChange={handleExpandedChange}
      />

      <View className="h-[1px] w-full bg-border/40 shadow-lg" />
    </View>
  );
}
