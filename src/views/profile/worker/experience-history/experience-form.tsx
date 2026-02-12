import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Pressable, Switch, View } from 'react-native';

import Icons from '@/components/icons';
import { DatePickerSheet } from '@/components/shared/date-picker.sheet';
import FormField from '@/components/shared/form-field';
import { Button, Input, Text } from '@/components/ui';
import { toast } from '@/providers/toaster';
import { formatPickerDate } from '@/utils/date';

import {
  experienceFormSchema,
  getExperienceFormError,
  type ExperienceFormValues,
} from './validation';

type DateFieldKey = 'startDate' | 'endDate';

const FORM_CARD = 'rounded-2xl border border-primary/20 bg-primary/5 p-5 gap-4';
const BASE_INPUT = 'font-body';

interface ExperienceFormProps {
  initialValues: ExperienceFormValues;
  submitLabel: string;
  onSubmit: (values: ExperienceFormValues) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const ExperienceForm = memo(function ExperienceForm({
  initialValues,
  submitLabel,
  onSubmit,
  onCancel,
  loading,
}: ExperienceFormProps) {
  const form = useForm({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: initialValues,
  });

  const datePickerRef = useRef<BottomSheetModal>(null);
  const [activeDateField, setActiveDateField] = useState<DateFieldKey | null>(
    null,
  );

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const isCurrent = useWatch({ control: form.control, name: 'isCurrent' });
  const startDate = useWatch({ control: form.control, name: 'startDate' });
  const endDate = useWatch({ control: form.control, name: 'endDate' });

  const openDatePicker = useCallback((field: DateFieldKey) => {
    setActiveDateField(field);
    datePickerRef.current?.present();
  }, []);

  const handleDateChange = useCallback(
    (date: string) => {
      if (!activeDateField) return;

      form.setValue(activeDateField, date, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      datePickerRef.current?.dismiss();
      setActiveDateField(null);
    },
    [activeDateField, form],
  );

  const startDateLabel = useMemo(() => {
    if (!startDate) return 'Start date';
    return formatPickerDate(startDate);
  }, [startDate]);

  const endDateLabel = useMemo(() => {
    if (isCurrent) return 'Present';
    if (!endDate) return 'End date';
    return formatPickerDate(endDate);
  }, [endDate, isCurrent]);

  const datePickerTitle =
    activeDateField === 'endDate' ? 'End Date' : 'Start Date';

  const handleInvalidSubmit = useCallback(() => {
    const errorMessage = getExperienceFormError(form.formState.errors);
    if (!errorMessage) return;
    toast.error({ title: errorMessage });
  }, [form.formState.errors]);

  return (
    <View className={FORM_CARD}>
      <View className="flex-row items-center gap-2">
        <View className="rounded-full bg-card p-2">
          <Icons.Briefcase size={16} className="text-primary" />
        </View>
        <Text className="font-subtitle text-foreground">{submitLabel}</Text>
      </View>

      <View className="gap-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <Input
              placeholder="Job title"
              {...field}
              className={BASE_INPUT}
              returnKeyType="next"
              onSubmitEditing={() => form.setFocus('company')}
            />
          )}
        />

        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <Input
              placeholder="Company"
              {...field}
              className={BASE_INPUT}
              returnKeyType="next"
            />
          )}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <FormField
              control={form.control}
              name="startDate"
              render={() => (
                <Pressable
                  onPress={() => openDatePicker('startDate')}
                  className="h-14 flex-row items-center justify-between rounded-lg border border-input bg-muted/80 px-3 dark:bg-muted/50"
                >
                  <Text className="font-subbody text-foreground">
                    {startDateLabel}
                  </Text>
                  <Icons.Calendar size={16} className="text-muted-foreground" />
                </Pressable>
              )}
            />
          </View>

          <View className="flex-1">
            <FormField
              control={form.control}
              name="endDate"
              render={() => (
                <Pressable
                  disabled={isCurrent}
                  onPress={() => openDatePicker('endDate')}
                  className="h-14 flex-row items-center justify-between rounded-lg border border-input bg-muted/80 px-3 dark:bg-muted/50 disabled:opacity-40"
                >
                  <Text className="font-subbody text-foreground">
                    {endDateLabel}
                  </Text>
                  <Icons.Calendar size={16} className="text-muted-foreground" />
                </Pressable>
              )}
            />
          </View>
        </View>

        <FormField
          control={form.control}
          name="isCurrent"
          render={({ field }) => (
            <Pressable
              onPress={() => {
                const nextValue = !Boolean(field.value);
                field.onChangeText(nextValue);
                if (nextValue) {
                  form.setValue('endDate', '', {
                    shouldDirty: true,
                    shouldTouch: true,
                    shouldValidate: true,
                  });
                }
              }}
              className="flex-row items-center justify-between rounded-xl border border-input bg-muted/80 px-4 py-3 dark:bg-muted/50"
            >
              <Text className="mr-3 flex-1 font-subbody text-foreground">
                I currently work here
              </Text>
              <Switch
                value={Boolean(field.value)}
                onValueChange={(value) => {
                  field.onChangeText(value);
                  if (value) {
                    form.setValue('endDate', '', {
                      shouldDirty: true,
                      shouldTouch: true,
                      shouldValidate: true,
                    });
                  }
                }}
              />
            </Pressable>
          )}
        />
      </View>

      <View className="mt-1 flex-row gap-2">
        <Button
          size="lg"
          className="flex-1"
          onPress={form.handleSubmit(onSubmit, handleInvalidSubmit)}
          loading={loading}
        >
          <Text>{submitLabel}</Text>
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          onPress={onCancel}
        >
          <Text>Cancel</Text>
        </Button>
      </View>

      <DatePickerSheet
        ref={datePickerRef}
        value={
          activeDateField === 'endDate' ? endDate || startDate || '' : startDate
        }
        onChange={handleDateChange}
        title={datePickerTitle}
      />
    </View>
  );
});
