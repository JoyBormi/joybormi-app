import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React, { forwardRef, useEffect } from 'react';
import { Pressable, Text, View } from 'react-native';

import { DetachedSheet } from '@/components/bottom-sheet';
import Icons from '@/components/icons';
import { useUserLocation } from '@/hooks/common/use-location';
import { usePreferencesStore } from '@/stores/use-preferences';

const LOCATIONS = ['Tashkent', 'Bukhara', 'Samarkand'];

export const LocationPickerSheet = forwardRef<BottomSheetModal>((_, ref) => {
  const { location: autoLocation } = useUserLocation();
  const { location, setLocation } = usePreferencesStore();

  // auto set location if user is in supported locations
  useEffect(() => {
    if (autoLocation && LOCATIONS.includes(autoLocation)) {
      setLocation(autoLocation);
    }
  }, [autoLocation, setLocation]);
  return (
    <DetachedSheet
      ref={ref}
      enablePanDownToClose={!location}
      enableDismissOnClose={!location}
      enableContentPanningGesture={!location}
      grabbable={false}
      backdropConfig={{
        pressBehavior: 'none',
        appearsOnIndex: 1,
      }}
    >
      <View className="py-6 gap-5">
        <View className="items-center gap-2">
          <View className="w-12 h-12 rounded-full bg-primary/15 items-center justify-center">
            <Icons.MapPin className="w-6 h-6 text-primary" />
          </View>
          <Text className="text-foreground font-heading">Choose your city</Text>
          <Text className="font-caption text-muted-foreground text-center">
            We currently support only these locations
          </Text>
          <Text className="font-xs text-muted-foreground/80 text-center">
            Your current location is {autoLocation ?? 'Unknown'}
          </Text>
        </View>

        <View className="gap-3">
          {LOCATIONS.map((loc) => {
            const selected = location === loc;

            return (
              <Pressable
                key={loc}
                onPress={() => {
                  setLocation(loc);
                  if (ref && 'current' in ref) {
                    ref.current?.dismiss();
                  }
                }}
                className={`p-4 rounded-2xl border-2 flex-row items-center justify-between ${
                  selected
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                }`}
              >
                <Text className="font-subtitle text-foreground">{loc}</Text>

                {selected && (
                  <Icons.CheckCircle className="w-6 h-6 text-primary" />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>
    </DetachedSheet>
  );
});

LocationPickerSheet.displayName = 'LocationPickerSheet';
