import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import {
  IBrand,
  IBrandPhoto,
  IBrandService,
  IBrandWorker,
} from '@/types/brand.type';
import { MotiView } from 'moti';
import React from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { PhotoGrid } from '../components/photo-grid';
import { ServiceCard } from '../components/service-card';
import { WorkerCard } from '../components/worker-card';

interface HomeTabProps {
  brand: IBrand;
  services: IBrandService[];
  workers: IBrandWorker[];
  photos: IBrandPhoto[];
  onServicePress?: (service: IBrandService) => void;
  onWorkerPress?: (worker: IBrandWorker) => void;
  onPhotoPress?: (photo: IBrandPhoto, index: number) => void;
  onViewAllServices?: () => void;
  onViewAllWorkers?: () => void;
  onViewAllPhotos?: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  brand,
  services,
  workers,
  photos,
  onServicePress,
  onWorkerPress,
  onPhotoPress,
  onViewAllServices,
  onViewAllWorkers,
  onViewAllPhotos,
}) => {
  const popularServices = services.filter((s) => s.popular).slice(0, 3);
  const topWorkers = workers.slice(0, 3);
  const recentPhotos = photos.slice(0, 6);

  return (
    <View className="flex-1">
      {/* About Section */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        className="px-4 mb-4"
      >
        <View className="bg-card/30 backdrop-blur-sm rounded-2xl p-4 border border-border/50">
          <Text className="font-title text-foreground mb-2">About</Text>
          <Text className="font-body text-muted-foreground mb-3">
            {brand.description}
          </Text>

          {/* Tags */}
          <View className="flex-row flex-wrap gap-2">
            {brand.tags.map((tag, index) => (
              <View
                key={index}
                className="bg-primary/10 px-3 py-1.5 rounded-full"
              >
                <Text className="font-caption text-primary">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      </MotiView>

      {/* Quick Actions */}
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400, delay: 100 }}
        className="px-4 mb-4"
      >
        <View className="flex-row gap-3">
          <Pressable className="flex-1 bg-primary/10 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 items-center">
            <Icons.Phone size={24} className="text-primary mb-2" />
            <Text className="font-caption text-primary">Call</Text>
          </Pressable>
          <Pressable className="flex-1 bg-primary/10 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 items-center">
            <Icons.MapPin size={24} className="text-primary mb-2" />
            <Text className="font-caption text-primary">Directions</Text>
          </Pressable>
          <Pressable className="flex-1 bg-primary/10 backdrop-blur-sm rounded-2xl p-4 border border-primary/20 items-center">
            <Icons.Share2 size={24} className="text-primary mb-2" />
            <Text className="font-caption text-primary">Share</Text>
          </Pressable>
        </View>
      </MotiView>

      {/* Popular Services */}
      {popularServices.length > 0 && (
        <View className="mb-4">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="font-title text-foreground">Popular Services</Text>
            <Pressable onPress={onViewAllServices}>
              <Text className="font-caption text-primary">View All</Text>
            </Pressable>
          </View>
          <View className="px-4">
            {popularServices.map((service, index) => (
              <ServiceCard
                key={service.id}
                service={service}
                onPress={() => onServicePress?.(service)}
                index={index}
              />
            ))}
          </View>
        </View>
      )}

      {/* Top Workers */}
      {topWorkers.length > 0 && (
        <View className="mb-4">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="font-title text-foreground">Our Team</Text>
            <Pressable onPress={onViewAllWorkers}>
              <Text className="font-caption text-primary">View All</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="pl-4"
          >
            {topWorkers.map((worker, index) => (
              <WorkerCard
                key={worker.id}
                worker={worker}
                onPress={() => onWorkerPress?.(worker)}
                index={index}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Recent Photos */}
      {recentPhotos.length > 0 && (
        <View className="mb-4">
          <View className="flex-row items-center justify-between px-4 mb-3">
            <Text className="font-title text-foreground">Photos</Text>
            <Pressable onPress={onViewAllPhotos}>
              <Text className="font-caption text-primary">View All</Text>
            </Pressable>
          </View>
          <PhotoGrid photos={recentPhotos} onPhotoPress={onPhotoPress} />
        </View>
      )}
    </View>
  );
};
