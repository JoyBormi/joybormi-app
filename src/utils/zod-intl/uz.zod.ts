import { z } from 'zod/v4';

/** Detects JS type for human-friendly output */
export const parsedType = (data: unknown): string => {
  const t = typeof data;

  switch (t) {
    case 'string':
      return 'matn';
    case 'number':
      return Number.isNaN(data) ? 'NaN' : 'son';
    case 'boolean':
      return 'mantiqiy qiymat';
    case 'bigint':
      return 'katta son';
    case 'symbol':
      return 'simvol';
    case 'undefined':
      return 'aniqlanmagan';
    case 'function':
      return 'funksiya';
    case 'object':
      if (Array.isArray(data)) return 'massiv';
      if (data === null) return 'null';
      if (data instanceof Date) return 'sana';
      if (
        Object.getPrototypeOf(data) !== Object.prototype &&
        data.constructor
      ) {
        return data.constructor.name;
      }
      return 'obyekt';
  }
};

/** Uzbek Zod locale implementation */
export const uzLocale = (): z.ZodErrorMap => {
  const Sizable: Record<string, { unit: string; verb: string }> = {
    string: { unit: 'belgilar', verb: 'bo‘lishi kerak' },
    file: { unit: 'bayt', verb: 'bo‘lishi kerak' },
    array: { unit: 'elementlar', verb: 'bo‘lishi kerak' },
    set: { unit: 'elementlar', verb: 'bo‘lishi kerak' },
  };

  const Nouns: Record<string, string> = {
    email: 'elektron pochta manzili',
    url: 'URL',
    uuid: 'UUID',
    cuid: 'cuid',
    cuid2: 'cuid2',
    uuidv4: 'UUIDv4',
    emoji: 'emoji',
    datetime: 'sana va vaqt',
    date: 'sana',
    time: 'vaqt',
    ipv4: 'IPv4 manzil',
    ipv6: 'IPv6 manzil',
    base64: 'base64 satri',
    jwt: 'JWT token',
  };

  const TypeNames: Record<string, string> = {
    string: 'matn',
    number: 'son',
    boolean: 'mantiqiy qiymat',
    bigint: 'katta son',
    symbol: 'simvol',
    undefined: 'aniqlanmagan',
    function: 'funksiya',
    object: 'obyekt',
    array: 'massiv',
    set: 'elementlar',
    map: 'elementlar',
  };

  const typeNamesMapper = (type: string) => TypeNames[type] ?? type;

  const getSizing = (origin: string): { unit: string; verb: string } | null =>
    Sizable[origin] ?? null;

  return (issue) => {
    switch (issue.code) {
      case 'custom':
        switch (issue.params?.customCode) {
          case 'custom.required':
            return { message: 'Iltimos, bu maydonni to‘ldiring' };

          case 'custom.phone_invalid':
            return { message: 'Telefon raqam noto‘g‘ri formatda' };

          case 'custom.email_invalid':
            return { message: 'Elektron pochta manzili noto‘g‘ri formatda' };

          case 'custom.password_not_match':
            return { message: 'Parollar mos emas' };

          case 'custom.working_fields_limit':
            return { message: 'Iltimos, faqat 3 ta tanlang' };

          case 'custom.otp_invalid':
            return { message: 'Noto‘g‘ri OTP' };
          case 'custom.invalid_date':
            return { message: 'Sana formati noto‘g‘ri' };
          case 'custom.invalid_date_range':
            return {
              message:
                'Tugash sanasi boshlanish sanasidan oldin bo‘lishi mumkin emas',
            };

          default:
            return { message: 'Noto‘g‘ri qiymat' };
        }
      case 'invalid_type':
        return {
          message: `Noto‘g‘ri turdagi qiymat: ${typeNamesMapper(issue.expected)} kutilgan, ammo ${parsedType(issue.input)} olindi`,
        };

      case 'invalid_value':
        if (issue.values.length === 1)
          return {
            message: `Noto‘g‘ri qiymat: ${z.util.stringifyPrimitive(issue.values[0])} kutilgan`,
          };
        return {
          message: `Noto‘g‘ri qiymat: quyidagilardan biri kutilgan ${z.util.joinValues(issue.values, ', ')}`,
        };

      case 'too_big': {
        const adj = issue.inclusive ? '<=' : '<';
        const sizing = getSizing(issue.origin);
        if (sizing)
          return {
            message: `Qiymat juda katta: ${issue.origin} ${adj}${issue.maximum} ${sizing.unit} ${sizing.verb}`,
          };
        return { message: `Qiymat juda katta: ${adj}${issue.maximum}` };
      }

      case 'too_small': {
        const adj = issue.inclusive ? '>=' : '>';
        const sizing = getSizing(issue.origin);
        if (sizing)
          return {
            message: `Qiymat juda kichik: ${issue.origin} ${adj}${issue.minimum} ${sizing.unit} ${sizing.verb}`,
          };
        return { message: `Qiymat juda kichik: ${adj}${issue.minimum}` };
      }

      case 'invalid_format': {
        const invalidFormatIssue = issue as {
          format: string;
          prefix?: string;
          suffix?: string;
          includes?: string;
          pattern?: string;
        };

        if (invalidFormatIssue.format === 'starts_with')
          return {
            message: `Matn "${invalidFormatIssue.prefix}" bilan boshlanishi kerak`,
          };
        if (invalidFormatIssue.format === 'ends_with')
          return {
            message: `Matn "${invalidFormatIssue.suffix}" bilan tugashi kerak`,
          };
        if (invalidFormatIssue.format === 'includes')
          return {
            message: `Matn "${invalidFormatIssue.includes}" ni o‘z ichiga olishi kerak`,
          };
        if (invalidFormatIssue.format === 'regex')
          return {
            message: `Matn mos kelishi kerak: ${invalidFormatIssue.pattern}`,
          };

        return {
          message: `Yaroqsiz ${Nouns[invalidFormatIssue.format] ?? issue.format}`,
        };
      }

      case 'not_multiple_of':
        return {
          message: `Son ${issue.divisor} ga ko‘paytmasi bo‘lishi kerak`,
        };

      case 'unrecognized_keys':
        return {
          message: `Noma'lum kalit${issue.keys.length > 1 ? 'lar' : ''}: ${z.util.joinValues(issue.keys, ', ')}`,
        };

      case 'invalid_key':
        return { message: `Noto‘g‘ri kalit ${issue.origin} ichida` };

      case 'invalid_union':
        return { message: `Noto‘g‘ri qiymat` };

      case 'invalid_element':
        return { message: `Noto‘g‘ri element ${issue.origin} ichida` };

      default:
        return { message: `Noto‘g‘ri qiymat` };
    }
  };
};
