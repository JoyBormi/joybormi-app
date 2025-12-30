import FormField from '@/components/shared/form-field';
import { Input, Text, Textarea } from '@/components/ui';
import Icons from '@/lib/icons';
import { Control, FieldValues } from 'react-hook-form';
import { View } from 'react-native';

interface BasicInfoProps<T extends FieldValues> {
  control: Control<T>;
}

export function BasicInfo<T extends FieldValues>({
  control,
}: BasicInfoProps<T>) {
  return (
    <View className="gap-6 flex-1">
      {/* Header */}
      <View className="bg-card p-6 rounded-2xl border border-border">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Icons.FileText className="text-primary" size={22} />
          </View>
          <Text className="text-xl font-bold text-foreground">
            Basic Information
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground leading-5">
          Tell us about your brand and what services you offer
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-5 flex-1">
        <FormField
          control={control}
          name="brandName"
          label="Brand Name"
          required
          labelClassName="text-base font-semibold text-foreground"
          render={({ field }) => (
            <Input placeholder="e.g., Elite Hair Studio" {...field} />
          )}
        />

        <FormField
          control={control}
          name="businessCategory"
          label="Business Category"
          required
          labelClassName="text-base font-semibold text-foreground"
          message="Select the primary category that best describes your business"
          render={({ field }) => (
            <Input
              placeholder="e.g., Hair Salon, Barbershop, Spa, Beauty Salon"
              {...field}
            />
          )}
        />

        <FormField
          control={control}
          name="description"
          label="Description (Optional)"
          className="min-h-[100px]"
          labelClassName="text-base font-semibold text-foreground"
          message="Briefly describe what makes your brand unique"
          render={({ field }) => (
            <Textarea
              placeholder="Tell customers about your brand..."
              {...field}
            />
          )}
        />
      </View>
    </View>
  );
}
