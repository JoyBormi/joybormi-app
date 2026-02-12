import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { forwardRef, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomBottomSheet } from '@/components/bottom-sheet';
import Icons from '@/components/icons';
import { routes } from '@/constants/routes';
import { Feedback } from '@/lib/haptics';
import { queryKeys } from '@/lib/tanstack-query';
import { cn, validateUserTypeSwitch } from '@/lib/utils';
import { useUserStore } from '@/stores';
import { EUserType } from '@/types/user.type';

import { UserTypeActionRequiredSheet } from './action-required';

interface UserTypeSheetProps {
  onClose: () => void;
}

const ALL_USER_TYPES = [
  {
    type: EUserType.USER,
    title: 'User',
    description: 'Book services and manage appointments',
    icon: Icons.User,
    color: 'text-blue-500',
  },
  {
    type: EUserType.CREATOR,
    title: 'Creator',
    description: 'Manage your brand and services',
    icon: Icons.Briefcase,
    color: 'text-purple-500',
  },
  {
    type: EUserType.WORKER,
    title: 'Worker',
    description: 'Provide services and manage bookings',
    icon: Icons.Users,
    color: 'text-green-500',
  },
];

export const UserTypeSheet = forwardRef<BottomSheetModal, UserTypeSheetProps>(
  ({ onClose }, ref) => {
    const { user, appType, setAppType } = useUserStore();
    const insets = useSafeAreaInsets();
    const actionSheetRef = useRef<BottomSheetModal>(null);
    const queryClient = useQueryClient();

    // States
    const [selectedType, setSelectedType] = useState<EUserType>(appType);
    const [actionReason, setActionReason] = useState<
      'NEED_CODE' | 'NEED_BRAND'
    >('NEED_CODE');

    const handleSelect = (type: EUserType) => {
      Feedback.light();
      setSelectedType(type);
    };

    const handleConfirm = () => {
      const reason = validateUserTypeSwitch(
        appType,
        selectedType,
        user?.role === EUserType.CREATOR,
      );
      if (reason === 'NEED_CODE' || reason === 'NEED_BRAND') {
        setActionReason(reason);
        actionSheetRef.current?.present();
        return;
      }

      Feedback.success();
      setAppType(selectedType);
      queryClient.invalidateQueries({ queryKey: queryKeys.creator.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.worker.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.files.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.service.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all });
      router.replace(routes.tabs.profile);
      onClose();
    };

    return (
      <CustomBottomSheet
        ref={ref}
        index={0}
        detached
        enablePanDownToClose
        enableDismissOnClose
        bottomInset={insets.bottom}
        style={{
          paddingHorizontal: 12,
        }}
        bottomSheetViewConfig={{
          className: 'rounded-b-3xl',
        }}
        onDismiss={() => {
          setSelectedType(appType);
        }}
      >
        <View className="gap-5 pb-6">
          <View>
            <Text className="text-2xl text-foreground font-heading tracking-tight">
              Switch User Type
            </Text>
            <Text className="text-sm text-muted-foreground font-body mt-2">
              Choose how you want to use the app
            </Text>
          </View>

          <View className="gap-3">
            {ALL_USER_TYPES.map((userType) => {
              const Icon = userType.icon;
              const isSelected = selectedType === userType.type;

              return (
                <Pressable
                  key={userType.type}
                  onPress={() => handleSelect(userType.type)}
                  className={cn(
                    'flex-row items-center gap-4 p-4 rounded-2xl border-2 transition-all',
                    isSelected
                      ? 'bg-primary/10 border-primary'
                      : 'bg-card/30 border-border/20',
                  )}
                >
                  <View
                    className={cn(
                      'w-12 h-12 rounded-xl items-center justify-center',
                      isSelected ? 'bg-primary/20' : 'bg-muted/30',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-6 h-6',
                        isSelected ? 'text-primary' : userType.color,
                      )}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-base text-foreground font-subtitle">
                      {userType.title}
                    </Text>
                    <Text className="text-sm text-muted-foreground font-body mt-0.5">
                      {userType.description}
                    </Text>
                  </View>

                  {isSelected && (
                    <Icons.CheckCircle className="text-primary w-6 h-6" />
                  )}
                </Pressable>
              );
            })}
          </View>

          <Pressable
            className="bg-primary h-14 rounded-2xl items-center justify-center mt-2"
            onPress={handleConfirm}
          >
            <Text className="text-primary-foreground font-subtitle text-base">
              Confirm Switch
            </Text>
          </Pressable>
        </View>
        <UserTypeActionRequiredSheet
          ref={actionSheetRef}
          type={actionReason}
          onPrimary={() => {
            onClose();
            actionSheetRef.current?.dismiss();

            if (actionReason === 'NEED_CODE')
              return router.push(routes.worker.invite_code);

            if (actionReason === 'NEED_BRAND')
              return router.push(routes.brand.create);
          }}
        />
      </CustomBottomSheet>
    );
  },
);

UserTypeSheet.displayName = 'UserTypeSheet';
