import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { EUserType, UserTypeBlockReason } from '@/types/user.type';
import { UploadedFile } from '@/utils/file-upload';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PHONE_REGEX = /^[1-9]\d{11,}$/; // 12+ digits, no +
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z]|\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/;

export const normalizePhone = (v: string) => v.replace(/\D/g, '');

/**
 * 1. User can switch to Worker if he has an invite code otherwise need to invite code
 * 2. User can switch to Creator if he has a brand otherwise need to create a brand
 * 3. Worker can switch to Creator if he has a brand only if his role is Creator, (role worker can not create brand or switch to creator)
 * 4. Creator can switch to Worker if he has a brand (coz he is a worker)
 * 5. Creator/Worker can switch User anytime
 */

export function validateUserTypeSwitch(
  from: EUserType,
  to: EUserType,
  hasBrand: boolean,
): UserTypeBlockReason {
  if (from === to) return null;

  // Creator / Worker → User is always allowed
  if (
    (from === EUserType.CREATOR || from === EUserType.WORKER) &&
    to === EUserType.USER
  ) {
    return null;
  }

  // User → Worker needs invite code
  if (from === EUserType.USER && to === EUserType.WORKER) {
    return 'NEED_CODE';
  }

  // User → Creator needs brand
  if (from === EUserType.USER && to === EUserType.CREATOR) {
    return hasBrand ? null : 'NEED_BRAND';
  }

  // Worker → Creator needs brand
  if (from === EUserType.WORKER && to === EUserType.CREATOR) {
    return hasBrand ? null : 'NOT_ALLOWED';
  }

  // Creator → Worker needs brand
  if (from === EUserType.CREATOR && to === EUserType.WORKER) {
    return hasBrand ? null : 'NOT_ALLOWED';
  }

  return null;
}

/**
 * Build uploaded file object
 * @param uri - File URI
 * @param label - File label
 * @returns UploadedFile
 */
export const buildUploadedFile = (uri: string, label: string): UploadedFile => {
  const name = uri.split('/').pop() || `${label}-${Date.now()}.jpg`;
  return {
    uri,
    name,
    type: 'image/jpeg',
  };
};
