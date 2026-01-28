const LOCAL_EMAIL = '@phone.local';

/**
 * @description
 * Start week from Monday (ISO standard)
 * LocaleConfig array: [Mon=0, Tue=1, Wed=2, Thu=3, Fri=4, Sat=5, Sun=6]
 * Database dayOfWeek: [Sun=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6]
 * Map LocaleConfig index to database dayOfWeek
 */
const DAY_ORDER = [1, 2, 3, 4, 5, 6, 0]; // Mon-Sun

export { DAY_ORDER, LOCAL_EMAIL };
