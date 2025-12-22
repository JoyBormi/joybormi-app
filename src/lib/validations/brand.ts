import { z } from 'zod';

/**
 * Brand Setup Form Validation Schema
 * Simple validation without locale - errors will be translated in UI layer
 */

// Step 1: Basic Information
export const basicInfoSchema = z.object({
  brandName: z
    .string()
    .min(1, 'Brand name is required')
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name must not exceed 100 characters')
    .regex(
      /^[a-zA-Z0-9\s-_]+$/,
      'Brand name can only contain letters, numbers, hyphens and underscores',
    ),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  businessCategory: z.string().min(1, 'Business category is required'),
});

// Step 2: Location Details
export const locationSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State/Province is required'),
  city: z.string().optional(),
  street: z
    .string()
    .min(1, 'Street address is required')
    .min(3, 'Street address must be at least 3 characters'),
  detailedAddress: z.string().optional(),
  postalCode: z
    .string()
    .min(1, 'Postal code is required')
    .min(3, 'Postal code must be at least 3 characters')
    .max(20, 'Postal code must not exceed 20 characters'),
});

// Step 3: Contact & Legal Information
export const contactLegalSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^[+]?[\d\s()-]+$/, 'Invalid phone number format'),
  businessRegistrationNumber: z
    .string()
    .min(1, 'Business registration number is required')
    .min(5, 'Registration number must be at least 5 characters')
    .max(50, 'Registration number must not exceed 50 characters'),
  licenseDocument: z.string().optional(),
});

// Step 4: Owner Information
export const ownerInfoSchema = z.object({
  ownerFirstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters'),
  ownerLastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters'),
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
