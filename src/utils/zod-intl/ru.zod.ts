import z from 'zod';

export const ruLocale = (): z.ZodErrorMap => {
  return (issue) => {
    if (issue.code === 'custom') {
      switch (issue.params?.customCode) {
        case 'custom.required':
          return 'Это поле обязательно';
        case 'custom.phone_invalid':
          return 'Неверный формат номера телефона';
        case 'custom.email_invalid':
          return 'Неверный формат email';
        case 'custom.password_not_match':
          return 'Пароли не совпадают';
      }
    }

    return undefined;
  };
};
