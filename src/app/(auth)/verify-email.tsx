import { useGlobalSearchParams, useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { animations } from '@/constants/animations';
import { routes } from '@/constants/routes';
import { useVerifyEmail } from '@/hooks/auth';
import { Feedback } from '@/lib/haptics';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { token } = useGlobalSearchParams<{ token?: string }>();

  const { mutateAsync: verifyEmail } = useVerifyEmail();

  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }

    verifyEmail({ token })
      .then(() => {
        Feedback.success();
        setStatus('success');
      })
      .catch(() => {
        Feedback.error();
        setStatus('error');
      });
  }, [token, verifyEmail]);

  return (
    <View className="flex-1 bg-background px-6 items-center justify-center">
      {/* CONFETTI - success only */}
      {status === 'success' && (
        <LottieView
          source={animations.confetti}
          autoPlay
          loop={false}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
          }}
        />
      )}

      {/* ICON */}
      <MotiView
        from={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring' }}
        className="mb-6"
      >
        {status === 'loading' && (
          <View className="w-20 h-20 rounded-full bg-muted items-center justify-center">
            <ActivityIndicator />
          </View>
        )}

        {status === 'success' && (
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
            <Icons.Check size={40} className="text-white" />
          </View>
        )}

        {status === 'error' && (
          <View className="w-20 h-20 rounded-full bg-destructive/15 items-center justify-center">
            <Icons.X size={36} className="text-destructive" />
          </View>
        )}
      </MotiView>

      {/* TEXT */}
      <MotiView
        from={{ translateY: 12, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ delay: 150 }}
        className="items-center"
      >
        {status === 'loading' && (
          <>
            <Text className="font-heading text-center mb-2">
              Verifying email...
            </Text>
            <Text className="text-muted-foreground text-center">
              Please wait a moment
            </Text>
          </>
        )}

        {status === 'success' && (
          <>
            <Text className="font-heading text-center mb-2">
              Email verified
            </Text>
            <Text className="text-muted-foreground text-center">
              Your account is now fully activated
            </Text>
          </>
        )}

        {status === 'error' && (
          <>
            <Text className="font-heading text-center mb-2">
              Verification failed
            </Text>
            <Text className="text-muted-foreground text-center">
              This link may be invalid or expired
            </Text>
          </>
        )}
      </MotiView>

      {/* CTA */}
      {status !== 'loading' && (
        <MotiView
          from={{ opacity: 0, translateY: 16 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300 }}
          className="w-full mt-10"
        >
          <Button
            size="lg"
            className="w-full"
            onPress={() => {
              router.replace(
                status === 'success' ? routes.tabs.home : routes.auth.login,
              );
            }}
          >
            <Text className="text-lg font-semibold">
              {status === 'success'
                ? t('auth.success.enterApp')
                : t('common.buttons.backToLogin')}
            </Text>
          </Button>
        </MotiView>
      )}
    </View>
  );
}
