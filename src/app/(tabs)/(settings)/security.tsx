import React, { useCallback, useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Header } from '@/components/shared/header';
import { Text } from '@/components/ui';
import {
  ISettingsItem,
  SettingsItem as SettingsItemComponent,
} from '@/views/settings';

export default function SecurityScreen() {
  const insets = useSafeAreaInsets();
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: true,
    loginAlerts: true,
    biometric: false,
    profileVisibility: true,
    marketingSharing: false,
  });

  const groups = useMemo(
    () => [
      {
        id: 'login',
        title: 'Login & access',
        items: [
          {
            id: 'two-factor',
            type: 'toggle',
            title: 'Two-factor authentication',
            subtitle: 'Require a code when logging in.',
            icon: Icons.Lock,
            iconColor: 'text-green-500',
            iconBgColor: 'bg-green-500/10',
            value: securitySettings.twoFactor,
          },
          {
            id: 'login-alerts',
            type: 'toggle',
            title: 'Login alerts',
            subtitle: 'Get notified about new device logins.',
            icon: Icons.Bell,
            iconColor: 'text-amber-500',
            iconBgColor: 'bg-amber-500/10',
            value: securitySettings.loginAlerts,
          },
          {
            id: 'biometric',
            type: 'toggle',
            title: 'Biometric unlock',
            subtitle: 'Use Face ID or fingerprint to open the app.',
            icon: Icons.Eye,
            iconColor: 'text-indigo-500',
            iconBgColor: 'bg-indigo-500/10',
            value: securitySettings.biometric,
          },
        ],
      },
      {
        id: 'privacy',
        title: 'Privacy controls',
        items: [
          {
            id: 'profile-visibility',
            type: 'toggle',
            title: 'Show my profile',
            subtitle: 'Allow clients to discover your profile.',
            icon: Icons.User,
            iconColor: 'text-sky-500',
            iconBgColor: 'bg-sky-500/10',
            value: securitySettings.profileVisibility,
          },
          {
            id: 'marketing-sharing',
            type: 'toggle',
            title: 'Share usage insights',
            subtitle: 'Help improve product experiences.',
            icon: Icons.Share2,
            iconColor: 'text-rose-500',
            iconBgColor: 'bg-rose-500/10',
            value: securitySettings.marketingSharing,
          },
        ],
      },
    ],
    [securitySettings],
  );

  const handleToggle = useCallback((itemId: string, value: boolean) => {
    setSecuritySettings((prev) => {
      switch (itemId) {
        case 'two-factor':
          return { ...prev, twoFactor: value };
        case 'login-alerts':
          return { ...prev, loginAlerts: value };
        case 'biometric':
          return { ...prev, biometric: value };
        case 'profile-visibility':
          return { ...prev, profileVisibility: value };
        case 'marketing-sharing':
          return { ...prev, marketingSharing: value };
        default:
          return prev;
      }
    });
  }, []);

  return (
    <View className="main-area" style={{ paddingTop: insets.top }}>
      <Header
        title="Security & Privacy"
        subtitle="Control how your account stays secure."
        animate={false}
        className="px-2"
        variant="row"
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View className="gap-6 px-5">
          {groups.map((group) => (
            <View key={group.id} className="gap-2">
              <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider">
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

          <View className="gap-3">
            <Text className="text-sm text-muted-foreground font-subtitle uppercase tracking-wider">
              Active sessions
            </Text>
            {[
              {
                id: 'session-1',
                device: 'iPhone 15 Pro',
                location: 'San Diego, CA',
                status: 'Active now',
              },
              {
                id: 'session-2',
                device: 'MacBook Air',
                location: 'San Diego, CA',
                status: 'Last seen yesterday',
              },
            ].map((session) => (
              <View
                key={session.id}
                className="rounded-2xl border border-border/50 bg-card/60 p-4"
              >
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-subtitle text-foreground">
                      {session.device}
                    </Text>
                    <Text className="text-xs text-muted-foreground mt-1">
                      {session.location}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted-foreground">
                    {session.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
