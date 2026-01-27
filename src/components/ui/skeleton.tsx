import { View } from 'react-native';

import { cn } from '@/lib/utils';

export const Skeleton = ({ className }: { className?: string }) => {
  return (
    <View
      className={cn(
        'h-12 bg-muted/50 rounded-lg w-full animate-pulse',
        className,
      )}
    />
  );
};
