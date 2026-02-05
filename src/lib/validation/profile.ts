import { z } from 'zod';

import { emailSchema, otpSchema, phoneSchema, usernameSchema } from './auth';

const optionalString = z.string().optional().or(z.literal(''));

export const profileSchema = z.object({
  username: usernameSchema,
  firstName: optionalString,
  lastName: optionalString,
  email: emailSchema,
  phone: phoneSchema,
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
});

export type ProfileFormData = z.infer<typeof profileSchema>;
