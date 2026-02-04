import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { AnimatedProgress } from '@/components/ui/progress';
import { IBrand, IBrandPhoto } from '@/types/brand.type';
import { IWorkingDay } from '@/types/schedule.type';
import { IService } from '@/types/service.type';

import type { IWorker } from '@/types/worker.type';

type BrandMissingProps = {
  canEdit: boolean;
  brand: IBrand;
  workers: IWorker[];
  services?: IService[];
  handleEditBrand: () => void;
  handleEditProfileImage: () => void;
  handleEditBanner: () => void;
  handleAddWorker: () => void;
  handleAddPhoto: () => void;
  mergedPhotos: IBrandPhoto[];
  workingDays: IWorkingDay[];
};

const BrandMissing: React.FC<BrandMissingProps> = ({
  canEdit,
  brand,
  workers,
  services,
  handleEditBrand,
  handleEditProfileImage,
  handleEditBanner,
  handleAddWorker,
  handleAddPhoto,
  mergedPhotos,
  workingDays,
}) => {
  const profileCompletion = useMemo(() => {
    const steps = [
      {
        label: 'Brand details',
        complete: Boolean(brand?.brandName && brand?.businessCategory),
      },
      {
        label: 'Description',
        complete: Boolean(brand?.description),
      },
      {
        label: 'Images',
        complete: Boolean(brand?.profileImage && brand?.bannerImage),
      },
      {
        label: 'Services',
        complete: (services?.length ?? 0) > 0,
      },
      {
        label: 'Team',
        complete: workers.length > 0,
      },
      {
        label: 'Photos',
        complete: mergedPhotos.length > 0,
      },
      {
        label: 'Schedule',
        complete: workingDays.length > 0,
      },
    ];
    const completedCount = steps.filter((step) => step.complete).length;
    return {
      steps,
      completedCount,
      total: steps.length,
    };
  }, [
    brand?.bannerImage,
    brand?.brandName,
    brand?.businessCategory,
    brand?.description,
    brand?.profileImage,
    mergedPhotos.length,
    services?.length,
    workers.length,
    workingDays.length,
  ]);

  const missingSetupItems = useMemo(() => {
    const items: {
      id: string;
      title: string;
      description: string;
      icon: typeof Icons.Store;
      action?: { label: string; onPress: () => void };
      secondaryAction?: { label: string; onPress: () => void };
    }[] = [];

    if (!brand?.brandName || !brand?.businessCategory) {
      items.push({
        id: 'details',
        title: 'Add brand details',
        description: 'Share your business name, category, and location.',
        icon: Icons.Store,
        action: {
          label: 'Edit details',
          onPress: handleEditBrand,
        },
      });
    }

    if (!brand?.description) {
      items.push({
        id: 'description',
        title: 'Write your story',
        description: 'Let clients know what makes your brand special.',
        icon: Icons.Notebook,
        action: {
          label: 'Add description',
          onPress: handleEditBrand,
        },
      });
    }

    if (!brand?.profileImage || !brand?.bannerImage) {
      const isMissingLogo = !brand?.profileImage;
      const isMissingBanner = !brand?.bannerImage;

      items.push({
        id: 'images',
        title: 'Upload brand images',
        description: 'Add a logo and banner to make your profile stand out.',
        icon: Icons.Image,
        action: isMissingLogo
          ? {
              label: 'Add logo',
              onPress: handleEditProfileImage,
            }
          : {
              label: 'Add banner',
              onPress: handleEditBanner,
            },
        secondaryAction:
          isMissingLogo && isMissingBanner
            ? {
                label: 'Add banner',
                onPress: handleEditBanner,
              }
            : undefined,
      });
    }

    if ((services?.length ?? 0) === 0) {
      items.push({
        id: 'services',
        title: 'List your services',
        description: 'Show pricing and service details for clients.',
        icon: Icons.Scissors,
        action: {
          label: 'Add service',
          onPress: () =>
            router.push(`/((screens))/upsert-service?brandId=${brand?.id}`),
        },
      });
    }

    if (workers.length === 0) {
      items.push({
        id: 'team',
        title: 'Invite your team',
        description: 'Add team members so clients can book them.',
        icon: Icons.Users,
        action: {
          label: 'Invite worker',
          onPress: handleAddWorker,
        },
      });
    }

    if (mergedPhotos.length === 0) {
      items.push({
        id: 'photos',
        title: 'Showcase your work',
        description: 'Upload photos to highlight your best work.',
        icon: Icons.Camera,
        action: {
          label: 'Add photos',
          onPress: handleAddPhoto,
        },
      });
    }

    if (workingDays.length === 0) {
      items.push({
        id: 'schedule',
        title: 'Set your availability',
        description: 'Add your working days so clients know when to book.',
        icon: Icons.CalendarDays,
        action: {
          label: 'Add hours',
          onPress: () =>
            router.push(`/(screens)/upsert-schedule?brandId=${brand?.id}`),
        },
      });
    }

    return items;
  }, [
    brand?.bannerImage,
    brand?.brandName,
    brand?.businessCategory,
    brand?.description,
    brand?.id,
    brand?.profileImage,
    handleAddPhoto,
    handleAddWorker,
    handleEditBanner,
    handleEditBrand,
    handleEditProfileImage,
    mergedPhotos.length,
    services?.length,
    workers.length,
    workingDays.length,
  ]);

  if (!canEdit) return null;
  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between">
        <Text className="font-title text-lg text-foreground">
          Profile setup
        </Text>
        <Text className="font-caption text-muted-foreground">
          {profileCompletion.completedCount}/{profileCompletion.total}
        </Text>
      </View>
      <View className="mt-3 h-3 rounded-full bg-muted/30 overflow-hidden">
        <AnimatedProgress
          currentStep={profileCompletion.completedCount}
          totalSteps={profileCompletion.total}
        />
      </View>
      <Text className="font-caption text-muted-foreground mt-2">
        Complete your profile to attract more bookings.
      </Text>
      {missingSetupItems.length > 0 && (
        <View className="mt-5 gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="font-subtitle text-foreground">
              Missing pieces
            </Text>
            <Text className="font-caption text-muted-foreground">
              {missingSetupItems.length} left
            </Text>
          </View>
          <View className="gap-3">
            {missingSetupItems.map((item) => (
              <View
                key={item.id}
                className="bg-card/70 rounded-2xl border border-border/50 p-4"
              >
                <View className="flex-row items-start gap-3">
                  <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
                    <item.icon size={18} className="text-primary" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-subtitle text-foreground">
                      {item.title}
                    </Text>
                    <Text className="font-caption text-muted-foreground mt-1">
                      {item.description}
                    </Text>
                    {(item.action || item.secondaryAction) && (
                      <View className="flex-row flex-wrap gap-2 mt-3">
                        {item.action && (
                          <Pressable
                            onPress={item.action.onPress}
                            className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30"
                          >
                            <Text className="text-primary font-caption">
                              {item.action.label}
                            </Text>
                          </Pressable>
                        )}
                        {item.secondaryAction && (
                          <Pressable
                            onPress={item.secondaryAction.onPress}
                            className="px-4 py-1.5 rounded-full bg-muted/40 border border-border/60"
                          >
                            <Text className="text-muted-foreground font-caption">
                              {item.secondaryAction.label}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

export { BrandMissing };
