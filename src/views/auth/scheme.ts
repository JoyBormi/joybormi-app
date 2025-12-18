import { z } from 'zod';

export const loginSchema = z.object({
  method: z.enum(['email', 'phone']),
  email: z.string().optional(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

export type LoginFormType = z.infer<typeof loginSchema>;

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

const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .refine((data) => data.match(/^[a-zA-Z0-9_]+$/), {
    params: {
      customCode: 'custom.required',
    },
  });

const phoneSchema = z
  .string()
  .refine((data) => data.match(/^\+?[1-9]\d{1,14}$/), {
    params: {
      customCode: 'custom.required',
    },
  });

export const registerEmailSchema = z
  .object({
    username: usernameSchema,
    email: z.email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],

    params: {
      customCode: 'custom.required',
    },
  });

export const registerPhoneSchema = z
  .object({
    username: usernameSchema,
    phone: phoneSchema,
    password: z.string().min(6),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],

    params: {
      customCode: 'custom.required',
    },
  });

export type RegisterEmailFormType = z.infer<typeof registerEmailSchema>;
export type RegisterPhoneFormType = z.infer<typeof registerPhoneSchema>;
