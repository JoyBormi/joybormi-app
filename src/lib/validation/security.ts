import { z } from 'zod';

import { required } from '@/utils/zod-intl';

import { emailSchema, otpSchema, passwordSchema, phoneSchema } from './auth';

export const contactVerificationSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  emailOtp: otpSchema,
  phoneOtp: otpSchema,
});

export type ContactVerificationFormData = z.infer<
  typeof contactVerificationSchema
>;

export const changePasswordSchema = z
  .object({
    currentPassword: required(z.string().min(6)),
    newPassword: passwordSchema,
    confirmPassword: required(z.string().min(6)),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    params: { customCode: 'custom.password_not_match' },
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
