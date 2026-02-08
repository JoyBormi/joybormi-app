import { z } from 'zod';

import { emailSchema, phoneSchema } from '@/lib/validation';

/**
 * Validation schemas for Worker Profile forms
 */

export const workerProfileSchema = z.object({
  username: z.string().min(1).optional(),

  firstName: z.string().min(1).optional(),

  lastName: z.string().min(1).optional(),

  avatar: z.url().optional().or(z.literal('')),

  coverImage: z.url().optional().or(z.literal('')),

  bio: z.string().min(1).optional(),

  jobTitle: z.string().min(1).optional(),

  phone: phoneSchema,

  email: emailSchema,

  languages: z.array(z.string()).optional(),

  instagram: z.string().optional(),

  isPublic: z.boolean().optional(),
});

export const serviceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  duration_mins: z.number().min(15, 'Duration must be at least 15 minutes'),
  price: z.string().min(1, 'Price is required'),
});

export const scheduleSchema = z.object({
  workingDays: z
    .array(
      z.object({
        day_of_week: z.number().min(0).max(6),
        start_time: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
            'Invalid time format',
          ),
        end_time: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
            'Invalid time format',
          ),
        breaks: z.array(
          z.object({
            start_time: z
              .string()
              .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
                'Invalid time format',
              ),
            end_time: z
              .string()
              .regex(
                /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
                'Invalid time format',
              ),
          }),
        ),
      }),
    )
    .min(1, 'At least one working day is required'),
});

export type WorkerProfileFormData = z.infer<typeof workerProfileSchema>;
export type ServiceFormData = z.infer<typeof serviceSchema>;
export type ScheduleFormData = z.infer<typeof scheduleSchema>;
