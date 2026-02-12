import type { ExperienceFormValues } from './validation';
import type {
  CreateExperiencePayload,
  IExperience,
  UpdateExperiencePayload,
} from '@/types/experience.type';

export const mapExperienceToFormValues = (
  experience: IExperience,
): ExperienceFormValues => ({
  company: experience.company ?? '',
  title: experience.title ?? '',
  startDate: experience.startDate?.slice(0, 10) ?? '',
  endDate: experience.endDate?.slice(0, 10) ?? '',
  isCurrent: experience.isCurrent,
});

export const sanitizeExperienceFormValues = (
  values: ExperienceFormValues,
): ExperienceFormValues => ({
  company: values.company.trim(),
  title: values.title.trim(),
  startDate: values.startDate.trim(),
  endDate: values.isCurrent ? '' : (values.endDate?.trim() ?? ''),
  isCurrent: values.isCurrent,
});

export const toCreateExperiencePayload = (
  values: ExperienceFormValues,
): CreateExperiencePayload => {
  const sanitized = sanitizeExperienceFormValues(values);

  return {
    company: sanitized.company,
    title: sanitized.title,
    startDate: sanitized.startDate,
    endDate: sanitized.isCurrent ? undefined : sanitized.endDate,
    isCurrent: sanitized.isCurrent,
  };
};

export const toUpdateExperiencePayload = (
  values: ExperienceFormValues,
): UpdateExperiencePayload => {
  const sanitized = sanitizeExperienceFormValues(values);

  return {
    company: sanitized.company,
    title: sanitized.title,
    startDate: sanitized.startDate,
    endDate: sanitized.isCurrent ? null : sanitized.endDate,
    isCurrent: sanitized.isCurrent,
  };
};
