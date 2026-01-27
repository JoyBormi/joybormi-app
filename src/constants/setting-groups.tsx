import * as Application from 'expo-application';

import Icons from '@/components/icons';

import type { TFunction } from 'i18next';

export const settingsGroups = ({
  t,
  handleLogout,
  handleDeleteAccount,
  isLoggedIn,
}: {
  t: TFunction<'translation', undefined>;
  handleLogout: () => void;
  handleDeleteAccount: () => void;
  isLoggedIn: boolean;
}) => {
  return [
    ...(isLoggedIn
      ? [
          {
            id: 'account',
            title: t('settings.groups.account'),
            items: [
              {
                id: 'likes',
                type: 'navigation',
                title: t('settings.items.likes.title'),
                subtitle: t('settings.items.likes.subtitle'),
                icon: Icons.Heart,
                iconColor: 'text-red-500',
                iconBgColor: 'bg-red-500/10',
                href: '/(tabs)/(settings)/profile/likes',
              },
              {
                id: 'reviews',
                type: 'navigation',
                title: t('settings.items.reviews.title'),
                subtitle: t('settings.items.reviews.subtitle'),
                icon: Icons.Star,
                iconColor: 'text-yellow-500',
                iconBgColor: 'bg-yellow-500/10',
                href: '/(tabs)/(settings)/profile/reviews',
              },
              {
                id: 'security',
                type: 'navigation',
                title: t('settings.items.security.title'),
                subtitle: t('settings.items.security.subtitle'),
                icon: Icons.Lock,
                iconColor: 'text-green-500',
                iconBgColor: 'bg-green-500/10',
                href: '/(tabs)/(settings)/security',
              },
              {
                id: 'payment',
                type: 'navigation',
                title: t('settings.items.payment.title'),
                subtitle: t('settings.items.payment.subtitle'),
                icon: Icons.CreditCard,
                iconColor: 'text-purple-500',
                iconBgColor: 'bg-purple-500/10',
                href: '/(tabs)/(settings)/payment',
              },
            ],
          },
        ]
      : []),
    {
      id: 'preferences',
      title: t('settings.groups.preferences'),
      items: [
        {
          id: 'preferences',
          type: 'navigation',
          title: t('settings.items.preferences.title'),
          subtitle: t('settings.items.preferences.subtitle'),
          icon: Icons.SlidersHorizontal,
          iconColor: 'text-indigo-500',
          iconBgColor: 'bg-indigo-500/10',
          href: '/(tabs)/(settings)/preferences',
        },
      ],
    },
    {
      id: 'support',
      title: t('settings.groups.support'),
      items: [
        {
          id: 'help',
          type: 'navigation',
          title: t('settings.items.help.title'),
          icon: Icons.HelpCircle,
          iconColor: 'text-teal-500',
          iconBgColor: 'bg-teal-500/10',
          href: '/(tabs)/(settings)/help',
        },
        {
          id: 'terms',
          type: 'navigation',
          title: t('settings.items.terms.title'),
          icon: Icons.FileText,
          iconColor: 'text-gray-500',
          iconBgColor: 'bg-gray-500/10',
          href: '/(tabs)/(settings)/legal/terms',
        },
        {
          id: 'privacy',
          type: 'navigation',
          title: t('settings.items.privacy.title'),
          icon: Icons.Shield,
          iconColor: 'text-gray-500',
          iconBgColor: 'bg-gray-500/10',
          href: '/(tabs)/(settings)/legal/privacy',
        },
        {
          id: 'version',
          type: 'info',
          title: t('settings.items.version.title'),
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
                title: t('settings.items.logout.title'),
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
                title: t('settings.items.deleteAccount.title'),
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
