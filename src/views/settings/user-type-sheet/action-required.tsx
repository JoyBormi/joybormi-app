import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import React, { forwardRef } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DetachedSheet } from '@/components/bottom-sheet';
import Icons from '@/components/icons';

interface Props {
  type: 'NEED_CODE' | 'NEED_BRAND';
  onPrimary: () => void;
}

export const UserTypeActionRequiredSheet = forwardRef<BottomSheetModal, Props>(
  ({ type, onPrimary }, ref) => {
    const content =
      type === 'NEED_CODE'
        ? {
            title: 'Invite Code Required',
            desc: 'Enter a 6-digit code to join a creator brand.',
            action: 'Enter Code',
            icon: Icons.FileText,
          }
        : {
            title: 'Create a Brand First',
            desc: 'You need a brand before switching to Creator.',
            action: 'Create Brand',
            icon: Icons.Briefcase,
          };

    const Icon = content.icon;

    const animationConfigs = useBottomSheetTimingConfigs({
      duration: 150,
    });

    return (
      <DetachedSheet
        ref={ref}
        animationConfigs={animationConfigs}
        grabbable={false}
      >
        <View className="items-center px-6 py-8 gap-4">
          <View className="w-14 h-14 rounded-full bg-primary/15 items-center justify-center">
            <Icon className="w-7 h-7 text-primary" />
          </View>

          <Text className="text-foreground font-heading text-center">
            {content.title}
          </Text>

          <Text className="text-muted-foreground text-center">
            {content.desc}
          </Text>

          <Pressable
            onPress={onPrimary}
            className="mt-4 bg-primary flex px-6 py-3 rounded-xl"
          >
            <Text className="text-primary-foreground font-subtitle">
              {content.action}
            </Text>
          </Pressable>
        </View>
      </DetachedSheet>
    );
  },
);

UserTypeActionRequiredSheet.displayName = 'UserTypeActionRequiredSheet';
