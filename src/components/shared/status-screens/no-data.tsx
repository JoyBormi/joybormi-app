import { PackageOpen } from 'lucide-react-native';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, PressableProps, Text, View } from 'react-native';

import { cn } from '@/lib/utils';

interface NoDataProps {
  /** The main heading */
  title?: string;
  /** The descriptive text below the heading */
  message?: string;
  /** Custom icon node. Defaults to PackageOpen */
  icon?: React.ReactNode;
  /** * Action configuration.
   * Pass specific button props (like testID or accessibilityLabel) via the props key.
   */
  action?: {
    label: string;
    onPress: () => void;
    props?: PressableProps;
    variant?: 'primary' | 'outline'; // clear distinction for button styles
  };
  /** Additional classes for the outer container (e.g., 'mt-10' or 'bg-white') */
  className?: string;
}

export function NoData({
  title = 'No Data Found',
  message = "We couldn't find any results to display here.",
  icon,
  action,
  className,
}: NoDataProps) {
  const isOutline = action?.variant === 'outline';

  return (
    <View
      className={cn(
        'flex-1 justify-center items-center p-8 border-b border-border mb-8',
        className,
      )}
    >
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 350 }}
        className="items-center w-full max-w-md"
      >
        {/* Icon Container with subtle glow/ring effect */}
        <View className="mb-6 relative justify-center items-center">
          <View className="absolute w-24 h-24 rounded-[28px] bg-primary/5 rotate-3" />
          <View className="w-24 h-24 rounded-[28px] bg-primary/10 items-center justify-center -rotate-3 border border-primary/20">
            {icon || <PackageOpen size={40} strokeWidth={1.5} />}
          </View>
        </View>

        {/* Typography */}
        <View className="items-center mb-6 gap-1">
          <Text className="font-title text-center text-foreground">
            {title}
          </Text>
          <Text className="font-body text-center leading-6 max-w-[85%] text-muted-foreground">
            {message}
          </Text>
        </View>

        {/* Action Button */}
        {action && (
          <Pressable
            onPress={action.onPress}
            {...action.props}
            className={cn(
              'h-12 px-8 rounded-full flex-row items-center justify-center',
              'active:scale-[0.98] transition-transform',
              isOutline
                ? 'border border-border bg-transparent'
                : 'bg-primary shadow-sm shadow-primary/20',
            )}
          >
            <Text
              className={cn(
                'font-subtitle font-semibold',
                isOutline ? 'text-foreground' : 'text-primary-foreground',
              )}
            >
              {action.label}
            </Text>
          </Pressable>
        )}
      </MotiView>
    </View>
  );
}
