import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Header } from '@/components/shared/header';
import { useColorScheme } from '@/hooks/common';
import {
  ISettingsItem,
  LanguageSheet,
  SettingsItem as SettingsItemComponent,
  ThemeSheet,
} from '@/views/settings';

const PreferencesScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { t, i18n } = useTranslation();
  const { isDarkColorScheme } = useColorScheme();

  const themeSheetRef = useRef<BottomSheetModal>(null);
  const languageSheetRef = useRef<BottomSheetModal>(null);

  const [preferences, setPreferences] = useState({
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
    reminderNotifications: true,
    marketingEmails: false,
    inAppSounds: true,
    hapticFeedback: true,
    autoplayVideos: false,
    dataSaver: false,
  });

  const handleThemePress = useCallback(() => {
    themeSheetRef.current?.present();
  }, []);

  const handleLanguagePress = useCallback(() => {
    languageSheetRef.current?.present();
  }, []);

  const languageLabel = useMemo(() => {
    switch (i18n.language) {
      case 'ru':
        return t('common.languages.ru');
      case 'uz':
        return t('common.languages.uz');
      default:
        return t('common.languages.en');
    }
  }, [i18n.language, t]);

  const preferenceGroups = useMemo(
    () => [
      {
        id: 'appearance',
        title: t('settings.preferencesScreen.sections.appearance'),
        items: [
          {
            id: 'theme',
            type: 'action',
            title: t('settings.preferencesScreen.options.theme.title'),
            subtitle: isDarkColorScheme
              ? t('common.themes.dark')
              : t('common.themes.light'),
            icon: isDarkColorScheme ? Icons.Moon : Icons.Sun,
            iconColor: 'text-indigo-500',
            iconBgColor: 'bg-indigo-500/10',
            onPress: handleThemePress,
          },
          {
            id: 'language',
            type: 'action',
            title: t('settings.preferencesScreen.options.language.title'),
            subtitle: languageLabel,
            icon: Icons.Globe,
            iconColor: 'text-cyan-500',
            iconBgColor: 'bg-cyan-500/10',
            onPress: handleLanguagePress,
          },
        ],
      },
      {
        id: 'notifications',
        title: t('settings.preferencesScreen.sections.notifications'),
        items: [
          {
            id: 'push-notifications',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.push.title'),
            subtitle: t('settings.preferencesScreen.options.push.subtitle'),
            icon: Icons.Bell,
            iconColor: 'text-orange-500',
            iconBgColor: 'bg-orange-500/10',
            value: preferences.pushNotifications,
          },
          {
            id: 'email-notifications',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.email.title'),
            subtitle: t('settings.preferencesScreen.options.email.subtitle'),
            icon: Icons.Mail,
            iconColor: 'text-blue-500',
            iconBgColor: 'bg-blue-500/10',
            value: preferences.emailNotifications,
          },
          {
            id: 'sms-notifications',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.sms.title'),
            subtitle: t('settings.preferencesScreen.options.sms.subtitle'),
            icon: Icons.MessageSquare,
            iconColor: 'text-violet-500',
            iconBgColor: 'bg-violet-500/10',
            value: preferences.smsNotifications,
          },
          {
            id: 'reminder-notifications',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.reminders.title'),
            subtitle: t(
              'settings.preferencesScreen.options.reminders.subtitle',
            ),
            icon: Icons.Clock,
            iconColor: 'text-emerald-500',
            iconBgColor: 'bg-emerald-500/10',
            value: preferences.reminderNotifications,
          },
          {
            id: 'marketing-emails',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.marketing.title'),
            subtitle: t(
              'settings.preferencesScreen.options.marketing.subtitle',
            ),
            icon: Icons.Megaphone,
            iconColor: 'text-amber-500',
            iconBgColor: 'bg-amber-500/10',
            value: preferences.marketingEmails,
          },
        ],
      },
      {
        id: 'experience',
        title: t('settings.preferencesScreen.sections.experience'),
        items: [
          {
            id: 'in-app-sounds',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.sound.title'),
            subtitle: t('settings.preferencesScreen.options.sound.subtitle'),
            icon: Icons.Volume2,
            iconColor: 'text-sky-500',
            iconBgColor: 'bg-sky-500/10',
            value: preferences.inAppSounds,
          },
          {
            id: 'haptic-feedback',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.haptics.title'),
            subtitle: t('settings.preferencesScreen.options.haptics.subtitle'),
            icon: Icons.Sparkles,
            iconColor: 'text-rose-500',
            iconBgColor: 'bg-rose-500/10',
            value: preferences.hapticFeedback,
          },
          {
            id: 'autoplay-videos',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.autoplay.title'),
            subtitle: t('settings.preferencesScreen.options.autoplay.subtitle'),
            icon: Icons.PlayCircle,
            iconColor: 'text-fuchsia-500',
            iconBgColor: 'bg-fuchsia-500/10',
            value: preferences.autoplayVideos,
          },
          {
            id: 'data-saver',
            type: 'toggle',
            title: t('settings.preferencesScreen.options.dataSaver.title'),
            subtitle: t(
              'settings.preferencesScreen.options.dataSaver.subtitle',
            ),
            icon: Icons.CloudDownload,
            iconColor: 'text-teal-500',
            iconBgColor: 'bg-teal-500/10',
            value: preferences.dataSaver,
          },
        ],
      },
    ],
    [
      handleLanguagePress,
      handleThemePress,
      isDarkColorScheme,
      languageLabel,
      preferences,
      t,
    ],
  );

  const handleToggle = useCallback((itemId: string, value: boolean) => {
    setPreferences((prev) => {
      switch (itemId) {
        case 'push-notifications':
          return { ...prev, pushNotifications: value };
        case 'email-notifications':
          return { ...prev, emailNotifications: value };
        case 'sms-notifications':
          return { ...prev, smsNotifications: value };
        case 'reminder-notifications':
          return { ...prev, reminderNotifications: value };
        case 'marketing-emails':
          return { ...prev, marketingEmails: value };
        case 'in-app-sounds':
          return { ...prev, inAppSounds: value };
        case 'haptic-feedback':
          return { ...prev, hapticFeedback: value };
        case 'autoplay-videos':
          return { ...prev, autoplayVideos: value };
        case 'data-saver':
          return { ...prev, dataSaver: value };
        default:
          return prev;
      }
    });
  }, []);

  return (
    <View className="main-area">
      <Header
        title={t('settings.preferencesScreen.title')}
        subtitle={t('settings.preferencesScreen.subtitle')}
        className="px-2"
      />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-6 mt-1">
          {preferenceGroups.map((group) => (
            <View key={group.id} className="gap-2">
              <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider px-4">
                {group.title}
              </Text>
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

export default PreferencesScreen;
