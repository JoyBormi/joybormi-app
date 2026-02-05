import { z } from 'zod';

import { PASSWORD_REGEX, PHONE_REGEX } from '@/lib/regex';
import { normalizePhone } from '@/lib/utils';
import { required } from '@/utils/zod-intl';

export const usernameSchema = required(
  z.string().refine((v) => /^[a-zA-Z0-9_ ]+$/.test(v), {
    params: { customCode: 'custom.username_invalid' },
  }),
);

export const emailSchema = z.email();
export const phoneSchema = required(
  z.string().refine((v) => PHONE_REGEX.test(normalizePhone(v)), {
    params: { customCode: 'custom.phone_invalid' },
  }),
);
export const passwordSchema = required(
  z.string().refine((v) => PASSWORD_REGEX.test(v), {
    params: { customCode: 'custom.password_invalid' },
  }),
);
export const confirmPasswordSchema = required(z.string());

export const otpSchema = z
  .string()
  .regex(/^\d{6}$/, { message: 'custom.otp_invalid' })
  .optional()
  .or(z.literal(''));

// ───────────────── SCHEMAS ────────────────── //

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

export const forgotPasswordSchema = z
  .object({
    method: z.enum(['email', 'phone']),
    email: z.string().optional(),
    phone: z.string().optional(),
    codeSent: z.boolean().optional(),
    code: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.method === 'email') {
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

    if (data.codeSent && !otpSchema.safeParse(data.code).success) {
      ctx.addIssue({
        path: ['code'],
        code: 'custom',
        params: { customCode: 'custom.otp_invalid' },
      });
    }
  });

export const resetPasswordSchema = z
  .object({
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    params: { customCode: 'custom.required' },
  });

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

export type LoginFormType = z.infer<typeof loginSchema>;
export type RegisterUserFormType = z.infer<typeof registerUserSchema>;
export type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;
