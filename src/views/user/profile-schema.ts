import { z } from 'zod';

import { normalizePhone, PHONE_REGEX } from '@/lib/utils';
import { required } from '@/utils/zod-intl';

/**
 * Username validation schema
 * - Required
 * - Alphanumeric and underscores only
 * - Min 3 characters
 */
const usernameSchema = required(
  z
    .string()
    .min(3)
    .refine((v) => /^[a-zA-Z0-9_]+$/.test(v), {
      params: { customCode: 'custom.username_invalid' },
    }),
);

/**
 * Email validation schema
 * - Optional
 * - Valid email format
 */
const emailSchema = z
  .string()
  .email({ message: 'custom.email_invalid' })
  .optional()
  .or(z.literal(''));

/**
 * Phone validation schema
 * - Optional
 * - Valid phone format
 */
const phoneSchema = z
  .string()
  .refine((v) => !v || PHONE_REGEX.test(normalizePhone(v)), {
    params: { customCode: 'custom.phone_invalid' },
  })
  .optional();

/**
 * Optional string schema
 */
const optionalString = z.string().optional().or(z.literal(''));

/**
 * Profile edit form schema
 * Handles validation for user profile updates
 */
export const profileSchema = z.object({
  username: usernameSchema,
  firstName: optionalString,
  lastName: optionalString,
  email: emailSchema,
  phone: phoneSchema,
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
