import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import * as React from 'react';
import { View } from 'react-native';

export interface MinimalHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
}

const MinimalHeader = React.forwardRef<
  React.ComponentRef<typeof View>,
  MinimalHeaderProps
>(({ title, subtitle, badge, className }, ref) => {
  return (
    <View ref={ref} className={cn('gap-2', className)}>
      <View className="flex-row items-center gap-3">
        <Text className="minimal-heading flex-1">{title}</Text>
        {badge && (
          <View className="minimal-badge">
            <Text className="minimal-badge-text text-gray-600">{badge}</Text>
          </View>
        )}
      </View>
      {subtitle && (
        <Text className="minimal-subheading text-gray-500">{subtitle}</Text>
      )}
    </View>
  );
});

MinimalHeader.displayName = 'MinimalHeader';

export { MinimalHeader };
