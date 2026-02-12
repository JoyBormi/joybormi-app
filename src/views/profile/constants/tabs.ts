export const WORKER_PROFILE_TABS = [
  { value: 'setup', label: 'Setup' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'experience', label: 'Experience' },
  { value: 'photos', label: 'Photos' },
  { value: 'danger', label: 'Danger' },
] as const;

export type WorkerProfileTab = (typeof WORKER_PROFILE_TABS)[number]['value'];

export const BRAND_PROFILE_TABS = [
  { value: 'setup', label: 'Setup' },
  { value: 'about', label: 'About' },
  { value: 'services', label: 'Services' },
  { value: 'schedule', label: 'Schedule' },
  { value: 'team', label: 'Team' },
  { value: 'photos', label: 'Photos' },
  { value: 'danger', label: 'Danger' },
] as const;

export type BrandProfileTab = (typeof BRAND_PROFILE_TABS)[number]['value'];
