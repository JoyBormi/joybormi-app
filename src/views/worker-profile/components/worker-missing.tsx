import { router } from 'expo-router';
import React, { useMemo } from 'react';

import Icons from '@/components/icons';
import { routes } from '@/constants/routes';
import { IFile } from '@/types/file.type';
import { IWorkingDay } from '@/types/schedule.type';
import { IService } from '@/types/service.type';
import { IWorker } from '@/types/worker.type';
import {
  MissingItem,
  ProfileMissing,
} from '@/views/profile/components/profile-missing';

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
  const steps = useMemo(
    () => [
      {
        label: 'Profile details',
        complete: Boolean(worker?.username && worker?.jobTitle),
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
    ],
    [
      mergedPhotos.length,
      services?.length,
      worker?.avatar,
      worker?.bio,
      worker?.coverImage,
      worker?.username,
      worker?.jobTitle,
      workingDays.length,
    ],
  );

  const missingSetupItems = useMemo(() => {
    const items: MissingItem[] = [];

    if (!worker?.username || !worker?.jobTitle) {
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
    worker?.username,
    worker?.jobTitle,
    workingDays.length,
  ]);

  return (
    <ProfileMissing
      canEdit={canEdit}
      steps={steps}
      items={missingSetupItems}
      filterIds={filterIds}
      variant={variant}
      expandAll={expandAll}
    />
  );
};

export default WorkerMissing;
