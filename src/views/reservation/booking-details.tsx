import CustomBottomSheet from '@/components/shared/bottom-sheet';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import dayjs from 'dayjs';
import React, { forwardRef, useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Reservation, ReservationStatus } from './types';

interface ReservationBottomSheetProps {
  reservation: Reservation | null;
  onClose: () => void;
}

const getStatusConfig = (
  status: ReservationStatus,
): {
  icon: React.ComponentType<{ className?: string }>;
  bgColor: string;
  textColor: string;
  label: string;
} => {
  switch (status) {
    case 'approved':
      return {
        icon: Icons.CheckCircle,
        bgColor: 'bg-success/10 dark:bg-success/20',
        textColor: 'text-success',
        label: 'Approved',
      };
    case 'pending':
      return {
        icon: Icons.Clock,
        bgColor: 'bg-warning/10 dark:bg-warning/20',
        textColor: 'text-warning',
        label: 'Pending',
      };
    case 'rejected':
      return {
        icon: Icons.X,
        bgColor: 'bg-destructive/10 dark:bg-destructive/20',
        textColor: 'text-destructive',
        label: 'Rejected',
      };
    case 'cancelled':
      return {
        icon: Icons.X,
        bgColor: 'bg-muted/50',
        textColor: 'text-muted-foreground',
        label: 'Cancelled',
      };
    case 'confirmed':
      return {
        icon: Icons.CheckCircle,
        bgColor: 'bg-primary/10 dark:bg-primary/20',
        textColor: 'text-primary',
        label: 'Confirmed',
      };
    case 'completed':
      return {
        icon: Icons.CheckCircle,
        bgColor: 'bg-success/10 dark:bg-success/20',
        textColor: 'text-success',
        label: 'Completed',
      };
  }
};

export const ReservationBottomSheet = forwardRef<
  BottomSheetModal,
  ReservationBottomSheetProps
>(({ reservation, onClose }, ref) => {
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
    <CustomBottomSheet ref={ref} snapPoints={['75%', '90%']} index={0}>
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
              <View
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
              <Icons.Briefcase className="text-primary w-5 h-5" />
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
              <Icons.Calendar className="text-primary w-5 h-5" />
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
              <TouchableOpacity
                activeOpacity={0.7}
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
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
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
              </TouchableOpacity>
            </>
          )}
          {(reservation.status === 'approved' ||
            reservation.status === 'confirmed') && (
            <TouchableOpacity
              activeOpacity={0.7}
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
            </TouchableOpacity>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            className="bg-card/50 h-14 px-5 rounded-2xl items-center justify-center"
            onPress={() => {
              Feedback.light();
              onClose();
            }}
          >
            <Icons.X className="text-foreground w-5 h-5" />
          </TouchableOpacity>
        </View>
      </View>
    </CustomBottomSheet>
  );
});

ReservationBottomSheet.displayName = 'ReservationBottomSheet';
