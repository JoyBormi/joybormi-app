# Typography Tokens

## Intent

Keep text styling consistent with the project's Tailwind typography tokens from `tailwind.config.js`.

## Required Pattern

Use these semantic classes instead of raw Tailwind font-size/weight utilities:

- `font-heading`
- `font-title`
- `font-subtitle`
- `font-body`
- `font-subbody`
- `font-caption`
- `font-base`

## Do Not Use

- `text-2xl`, `text-xl`, `text-lg`, `text-sm`, etc. for app typography scale.
- `font-bold`, `font-semibold`, `font-medium` for app typography hierarchy.

## Why

- Typography scale is already defined with exact size + line-height + family.
- Font weights are controlled by tokenized classes with Montserrat mappings.
- Prevents inconsistent UI and design drift across screens.

## Example

```tsx
// Bad
<Text className="text-2xl font-bold">Profile</Text>

// Good
<Text className="font-heading">Profile</Text>
```
