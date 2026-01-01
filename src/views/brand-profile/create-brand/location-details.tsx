import { Control, FieldValues, Path, UseFormSetFocus } from 'react-hook-form';
import { View } from 'react-native';

import FormField from '@/components/shared/form-field';
import { Input, Text } from '@/components/ui';
import Icons from '@/lib/icons';

interface LocationDetailsProps<T extends FieldValues> {
  control: Control<T>;
  setFocus: UseFormSetFocus<T>;
}

export function LocationDetails<T extends FieldValues>({
  control,
  setFocus,
}: LocationDetailsProps<T>) {
  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card p-6 rounded-2xl border-border border">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Icons.MapPin className="text-primary" size={22} />
          </View>
          <Text className="text-xl font-bold text-foreground">Location</Text>
        </View>
        <Text className="text-sm text-muted-foreground leading-5">
          Where is your business physically located?
        </Text>
      </View>

      <View className="gap-5">
        <FormField
          control={control}
          name="country"
          label="Country"
          required
          className="gap-2"
          render={({ field }) => (
            <Input
              placeholder="e.g., United States"
              returnKeyType="next"
              onSubmitEditing={() => setFocus('state' as Path<T>)}
              {...field}
            />
          )}
        />

        <View className="flex-row gap-3">
          <FormField
            control={control}
            name="state"
            label="State/Province"
            required
            className="flex-1 gap-2"
            render={({ field }) => (
              <Input
                placeholder="State"
                returnKeyType="next"
                onSubmitEditing={() => setFocus('city' as Path<T>)}
                {...field}
              />
            )}
          />

          <FormField
            control={control}
            name="city"
            label="City (Optional)"
            className="flex-1 gap-2"
            render={({ field }) => (
              <Input
                placeholder="City"
                returnKeyType="next"
                onSubmitEditing={() => setFocus('street' as Path<T>)}
                {...field}
              />
            )}
          />
        </View>

        <FormField
          control={control}
          name="street"
          label="Street Address"
          required
          className="gap-2"
          render={({ field }) => (
            <Input
              placeholder="123 Main Street"
              returnKeyType="next"
              onSubmitEditing={() => setFocus('detailedAddress' as Path<T>)}
              {...field}
            />
          )}
        />

        <FormField
          control={control}
          name="detailedAddress"
          label="Detailed Address (Optional)"
          className="gap-2"
          message="Apartment, suite, floor, building, etc."
          render={({ field }) => (
            <Input
              placeholder="Suite 200, Floor 3"
              returnKeyType="next"
              onSubmitEditing={() => setFocus('postalCode' as Path<T>)}
              {...field}
            />
          )}
        />

        <FormField
          control={control}
          name="postalCode"
          label="Postal Code"
          required
          className="gap-2"
          render={({ field }) => (
            <Input placeholder="12345" returnKeyType="done" {...field} />
          )}
        />
      </View>
    </View>
  );
}
