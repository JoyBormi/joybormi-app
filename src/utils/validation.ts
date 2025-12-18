import { CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js';

/**
 * @description validation func for schema
 */
export const validateEmail = () => {};
export const validatePassword = () => {};
export const validatePasswordMatch = () => {};

// Utility function to validate phone number
export const validatePhoneNumber = (
  phone: string,
  country?: CountryCode,
): boolean => {
  try {
    const phoneNumber = parsePhoneNumberWithError(phone, country);
    return phoneNumber ? phoneNumber.isValid() : false;
  } catch {
    return false;
  }
};

// Utility function to get raw phone number (E.164 format)
export const getRawPhoneNumber = (
  phone: string,
  country?: CountryCode,
): string | null => {
  try {
    const phoneNumber = parsePhoneNumberWithError(phone, country);
    return phoneNumber ? phoneNumber.number : null;
  } catch {
    return null;
  }
};
