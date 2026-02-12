import { IMAGE_CATEGORIES } from '@/constants/global.constants';

export type ProfilePhotoCategory =
  (typeof IMAGE_CATEGORIES)[keyof typeof IMAGE_CATEGORIES];

export type ProfilePhotoCategoryOption = {
  value: ProfilePhotoCategory;
  label: string;
  icon: string;
};

export const DEFAULT_PROFILE_PHOTO_CATEGORIES: ProfilePhotoCategoryOption[] = [
  { value: IMAGE_CATEGORIES.interior, label: 'Interior', icon: 'Home' },
  { value: IMAGE_CATEGORIES.exterior, label: 'Exterior', icon: 'Store' },
  { value: IMAGE_CATEGORIES.service, label: 'Service', icon: 'Scissors' },
  { value: IMAGE_CATEGORIES.team, label: 'Team', icon: 'Users' },
  { value: IMAGE_CATEGORIES.other, label: 'Other', icon: 'Image' },
];

export const WORKER_PROFILE_PHOTO_CATEGORIES: ProfilePhotoCategoryOption[] = [
  {
    value: IMAGE_CATEGORIES.worker_portfolio,
    label: 'Portfolio',
    icon: 'Camera',
  },
  {
    value: IMAGE_CATEGORIES.worker_certificates,
    label: 'Certificates',
    icon: 'Shield',
  },
  {
    value: IMAGE_CATEGORIES.worker_workspace,
    label: 'Workspace',
    icon: 'Home',
  },
  { value: IMAGE_CATEGORIES.other, label: 'Other', icon: 'Image' },
];
