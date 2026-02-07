import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
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
  worker?: IWorker;
  services?: IService[];
  handleEditWorker?: () => void;
  handleEditProfileImage?: () => void;
  handleEditBanner?: () => void;
  handleAddPhoto?: () => void;
  mergedPhotos?: IFile[];
  workingDays?: IWorkingDay[];
  filterIds?: string[];
  variant?: 'full' | 'inline';
  expandAll?: boolean;
};

const WorkerMissing: React.FC<WorkerMissingProps> = ({
  canEdit,
  worker,
  services,
  handleEditWorker,
  handleEditProfileImage,
  handleEditBanner,
  handleAddPhoto,
  mergedPhotos = [],
  workingDays = [],
  filterIds,
  variant = 'full',
  expandAll = false,
}) => {
  const [expanded, setExpanded] = useState(expandAll);
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
        action: handleEditWorker
          ? {
              label: 'Edit details',
              onPress: handleEditWorker,
            }
          : undefined,
      });
    }

    if (!worker?.bio) {
      items.push({
        id: 'description',
        title: 'Write your story',
        description: 'Let clients know what makes your work special.',
        icon: Icons.Notebook,
        action: handleEditWorker
          ? {
              label: 'Add bio',
              onPress: handleEditWorker,
            }
          : undefined,
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
          ? handleEditProfileImage
            ? {
                label: 'Add photo',
                onPress: handleEditProfileImage,
              }
            : undefined
          : handleEditBanner
            ? {
                label: 'Add banner',
                onPress: handleEditBanner,
              }
            : undefined,
        secondaryAction:
          isMissingAvatar && isMissingBanner && handleEditBanner
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
        action: handleAddPhoto
          ? {
              label: 'Add photos',
              onPress: handleAddPhoto,
            }
          : undefined,
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

  const filteredItems = useMemo(() => {
    if (!filterIds || filterIds.length === 0) return missingSetupItems;
    return missingSetupItems.filter((item) => filterIds.includes(item.id));
  }, [filterIds, missingSetupItems]);

  if (!canEdit || filteredItems.length === 0) return null;

  const cards = (
    <View className="mt-4 gap-3">
      {filteredItems.map((item) => {
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
  );

  if (variant === 'inline') {
    return <View className="px-6 mb-6">{cards}</View>;
  }

  return (
    <View className="px-6 mb-8">
      <View className="flex-row items-center justify-between">
        <Text className="font-title text-lg text-foreground">
          Profile setup
        </Text>
        {expanded ? (
          <Icons.ChevronUp
            size={18}
            className="text-muted-foreground stroke-1.5"
          />
        ) : (
          <Icons.ChevronDown
            size={18}
            className="text-muted-foreground stroke-1.5"
          />
        )}
        <Text className="font-caption text-muted-foreground">
          {profileCompletion.completedCount}/{profileCompletion.total}
        </Text>
      </View>
      <View className="mt-3 h-3 rounded-full bg-muted/80 overflow-hidden">
        <AnimatedProgress
          currentStep={profileCompletion.completedCount}
          totalSteps={profileCompletion.total}
        />
      </View>
      {expanded && cards}
    </View>
  );
};

export default WorkerMissing;
