import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface InviteTeamSheetProps {
  brandId: string;
  brandName: string;
}

/**
 * Shared Invite Team Sheet
 * Shows QR code and 6-digit code for workers to join
 */
export const InviteTeamSheet = forwardRef<
  BottomSheetModal,
  InviteTeamSheetProps
>(({ brandId, brandName }, ref) => {
  const insets = useSafeAreaInsets();
  const animationConfigs = useBottomSheetTimingConfigs({ duration: 150 });

  // Generate 6-digit code from brandId
  const inviteCode = useMemo(() => {
    const hash = brandId
      .split('')
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return String(hash).slice(-6).padStart(6, '0');
  }, [brandId]);

  const qrData = useMemo(
    () =>
      JSON.stringify({
        type: 'brand_invite',
        brandId,
        code: inviteCode,
      }),
    [brandId, inviteCode],
  );

  const handleCopyCode = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // TODO: Copy to clipboard
    console.warn('Copy code:', inviteCode);
  }, [inviteCode]);

  return (
    <CustomBottomSheet
      ref={ref}
      index={0}
      detached
      bottomInset={insets.bottom}
      animationConfigs={animationConfigs}
      style={{
        paddingHorizontal: 12,
      }}
      bottomSheetViewConfig={{
        className: 'rounded-b-3xl',
      }}
    >
      <View className="gap-6 pb-8 pt-4 items-center">
        {/* Header */}

        <Text className="font-title text-foreground">Invite Team Member</Text>

        {/* Info */}
        <View className="bg-primary/10 rounded-2xl p-4 w-full">
          <View className="flex-row gap-3">
            <Icons.Info size={20} className="text-primary mt-0.5" />
            <View className="flex-1">
              <Text className="font-subtitle text-foreground mb-1">
                Share this code
              </Text>
              <Text className="font-body text-muted-foreground">
                Team members can scan the QR code or enter the 6-digit code to
                join {brandName}
              </Text>
            </View>
          </View>
        </View>

        {/* QR Code */}
        <View className="bg-white p-6 rounded-2xl">
          <QRCode value={qrData} size={120} />
        </View>

        {/* 6-Digit Code */}
        <View className="w-full">
          <Text className="font-subtitle text-foreground mb-2 text-center">
            Or enter this code:
          </Text>
          <Pressable
            onPress={handleCopyCode}
            className="bg-card/50 backdrop-blur-xl rounded-2xl p-6 border border-border/50 items-center"
          >
            <Text className="font-heading text-4xl text-foreground tracking-widest">
              {inviteCode.match(/.{1,3}/g)?.join(' ')}
            </Text>
            <View className="flex-row items-center gap-2 mt-3">
              <Icons.Copy size={16} className="text-muted-foreground" />
              <Text className="font-caption text-muted-foreground">
                Tap to copy
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </CustomBottomSheet>
  );
});

InviteTeamSheet.displayName = 'InviteTeamSheet';
