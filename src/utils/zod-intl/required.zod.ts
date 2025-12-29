import z from 'zod';

export const required = <T extends z.ZodTypeAny>(schema: T) =>
  schema.refine(
    (value) => value !== undefined && value !== null && value !== '',
    { params: { customCode: 'custom.required' } },
  );
