import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Modal, Pressable, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';

import Icons from '../icons';
import { Button, Text } from '../ui';

export function NotificationPermissionModal() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        setIsVisible(true);
      }
    };
    checkPermissions();
  }, []);

  const handleOpenSettings = () => {
    Linking.openSettings();
    setIsVisible(false);
  };

  const handleRequestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === 'granted') {
      setIsVisible(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      statusBarTranslucent
    >
      <Animated.View
        entering={FadeIn.duration(400)}
        exiting={FadeOut.duration(300)}
        className="flex-1 bg-black/20 justify-center items-center px-6"
      >
        <Animated.View
          entering={SlideInDown.duration(600)}
          exiting={SlideOutDown.duration(400)}
          className="w-full max-w-sm overflow-hidden rounded-[32px] border border-muted shadow-2xl"
        >
          <View className="p-8 bg-muted">
            <Pressable
              onPress={() => setIsVisible(false)}
              className="absolute right-4 top-4 z-10 p-2 rounded-full bg-card/20"
              hitSlop={20}
            >
              <Icons.X className="w-6 h-6 text-foreground" />
            </Pressable>

            <View className="items-center">
              <View className="bg-card/50 rounded-full p-6 mb-6 shadow-inner">
                <Icons.Bell className="w-6 h-6 text-foreground" />
              </View>

              <View className="items-center mb-6">
                <Text className="font-title text-foreground text-center mb-2">
                  {t(
                    'common.permissions.notifications.title',
                    'Enable Notifications',
                  )}
                </Text>
                <Text className="font-body text-muted-foreground text-center px-2">
                  {t(
                    'common.permissions.notifications.message',
                    'Allow notifications to receive timely reminders for each appointment.',
                  )}
                </Text>
              </View>

              <View className="w-full gap-3">
                <Button onPress={handleRequestPermission} className="w-full">
                  <Text>
                    {t(
                      'common.permissions.notifications.allow',
                      'Allow Notifications',
                    )}
                  </Text>
                </Button>
                <Button
                  variant="outline"
                  onPress={handleOpenSettings}
                  className="w-full"
                >
                  <Text>
                    {t(
                      'common.permissions.notifications.settings',
                      'Open Settings',
                    )}
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
