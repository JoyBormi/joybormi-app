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
        case 'custom.invalid_date':
          return 'Неверный формат даты';
        case 'custom.invalid_date_range':
          return 'Дата окончания не может быть раньше даты начала';
      }
    }

    return undefined;
  };
};
