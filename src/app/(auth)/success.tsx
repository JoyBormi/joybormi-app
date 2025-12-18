import { Button, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { useGlobalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';

export default function SuccessScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { type } = useGlobalSearchParams<{ type: 'reset-pwd' | 'register' }>();

  const title = t(`auth.success.${type}.title`);
  const subtitle = t(`auth.success.${type}.subtitle`);

  return (
    <View className="flex-1 justify-center items-center px-4 bg-background">
      <MotiView
        from={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          duration: 1000,
        }}
        className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-8"
      >
        <Icons.Check className="text-white" size={40} />
      </MotiView>

      <MotiView
        from={{
          translateY: 20,
          opacity: 0,
        }}
        animate={{
          translateY: 0,
          opacity: 1,
        }}
        transition={{
          type: 'timing',
          delay: 400,
          duration: 700,
        }}
        className="items-center"
      >
        <Text className="font-heading text-center mb-2">{title}</Text>
        <Text className="text-muted-foreground text-center mb-10">
          {subtitle}
        </Text>

        <Button
          onPress={() => {
            Feedback.soft();
            router.dismissTo('/(auth)/login');
          }}
          className="w-full"
        >
          <Text>{t('auth.success.backToLogin')}</Text>
        </Button>
      </MotiView>
    </View>
  );
}
