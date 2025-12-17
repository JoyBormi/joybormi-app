import { Text } from '@/components/ui';
import { Select, SelectItem } from '@/components/ui/select';
import React from 'react';
import { Controller, FieldValues, Path } from 'react-hook-form';
import { BaseFieldProps } from './form';

export function SelectField<T extends FieldValues>(props: BaseFieldProps<T>) {
  return (
    <Controller
      control={props.control}
      name={props.name as Path<T>}
      render={({ field, fieldState }) => (
        <>
          <Select value={field.value} onValueChange={field.onChange}>
            {props.options?.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                label={opt.label}
                disabled={opt.disabled}
              />
            ))}
          </Select>
          {fieldState.error?.message && (
            <Text className="text-destructive mt-0.5 pl-1 font-caption">
              {fieldState.error.message}
            </Text>
          )}
        </>
      )}
    />
  );
}
