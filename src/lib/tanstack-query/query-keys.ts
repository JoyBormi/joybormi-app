/**
 * Centralized query key factory
 * All query keys are defined here as string arrays only
 * Parameters should be passed separately when calling useQuery/useMutation: [...key, {param}]
 * Keys are hierarchical and role-aware to prevent cache collisions
 *
 * Pattern: ['feature', 'role', 'entity', 'id']
 * Usage: useQuery({ queryKey: [...queryKeys.auth.me, { userId }], ... })
 */

export const queryKeys = {
  // ============================================
  // AUTH
  // ============================================
  auth: {
    all: ['auth'],
    me: ['auth', 'me'],
    session: ['auth', 'session'],
  },

  // ============================================
  // USER
  // ============================================
  user: {
    all: ['user'],
    profile: ['user', 'profile'],
    favorites: ['user', 'favorites'],
    settings: ['user', 'settings'],
  },

  // ============================================
  // RESERVATIONS
  // ============================================
  reservations: {
    all: ['reservations'],
    list: ['reservations', 'list'],
    detail: ['reservations', 'detail'],
    upcoming: ['reservations', 'upcoming'],
    past: ['reservations', 'past'],
    calendar: ['reservations', 'calendar'],
  },

  // ============================================
  // WORKER
  // ============================================
  worker: {
    all: ['worker'],
    profile: ['worker', 'profile'],
    services: ['worker', 'services'],
    schedule: ['worker', 'schedule'],
    availability: ['worker', 'availability'],
    reviews: ['worker', 'reviews'],
    stats: ['worker', 'stats'],
  },

  // ============================================
  // CREATOR (BRAND/BUSINESS)
  // ============================================
  creator: {
    all: ['creator'],
    brand: ['creator', 'brand'],
    team: ['creator', 'team'],
    services: ['creator', 'services'],
    photos: ['creator', 'photos'],
    analytics: ['creator', 'analytics'],
    revenue: ['creator', 'revenue'],
  },

  // ============================================
  // SCHEDULE
  // ============================================
  schedule: {
    all: ['schedule'],
    detail: ['schedule', 'detail'],
  },

  // ============================================
  // SERVICES
  // ============================================
  service: {
    all: ['service'],
    list: ['service', 'list'],
    detail: ['service', 'detail'],
    categories: ['service', 'categories'],
  },

  // ============================================
  // SEARCH
  // ============================================
  search: {
    all: ['search'],
    workers: ['search', 'workers'],
    brands: ['search', 'brands'],
    services: ['search', 'services'],
  },

  // ============================================
  // NOTIFICATIONS
  // ============================================
  notifications: {
    all: ['notifications'],
    list: ['notifications', 'list'],
    unreadCount: ['notifications', 'unreadCount'],
  },

  // ============================================
  // REVIEWS
  // ============================================
  reviews: {
    all: ['reviews'],
    list: ['reviews', 'list'],
    detail: ['reviews', 'detail'],
  },

  // ============================================
  // CHAT
  // ============================================
  chat: {
    all: ['chat'],
    conversations: ['chat', 'conversations'],
    messages: ['chat', 'messages'],
  },

  // ============================================
  // FILES
  // ============================================
  files: {
    all: ['files'],
    detail: ['files', 'detail'],
    category: ['files', 'category'],
  },
} as const;
