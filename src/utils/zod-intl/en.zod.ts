import { z } from 'zod/v4';

export const enLocale = (): z.ZodErrorMap => {
  return (issue) => {
    if (issue.code === 'custom') {
      switch (issue.params?.customCode) {
        case 'custom.required':
          return 'This field is required';
        case 'custom.phone_invalid':
          return 'Invalid phone number format';
        case 'custom.email_invalid':
          return 'Invalid email address format';
        case 'custom.password_not_match':
          return 'Passwords do not match';
        case 'custom.username_invalid':
          return 'Invalid username format';
        case 'custom.password_invalid':
          return 'Invalid password format';
        case 'custom.working_fields_limit':
          return 'You can select up to 3 working fields';
        case 'custom.otp_invalid':
          return 'Invalid OTP';
        case 'custom.invalid_date':
          return 'Invalid date format';
        case 'custom.invalid_date_range':
          return 'End date cannot be earlier than start date';
      }
    }

    return undefined; // let locale / default handle others
  };
};
