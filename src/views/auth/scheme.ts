import { z } from 'zod';

import { normalizePhone, PASSWORD_REGEX, PHONE_REGEX } from '@/lib/utils';
import { required } from '@/utils/zod-intl';

const usernameSchema = required(
  z.string().refine((v) => /^[a-zA-Z0-9_ ]+$/.test(v), {
    params: { customCode: 'custom.username_invalid' },
  }),
);

const emailSchema = z.email();
const phoneSchema = required(
  z.string().refine((v) => PHONE_REGEX.test(normalizePhone(v)), {
    params: { customCode: 'custom.phone_invalid' },
  }),
);

const passwordSchema = required(
  z.string().refine((v) => PASSWORD_REGEX.test(v), {
    params: { customCode: 'custom.password_invalid' },
  }),
);

const confirmPasswordSchema = required(z.string());

// Login schema
export const loginSchema = z
  .object({
    method: z.enum(['email', 'phone']),
    email: z.string().optional(),
    phone: z.string().optional(),
    password: z.string().min(6),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email' && !data.email) {
      ctx.addIssue({
        path: ['email'],
        code: 'custom',
        params: { customCode: 'custom.required' },
      });
    } else if (data.method === 'email' && data.email) {
      const result = emailSchema.safeParse(data.email);
      if (!result.success) {
        ctx.addIssue({
          path: ['email'],
          code: 'custom',
          params: { customCode: 'custom.email_invalid' },
        });
      }
    }

    if (data.method === 'phone') {
      const result = phoneSchema.safeParse(data.phone);
      if (!result.success) {
        ctx.addIssue({
          path: ['phone'],
          code: 'custom',
          params: { customCode: 'custom.phone_invalid' },
        });
      }
    }
  });
export type LoginFormType = z.infer<typeof loginSchema>;

// Forgot password schema
export const forgotPwdEmailSchema = z.object({
  email: z.email(),
  code: z.string().optional(),
});

export const forgotPwdCodeSchema = z.object({
  email: z.email(),
  code: z.string().length(6),
});

export type ForgotPwdEmailFormType = z.infer<typeof forgotPwdEmailSchema>;
export type ForgotPwdCodeFormType = z.infer<typeof forgotPwdCodeSchema>;

export const forgotPwdPhoneSchema = z.object({
  phone: z.string().refine((data) => data.match(/^\+?[1-9]\d{1,14}$/), {
    params: {
      customCode: 'custom.required',
    },
  }),
  code: z.string().optional(),
});

export const forgotPwdPhoneCodeSchema = z.object({
  phone: z.string().refine((data) => data.match(/^\+?[1-9]\d{1,14}$/), {
    params: {
      customCode: 'custom.required',
    },
  }),
  code: z.string().length(6),
});

export type ForgotPwdPhoneFormType = z.infer<typeof forgotPwdPhoneSchema>;
export type ForgotPwdPhoneCodeFormType = z.infer<
  typeof forgotPwdPhoneCodeSchema
>;

export const resetPwdSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],

    params: {
      customCode: 'custom.required',
    },
  });

export type ResetPwdFormType = z.infer<typeof resetPwdSchema>;

export const registerUserSchema = z
  .object({
    method: z.enum(['email', 'phone']),
    identifier: z.string(),
    username: usernameSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    params: { customCode: 'custom.password_not_match' },
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
      const result = emailSchema.safeParse(data.identifier);
      if (!result.success) {
        ctx.addIssue({
          path: ['identifier'],
          code: 'custom',
          params: { customCode: 'custom.email_invalid' },
        });
      }
    }

    if (data.method === 'phone') {
      const result = phoneSchema.safeParse(data.identifier);
      if (!result.success) {
        ctx.addIssue({
          path: ['identifier'],
          code: 'custom',
          params: { customCode: 'custom.phone_invalid' },
        });
      }
    }
  });

export type RegisterUserFormType = z.infer<typeof registerUserSchema>;
