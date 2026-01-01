import { MotiView } from 'moti';
import React from 'react';
import { Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { IBrand } from '@/types/brand.type';

interface AboutTabProps {
  brand: IBrand;
  canEdit?: boolean;
  onEdit?: () => void;
}

export const AboutTab: React.FC<AboutTabProps> = ({ brand }) => {
  const insets = useSafeAreaInsets();
  const handleCall = () => {
    Linking.openURL(`tel:${brand.contact.phone}`);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${brand.contact.email}`);
  };

  const handleWebsite = () => {
    if (brand.contact.website) {
      Linking.openURL(brand.contact.website);
    }
  };

  const handleDirections = () => {
    const { lat, lng } = brand.location.coordinates;
    Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
  };

  return (
    <ScrollView
      className="flex-1 px-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
    >
      {/* Description */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        className="mb-4"
      >
        <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
          <Text className="font-title text-foreground mb-2">About Us</Text>
          <Text className="font-body text-muted-foreground">
            {brand.description}
          </Text>
        </View>
      </MotiView>

      {/* Contact Information */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 100 }}
        className="mb-4"
      >
        <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
          <Text className="font-title text-foreground mb-3">Contact</Text>

          <Pressable
            onPress={handleCall}
            className="flex-row items-center gap-3 mb-3"
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Icons.Phone size={20} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-caption text-muted-foreground mb-0.5">
                Phone
              </Text>
              <Text className="font-body text-foreground">
                {brand.contact.phone}
              </Text>
            </View>
            <Icons.ChevronRight size={20} className="text-muted-foreground" />
          </Pressable>

          <Pressable
            onPress={handleEmail}
            className="flex-row items-center gap-3 mb-3"
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Icons.Mail size={20} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-caption text-muted-foreground mb-0.5">
                Email
              </Text>
              <Text className="font-body text-foreground">
                {brand.contact.email}
              </Text>
            </View>
            <Icons.ChevronRight size={20} className="text-muted-foreground" />
          </Pressable>

          {brand.contact.website && (
            <Pressable
              onPress={handleWebsite}
              className="flex-row items-center gap-3"
            >
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
                <Icons.Globe size={20} className="text-primary" />
              </View>
              <View className="flex-1">
                <Text className="font-caption text-muted-foreground mb-0.5">
                  Website
                </Text>
                <Text className="font-body text-foreground">
                  {brand.contact.website}
                </Text>
              </View>
              <Icons.ChevronRight size={20} className="text-muted-foreground" />
            </Pressable>
          )}
        </View>
      </MotiView>

      {/* Location */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 200 }}
        className="mb-4"
      >
        <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
          <Text className="font-title text-foreground mb-3">Location</Text>

          <Pressable
            onPress={handleDirections}
            className="flex-row items-center gap-3"
          >
            <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center">
              <Icons.MapPin size={20} className="text-primary" />
            </View>
            <View className="flex-1">
              <Text className="font-body text-foreground mb-0.5">
                {brand.location.address}
              </Text>
              <Text className="font-caption text-muted-foreground">
                {brand.location.city}
              </Text>
            </View>
            <Icons.ChevronRight size={20} className="text-muted-foreground" />
          </Pressable>
        </View>
      </MotiView>

      {/* Working Hours */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 300 }}
        className="mb-4"
      >
        <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
          <Text className="font-title text-foreground mb-3">Working Hours</Text>

          {brand.workingHours.map((hours, index) => (
            <View
              key={index}
              className="flex-row justify-between items-center mb-2"
            >
              <Text className="font-body text-foreground">{hours.day}</Text>
              {hours.isOpen ? (
                <Text className="font-body text-muted-foreground">
                  {hours.openTime} - {hours.closeTime}
                </Text>
              ) : (
                <Text className="font-body text-destructive">Closed</Text>
              )}
            </View>
          ))}
        </View>
      </MotiView>
    </ScrollView>
  );
};
