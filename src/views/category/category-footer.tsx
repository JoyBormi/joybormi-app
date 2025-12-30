import { Input, PressableBounce } from '@/components/ui';
import { useKeyboardHeight } from '@/hooks/common';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { memo, useMemo, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const CategoryFooter = memo(function CategoryFooter({
  value,
  onChangeText,
  onFilterPress,
  onSubmitEditing,
}: {
  value: string;
  onFilterPress?: () => void;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
}) {
  const keyboardHeight = useKeyboardHeight();
  const insets = useSafeAreaInsets();
  const [focused, setFocused] = useState(false);

  const lift = useMemo(
    () => Math.max(0, keyboardHeight + insets.bottom),
    [keyboardHeight, insets.bottom],
  );

  return (
    <AnimatePresence>
      <MotiView
        from={{ opacity: 0, scale: 0.9, translateY: 30 }}
        animate={{ opacity: 1, scale: 1, translateY: -lift }}
        exit={{ opacity: 0, scale: 0.95, translateY: 40 }}
        transition={{ type: 'timing', duration: 220 }}
        className="absolute bottom-4 left-6 right-6"
        style={{ transform: [{ translateY: -lift }] }}
      >
        <View className="flex-row items-center justify-between gap-2">
          {!focused && (
            <BlurView
              intensity={focused ? 90 : 50}
              tint="light"
              className={cn(
                'overflow-hidden rounded-full',
                focused
                  ? 'bg-foreground/40 shadow-xl flex-1 '
                  : 'bg-foreground/20 shadow-md',
              )}
            >
              <PressableBounce
                onPress={() => router.back()}
                hitSlop={24}
                onLongPress={() => router.replace('/(tabs)')}
                className="p-2 items-center justify-center rounded-full border border-border active:opacity-60"
              >
                <Icons.ChevronLeft size={24} className="text-foreground" />
              </PressableBounce>
            </BlurView>
          )}

          <BlurView
            intensity={focused ? 90 : 50}
            tint="light"
            className={cn(
              'overflow-hidden rounded-full',
              focused
                ? 'bg-foreground/40 shadow-xl flex-1 '
                : 'bg-foreground/20 shadow-md',
            )}
          >
            <Input
              value={value}
              onChangeText={onChangeText}
              placeholder="Search"
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              onSubmitEditing={onSubmitEditing}
              maxLength={45}
              className={cn(
                'bg-transparent border-none rounded-full px-5 py-3 font-body text-black/80 ',
                focused ? 'w-full' : 'w-36 text-center',
              )}
            />
          </BlurView>

          {!focused && onFilterPress && (
            <BlurView
              intensity={focused ? 90 : 50}
              tint="light"
              className={cn(
                'w-11 overflow-hidden rounded-full items-center',
                focused
                  ? 'bg-foreground/40 shadow-xl'
                  : 'bg-foreground/20 shadow-md',
              )}
            >
              <PressableBounce
                onPress={onFilterPress}
                className="p-2 items-center border rounded-full border-border justify-center active:opacity-60"
              >
                <Icons.SlidersHorizontal
                  size={22}
                  className="text-foreground"
                />
              </PressableBounce>
            </BlurView>
          )}
        </View>
      </MotiView>
    </AnimatePresence>
  );
});
