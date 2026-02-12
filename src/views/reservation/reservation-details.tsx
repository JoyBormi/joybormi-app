import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { forwardRef, Fragment, useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { CustomBottomSheet } from '@/components/bottom-sheet';
import Icons from '@/components/icons';
import { ColorPickerModal } from '@/components/modals/color-picker-modal';
import { Feedback } from '@/lib/haptics';

import { getStatusConfig } from './reservation.utils';
import { Reservation } from './types';

interface ReservationBottomSheetProps {
  reservation: Reservation | null;
  onClose: () => void;
}

export const ReservationBottomSheet = forwardRef<
  BottomSheetModal,
  ReservationBottomSheetProps
>(({ reservation, onClose }, ref) => {
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const statusConfig = useMemo(
    () => (reservation ? getStatusConfig(reservation.status) : null),
    [reservation],
  );

  const duration = useMemo(() => {
    if (!reservation) return '';
    const start = dayjs(reservation.start_time);
    const end = dayjs(reservation.end_time);
    const diff = end.diff(start, 'minute');
    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;
    if (hours > 0 && minutes > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${minutes}m`;
    }
  }, [reservation]);

  if (!reservation || !statusConfig) return null;

  const StatusIcon = statusConfig.icon;

  return (
    <Fragment>
      <CustomBottomSheet
        ref={ref}
        snapPoints={['75%', '85%', '90%']}
        index={0}
        enablePanDownToClose
        enableDismissOnClose
        scrollEnabled
        scrollConfig={{ className: 'flex-1' }}
      >
        <View className="gap-5 pb-6">
          {/* Header with Title and Brand */}
          <View className="gap-2">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-2xl text-foreground font-heading tracking-tight">
                  {reservation.title}
                </Text>
                <Text className="text-sm text-muted-foreground mt-1 font-body">
                  {reservation.brand_name}
                </Text>
              </View>
              {reservation.color && (
                <Pressable
                  onPress={() => setColorPickerVisible(true)}
                  className="w-10 h-10 rounded-xl"
                  style={{ backgroundColor: reservation.color }}
                />
              )}
            </View>
            {reservation.summary && (
              <Text className="text-sm text-muted-foreground font-body mt-1">
                {reservation.summary}
              </Text>
            )}
          </View>

          {/* Info Cards */}
          <View className="gap-3">
            {/* Service & Worker */}
            <View className="flex-row items-center gap-3 py-4 rounded-2xl bg-card/30 backdrop-blur-sm">
              <View className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 items-center justify-center">
                <Icons.Briefcase className="text-foreground w-5 h-5" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground font-caption uppercase tracking-wider">
                  Service & Provider
                </Text>
                <Text className="text-base text-foreground mt-0.5 font-subtitle">
                  {reservation.service}
                </Text>
                <Text className="text-sm text-muted-foreground mt-0.5 font-body">
                  with {reservation.worker_name}
                </Text>
              </View>
            </View>

            {/* Date & Time */}
            <View className="flex-row items-center gap-3 py-4  rounded-2xl bg-card/30 backdrop-blur-sm">
              <View className="w-11 h-11 rounded-xl bg-primary/10 dark:bg-primary/20 items-center justify-center">
                <Icons.Calendar className="text-foreground w-5 h-5" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground font-caption uppercase tracking-wider">
                  Date & Time
                </Text>
                <Text className="text-base text-foreground mt-0.5 font-subtitle">
                  {dayjs(reservation.start_time).format('MMMM D, YYYY')}
                </Text>
                <Text className="text-sm text-muted-foreground mt-0.5 font-body">
                  {dayjs(reservation.start_time).format('h:mm A')} -{' '}
                  {dayjs(reservation.end_time).format('h:mm A')} ({duration})
                </Text>
              </View>
            </View>

            {/* Status */}
            <View className="flex-row items-center gap-3 py-4  rounded-2xl bg-card/30 backdrop-blur-sm">
              <View
                className={`w-11 h-11 rounded-xl items-center justify-center ${statusConfig.bgColor}`}
              >
                <StatusIcon className={`${statusConfig.textColor} w-5 h-5`} />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground font-caption uppercase tracking-wider">
                  Status
                </Text>
                <Text
                  className={`text-base mt-0.5 font-subtitle ${statusConfig.textColor}`}
                >
                  {statusConfig.label}
                </Text>
              </View>
            </View>

            {/* UUID */}
            <View className="flex-row items-center gap-3 py-4  rounded-2xl bg-card/30 backdrop-blur-sm">
              <View className="w-11 h-11 rounded-xl bg-muted/50 items-center justify-center">
                <Icons.Info className="text-muted-foreground w-5 h-5" />
              </View>
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground font-caption uppercase tracking-wider">
                  Booking ID
                </Text>
                <Text className="text-sm text-muted-foreground mt-0.5 font-mono">
                  {reservation.uuid.slice(0, 8)}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row gap-3 mt-2">
            {reservation.status === 'pending' && (
              <>
                <Pressable
                  className="flex-1 bg-success h-14 rounded-2xl items-center justify-center"
                  onPress={() => {
                    Feedback.success();
                    // Handle approve
                    onClose();
                  }}
                >
                  <Text className="text-white font-subtitle text-base">
                    Approve
                  </Text>
                </Pressable>
                <Pressable
                  className="flex-1 bg-destructive h-14 rounded-2xl items-center justify-center"
                  onPress={() => {
                    Feedback.medium();
                    // Handle reject
                    onClose();
                  }}
                >
                  <Text className="text-white font-subtitle text-base">
                    Reject
                  </Text>
                </Pressable>
              </>
            )}
            {(reservation.status === 'approved' ||
              reservation.status === 'confirmed') && (
              <Pressable
                className="flex-1 bg-primary h-14 rounded-2xl items-center justify-center"
                onPress={() => {
                  Feedback.success();
                  // Handle edit or details
                  onClose();
                }}
              >
                <Text className="text-primary-foreground font-subtitle text-base">
                  View Details
                </Text>
              </Pressable>
            )}
            <Pressable
              hitSlop={20}
              className="bg-card/50 h-14 rounded-2xl items-center justify-center"
              onPress={() => {
                Feedback.light();
                onClose();
              }}
            >
              <Icons.X
                className="text-foreground stroke-foreground w-5 h-5"
                strokeWidth="3"
              />
            </Pressable>
          </View>
        </View>
      </CustomBottomSheet>
      <ColorPickerModal
        visible={colorPickerVisible}
        onClose={() => setColorPickerVisible(false)}
        onSelectColor={() => {}}
      />
    </Fragment>
  );
});

ReservationBottomSheet.displayName = 'ReservationBottomSheet';
