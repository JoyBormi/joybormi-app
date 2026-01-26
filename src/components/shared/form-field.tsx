/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from 'react';
import {
  Control,
  Controller,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
  Path,
} from 'react-hook-form';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

type FormFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  message?: string;
  messageClassName?: string;
  loading?: boolean;
  render: (params: {
    field: ControllerRenderProps<T, FieldPath<T>> & {
      onChangeText: (value: string) => void;
    };
    fieldState: { error?: { message?: string } };
    formState: any;
  }) => React.ReactNode;
};
/**
 *
 * @param inputProps
 * @returns
 */
const adaptRNInput = <T extends FieldValues>(
  inputProps: ControllerRenderProps<T, Path<T>>,
) => {
  return {
    onChangeText: inputProps.onChange,
    value: inputProps.value,
    onBlur: inputProps.onBlur,
    onChange: undefined as any,
    name: inputProps.name,
    ref: inputProps.ref,
  };
};

/**
 * Cross-platform version of shadcn/ui FormField for React Native + Expo
 */
const FormField = memo(<T extends FieldValues>(props: FormFieldProps<T>) => {
  const {
    control,
    name,
    label,
    required,
    className,
    labelClassName,
    message,
    messageClassName,
    loading,
    render,
  } = props;
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      render={({ field, fieldState, formState }) => (
        <View className={className}>
          {label && (
            <Text
              className={cn('mb-1.5 font-body text-foreground', labelClassName)}
            >
              {label}
              {required && <Text className="text-destructive">*</Text>}
            </Text>
          )}

          {loading ? (
            <View className="py-2 h-10 w-full rounded-md border border-input bg-muted animate-pulse" />
          ) : (
            render({ field: adaptRNInput(field), fieldState, formState })
          )}

          {message && (
            <Text
              className={cn(
                'text-muted-foreground font-base mt-1.5',
                messageClassName,
              )}
            >
              {message}
            </Text>
          )}

          {fieldState.error && (
            <Text className="text-destructive font-base mt-1">
              {fieldState.error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
});

FormField.displayName = 'FormField';

export default FormField as <T extends FieldValues>(
  props: FormFieldProps<T>,
) => React.ReactElement;
