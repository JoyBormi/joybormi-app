import dayjs from 'dayjs';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';
import { routes } from '@/constants/routes';

const SuccessScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{
    serviceName: string;
    date: string;
    time: string;
    workerName: string;
    brandName: string;
    price: string;
  }>();

  const handleGoHome = () => {
    router.replace(routes.tabs.home);
  };

  const handleViewReservation = () => {
    router.replace(routes.tabs.reservations);
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-6 items-center justify-center pt-20"
      >
        {/* Success Icon */}
        <MotiView
          from={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          className="w-24 h-24 rounded-full bg-success/10 items-center justify-center mb-6"
        >
          <Icons.CheckCircle size={48} className="text-success" />
        </MotiView>

        {/* Success Message */}
        <MotiView
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400 }}
          className="items-center mb-8"
        >
          <Text className="font-title text-2xl text-center mb-2">
            Booking Confirmed!
          </Text>
          <Text className="font-body text-base text-muted-foreground text-center">
            Your appointment has been successfully scheduled.
          </Text>
        </MotiView>

        {/* Reservation Details Card */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600 }}
          className="w-full bg-card rounded-3xl p-6 border border-border/50 shadow-sm mb-10"
        >
          <View className="gap-4">
            <View className="flex-row justify-between border-b border-border/50 pb-4">
              <Text className="text-muted-foreground font-subtitle">
                Service
              </Text>
              <Text className="font-subtitle">{params.serviceName}</Text>
            </View>

            <View className="flex-row justify-between border-b border-border/50 pb-4">
              <Text className="text-muted-foreground font-subtitle">
                Date & Time
              </Text>
              <View className="items-end">
                <Text className="font-subtitle">
                  {dayjs(params.date).format('MMM DD, YYYY')}
                </Text>
                <Text className="text-muted-foreground font-caption">
                  at {params.time}
                </Text>
              </View>
            </View>

            <View className="flex-row justify-between border-b border-border/50 pb-4">
              <Text className="text-muted-foreground font-subtitle">
                Worker
              </Text>
              <Text className="font-subtitle">{params.workerName}</Text>
            </View>

            <View className="flex-row justify-between border-b border-border/50 pb-4">
              <Text className="text-muted-foreground font-subtitle">Brand</Text>
              <Text className="font-subtitle">{params.brandName}</Text>
            </View>

            <View className="flex-row justify-between">
              <Text className="text-muted-foreground font-subtitle">
                Total Price
              </Text>
              <Text className="font-title text-lg text-primary">
                {params.price}
              </Text>
            </View>
          </View>
        </MotiView>

        {/* Actions */}
        <MotiView
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 800 }}
          className="w-full gap-3 mt-auto"
        >
          <Button
            onPress={handleViewReservation}
            className="bg-primary"
            size="lg"
          >
            <Text className="text-primary-foreground font-subtitle">
              View My Reservations
            </Text>
          </Button>
          <Button
            onPress={handleGoHome}
            variant="ghost"
            className="border border-border/50"
            size="lg"
          >
            <Text className="font-subtitle">Go to Home</Text>
          </Button>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuccessScreen;
