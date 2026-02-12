import { z } from 'zod';

import { required } from '@/utils/zod-intl/required.zod';

import type { FieldErrors } from 'react-hook-form';

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const experienceFormSchema = z
  .object({
    company: required(z.string().trim()),
    title: required(z.string().trim()),
    startDate: required(z.string().trim()),
    endDate: z.string().trim().optional().default(''),
    isCurrent: z.boolean(),
  })
  .superRefine((values, ctx) => {
    if (values.isCurrent) return;

    const endDate = values.endDate?.trim() ?? '';
    if (!endDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        params: { customCode: 'custom.required' },
      });
      return;
    }

    if (!datePattern.test(endDate)) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        params: { customCode: 'custom.invalid_date' },
      });
      return;
    }

    if (endDate < values.startDate) {
      ctx.addIssue({
        path: ['endDate'],
        code: 'custom',
        params: { customCode: 'custom.invalid_date_range' },
      });
    }
  });

export type ExperienceFormValues = z.infer<typeof experienceFormSchema>;

export const EMPTY_EXPERIENCE_FORM_VALUES: ExperienceFormValues = {
  company: '',
  title: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
};

export const getExperienceFormError = (
  errors: FieldErrors<ExperienceFormValues>,
) => {
  const rawMessage =
    errors.title?.message ??
    errors.company?.message ??
    errors.startDate?.message ??
    errors.endDate?.message;

  if (!rawMessage) return null;
  return String(rawMessage);
};
