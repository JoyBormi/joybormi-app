import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import {
  mockBrand,
  mockServices,
  mockWorkers,
} from '@/views/brand/data/mock-brand';
import {
  BookingCalendar,
  ServiceSummaryCard,
  TimeSlotGrid,
} from '@/views/reservation';

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

  const handleBack = () => {
    router.back();
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) return;

    // Navigate to success screen with data
    router.push({
      pathname: '/booking/success',
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

  return (
    <SafeAreaView className="safe-area">
      {/* Header */}
      <View className="px-4 py-3 flex-row items-center border-b border-border/50 bg-background">
        <Pressable onPress={handleBack} className="p-2 -ml-2">
          <Icons.ChevronLeft size={24} className="text-foreground" />
        </Pressable>
        <Text className="flex-1 text-center font-title text-lg mr-8">
          Book Service
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="p-4 gap-6"
      >
        {/* Service Summary */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
        >
          <ServiceSummaryCard service={service} brand={brand} worker={worker} />
        </MotiView>

        {/* Calendar Selection */}
        <View className="gap-3">
          <Text className="font-subtitle text-base">Select Date</Text>
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
            <Text className="font-subtitle text-base">Select Time</Text>
            <TimeSlotGrid
              slots={timeSlots}
              selectedSlot={selectedTime}
              onSlotSelect={setSelectedTime}
            />
          </MotiView>
        )}

        {/* Note for Worker */}
        <View className="gap-3 mb-6">
          <Text className="font-subtitle text-base">Add a note (optional)</Text>
          <View className="bg-card rounded-2xl p-4 border border-border/50">
            <TextInput
              placeholder="Tell us about special requests..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              value={note}
              onChangeText={setNote}
              className="text-foreground font-body text-sm"
              style={{ textAlignVertical: 'top', height: 100 }}
              maxLength={200}
            />
            <Text className="text-right text-xs text-muted-foreground mt-2">
              {note.length}/200
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer / Submit Button */}
      <View className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-xl">
        <Button
          onPress={handleBooking}
          disabled={isSubmitDisabled}
          className={`${isSubmitDisabled ? 'bg-muted' : 'bg-primary'}`}
          size="lg"
        >
          <Text
            className={`font-subtitle text-base ${
              isSubmitDisabled
                ? 'text-muted-foreground'
                : 'text-primary-foreground'
            }`}
          >
            Confirm Booking
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default BookingScreen;
