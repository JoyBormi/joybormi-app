import dayjs from 'dayjs';
import * as parsePhoneNumber from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js';

import { LOCAL_EMAIL } from '@/constants/global.constants';

// TODO: remove this function used for dummy data
export const getDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return dayjs(date).format('YYYY-MM-DD');
};

/**
 * @param phoneNumber Raw input (any format)
 * @param defaultCountry ISO-2 country code, e.g. "UZ"
 * @returns formatted E.164 or null
 */
export const formatPhoneNumber = (
  phoneNumber: string,
  defaultCountry: string = 'UZ',
): string | null => {
  const parsed = parsePhoneNumber.parsePhoneNumberFromString(
    phoneNumber,
    defaultCountry as CountryCode,
  );

  if (!parsed || !parsed.isValid()) {
    return null;
  }

  return parsed.formatInternational(); // "+998 93 455 25 65"
};

/**
 * @param email Email to check
 * @returns Empty string if email is local, otherwise returns the email
 */
export const emptyLocalEmail = (email: string) => {
  const isEmailLOcal = email.endsWith(LOCAL_EMAIL);

  return isEmailLOcal ? '' : email;
};

/**
 * @param amount Amount to format
 * @param currency Currency to use
 * @returns formatted currency
 */
export const formatCurrency = (amount?: number, currency?: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency ?? 'UZS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    currencyDisplay: 'symbol',
    currencySign: 'standard',
    useGrouping: true,
    notation: 'standard',
  }).format(amount ?? 0);
};

/**
 * @param num Raw input (any format)
 * @returns formatted  or null
 */
export const normalizeInput = (num?: string): string => {
  if (!num) return '';
  return num.replace(/\s/g, '');
};

type FormatNumberOptions = {
  useThousandsSeparator?: boolean;
  useCompactNotation?: boolean; // 1.2K, 3.4M
  maxDecimalPlaces?: number;
  compactFrom?: number;
};
/**
 * @description format any number
 * @param value number
 * @param options FormatNumberOptions
 * @returns formatted string
 */
export function formatNumber(
  value?: number,
  {
    useThousandsSeparator = true,
    useCompactNotation = false,
    maxDecimalPlaces = 1,
    compactFrom = 1_000,
  }: FormatNumberOptions = {},
): string {
  if (value === null || value === undefined) return '0';

  const abs = Math.abs(value);
  const shouldCompact = useCompactNotation && abs >= compactFrom;

  if (shouldCompact) {
    const sign = value < 0 ? '-' : '';

    if (abs >= 1_000_000_000) {
      return (
        sign +
        (abs / 1_000_000_000).toFixed(maxDecimalPlaces).replace(/\.?0+$/, '') +
        'B'
      );
    }
    if (abs >= 1_000_000) {
      return (
        sign +
        (abs / 1_000_000).toFixed(maxDecimalPlaces).replace(/\.?0+$/, '') +
        'M'
      );
    }
    if (abs >= 1_000) {
      return (
        sign +
        (abs / 1_000).toFixed(maxDecimalPlaces).replace(/\.?0+$/, '') +
        'K'
      );
    }
  }

  return Intl.NumberFormat('en', {
    useGrouping: useThousandsSeparator,
    maximumFractionDigits: maxDecimalPlaces,
  }).format(value);
}
