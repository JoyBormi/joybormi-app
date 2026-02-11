import { z } from 'zod';

import { EUserMethod } from '@/types/user.type';
import { required } from '@/utils/zod-intl';

import { emailSchema, otpSchema, passwordSchema, phoneSchema } from './auth';

const optionalContactValue = z.string().optional().or(z.literal(''));

export const createContactVerificationSchema = (
  method?: EUserMethod | null,
) => {
  return z
    .object({
      email: optionalContactValue,
      phone: optionalContactValue,
      phoneOtp: otpSchema,
    })
    .superRefine((data, ctx) => {
      if (method === EUserMethod.PHONE) {
        if (!phoneSchema.safeParse(data.phone).success) {
          ctx.addIssue({
            path: ['phone'],
            code: 'custom',
            params: { customCode: 'custom.phone_invalid' },
          });
        }
        return;
      }

      if (!emailSchema.safeParse(data.email).success) {
        ctx.addIssue({
          path: ['email'],
          code: 'custom',
          params: { customCode: 'custom.email_invalid' },
        });
      }
    });
};

export const contactVerificationSchema = createContactVerificationSchema();

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
