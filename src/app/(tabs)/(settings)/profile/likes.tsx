import React, { useMemo } from 'react';
import { Image, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Icons from '@/components/icons';
import { Header } from '@/components/shared/header';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Text,
} from '@/components/ui';
import { placeholder } from '@/constants/images';

export default function LikesScreen() {
  const insets = useSafeAreaInsets();
  const likedBrands = useMemo(
    () => [
      {
        id: 'brand-1',
        name: 'Luxe Glow Studio',
        category: 'Beauty & Wellness',
        location: 'Austin, TX',
        image: placeholder.banner,
      },
      {
        id: 'brand-2',
        name: 'Blend & Bloom',
        category: 'Hair & Makeup',
        location: 'Miami, FL',
        image: placeholder.banner,
      },
    ],
    [],
  );

  const likedWorkers = useMemo(
    () => [
      {
        id: 'worker-1',
        name: 'Arianna J.',
        role: 'Senior Stylist',
        rating: 4.9,
        image: placeholder.avatar,
      },
      {
        id: 'worker-2',
        name: 'Kofi M.',
        role: 'Massage Therapist',
        rating: 4.8,
        image: placeholder.avatar,
      },
    ],
    [],
  );

  return (
    <View className="main-area" style={{ paddingTop: insets.top }}>
      <Header
        title="Liked items"
        subtitle="Quick access to the brands and workers you love."
        animate={false}
        className="px-2"
        variant="row"
      />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View className="px-5">
          <Tabs defaultValue="brands">
            <TabsList className="mb-4">
              <TabsTrigger value="brands">
                <Text className="font-subtitle">Brands</Text>
              </TabsTrigger>
              <TabsTrigger value="workers">
                <Text className="font-subtitle">Workers</Text>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="brands">
              <View className="gap-3">
                {likedBrands.map((brand) => (
                  <View
                    key={brand.id}
                    className="rounded-2xl border border-border/50 bg-card/60 p-4"
                  >
                    <View className="flex-row items-center gap-4">
                      <Image
                        source={brand.image}
                        className="h-16 w-16 rounded-2xl"
                      />
                      <View className="flex-1">
                        <Text className="font-subtitle text-foreground">
                          {brand.name}
                        </Text>
                        <Text className="text-xs text-muted-foreground mt-1">
                          {brand.category}
                        </Text>
                        <View className="flex-row items-center gap-2 mt-2">
                          <Icons.MapPin
                            size={14}
                            className="text-muted-foreground"
                          />
                          <Text className="text-xs text-muted-foreground">
                            {brand.location}
                          </Text>
                        </View>
                      </View>
                      <Icons.Heart size={18} className="text-red-500" />
                    </View>
                  </View>
                ))}
              </View>
            </TabsContent>

            <TabsContent value="workers">
              <View className="gap-3">
                {likedWorkers.map((worker) => (
                  <View
                    key={worker.id}
                    className="rounded-2xl border border-border/50 bg-card/60 p-4"
                  >
                    <View className="flex-row items-center gap-4">
                      <Image
                        source={worker.image}
                        className="h-14 w-14 rounded-2xl"
                      />
                      <View className="flex-1">
                        <Text className="font-subtitle text-foreground">
                          {worker.name}
                        </Text>
                        <Text className="text-xs text-muted-foreground mt-1">
                          {worker.role}
                        </Text>
                        <View className="flex-row items-center gap-1 mt-2">
                          <Icons.Star
                            size={14}
                            className="text-warning"
                            fill="#f59e0b"
                          />
                          <Text className="text-xs text-muted-foreground">
                            {worker.rating} rating
                          </Text>
                        </View>
                      </View>
                      <Icons.Heart size={18} className="text-red-500" />
                    </View>
                  </View>
                ))}
              </View>
            </TabsContent>
          </Tabs>
        </View>
      </ScrollView>
    </View>
  );
}
