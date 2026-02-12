import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { memo, useCallback, useMemo, useState } from 'react';
import { TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { PressableBounce } from '@/components/ui';
import { routes } from '@/constants/routes';
import { useKeyboardHeight } from '@/hooks/common';
import { cn } from '@/lib/utils';

interface CategoryFooterProps {
  value: string;
  onChangeText: (value: string) => void;
  onFilterPress?: () => void;
  onSubmitEditing?: () => void;
  bottomInset?: number;
}

export const CategoryFooter = memo(function CategoryFooter({
  value,
  onChangeText,
  onFilterPress,
  onSubmitEditing,
  bottomInset,
}: CategoryFooterProps) {
  const keyboardHeight = useKeyboardHeight();
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState(false);
  const resolvedBottomInset = bottomInset ?? insets.bottom;

  const lift = useMemo(() => Math.max(0, keyboardHeight), [keyboardHeight]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, []);

  const handleBackLongPress = useCallback(() => {
    router.dismissTo(routes.tabs.home);
  }, []);

  return (
    <AnimatePresence>
      <MotiView
        from={{ opacity: 0, scale: 0.9, translateY: 30 }}
        animate={{ opacity: 1, scale: 1, translateY: -lift }}
        exit={{ opacity: 0, scale: 0.95, translateY: 40 }}
        transition={{ type: 'timing', duration: 220 }}
        className="absolute left-6 right-6"
        style={{ bottom: resolvedBottomInset }}
      >
        <View className="flex-row items-center justify-between gap-2">
          {!focused ? (
            <BlurView
              intensity={30}
              tint="regular"
              className="overflow-hidden rounded-full border border-border/50 bg-card/90 shadow-lg"
            >
              <PressableBounce
                haptic
                hitSlop={24}
                onPress={handleBackPress}
                onLongPress={handleBackLongPress}
                className="p-3 items-center justify-center rounded-full active:opacity-60"
              >
                <Icons.ChevronLeft size={24} className="text-foreground" />
              </PressableBounce>
            </BlurView>
          ) : null}

          <BlurView
            intensity={focused ? 90 : 40}
            tint="regular"
            className={cn(
              'overflow-hidden rounded-full border border-border/50',
              focused ? 'bg-card/95 shadow-xl flex-1' : 'bg-card/90 shadow-lg',
            )}
          >
            <TextInput
              value={value}
              onChangeText={onChangeText}
              placeholder="Search"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={onSubmitEditing}
              maxLength={25}
              autoCapitalize="none"
              placeholderTextColor="text-foreground/90"
              className={cn(
                'rounded-full px-5 font-subtitle native:leading-[1.25] h-14 py-3 text-foreground',
                focused ? 'w-full' : 'w-44 text-center',
              )}
            />
          </BlurView>

          {!focused && onFilterPress ? (
            <BlurView
              intensity={30}
              tint="regular"
              className="overflow-hidden rounded-full items-center border border-border/50 bg-card/90 shadow-lg"
            >
              <PressableBounce
                hitSlop={24}
                onPress={onFilterPress}
                haptic
                className="p-3 items-center justify-center rounded-full active:opacity-60"
              >
                <Icons.SlidersHorizontal
                  size={24}
                  className="text-foreground"
                />
              </PressableBounce>
            </BlurView>
          ) : null}
        </View>
      </MotiView>
    </AnimatePresence>
  );
});

CategoryFooter.displayName = 'CategoryFooter';
