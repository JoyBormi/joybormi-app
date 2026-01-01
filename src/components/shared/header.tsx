import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { useNavigation } from 'expo-router';

import { Feedback } from '@/lib/haptics';
import { cn } from '@/lib/utils';
import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';

export function Header({
  title = 'Log in',
  subtitle = 'Login to start using your app',
  onGoBack,
  className,
}: {
  title?: string;
  subtitle?: string;
  onGoBack?: () => void;
  className?: string;
}) {
  const navigation = useNavigation();

  return (
    <AnimatePresence>
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 900 }}
        className={cn('mb-5 pt-20', className)}
      >
        {navigation.canGoBack() && (
          <Button
            onPress={() => {
              Feedback.soft();
              onGoBack?.();
            }}
            className="p-2 w-fit aspect-square rounded-full !pl-0"
            variant="ghost"
          >
            <Icons.ArrowLeft size={20} className="text-card-foreground" />
          </Button>
        )}
        <View className="flex flex-col items-start gap-y-1 mt-5">
          <Text className="font-heading">{title}</Text>
          <Text className="font-regular text-card-foreground pl-0.5">
            {subtitle}
          </Text>
        </View>
      </MotiView>
    </AnimatePresence>
  );
}
