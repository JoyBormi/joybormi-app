import React from 'react';

import { ProfilePhotosGrid } from '@/views/profile/components';

import type { IBrandPhoto } from '@/types/brand.type';

interface BrandPhotosGridProps {
  photos: IBrandPhoto[];
  canEdit: boolean;
  onAddPhoto: () => void;
  onPhotoPress?: (photo: IBrandPhoto, index: number) => void;
}

/**
 * Brand Photos Grid Component
 * Displays grid of brand photos with add button
 */
export const BrandPhotosGrid: React.FC<BrandPhotosGridProps> = ({
  photos,
  canEdit,
  onAddPhoto,
  onPhotoPress,
}) => {
  return (
    <ProfilePhotosGrid
      photos={photos}
      canEdit={canEdit}
      onAddPhoto={onAddPhoto}
      onPhotoPress={onPhotoPress}
    />
  );
};
