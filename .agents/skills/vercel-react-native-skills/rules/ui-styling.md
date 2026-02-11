---
title: JoyBormi React Native Styling Standards
impact: HIGH
impactDescription: strict design consistency, scalable UI system, enforced class composition
tags: styling, nativewind, tokens, layout, cn, consistency
---

## JoyBormi Styling Standards

Follow these patterns strictly.

---

## 1. Always Use Semantic Tokens (Never Hardcode Colors)

Use only theme tokens:

- bg-background
- bg-card
- bg-primary
- bg-muted
- bg-secondary
- bg-destructive
- text-foreground
- text-muted-foreground
- border-border

```tsx
// ❌ Incorrect
<View className="bg-white" />

// ✅ Correct
<View className="bg-card" />
```

---

## 2. Typography: Use Utilities Only

Do not use `text-sm`, `text-lg`, etc.

Allowed:

- font-heading
- font-title
- font-subtitle
- font-body
- font-subbody
- font-caption
- font-base

```tsx
// ❌ Incorrect
<Text className="text-lg font-bold">Title</Text>

// ✅ Correct
<Text className="font-title text-foreground">
  Title
</Text>
```

Hierarchy = typography token + semantic color.

---

## 3. Spacing: Use Scale Only

Use spacing scale (`xs → 4xl`)

No arbitrary values like `p-[13px]`.

```tsx
// ❌ Incorrect
<View className="p-[15px]" />

// ✅ Correct
<View className="p-4xl" />
```

Use:

- `p-*` → internal spacing
- `gap-*` → spacing between children

---

## 4. Use `gap` Instead of Margins

```tsx
// ❌ Incorrect
<View>
  <Text className="mb-lg">Title</Text>
  <Text className="mb-lg">Subtitle</Text>
</View>

// ✅ Correct
<View className="gap-lg">
  <Text className="font-title text-foreground">Title</Text>
  <Text className="font-body text-muted-foreground">Subtitle</Text>
</View>
```

No margin stacking between siblings.

---

## 5. Always Use `cn()` for Class Composition

All conditional or dynamic classes must use:

```ts
import { cn } from '@/lib/utils';
```

Never use template string interpolation inside `className`.

### ❌ Incorrect

```tsx
<Text
  className={`font-body ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
/>
```

### ✅ Correct

```tsx
import { cn } from '@/lib/utils';

<Text
  className={cn(
    'font-body',
    isActive ? 'text-primary' : 'text-muted-foreground',
  )}
/>;
```

---

## 6. Extract Conditional Logic Outside JSX

Do not compute logic inside JSX.

### ❌ Incorrect

```tsx
<View
  className={cn(
    'p-4xl rounded-xl',
    isSelected && 'bg-primary'
  )}
>
```

### ✅ Correct

```tsx
<View
  className={cn('p-4xl rounded-xl', isSelected ? 'bg-primary' : 'bg-card')}
/>
```

---

## 7. Border Radius Must Use Token Scale

Use only:

- rounded-xs
- rounded-sm
- rounded-md
- rounded-lg
- rounded-xl
- rounded-2xl
- rounded-3xl
- rounded-4xl

```tsx
// ❌ Incorrect
<View className="rounded-[14px]" />

// ✅ Correct
<View className="rounded-xl" />
```

---

## 8. Shadows: Use `boxShadow`

Do not use:

- elevation
- shadowColor objects

```tsx
<View
  className="bg-card rounded-xl p-4xl"
  style={{
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
  }}
/>
```

Use sparingly.

---

## 9. Gradients (If Required)

No third-party gradient libraries.

```tsx
<View
  className="rounded-xl"
  style={{
    experimental_backgroundImage:
      'linear-gradient(to bottom, hsl(var(--primary)), hsl(var(--secondary)))',
  }}
/>
```

---

## Non-Negotiable Rules

1. No hardcoded colors
2. No arbitrary spacing
3. No custom font sizes
4. No inline template string classNames
5. All dynamic classes must use `cn()`
6. Prefer `gap` over margins
7. Use semantic tokens only
8. Use typography utilities only

This ensures:

- Design consistency
- Dark mode compatibility
- Predictable scaling
- Clean class composition
- Long-term maintainability

```

```
