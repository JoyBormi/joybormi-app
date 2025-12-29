import dayjs from 'dayjs';
import * as parsePhoneNumber from 'libphonenumber-js';
import { CountryCode } from 'libphonenumber-js';

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
