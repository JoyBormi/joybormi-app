import { Button, Input, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import * as Haptics from 'expo-haptics';
import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import { Pressable, View } from 'react-native';

export interface InviteWorkerFormData {
  email: string;
  role: string;
  message?: string;
}

interface InviteWorkerSheetProps {
  onInvite: (data: InviteWorkerFormData) => void;
}

/**
 * Invite Worker Bottom Sheet
 * Allows brand creators to invite team members
 */
export const InviteWorkerSheet = forwardRef<
  BottomSheetModal,
  InviteWorkerSheetProps
>(({ onInvite }, ref) => {
  const snapPoints = useMemo(() => ['70%'], []);

  const [formData, setFormData] = useState<InviteWorkerFormData>({
    email: '',
    role: '',
    message: '',
  });

  const handleClose = useCallback(() => {
    (ref as React.RefObject<BottomSheetModal>).current?.dismiss();
    // Reset form
    setFormData({ email: '', role: '', message: '' });
  }, [ref]);

  const handleInvite = useCallback(() => {
    if (!formData.email || !formData.role) {
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onInvite(formData);
    handleClose();
  }, [formData, onInvite, handleClose]);

  const isValid = formData.email && formData.role;

  return (
    <BottomSheetModal
      ref={ref}
      snapPoints={snapPoints}
      enablePanDownToClose
      backgroundStyle={{ backgroundColor: 'transparent' }}
      handleIndicatorStyle={{ backgroundColor: '#666' }}
    >
      <BottomSheetView className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-border">
          <Text className="font-heading text-xl text-foreground">
            Invite Team Member
          </Text>
          <Pressable onPress={handleClose}>
            <Icons.X size={24} className="text-muted-foreground" />
          </Pressable>
        </View>

        <BottomSheetScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
        >
          <View className="p-6 gap-6">
            {/* Info Card */}
            <View className="bg-primary/10 rounded-2xl p-4 flex-row gap-3">
              <Icons.Info size={20} className="text-primary mt-0.5" />
              <View className="flex-1">
                <Text className="font-subtitle text-foreground mb-1">
                  Team Invitation
                </Text>
                <Text className="font-body text-muted-foreground">
                  Send an invitation email to add a new team member to your
                  brand. They&apos;ll receive a link to join.
                </Text>
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="font-subtitle text-foreground mb-2">
                Email Address *
              </Text>
              <Input
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
                placeholder="worker@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                className="bg-card/50"
              />
            </View>

            {/* Role */}
            <View>
              <Text className="font-subtitle text-foreground mb-2">
                Role/Position *
              </Text>
              <Input
                value={formData.role}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, role: text }))
                }
                placeholder="e.g., Hair Stylist, Barber, Nail Technician"
                className="bg-card/50"
              />
            </View>

            {/* Optional Message */}
            <View>
              <Text className="font-subtitle text-foreground mb-2">
                Personal Message (Optional)
              </Text>
              <Input
                value={formData.message}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, message: text }))
                }
                placeholder="Add a personal note..."
                multiline
                numberOfLines={3}
                className="bg-card/50"
              />
            </View>

            {/* Action Buttons */}
            <View className="gap-3 pb-6">
              <Button
                onPress={handleInvite}
                disabled={!isValid}
                className="bg-primary disabled:opacity-50"
              >
                <View className="flex-row items-center gap-2">
                  <Icons.Mail size={18} className="text-primary-foreground" />
                  <Text className="font-subtitle text-primary-foreground">
                    Send Invitation
                  </Text>
                </View>
              </Button>
              <Button
                onPress={handleClose}
                variant="outline"
                className="border-border"
              >
                <Text className="font-subtitle text-foreground">Cancel</Text>
              </Button>
            </View>
          </View>
        </BottomSheetScrollView>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

InviteWorkerSheet.displayName = 'InviteWorkerSheet';
