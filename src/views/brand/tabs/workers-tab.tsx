import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { IBrandWorker } from '@/types/brand.type';
import { router } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WorkersTabProps {
  workers: IBrandWorker[];
  onWorkerPress?: (worker: IBrandWorker) => void;
  canEdit?: boolean;
  onAddWorker?: () => void;
}

export const WorkersTab: React.FC<WorkersTabProps> = ({
  workers,
  onWorkerPress,
}) => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 px-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: insets.bottom + 10 }}
    >
      {workers.map((worker, index) => (
        <MotiView
          key={worker.id}
          from={{ opacity: 0, translateX: -20 }}
          animate={{ opacity: 1, translateX: 0 }}
          transition={{ type: 'timing', duration: 400, delay: index * 100 }}
        >
          <Pressable
            onPress={() =>
              router.push(`/(dynamic-brand)/team/worker/${worker.id}`)
            }
            className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50 mb-3"
          >
            <View className="flex-row gap-3">
              {/* Avatar */}
              <View className="relative">
                <Image
                  source={{ uri: worker.avatar }}
                  className="w-20 h-20 rounded-2xl border-2 border-border"
                  resizeMode="cover"
                />
                <View
                  className={`absolute bottom-0 right-0 w-5 h-5 rounded-full border-2 border-card ${worker.isAvailable ? 'bg-success' : 'bg-muted'}`}
                />
              </View>

              {/* Worker Info */}
              <View className="flex-1">
                <Text className="font-subtitle text-foreground mb-1">
                  {worker.name}
                </Text>
                <Text className="font-caption text-muted-foreground mb-2">
                  {worker.role}
                </Text>

                {/* Rating & Experience */}
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="flex-row items-center gap-1">
                    <Icons.Star
                      size={14}
                      className="text-warning fill-warning"
                    />
                    <Text className="font-caption text-foreground font-medium">
                      {worker.rating.toFixed(1)}
                    </Text>
                    <Text className="font-caption text-muted-foreground">
                      ({worker.reviewCount})
                    </Text>
                  </View>
                  <View className="bg-primary/10 px-2 py-0.5 rounded-full">
                    <Text className="font-caption text-primary text-xs">
                      {worker.yearsOfExperience} years
                    </Text>
                  </View>
                </View>

                {/* Specialties */}
                <View className="flex-row flex-wrap gap-1">
                  {worker.specialties.slice(0, 3).map((specialty, idx) => (
                    <View
                      key={idx}
                      className="bg-muted/50 px-2 py-0.5 rounded-full"
                    >
                      <Text className="font-caption text-muted-foreground text-xs">
                        {specialty}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              {/* Book Button */}
              <Pressable className="bg-primary px-4 py-2 rounded-full self-center">
                <Text className="font-caption text-primary-foreground">
                  Book
                </Text>
              </Pressable>
            </View>

            {/* Bio */}
            {worker.bio && (
              <Text className="font-body text-muted-foreground mt-3 pt-3 border-t border-border/50">
                {worker.bio}
              </Text>
            )}
          </Pressable>
        </MotiView>
      ))}
    </ScrollView>
  );
};
