import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { useColorScheme } from '@/hooks/common';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type ThemeMode = 'light' | 'dark';

interface ThemeSheetProps {
  onClose: () => void;
}

const THEME_OPTIONS: {
  mode: ThemeMode;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    mode: 'light',
    title: 'Light',
    description: 'Always use light theme',
    icon: Icons.Sun,
  },
  {
    mode: 'dark',
    title: 'Dark',
    description: 'Always use dark theme',
    icon: Icons.Moon,
  },
  // {
  //   mode: 'system',
  //   title: 'System',
  //   description: 'Follow system settings',
  //   icon: Icons.Settings,
  // },
];

export const ThemeSheet = forwardRef<BottomSheetModal, ThemeSheetProps>(
  ({ onClose }, ref) => {
    const insets = useSafeAreaInsets();
    const { isDarkColorScheme, changeTheme } = useColorScheme();

    const handleSelect = (theme: ThemeMode) => {
      Feedback.light();
      changeTheme(theme);
      setTimeout(() => {
        onClose();
      }, 300);
    };

    return (
      <CustomBottomSheet
        ref={ref}
        index={0}
        detached
        enablePanDownToClose
        enableDismissOnClose
        bottomInset={insets.bottom}
        style={{
          paddingHorizontal: 12,
        }}
        bottomSheetViewConfig={{
          className: 'rounded-b-3xl',
        }}
      >
        <View className="gap-5 pb-6">
          <View>
            <Text className="text-2xl text-foreground font-heading tracking-tight">
              Theme
            </Text>
            <Text className="text-sm text-muted-foreground font-body mt-2">
              Choose your preferred theme
            </Text>
          </View>

          <View className="gap-3">
            {THEME_OPTIONS.map((theme) => {
              const Icon = theme.icon;
              const isSelected =
                theme.mode === 'dark' ? isDarkColorScheme : !isDarkColorScheme;

              return (
                <Pressable
                  key={theme.mode}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(theme.mode)}
                  className={cn(
                    'flex-row items-center gap-4 p-4 rounded-2xl border-2 transition-all',
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card/30 border-border/20',
                  )}
                >
                  <View
                    className={cn(
                      'w-12 h-12 rounded-xl items-center justify-center',
                      isSelected ? 'bg-primary/20' : 'bg-muted/30',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-6 h-6',
                        isSelected ? 'text-primary' : 'text-foreground',
                      )}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base text-foreground font-subtitle">
                      {theme.title}
                    </Text>
                    <Text className="text-sm text-muted-foreground font-body mt-0.5">
                      {theme.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <Icons.CheckCircle className="text-primary w-6 h-6" />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      </CustomBottomSheet>
    );
  },
);

ThemeSheet.displayName = 'ThemeSheet';
