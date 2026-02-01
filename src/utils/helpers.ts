import dayjs from 'dayjs';
import * as parsePhoneNumber from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js';

import { LOCAL_EMAIL } from '@/constants/global.constants';

export const getDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return dayjs(date).format('YYYY-MM-DD');
};

/*
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

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
    currencyDisplay: 'symbol',
    currencySign: 'standard',
    useGrouping: true,
    notation: 'standard',
  }).format(amount);
};

/**
 * @param price Raw input (any format)
 * @returns formatted price or null
 */
export const normalizePrice = (price: string): string | null => {
  return price.replace(/\s/g, '');
};
