/**
 * @description
 * Local email suffix for phone-based authentication
 */
const LOCAL_EMAIL = '@phone.local';

/**
 * @description
 * Start week from Monday (ISO standard)
 * LocaleConfig array: [Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6]
 * Database dayOfWeek: [Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6]
 * Map LocaleConfig index to database dayOfWeek
 */
const DAY_ORDER = [0, 1, 2, 3, 4, 5, 6]; // Mon-Sun

/**
 * @description
 * Image categories for file upload
 */
const IMAGE_CATEGORIES = {
  brand_avatar: 'brand-avatar',
  brand_banner: 'brand-banner',
  worker_avatar: 'worker-avatar',
  worker_cover: 'worker-cover',
  worker_portfolio: 'worker-portfolio',
  worker_certificates: 'worker-certificates',
  worker_workspace: 'worker-workspace',
  interior: 'interior',
  exterior: 'exterior',
  service: 'service',
  team: 'team',
  other: 'other',
};

export { DAY_ORDER, IMAGE_CATEGORIES, LOCAL_EMAIL };
