import { useColorScheme } from '@/hooks/common';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import {
  LanguageSheet,
  SettingsGroup,
  SettingsItem as SettingsItemComponent,
  ThemeSheet,
  UserProfile,
  UserProfileCard,
  UserType,
  UserTypeSheet,
} from '@/views/settings';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const APP_VERSION = '1.0.0';

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { i18n, t } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();

  const userTypeSheetRef = useRef<BottomSheetModal>(null);
  const themeSheetRef = useRef<BottomSheetModal>(null);
  const languageSheetRef = useRef<BottomSheetModal>(null);

  // Mock user profile - replace with actual user data
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Set to false to test login flow
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'John Doe',
    email: 'john.doe@example.com',
    currentType: 'user',
  });

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

  const handleUserTypeSelect = useCallback((type: UserType) => {
    setUserProfile((prev) => ({ ...prev, currentType: type }));
    // TODO: Update user type in backend
  }, []);

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
  }, [isLoggedIn]);

  const settingsGroups: SettingsGroup[] = useMemo(
    () => [
      {
        id: 'account',
        title: 'Account',
        items: [
          {
            id: 'likes',
            type: 'navigation',
            title: 'Liked Items',
            subtitle: 'Your favorite workers and brands',
            icon: Icons.Heart,
            iconColor: 'text-red-500',
            iconBgColor: 'bg-red-500/10',
            href: '/profile/likes',
          },
          {
            id: 'reviews',
            type: 'navigation',
            title: 'My Reviews',
            subtitle: "Reviews you've written",
            icon: Icons.Star,
            iconColor: 'text-yellow-500',
            iconBgColor: 'bg-yellow-500/10',
            href: '/profile/reviews',
          },
          {
            id: 'security',
            type: 'navigation',
            title: 'Security & Privacy',
            subtitle: 'Password, 2FA, and privacy settings',
            icon: Icons.Lock,
            iconColor: 'text-green-500',
            iconBgColor: 'bg-green-500/10',
            href: '/settings/security',
          },
          {
            id: 'payment',
            type: 'navigation',
            title: 'Payment Methods',
            subtitle: 'Manage your payment options',
            icon: Icons.CreditCard,
            iconColor: 'text-purple-500',
            iconBgColor: 'bg-purple-500/10',
            href: '/settings/payment',
          },
        ],
      },
      {
        id: 'notifications',
        title: 'Notifications',
        items: [
          {
            id: 'push-notifications',
            type: 'toggle',
            title: 'Push Notifications',
            subtitle: 'Receive notifications on your device',
            icon: Icons.Bell,
            iconColor: 'text-orange-500',
            iconBgColor: 'bg-orange-500/10',
            value: notificationsEnabled,
          },
          {
            id: 'email-notifications',
            type: 'toggle',
            title: 'Email Notifications',
            subtitle: 'Receive updates via email',
            icon: Icons.Mail,
            iconColor: 'text-blue-500',
            iconBgColor: 'bg-blue-500/10',
            value: emailNotifications,
          },
        ],
      },
      {
        id: 'preferences',
        title: 'Preferences',
        items: [
          {
            id: 'theme',
            type: 'action',
            title: 'Theme',
            subtitle: isDarkColorScheme ? 'Dark' : 'Light',
            icon: isDarkColorScheme ? Icons.Moon : Icons.Sun,
            iconColor: 'text-indigo-500',
            iconBgColor: 'bg-indigo-500/10',
            onPress: handleThemePress,
          },
          {
            id: 'language',
            type: 'action',
            title: 'Language',
            subtitle:
              i18n.language === 'ru'
                ? 'Russian'
                : i18n.language === 'uz'
                  ? 'Uzbek'
                  : 'English',
            icon: Icons.Globe,
            iconColor: 'text-cyan-500',
            iconBgColor: 'bg-cyan-500/10',
            onPress: handleLanguagePress,
          },
        ],
      },
      {
        id: 'support',
        title: 'Support & About',
        items: [
          {
            id: 'help',
            type: 'navigation',
            title: 'Help & Support',
            icon: Icons.HelpCircle,
            iconColor: 'text-teal-500',
            iconBgColor: 'bg-teal-500/10',
            href: '/support',
          },
          {
            id: 'terms',
            type: 'navigation',
            title: 'Terms & Conditions',
            icon: Icons.FileText,
            iconColor: 'text-gray-500',
            iconBgColor: 'bg-gray-500/10',
            href: '/legal/terms',
          },
          {
            id: 'privacy',
            type: 'navigation',
            title: 'Privacy Policy',
            icon: Icons.Shield,
            iconColor: 'text-gray-500',
            iconBgColor: 'bg-gray-500/10',
            href: '/legal/privacy',
          },
          {
            id: 'version',
            type: 'info',
            title: 'App Version',
            icon: Icons.Info,
            iconColor: 'text-muted-foreground',
            iconBgColor: 'bg-muted/30',
            value: APP_VERSION,
          },
        ],
      },
      {
        id: 'logout',
        items: [
          {
            id: 'logout-button',
            type: 'action',
            title: 'Log Out',
            icon: Icons.LogOut,
            iconColor: 'text-destructive',
            iconBgColor: 'bg-destructive/10',
            destructive: true,
            onPress: handleLogout,
          },
        ],
      },
    ],
    [
      notificationsEnabled,
      emailNotifications,
      isDarkColorScheme,
      i18n.language,
      handleThemePress,
      handleLanguagePress,
      handleLogout,
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
        <View style={{ paddingTop: insets.top + 50 }}>
          <UserProfileCard profile={userProfile} onPress={handleProfilePress} />
        </View>

        {/* Shiny Switch User Type Button */}
        {isLoggedIn && (
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
                        Current: {userProfile.currentType}
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
          {settingsGroups.map((group) => (
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
                    item={item}
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
        currentType={userProfile.currentType}
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
