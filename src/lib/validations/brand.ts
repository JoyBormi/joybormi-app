import { Major } from '@/constants/enum';
import { required } from '@/utils/zod-intl';
import { z } from 'zod';
import { normalizePhone, PHONE_REGEX } from '../utils';

// Keep this in sync with your Prisma enum BrandCategory
export const BrandCategoryEnum = z.enum(Major);

const phoneSchema = required(
  z.string().refine((v) => PHONE_REGEX.test(normalizePhone(v)), {
    params: { customCode: 'custom.phone_invalid' },
  }),
);

export const createBrandSchema = z.object({
  brandName: required(z.string()),
  businessName: required(z.string()),
  businessNumber: required(z.string()),
  businessCertUrl: required(z.url()),

  businessCategory: required(z.enum(Major)),

  ownerFirstName: required(z.string()),
  ownerLastName: required(z.string()),

  email: z.email().optional(),
  phone: phoneSchema,

  country: required(z.string()),
  state: required(z.string()),
  city: required(z.string()),

  street: required(z.string()),
  detailedAddress: required(z.string()),
  postalCode: required(z.string()),

  profileImage: z.url().optional(),
  bannerImage: z.url().optional(),

  description: z.string().optional(),

  // maps to BrandWorkingField.keyword[] - max 3 selections
  workingFields: z
    .array(required(z.string()))
    .refine((v) => v.length <= 3, {
      params: { customCode: 'custom.working_fields_limit' },
    })
    .optional(),
});

export type TCreateBrandInput = z.infer<typeof createBrandSchema>;
