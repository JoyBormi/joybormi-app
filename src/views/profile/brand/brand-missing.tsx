import { router } from 'expo-router';
import React, { useMemo } from 'react';

import Icons from '@/components/icons';
import { routes } from '@/constants/routes';
import { IBrand } from '@/types/brand.type';
import { IFile } from '@/types/file.type';
import { IWorkingDay } from '@/types/schedule.type';
import { IService } from '@/types/service.type';
import {
  MissingItem,
  ProfileMissing,
} from '@/views/profile/components/profile-missing';

import type { IWorker } from '@/types/worker.type';

type BrandMissingProps = {
  canEdit: boolean;
  brand?: IBrand;
  workers?: IWorker[];
  services?: IService[];
  handleEditBrand?: () => void;
  handleEditProfileImage?: () => void;
  handleEditBanner?: () => void;
  handleAddWorker?: () => void;
  handleManageServices?: () => void;
  handleAddPhoto?: () => void;
  mergedPhotos?: IFile[];
  workingDays?: IWorkingDay[];
  filterIds?: string[];
  variant?: 'full' | 'inline';
  expandAll?: boolean;
};

const BrandMissing: React.FC<BrandMissingProps> = ({
  canEdit,
  brand,
  workers = [],
  services,
  handleEditBrand,
  handleEditProfileImage,
  handleEditBanner,
  handleAddWorker,
  handleManageServices,
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
    ],
    [
      brand?.bannerImage,
      brand?.brandName,
      brand?.businessCategory,
      brand?.description,
      brand?.profileImage,
      mergedPhotos.length,
      services?.length,
      workers.length,
      workingDays.length,
    ],
  );

  const missingSetupItems = useMemo(() => {
    const items: MissingItem[] = [];

    if (!brand?.brandName || !brand?.businessCategory) {
      items.push({
        id: 'details',
        title: 'Add brand details',
        description: 'Share your business name, category, and location.',
        icon: Icons.Store,
        action: handleEditBrand
          ? {
              label: 'Edit details',
              onPress: handleEditBrand,
            }
          : undefined,
      });
    }

    if (!brand?.description) {
      items.push({
        id: 'description',
        title: 'Write your story',
        description: 'Let clients know what makes your brand special.',
        icon: Icons.Notebook,
        action: handleEditBrand
          ? {
              label: 'Add description',
              onPress: handleEditBrand,
            }
          : undefined,
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
          ? handleEditProfileImage
            ? {
                label: 'Add logo',
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
          isMissingLogo && isMissingBanner && handleEditBanner
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
        title: 'Manage worker services',
        description:
          'For MVP, services are managed from your worker profile and auto-shown here.',
        icon: Icons.Scissors,
        action: handleManageServices
          ? {
              label: 'Open worker profile',
              onPress: handleManageServices,
            }
          : undefined,
      });
    }

    if (workers.length === 0) {
      items.push({
        id: 'team',
        title: 'Invite your team',
        description: 'Add team members so clients can book them.',
        icon: Icons.Users,
        action: handleAddWorker
          ? {
              label: 'Invite worker',
              onPress: handleAddWorker,
            }
          : undefined,
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
          onPress: () =>
            brand?.id && router.push(routes.screens.upsert_schedule(brand.id)),
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
    handleManageServices,
    handleEditBanner,
    handleEditBrand,
    handleEditProfileImage,
    mergedPhotos.length,
    services?.length,
    workers.length,
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
      summaryText="Complete your profile to attract more bookings."
    />
  );
};

export { BrandMissing };
