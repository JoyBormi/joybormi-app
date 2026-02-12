import {
  BottomSheetModal,
  useBottomSheetTimingConfigs,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CustomBottomSheet } from '@/components/bottom-sheet';
import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { agent } from '@/lib/agent';

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

  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const fetchInviteCode = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await agent.post<
        string | { inviteCode?: string; code?: string }
      >('/workers/invite');
      const resolvedCode =
        typeof response === 'string'
          ? response
          : (response.inviteCode ?? response.code ?? '');
      setInviteCode(resolvedCode);
    } catch (error) {
      console.error('Failed to fetch invite code:', error);
      setInviteCode('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInviteCode();
  }, [fetchInviteCode]);

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
    if (!inviteCode) return;
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
        <View className="bg-white p-6 rounded-2xl items-center justify-center">
          {isLoading ? (
            <ActivityIndicator />
          ) : (
            <QRCode value={qrData} size={120} />
          )}
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
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text className="font-heading text-4xl text-foreground tracking-widest">
                {inviteCode ? inviteCode.match(/.{1,3}/g)?.join(' ') : '------'}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </CustomBottomSheet>
  );
});

InviteTeamSheet.displayName = 'InviteTeamSheet';
