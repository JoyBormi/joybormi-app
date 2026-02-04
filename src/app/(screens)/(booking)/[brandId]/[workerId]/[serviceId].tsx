import dayjs from 'dayjs';
import {
  RelativePathString,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Header } from '@/components/shared/header';
import { Button, Text } from '@/components/ui';
import { routes } from '@/constants/routes';
import { useColorScheme } from '@/hooks/common';
import { cn } from '@/lib/utils';
import {
  mockBrand,
  mockServices,
  mockWorkers,
} from '@/views/brand/data/mock-brand';
import { BookingCalendar, TimeSlotGrid } from '@/views/reservation';

const BookingScreen: React.FC = () => {
  const router = useRouter();
  const { brandId, workerId, serviceId } = useLocalSearchParams<{
    brandId: string;
    workerId: string;
    serviceId: string;
  }>();

  const [selectedDate, setSelectedDate] = useState<string>(
    dayjs().format('YYYY-MM-DD'),
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const { colors } = useColorScheme();

  // Find data from mocks (In production, fetch from API)
  const brand = mockBrand;
  const service =
    mockServices.find((s) => s.id === serviceId) || mockServices[0];
  const worker = mockWorkers.find((w) => w.id === workerId) || mockWorkers[0];

  // Dummy time slots based on selected date
  const timeSlots = useMemo(() => {
    return [
      '09:00',
      '10:00',
      '11:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
    ];
  }, []);

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;

    // Navigate to success screen with data
    router.push({
      pathname: routes.booking.success as RelativePathString,
      params: {
        serviceName: service.name,
        date: selectedDate,
        time: selectedTime,
        workerName: worker.name,
        brandName: brand.brandName,
        price: `${service.price} ${service.currency}`,
      },
    });
  };

  const isSubmitDisabled = !selectedDate || !selectedTime;
  const summaryLabel = selectedTime
    ? `${dayjs(selectedDate).format('ddd, MMM D')} · ${selectedTime}`
    : 'Select a date and time';

  return (
    <SafeAreaView className="safe-area">
      {/* Header */}

      <Header
        title="Reservation"
        subtitle={brand.brandName ?? 'Brand Name'}
        variant="row"
        className="px-3 pt-4"
      />

      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerClassName="px-5 pb-10 gap-8 pt-5s"
        >
          {/* Service Summary */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
          >
            <View className="rounded-3xl bg-card/70 border border-border/40 p-4">
              <View className="flex-row items-center gap-4">
                {service.image ? (
                  <Image
                    source={{ uri: service.image }}
                    className="w-16 h-16 rounded-2xl"
                  />
                ) : (
                  <View className="w-16 h-16 rounded-2xl bg-muted items-center justify-center">
                    <Icons.Scissors
                      size={26}
                      className="text-muted-foreground"
                    />
                  </View>
                )}
                <View className="flex-1">
                  <Text className="font-title">{service.name}</Text>
                  <Text className="font-subbody text-muted-foreground mt-1">
                    {service.duration} mins · {service.price} {service.currency}
                  </Text>
                </View>
              </View>

              <View className="h-[1px] bg-border/40 my-4" />

              <View className="flex-row items-center justify-between gap-3">
                <View>
                  <Text className="font-subtitle">{worker.name}</Text>
                  <Text className="font-subbody text-muted-foreground">
                    {worker.role}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="font-subbody text-muted-foreground">
                    Location
                  </Text>
                  <Text className="font-subtitle text-right">{brand.city}</Text>
                </View>
              </View>
            </View>
          </MotiView>

          {/* Calendar Selection */}
          <View className="gap-4">
            <Text className="font-subtitle uppercase tracking-widest text-muted-foreground">
              Date
            </Text>
            <BookingCalendar
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime(null); // Reset time when date changes
              }}
            />
          </View>

          {/* Time Slot Selection */}
          {selectedDate && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="gap-3"
            >
              <Text className="font-subtitle uppercase tracking-widest text-muted-foreground">
                Time
              </Text>
              <TimeSlotGrid
                slots={timeSlots}
                selectedSlot={selectedTime}
                onSlotSelect={setSelectedTime}
              />
            </MotiView>
          )}

          {/* Note for Worker */}
          <View className="gap-3 mb-2">
            <Text className="font-subtitle uppercase tracking-widest text-muted-foreground">
              Notes
            </Text>
            <View className="bg-card/70 rounded-3xl p-4 border border-border/40">
              <TextInput
                placeholder="Tell us about special requests..."
                placeholderTextColor={colors.muted}
                multiline
                numberOfLines={4}
                value={note}
                onChangeText={setNote}
                className="text-foreground font-body text-sm"
                style={{ textAlignVertical: 'top', height: 100 }}
                maxLength={200}
              />
              <Text className="text-right font-base text-muted-foreground mt-2">
                {note.length}/200
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Footer / Submit Button */}
      <View className="px-5 py-4 border-t border-border/40 bg-background/90 backdrop-blur-xl">
        <View className="flex-row items-center justify-between gap-4">
          <View>
            <Text className="font-subbody text-muted-foreground">Total</Text>
            <Text className="font-title">
              {service.price} {service.currency}
            </Text>
            <Text className="font-subbody text-muted-foreground mt-1">
              {summaryLabel}
            </Text>
          </View>
          <Button
            onPress={handleBooking}
            disabled={isSubmitDisabled}
            className={`${isSubmitDisabled ? 'bg-muted' : 'bg-primary'}`}
            size="lg"
          >
            <Text
              className={cn(
                isSubmitDisabled
                  ? 'text-muted-foreground'
                  : 'text-primary-foreground',
              )}
            >
              Reserve
            </Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;
