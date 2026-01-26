import * as Application from 'expo-application';
import { i18n } from 'i18next';

import Icons from '@/components/icons';

export const settingsGroups = ({
  notificationsEnabled,
  emailNotifications,
  isDarkColorScheme,
  i18n,
  handleThemePress,
  handleLanguagePress,
  handleLogout,
  handleDeleteAccount,
  isLoggedIn,
}: {
  notificationsEnabled: boolean;
  emailNotifications: boolean;
  isDarkColorScheme: boolean;
  i18n: i18n;
  handleThemePress: () => void;
  handleLanguagePress: () => void;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
  isLoggedIn: boolean;
}) => {
  return [
    ...(isLoggedIn
      ? [
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
                href: '/(tabs)/(settings)/profile/likes',
              },
              {
                id: 'reviews',
                type: 'navigation',
                title: 'My Reviews',
                subtitle: "Reviews you've written",
                icon: Icons.Star,
                iconColor: 'text-yellow-500',
                iconBgColor: 'bg-yellow-500/10',
                href: '/(tabs)/(settings)/profile/reviews',
              },
              {
                id: 'security',
                type: 'navigation',
                title: 'Security & Privacy',
                subtitle: 'Password, 2FA, and privacy settings',
                icon: Icons.Lock,
                iconColor: 'text-green-500',
                iconBgColor: 'bg-green-500/10',
                href: '/(tabs)/(settings)/security',
              },
              {
                id: 'payment',
                type: 'navigation',
                title: 'Payment Methods',
                subtitle: 'Manage your payment options',
                icon: Icons.CreditCard,
                iconColor: 'text-purple-500',
                iconBgColor: 'bg-purple-500/10',
                href: '/(tabs)/(settings)/payment',
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
        ]
      : []),
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
          href: '/(tabs)/(settings)/help',
        },
        {
          id: 'terms',
          type: 'navigation',
          title: 'Terms & Conditions',
          icon: Icons.FileText,
          iconColor: 'text-gray-500',
          iconBgColor: 'bg-gray-500/10',
          href: '/(tabs)/(settings)/legal/terms',
        },
        {
          id: 'privacy',
          type: 'navigation',
          title: 'Privacy Policy',
          icon: Icons.Shield,
          iconColor: 'text-gray-500',
          iconBgColor: 'bg-gray-500/10',
          href: '/(tabs)/(settings)/legal/privacy',
        },
        {
          id: 'version',
          type: 'info',
          title: 'App Version',
          icon: Icons.Info,
          iconColor: 'text-muted-foreground',
          iconBgColor: 'bg-muted/30',
          value: Application.nativeApplicationVersion,
        },
      ],
    },
    ...(isLoggedIn
      ? [
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
          {
            id: 'delete-account',
            items: [
              {
                id: 'delete-account-button',
                type: 'action',
                title: 'Delete Account',
                iconColor: 'text-destructive',
                iconBgColor: 'bg-destructive/10',
                withdraw: true,
                onPress: handleDeleteAccount,
              },
            ],
          },
        ]
      : []),
  ];
};
