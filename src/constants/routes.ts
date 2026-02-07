import { Href, RelativePathString } from 'expo-router';

export const routes = {
  // ───────────────────────────────── Root
  root: '/' as RelativePathString,

  // ───────────────────────────────── Auth
  auth: {
    forgot_password: '/(auth)/forgot-pwd' as RelativePathString,
    login: '/(auth)/login' as RelativePathString,
    register: '/(auth)/register' as RelativePathString,
    reset_password: '/(auth)/reset-pwd' as RelativePathString,
    success: '/(auth)/success' as RelativePathString,
  },

  // ───────────────────────────────── Tabs
  tabs: {
    home: '/(tabs)' as RelativePathString,
    reservations: '/(tabs)/reservations' as RelativePathString,
    profile: '/(tabs)/settings' as RelativePathString,

    calendar: {
      month: '/(tabs)/(calendar)/month' as RelativePathString,
      week: (date: string) =>
        `/(tabs)/(calendar)/(week)/${date}` as RelativePathString,
    },

    brand: {
      brand_profile: '/(tabs)/(brand)/brand-profile' as RelativePathString,
      worker_profile: '/(tabs)/(brand)/worker-profile' as RelativePathString,
    },
  },

  // ───────────────────────────────── Booking
  booking: {
    service: (brandId: string, workerId: string, serviceId: string): Href => ({
      pathname: '/(screens)/(booking)/[brandId]/[workerId]/[serviceId]',
      params: { brandId, workerId, serviceId },
    }),

    success: '/(screens)/(booking)/success' as RelativePathString,
  },

  // ───────────────────────────────── Brand (Screens)
  brand: {
    details: (id: string): Href => ({
      pathname: '/(screens)/(brand)/[id]',
      params: { id },
    }),
    create: '/(screens)/(brand)/create-brand' as RelativePathString,
    edit_profile: '/(screens)/edit-brand-profile' as RelativePathString,
  },

  // ───────────────────────────────── Worker
  worker: {
    details: (id: string): Href => `/(screens)/(worker)/${id}`,
    edit_profile:
      '/(screens)/(worker)/edit-worker-profile' as RelativePathString,
    experience_history:
      '/(screens)/(worker)/experience-history' as RelativePathString,
    invite_code: '/(screens)/(worker)/invite-code' as RelativePathString,
    event: (id: string): Href => ({
      pathname: '/(screens)/(worker)/event/[id]',
      params: { id },
    }),
  },

  // ───────────────────────────────── User
  user: {
    edit_profile: '/(screens)/(user)/edit-profile' as RelativePathString,
  },

  // ───────────────────────────────── Category
  category: {
    view: (category: string): Href => ({
      pathname: '/(category)/[category]',
      params: { category },
    }),
  },

  // ───────────────────────────────── Screens (Shared)
  screens: {
    upsert_service: (
      params: {
        ownerId?: string;
        ownerType?: 'brand' | 'worker';
        serviceId?: string;
        brandId?: string;
      } = {},
    ): Href => ({
      pathname: '/(screens)/upsert-service',
      params,
    }),
    upsert_schedule: (brandId: string): Href => ({
      pathname: '/(screens)/upsert-schedule',
      params: { brandId },
    }),
  },

  // ───────────────────────────────── Settings
  settings: {
    root: '/(settings)' as RelativePathString,
    help: '/(settings)/help' as RelativePathString,
    payment: '/(settings)/payment' as RelativePathString,
    preferences: '/(settings)/preferences' as RelativePathString,
    security: '/(settings)/security' as RelativePathString,

    legal: {
      privacy: '/(settings)/legal/privacy' as RelativePathString,
      terms: '/(settings)/legal/terms' as RelativePathString,
    },

    profile: {
      likes: '/(settings)/profile/likes' as RelativePathString,
      reviews: '/(settings)/profile/reviews' as RelativePathString,
    },
  },

  // ───────────────────────────────── Website
  website: {
    home: '/(website)' as RelativePathString,
  },

  // ───────────────────────────────── Dynamic Brand
  dynamic_brand: {
    team_worker: (id: string): RelativePathString =>
      `/(dynamic-brand)/team/worker/${id}` as RelativePathString,
    team_member: (id: string): RelativePathString =>
      `/(dynamic-brand)/team/member/${id}` as RelativePathString,
  },
} as const;
