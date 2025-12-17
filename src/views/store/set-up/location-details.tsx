import { FormField, FormFieldType } from '@/components/shared/fields';
import { Text } from '@/components/ui';
import { Control, FieldValues } from 'react-hook-form';
import { View } from 'react-native';

interface LocationDetailsProps<T extends FieldValues> {
  control: Control<T>;
}

export function LocationDetails<T extends FieldValues>({
  control,
}: LocationDetailsProps<T>) {
  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card/50 dark:bg-card/30 p-5 rounded-2xl backdrop-blur-sm">
        <Text className="font-title text-foreground">02. Location</Text>
        <Text className="font-caption text-muted-foreground mt-1">
          Where is your brand located?
        </Text>
      </View>

      <View className="gap-4">
        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="country"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Country *
              </Text>
            }
            placeholder="Country"
            required
          />
        </View>

        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <View className="flex-row gap-4">
            <View className="flex-1">
              <FormField
                control={control}
                name="state"
                fieldType={FormFieldType.INPUT}
                label={
                  <Text className="font-caption text-foreground font-medium mb-2">
                    State
                  </Text>
                }
                placeholder="State"
              />
            </View>
            <View className="flex-1">
              <FormField
                control={control}
                name="city"
                fieldType={FormFieldType.INPUT}
                label={
                  <Text className="font-caption text-foreground font-medium mb-2">
                    City
                  </Text>
                }
                placeholder="City"
              />
            </View>
          </View>
        </View>

        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="street"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Street Address *
              </Text>
            }
            placeholder="123 Main Street"
            required
          />
        </View>

        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="detailedAddress"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Details
              </Text>
            }
            placeholder="Apartment, suite, floor..."
          />
        </View>

        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="postalCode"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Postal Code
              </Text>
            }
            placeholder="12345"
            keyboard="number-pad"
          />
        </View>
      </View>
    </View>
  );
}
