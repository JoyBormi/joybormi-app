import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { useNavigation } from 'expo-router';

import { Feedback } from '@/lib/haptics';
import { AnimatePresence, MotiView } from 'moti';
import { View } from 'react-native';

export function AuthHeader({
  title = 'Log in',
  subtitle = 'Login to start using your app',
}: {
  title?: string;
  subtitle?: string;
}) {
  const navigation = useNavigation();

  return (
    <AnimatePresence>
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 900 }}
        className="mb-5"
      >
        {navigation.canGoBack() && (
          <Button
            onPress={() => {
              Feedback.soft();
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
          <Text className="font-regular text-card-foreground pl-0.5">
            {subtitle}
          </Text>
        </View>
      </MotiView>
    </AnimatePresence>
  );
}
