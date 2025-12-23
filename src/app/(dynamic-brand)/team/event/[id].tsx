import { Button, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MotiText } from 'moti';
import { useState } from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const images = [
  'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=800&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
];

export default function ProfessionalDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(images[0]);

  return (
    <View
      className="flex-1"
      style={{
        paddingTop: Platform.OS === 'ios' ? insets.top - 5 : insets.top + 10,
      }}
    >
      <ImageBackground
        source={{ uri: selected }}
        className="absolute inset-0"
        resizeMode="cover"
      />

      {/* Overlay gradient or dim */}
      <View className="absolute inset-0 bg-black/5" />

      {/* Top section */}
      <View className="flex-row items-center justify-start px-6 flex w-full">
        <Pressable onPress={() => router.back()} className="p-1 z-50">
          <Icons.ArrowLeft size={24} className="text-black mr-6" />
        </Pressable>
        <View className="flex-row items-center gap-x-1 flex-1">
          <Image
            source={{ uri: selected }}
            className="w-8 h-8 rounded-full object-cover"
          />
          <Text className="font-subtitle">Barber Shop</Text>
        </View>
      </View>

      {/* Left vertical carousel */}
      <View className="pl-4 pt-10 max-h-96">
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16 }}
          bounces={false}
        >
          {images.map((img, idx) => (
            <Pressable
              key={idx}
              onPress={() => setSelected(img)}
              className="mb-3"
            >
              <Image
                source={{ uri: img }}
                className={cn(
                  'w-16 h-16 rounded-xl border-2 border-white',
                  selected === img ? 'border-white' : 'border-transparent',
                )}
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Bottom description */}
      <View className="absolute bottom-0 left-0 right-0">
        <BlurView
          intensity={4}
          tint="systemUltraThinMaterialDark"
          className="p-4 rounded-t-xl"
        >
          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 100 }}
            className="font-title text-white mb-1"
          >
            Barber Beauty Salon
          </MotiText>
          <MotiText
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
            className="text-white/90 font-caption"
            numberOfLines={8}
          >
            Book your grooming session in a stylish, professional setting.
            Premium barbers and hair stylists at your service. Book your
            grooming session in a stylish, professional setting. Premium barbers
            and hair stylists at your service. Book your grooming session in a
            stylish, professional setting. Premium barbers and hair stylists at
            your service. Book your grooming session in a stylish, professional
            setting. Premium barbers and hair stylists at your service. Book
            your grooming session in a stylish, professional setting. Premium
            barbers and hair stylists at your service. your service. Book your
            grooming session in a stylish, professional setting. Premium barbers
            and hair stylists at your service. Book your grooming session in a
            stylish, professional setting. Premium barbers and hair stylists at
            your service. your service. Book your grooming session in a stylish,
            professional setting. Premium barbers and hair stylists at your
            service. Book your grooming session in a stylish, professional
            setting. Premium barbers and hair stylists at your service. your
            service. Book your grooming session in a stylish, professional
            setting. Premium barbers and hair stylists at your service. Book
            your grooming session in a stylish, professional setting. Premium
            barbers and hair stylists at your service.
          </MotiText>
        </BlurView>
        <Button
          style={{ marginBottom: insets.bottom }}
          className="rounded-none mt-4"
        >
          <Text>Book Your Seat</Text>
        </Button>
      </View>
    </View>
  );
}
