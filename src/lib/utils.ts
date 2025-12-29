import { EUserType, UserTypeBlockReason } from '@/types/user.type';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PHONE_REGEX = /^[1-9]\d{11,}$/; // 12+ digits, no +
export const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
export const PASSWORD_REGEX =
  /^(?=.*[A-Za-z]|\d)[A-Za-z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{6,20}$/;

export const normalizePhone = (v: string) => v.replace(/\D/g, '');

export function validateUserTypeSwitch(
  from: EUserType,
  to: EUserType,
  hasBrand: boolean,
): UserTypeBlockReason {
  if (from === to) return null;

  if (
    (from === EUserType.CREATOR && to === EUserType.WORKER) ||
    (from === EUserType.WORKER && to === EUserType.CREATOR)
  ) {
    return 'NOT_ALLOWED';
  }

  if (from === EUserType.USER && to === EUserType.WORKER) {
    return 'NEED_CODE';
  }

  if (from === EUserType.USER && to === EUserType.CREATOR && !hasBrand) {
    return 'NEED_BRAND';
  }

  return null;
}
