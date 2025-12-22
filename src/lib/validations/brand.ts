import { z } from 'zod';

/**
 * Brand Setup Form Validation Schema
 * Supports internationalization through custom error messages
 */

// Step 1: Basic Information
export const basicInfoSchema = z.object({
  brandName: z
    .string()
    .min(2, 'brand.validation.name_too_short')
    .max(100, 'brand.validation.name_too_long')
    .regex(/^[a-zA-Z0-9\s-_]+$/, 'brand.validation.name_invalid_chars'),
  description: z
    .string()
    .max(500, 'brand.validation.description_too_long')
    .optional(),
  businessCategory: z.string().min(1, 'brand.validation.category_required'),
});

// Step 2: Location Details
export const locationSchema = z.object({
  country: z.string().min(2, 'brand.validation.country_required'),
  state: z.string().min(1, 'brand.validation.state_required'),
  city: z.string().optional(),
  street: z.string().min(3, 'brand.validation.street_required'),
  detailedAddress: z.string().optional(),
  postalCode: z
    .string()
    .min(3, 'brand.validation.postal_code_required')
    .max(20, 'brand.validation.postal_code_invalid'),
});

// Step 3: Contact & Legal Information
export const contactLegalSchema = z.object({
  email: z
    .string()
    .email('brand.validation.email_invalid')
    .min(1, 'brand.validation.email_required'),
  phone: z
    .string()
    .min(10, 'brand.validation.phone_invalid')
    .regex(/^[+]?[\d\s()-]+$/, 'brand.validation.phone_format_invalid'),
  businessRegistrationNumber: z
    .string()
    .min(5, 'brand.validation.registration_number_required')
    .max(50, 'brand.validation.registration_number_invalid'),
  licenseDocument: z
    .string()
    .min(1, 'brand.validation.license_required')
    .optional(), // Will be required when file upload is implemented
});

// Step 4: Owner Information
export const ownerInfoSchema = z.object({
  ownerFirstName: z
    .string()
    .min(2, 'brand.validation.first_name_required')
    .max(50, 'brand.validation.first_name_too_long'),
  ownerLastName: z
    .string()
    .min(2, 'brand.validation.last_name_required')
    .max(50, 'brand.validation.last_name_too_long'),
});

// Complete Brand Form Schema
export const brandFormSchema = z.object({
  ...basicInfoSchema.shape,
  ...locationSchema.shape,
  ...contactLegalSchema.shape,
  ...ownerInfoSchema.shape,
});

export type BasicInfoForm = z.infer<typeof basicInfoSchema>;
export type LocationForm = z.infer<typeof locationSchema>;
export type ContactLegalForm = z.infer<typeof contactLegalSchema>;
export type OwnerInfoForm = z.infer<typeof ownerInfoSchema>;
export type BrandFormData = z.infer<typeof brandFormSchema>;
