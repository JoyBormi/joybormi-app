import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DeleteModal, DeleteModalRef } from '@/components/modals';
import { settingsGroups } from '@/constants/setting-groups';
import { useLogout, useWithdraw } from '@/hooks/auth';
import { Feedback } from '@/lib/haptics';
import { useUserStore } from '@/stores';
import {
  ISettingsItem,
  SettingsItem as SettingsItemComponent,
  UserProfileCard,
  UserTypeSheet,
} from '@/views/settings';

const SettingsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { user, appType, isLoggedIn } = useUserStore();

  const userTypeSheetRef = useRef<BottomSheetModal>(null);
  const deleteModalRef = useRef<DeleteModalRef>(null);

  const { mutateAsync: logout } = useLogout();
  const { mutateAsync: withdraw } = useWithdraw();

  const handleUserTypeSwitch = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    userTypeSheetRef.current?.present();
  }, [isLoggedIn]);

  const handleProfilePress = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/(auth)/login');

      return;
    }
    router.push('/((screens))/(user)/edit-profile');
  }, [isLoggedIn]);

  const handleLogout = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    Alert.alert(
      t('settings.items.logout.title'),
      t('settings.alerts.logout'),
      [
        {
          text: t('common.buttons.cancel'),
          style: 'cancel',
          onPress: () => Feedback.light(),
        },
        {
          text: t('settings.items.logout.title'),
          style: 'destructive',
          onPress: () => {
            Feedback.medium();
            logout();
          },
        },
      ],
      { cancelable: true },
    );
  }, [isLoggedIn, logout, t]);

  const handleDeleteAccount = useCallback(() => {
    if (!isLoggedIn) {
      router.push('/(auth)/login');
      return;
    }
    deleteModalRef.current?.show();
  }, [isLoggedIn]);

  const settings = useMemo(
    () =>
      settingsGroups({
        t,
        handleLogout,
        handleDeleteAccount,
        isLoggedIn,
      }),
    [handleDeleteAccount, handleLogout, isLoggedIn, t],
  );

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

        {isLoggedIn && (
          <View className="mb-8">
            <Pressable
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
                    <Text className="text-white font-heading">
                      {t('settings.userType.title')}
                    </Text>

                    <Text className="text-white/85 font-body mt-1">
                      {t('settings.userType.subtitle')}
                    </Text>

                    <View className="mt-3 self-end rounded-full bg-white/20 px-3 py-1">
                      <Text className="text-white font-base">
                        {t('settings.userType.current', { type: appType })}
                      </Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Pressable>
          </View>
        )}
        {/* Settings Groups */}
        <View className="gap-6">
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
        onClose={() => userTypeSheetRef.current?.dismiss()}
      />

      <DeleteModal
        ref={deleteModalRef}
        onConfirm={() => {
          withdraw();
        }}
      />
    </View>
  );
};

export default SettingsScreen;
