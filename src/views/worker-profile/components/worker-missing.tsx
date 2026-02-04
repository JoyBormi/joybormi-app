import { router } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, View } from 'react-native';

import Icons from '@/components/icons';
import { Text } from '@/components/ui';
import { AnimatedProgress } from '@/components/ui/progress';
import { routes } from '@/constants/routes';
import { IFile } from '@/types/file.type';
import { IWorkingDay } from '@/types/schedule.type';
import { IService } from '@/types/service.type';
import { IWorker } from '@/types/worker.type';

type WorkerMissingProps = {
  canEdit: boolean;
  worker: IWorker;
  services?: IService[];
  handleEditWorker: () => void;
  handleEditProfileImage: () => void;
  handleEditBanner: () => void;
  handleAddPhoto: () => void;
  mergedPhotos: IFile[];
  workingDays: IWorkingDay[];
};

const WorkerMissing: React.FC<WorkerMissingProps> = ({
  canEdit,
  worker,
  services,
  handleEditWorker,
  handleEditProfileImage,
  handleEditBanner,
  handleAddPhoto,
  mergedPhotos,
  workingDays,
}) => {
  const profileCompletion = useMemo(() => {
    const steps = [
      {
        label: 'Profile details',
        complete: Boolean(worker?.name && worker?.role),
      },
      {
        label: 'Description',
        complete: Boolean(worker?.bio),
      },
      {
        label: 'Images',
        complete: Boolean(worker?.avatar && worker?.coverImage),
      },
      {
        label: 'Services',
        complete: (services?.length ?? 0) > 0,
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
    mergedPhotos.length,
    services?.length,
    worker?.avatar,
    worker?.bio,
    worker?.coverImage,
    worker?.name,
    worker?.role,
    workingDays.length,
  ]);

  const missingSetupItems = useMemo(() => {
    const items: {
      id: string;
      title: string;
      description: string;
      icon: typeof Icons.User;
      action?: { label: string; onPress: () => void };
      secondaryAction?: { label: string; onPress: () => void };
    }[] = [];

    if (!worker?.name || !worker?.role) {
      items.push({
        id: 'details',
        title: 'Add profile details',
        description: 'Share your name and role with clients.',
        icon: Icons.User,
        action: {
          label: 'Edit details',
          onPress: handleEditWorker,
        },
      });
    }

    if (!worker?.bio) {
      items.push({
        id: 'description',
        title: 'Write your story',
        description: 'Let clients know what makes your work special.',
        icon: Icons.Notebook,
        action: {
          label: 'Add bio',
          onPress: handleEditWorker,
        },
      });
    }

    if (!worker?.avatar || !worker?.coverImage) {
      const isMissingAvatar = !worker?.avatar;
      const isMissingBanner = !worker?.coverImage;

      items.push({
        id: 'images',
        title: 'Upload profile images',
        description: 'Add a profile photo and banner to stand out.',
        icon: Icons.Image,
        action: isMissingAvatar
          ? {
              label: 'Add photo',
              onPress: handleEditProfileImage,
            }
          : {
              label: 'Add banner',
              onPress: handleEditBanner,
            },
        secondaryAction:
          isMissingAvatar && isMissingBanner
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
            router.push(
              routes.screens.upsert_service({
                ownerId: worker?.id,
                ownerType: 'worker',
              }),
            ),
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
          onPress: () => {
            if (!worker?.brandId) return;
            router.push(routes.screens.upsert_schedule(worker.brandId));
          },
        },
      });
    }

    return items;
  }, [
    handleAddPhoto,
    handleEditBanner,
    handleEditProfileImage,
    handleEditWorker,
    mergedPhotos.length,
    services?.length,
    worker?.avatar,
    worker?.bio,
    worker?.brandId,
    worker?.coverImage,
    worker?.id,
    worker?.name,
    worker?.role,
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
          className="bg-primary"
        />
      </View>

      <View className="mt-4 gap-3">
        {missingSetupItems.map((item) => {
          const Icon = item.icon;

          return (
            <View
              key={item.id}
              className="rounded-2xl border border-border/50 bg-card/50 p-4"
            >
              <View className="flex-row items-start gap-3">
                <View className="h-10 w-10 rounded-xl bg-primary/10 items-center justify-center">
                  <Icon className="text-primary" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="font-subtitle text-foreground">
                    {item.title}
                  </Text>
                  <Text className="font-caption text-muted-foreground mt-1">
                    {item.description}
                  </Text>
                </View>
              </View>

              <View className="flex-row gap-3 mt-4">
                {item.action && (
                  <Pressable
                    onPress={item.action.onPress}
                    className="flex-1 rounded-xl border border-primary/20 bg-primary/10 px-3 py-2"
                  >
                    <Text className="text-primary text-center font-subtitle">
                      {item.action.label}
                    </Text>
                  </Pressable>
                )}
                {item.secondaryAction && (
                  <Pressable
                    onPress={item.secondaryAction.onPress}
                    className="flex-1 rounded-xl border border-border/50 bg-muted/20 px-3 py-2"
                  >
                    <Text className="text-foreground text-center font-subtitle">
                      {item.secondaryAction.label}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default WorkerMissing;
