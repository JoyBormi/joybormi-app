import { useNavigation } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';

type HeaderVariant = 'default' | 'row';

export function Header({
  title = 'Log in',
  subtitle = 'Login to start using your app',
  onGoBack,
  className,
  animate = true,
  haptic = true,
  variant = 'default',
}: {
  title?: string;
  subtitle?: string;
  onGoBack?: () => void;
  className?: string;
  animate?: boolean;
  haptic?: boolean;
  variant?: HeaderVariant;
}) {
  const navigation = useNavigation();
  const canGoBack = navigation.canGoBack();

  const BackButton = canGoBack ? (
    <Button
      onPress={() => {
        haptic && Feedback.soft();
        onGoBack?.();
        navigation.goBack();
      }}
      className="p-2 aspect-square rounded-full"
      variant="ghost"
    >
      <Icons.ArrowLeft size={20} className="text-card-foreground" />
    </Button>
  ) : null;

  return (
    <AnimatePresence>
      <MotiView
        from={animate ? { opacity: 0, translateY: 10 } : undefined}
        animate={animate ? { opacity: 1, translateY: 0 } : undefined}
        transition={{ type: 'timing', duration: 900 }}
        className={cn('pb-5', variant === 'default' && 'pt-20', className)}
      >
        {/* DEFAULT — unchanged */}
        {variant === 'default' && (
          <>
            {BackButton}
            <View className="flex flex-col items-start gap-y-1 mt-5">
              <Text className="font-heading">{title}</Text>
              <Text className="font-body text-card-foreground pl-0.5">
                {subtitle}
              </Text>
            </View>
          </>
        )}

        {/* ROW VARIANT */}
        {variant === 'row' && (
          <View>
            <View className="flex flex-row items-center gap-x-2">
              {BackButton}
              <Text className="font-heading">{title}</Text>
            </View>

            <Text className="font-body text-card-foreground pl-0.5 mt-1">
              {subtitle}
            </Text>
          </View>
        )}
      </MotiView>
    </AnimatePresence>
  );
}
