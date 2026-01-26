import { useNavigation } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';

export function Header({
  title = 'Log in',
  subtitle = 'Login to start using your app',
  onGoBack,
  className,
  animate = true,
}: {
  title?: string;
  subtitle?: string;
  onGoBack?: () => void;
  className?: string;
  animate?: boolean;
}) {
  const navigation = useNavigation();

  return (
    <AnimatePresence>
      <MotiView
        from={animate ? { opacity: 0, translateY: 10 } : undefined}
        animate={animate ? { opacity: 1, translateY: 0 } : undefined}
        transition={{ type: 'timing', duration: 900 }}
        className={cn('mb-5 pt-20', className)}
      >
        {navigation.canGoBack() && (
          <Button
            onPress={() => {
              Feedback.soft();
              onGoBack?.();
              navigation.goBack();
            }}
            className="p-2 w-fit aspect-square rounded-full !pl-0"
            variant="ghost"
          >
            <Icons.ArrowLeft size={20} className="text-card-foreground" />
          </Button>
        )}
        <View className="flex flex-col items-start gap-y-1 mt-5">
          <Text className="font-heading">{title}</Text>
          <Text className="font-body text-card-foreground pl-0.5">
            {subtitle}
          </Text>
        </View>
      </MotiView>
    </AnimatePresence>
  );
}
