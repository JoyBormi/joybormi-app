import { useColorScheme } from '@/hooks/common';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import { Image } from 'expo-image';
import React, { forwardRef, useCallback, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Reservation } from './types';

interface Props {
  reservation: Reservation | null;
  onClose: () => void;
}

export const ReservationBottomSheet = forwardRef<BottomSheetModal, Props>(
  ({ reservation, onClose }, ref) => {
    const { colors } = useColorScheme();
    const snapPoints = useMemo(() => ['45%'], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsAt={-1}
          appearsAt={0}
          opacity={0.5}
        />
      ),
      [],
    );

    if (!reservation) return null;

    return (
      <BottomSheetModal
        ref={ref}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.card }}
        handleIndicatorStyle={{ backgroundColor: colors.border, width: 40 }}
        onDismiss={onClose}
      >
        <BottomSheetView className="flex-1 p-8">
          <View>
            <View className="flex-row items-center mb-8">
              <Image
                source={{ uri: reservation.avatar }}
                className="w-20 h-20 rounded-3xl bg-muted shadow-sm"
              />
              <View className="ml-5 flex-1">
                <Text className="text-2xl text-foreground tracking-tight font-bold">
                  {reservation.name}
                </Text>
                <Text className="text-[17px] text-muted-foreground mt-1 font-medium">
                  {reservation.service}
                </Text>
              </View>
            </View>

            <View className="space-y-6">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 rounded-2xl bg-primary/10 items-center justify-center">
                  <Icons.Clock className="text-primary w-6 h-6" />
                </View>
                <View>
                  <Text className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    Appointment Time
                  </Text>
                  <Text className="text-[17px] text-foreground mt-0.5 font-bold">
                    {dayjs(reservation.start).format('MMMM D, YYYY')} •{' '}
                    {dayjs(reservation.start).format('h:mm A')}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-4 mt-6">
                <View className="w-12 h-12 rounded-2xl bg-green-500/10 items-center justify-center">
                  <Icons.CheckCircle className="text-green-500 w-6 h-6" />
                </View>
                <View>
                  <Text className="text-xs text-muted-foreground uppercase tracking-wider font-bold">
                    Current Status
                  </Text>
                  <Text className="text-[17px] text-foreground mt-0.5 capitalize font-bold">
                    {reservation.status}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-4 mt-10">
              <TouchableOpacity
                activeOpacity={0.8}
                className="flex-1 bg-primary h-16 rounded-2xl items-center justify-center shadow-lg shadow-primary/20"
                onPress={() => {
                  Feedback.success();
                  onClose();
                }}
              >
                <Text className="text-primary-foreground font-bold text-[17px]">
                  Confirm Booking
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                className="bg-muted h-16 px-6 rounded-2xl items-center justify-center"
                onPress={() => {
                  Feedback.medium();
                  onClose();
                }}
              >
                <Icons.X className="text-foreground w-6 h-6" />
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    );
  },
);
ReservationBottomSheet.displayName = 'ReservationBottomSheet';
