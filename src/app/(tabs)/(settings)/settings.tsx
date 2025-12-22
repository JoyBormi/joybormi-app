import { settingsGroups } from '@/constants/setting-groups';
import { useColorScheme } from '@/hooks/common';
import { Feedback } from '@/lib/haptics';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';
import {
  ISettingsItem,
  LanguageSheet,
  SettingsItem as SettingsItemComponent,
  ThemeSheet,
  UserProfileCard,
  UserTypeSheet,
} from '@/views/settings';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { i18n } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();
  const { user, appType, isLoggedIn, setIsLoggedIn, setAppType } =
    useUserStore();

  const userTypeSheetRef = useRef<BottomSheetModal>(null);
  const themeSheetRef = useRef<BottomSheetModal>(null);
  const languageSheetRef = useRef<BottomSheetModal>(null);

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  const handleUserTypeSwitch = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    userTypeSheetRef.current?.present();
  }, [isLoggedIn]);

  const handleThemePress = useCallback(() => {
    themeSheetRef.current?.present();
  }, []);

  const handleLanguagePress = useCallback(() => {
    languageSheetRef.current?.present();
  }, []);

  const handleProfilePress = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    // TODO: Navigate to profile screen
  }, [isLoggedIn]);

  const handleUserTypeSelect = useCallback(
    (type: EUserType) => {
      setAppType(type);
      userTypeSheetRef.current?.dismiss();
      // TODO: Update user type in backend
    },
    [setAppType],
  );

  const handleLogout = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Feedback.light(),
        },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => {
            Feedback.medium();
            setIsLoggedIn(false);
            // TODO: Implement logout logic
          },
        },
      ],
      { cancelable: true },
    );
  }, [isLoggedIn, setIsLoggedIn]);

  const settings = useMemo(
    () =>
      settingsGroups({
        notificationsEnabled,
        emailNotifications,
        isDarkColorScheme,
        i18n,
        handleThemePress,
        handleLanguagePress,
        handleLogout,
      }),
    [
      notificationsEnabled,
      emailNotifications,
      isDarkColorScheme,
      handleThemePress,
      handleLanguagePress,
      handleLogout,
      i18n,
    ],
  );

  const handleToggle = useCallback((itemId: string, value: boolean) => {
    switch (itemId) {
      case 'push-notifications':
        setNotificationsEnabled(value);
        break;
      case 'email-notifications':
        setEmailNotifications(value);
        break;
    }
  }, []);

  return (
    <View className="main-area">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* User Profile Card */}
        <View style={{ paddingTop: insets.top + 20 }}>
          <UserProfileCard profile={user} onPress={handleProfilePress} />
        </View>

        {/* Shiny Switch User Type Button */}

        {isLoggedIn && user && (
          <View className="px-4 my-8">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleUserTypeSwitch}
              className="overflow-hidden rounded-2xl"
            >
              <LinearGradient
                colors={[
                  'rgba(168, 85, 247, 0.9)',
                  'rgba(236, 72, 153, 0.9)',
                  'rgba(251, 146, 60, 0.9)',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View className="flex-row items-center justify-between p-5">
                  <View className="flex-1 pr-3">
                    <Text className="text-white font-heading text-lg">
                      Switch Role
                    </Text>

                    <Text className="text-white/85 font-body text-sm mt-1">
                      Use the app as a User, Worker, or Creator
                    </Text>

                    <View className="mt-3 self-end rounded-full bg-white/20 px-3 py-1">
                      <Text className="text-white text-xs font-medium">
                        Current: {user.type}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
        {/* Settings Groups */}
        <View className="px-3 gap-6">
          {settings.map((group) => (
            <View key={group.id} className="gap-2">
              {group.title && (
                <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider px-2">
                  {group.title}
                </Text>
              )}
              <View className="overflow-hidden rounded-2xl">
                {group.items.map((item, index) => (
                  <SettingsItemComponent
                    key={item.id}
                    item={item as ISettingsItem}
                    isFirst={index === 0}
                    isLast={index === group.items.length - 1}
                    onToggle={(value) => handleToggle(item.id, value)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sheets */}
      <UserTypeSheet
        ref={userTypeSheetRef}
        currentType={appType}
        onSelect={handleUserTypeSelect}
        onClose={() => userTypeSheetRef.current?.dismiss()}
      />

      <ThemeSheet
        ref={themeSheetRef}
        onClose={() => themeSheetRef.current?.dismiss()}
      />

      <LanguageSheet
        ref={languageSheetRef}
        onClose={() => languageSheetRef.current?.dismiss()}
      />
    </View>
  );
};

export default SettingsScreen;
