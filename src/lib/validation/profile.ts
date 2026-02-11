import { z } from 'zod';

import { EUserMethod } from '@/types/user.type';

import { emailSchema, otpSchema, phoneSchema, usernameSchema } from './auth';

const optionalString = z.string().optional().or(z.literal(''));

export const createProfileSchema = (method?: EUserMethod | null) => {
  return z
    .object({
      username: usernameSchema,
      firstName: optionalString,
      lastName: optionalString,
      email: optionalString,
      phone: optionalString,
      emailOtp: otpSchema,
      phoneOtp: otpSchema,
      language: optionalString,
      country: optionalString,
      state: optionalString,
      city: optionalString,
      street: optionalString,
      postalCode: optionalString,
      detailedAddress: optionalString,
      preferredLocation: optionalString,
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

export const profileSchema = createProfileSchema();

export type ProfileFormData = z.infer<typeof profileSchema>;
