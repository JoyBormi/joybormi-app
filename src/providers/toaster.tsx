// sonner-toast.tsx
// High-quality Sonner-style toast for Expo + NativeWind
// Uses react-native-toast-message as the engine
// Fully type-safe, single-file implementation

import React from 'react';
import { Text, View } from 'react-native';
import Toast, {
  ToastConfig,
  ToastConfigParams,
} from 'react-native-toast-message';

import Icons from '@/components/icons';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

// Allowed toast variants (closed union → type-safe)
type ToastVariant = 'success' | 'error' | 'info' | 'warning';

// Custom props passed through Toast.show → props
type SonnerProps = {
  variant: ToastVariant;
};

// Shared icon contract (matches lucide-style icons)
type IconType = React.ComponentType<{
  size?: number;
  className?: string;
}>;

/* -------------------------------------------------------------------------- */
/*                              Variant Mapping                               */
/* -------------------------------------------------------------------------- */

// Centralized variant → visual mapping
const variantStyles: Record<
  ToastVariant,
  {
    Icon: IconType;
    iconClass: string;
    borderClass: string;
  }
> = {
  success: {
    Icon: Icons.CheckCircle,
    iconClass: 'text-emerald-500',
    borderClass: 'border-emerald-500/20',
  },
  error: {
    Icon: Icons.X,
    iconClass: 'text-red-500',
    borderClass: 'border-red-500/20',
  },
  info: {
    Icon: Icons.Info,
    iconClass: 'text-blue-500',
    borderClass: 'border-blue-500/20',
  },
  warning: {
    Icon: Icons.AlertCircle,
    iconClass: 'text-amber-500',
    borderClass: 'border-amber-500/20',
  },
};

/* -------------------------------------------------------------------------- */
/*                             Toast UI Component                              */
/* -------------------------------------------------------------------------- */

// Sonner-style toast layout
export function SonnerToast(params: ToastConfigParams<SonnerProps>) {
  const { text1, text2, props } = params;

  // Variant is guaranteed by ToastConfig
  const { Icon, iconClass, borderClass } = variantStyles[props.variant];

  return (
    <View
      className={cn(
        `w-[92%] flex-row gap-3 rounded-xl border bg-background px-4 py-3 shadow-md`,
        borderClass,
      )}
    >
      {/* Left icon */}
      <Icon size={22} className={cn(`mt-0.5`, iconClass)} />

      {/* Content */}
      <View className="flex-1">
        {text1 ? (
          <Text className="font-body text-foreground">{text1}</Text>
        ) : null}

        {text2 ? (
          <Text className="mt-0.5 font-base text-muted-foreground">
            {text2}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Toast Config                                  */
/* -------------------------------------------------------------------------- */

// Maps toast "type" → SonnerToast with correct variant
export const toastConfig: ToastConfig = {
  success: (p) => <SonnerToast {...p} props={{ variant: 'success' }} />,
  error: (p) => <SonnerToast {...p} props={{ variant: 'error' }} />,
  info: (p) => <SonnerToast {...p} props={{ variant: 'info' }} />,
  warning: (p) => <SonnerToast {...p} props={{ variant: 'warning' }} />,
};

/* -------------------------------------------------------------------------- */
/*                          Sonner-like Public API                              */
/* -------------------------------------------------------------------------- */

type ToastInput = {
  title: string;
  description?: string;
};

// Internal helper (keeps API DRY)
function showToast(type: ToastVariant, { title, description }: ToastInput) {
  Toast.show({
    type,
    text1: title,
    text2: description,
  });
}

// Public API (matches shadcn/sonner ergonomics)
export const toast = {
  success: (data: ToastInput) => showToast('success', data),
  error: (data: ToastInput) => showToast('error', data),
  info: (data: ToastInput) => showToast('info', data),
  warning: (data: ToastInput) => showToast('warning', data),
};

/* -------------------------------------------------------------------------- */
/*                              Toast Provider                                 */
/* -------------------------------------------------------------------------- */

// Mount ONCE at app root
export function ToastProvider() {
  return <Toast config={toastConfig} position="top" />;
}

// Default export = toast API
export default toast;
