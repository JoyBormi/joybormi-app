import { CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js';

/**
 * @description validation func for schema
 */
export const validateEmail = () => {};
export const validatePassword = () => {};
export const validatePasswordMatch = () => {};

/**
 * @description validate form errors and return first error key
 * @param errors
 * @returns first error key
 */
export const validateFormErrors = <T extends Record<string, any>>(
  errors: T,
) => {
  const firstError = Object.keys(errors)[0];
  if (firstError) {
    return firstError;
  }
};

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
