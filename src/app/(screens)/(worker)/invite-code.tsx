import { zodResolver } from '@hookform/resolvers/zod';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { QrCode, X } from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Modal, Pressable, View } from 'react-native';
import { z } from 'zod';

import { Header } from '@/components/shared/header';
import KeyboardAvoid from '@/components/shared/keyboard-avoid';
import { Button, OtpInput, Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';

/* ================= SCHEMA ================= */

const inviteCodeSchema = z.object({
  code: z
    .string()
    .length(6, 'Code must be 6 digits')
    .regex(/^\d+$/, 'Only numbers allowed'),
});

type InviteCodeForm = z.infer<typeof inviteCodeSchema>;

/* ================= HELPERS ================= */

function extractSixDigits(input: string): string | null {
  const raw = (input ?? '').trim();

  // allow raw "123456"
  if (/^\d{6}$/.test(raw)) return raw;

  // allow things like "invite:123456" or URL query "...?code=123456"
  const m = raw.match(/(\d{6})/);
  return m?.[1] ?? null;
}

/* ================= SCREEN ================= */

function InviteCodeScreen() {
  const router = useRouter();

  const { control, handleSubmit, setValue } = useForm<InviteCodeForm>({
    resolver: zodResolver(inviteCodeSchema),
    defaultValues: { code: '' },
  });

  // Camera permissions
  const [permission, requestPermission] = useCameraPermissions();

  // Modal + scan state
  const [scanOpen, setScanOpen] = useState(false);
  const [scanned, setScanned] = useState(false);

  // reset scan state each time modal opens
  useEffect(() => {
    if (scanOpen) setScanned(false);
  }, [scanOpen]);

  const closeScan = useCallback(() => setScanOpen(false), []);
  const openScan = useCallback(async () => {
    // ask permission only when user tries to scan
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) return;
    }
    setScanOpen(true);
  }, [permission?.granted, requestPermission]);

  const onSubmit = (data: InviteCodeForm) => {
    Feedback.success();
    console.log('Invite code entered:', data.code);
    router.back();
  };

  const onBarcodeScanned = useCallback(
    ({ data }: { data: string }) => {
      if (scanned) return; // prevent multi-fire
      setScanned(true);

      const code = extractSixDigits(data);
      if (!code) {
        Feedback.heavy();
        // allow scanning again
        setTimeout(() => setScanned(false), 600);
        return;
      }

      setValue('code', code, { shouldValidate: true });
      Feedback.success();
      closeScan();
    },
    [scanned, setValue, closeScan],
  );

  const permissionText = useMemo(() => {
    if (!permission) return 'Requesting camera permission...';
    if (permission.granted) return '';
    return 'Camera permission is required to scan a QR code.';
  }, [permission]);

  return (
    <KeyboardAvoid>
      <View className="flex-1 px-5 pt-20">
        <Header
          title="Enter Invite Code"
          subtitle="Enter the 6-digit code provided by the creator brand"
        />

        {/* OTP */}
        <View className="mt-16 items-center">
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <OtpInput value={field.value} onChangeText={field.onChange} />
            )}
          />

          <Text className="mt-3 text-center font-base text-muted-foreground">
            Don’t have a code? Ask the creator to invite you.
          </Text>
        </View>

        {/* Actions */}
        <View className="mt-auto mb-10 flex-row items-center gap-4">
          <Button variant="outline" size="iconLg" onPress={openScan}>
            <QrCode size={24} />
          </Button>

          <Button size="lg" className="flex-1" onPress={handleSubmit(onSubmit)}>
            <Text>Join as Worker</Text>
          </Button>
        </View>

        {/* QR Scan Modal */}
        <Modal
          visible={scanOpen}
          animationType="slide"
          onRequestClose={closeScan}
        >
          <View className="flex-1 bg-black">
            {!permission?.granted ? (
              <View className="flex-1 items-center justify-center px-6">
                <Text className="text-white text-center mb-4">
                  {permissionText}
                </Text>
                <Button onPress={requestPermission}>
                  <Text>Grant Permission</Text>
                </Button>
                <View className="h-3" />
                <Button variant="outline" onPress={closeScan}>
                  <Text>Cancel</Text>
                </Button>
              </View>
            ) : (
              <View className="flex-1">
                <CameraView
                  style={{ flex: 1 }}
                  facing="back"
                  onBarcodeScanned={scanned ? undefined : onBarcodeScanned}
                  barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                />

                {/* Simple overlay */}
                <View className="absolute inset-x-0 bottom-0 px-6 pb-10">
                  <View className="rounded-2xl bg-black/60 px-4 py-3">
                    <Text className="text-white text-center">
                      Align the QR code inside the frame to fill the invite
                      code.
                    </Text>
                  </View>
                  <View className=" flex-row items-center justify-between px-4 pt-14 pb-3">
                    <Text className="text-white font-lg">Scan QR</Text>
                    <Pressable
                      onPress={closeScan}
                      className="h-10 w-10 items-center justify-center"
                    >
                      <X color="white" size={24} />
                    </Pressable>
                  </View>
                </View>

                {/* Faux frame */}
                <View className="absolute inset-0 items-center justify-center">
                  <View className="h-64 w-64 rounded-3xl border-2 border-white/80" />
                </View>
              </View>
            )}
          </View>
        </Modal>
      </View>
    </KeyboardAvoid>
  );
}

export default InviteCodeScreen;
