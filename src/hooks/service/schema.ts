import z from 'zod';

import { required } from '@/utils/zod-intl';

export const serviceSchema = z.object({
  name: required(z.string()),
  description: z.string().optional(),
  durationMins: z.string().refine((value) => parseInt(value) >= 15, {
    params: {
      customCode: 'service.validation.durationMin',
    },
  }),
  price: required(z.string()),
  currency: z.string(),
  ownerType: z.string(),
});

export type ServiceFormData = z.infer<typeof serviceSchema>;
