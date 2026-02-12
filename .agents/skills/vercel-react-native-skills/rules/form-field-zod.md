# Form Field + Zod Standard

## Intent

Enforce one consistent form architecture across React Native screens:

- UI inputs must be wrapped with `src/components/shared/form-field.tsx`
- Validation must be implemented with `zod`
- Form state must be managed with `react-hook-form`

## Required Pattern

1. Define a `zod` schema for the form data.
2. Infer form types from the schema with `z.infer<typeof schema>`.
3. Initialize `useForm` with `zodResolver(schema)`.
4. Render every editable field via `FormField`.
5. Keep inline validation messages in `FormField`; avoid ad-hoc manual validators.
6. Follow i18n validation style from `src/lib/validation/auth.ts`:

- Use `required(...)` helper from `src/utils/zod-intl/required.zod.ts` for required-field rules.
- Use `params: { customCode: '...' }` in `refine`/`addIssue` for translatable errors.
- Avoid hardcoded localized strings inside schema rules.

## Correct Example

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import FormField from '@/components/shared/form-field';
import { Input } from '@/components/ui/input';
import { required } from '@/utils/zod-intl/required.zod';

const schema = z.object({
  title: required(z.string().trim()),
});

type FormValues = z.infer<typeof schema>;

const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { title: '' },
});

<FormField
  control={form.control}
  name="title"
  render={({ field }) => <Input {...field} placeholder="Title" />}
/>;
```

## Anti-Patterns

- Manual `validateX()` functions for form fields when `zod` is available.
- Mixing local `useState` field state with `react-hook-form` for the same input.
- Rendering `Input`, `Select`, `Textarea`, or pickers directly without `FormField`.
- Hardcoding validation strings in submit handlers instead of schema rules.
- Hardcoding i18n messages in schema when `customCode` can be used.

## Notes

- Use `useWatch` for derived UI (e.g., disable end date when `isCurrent` is true).
- Keep schema and payload mapping separated: schema validates form shape, mapper adapts API payload.
- Prefer reusable schema files for shared forms; keep local schemas only for screen-specific forms.
