import { FormField, FormFieldType } from '@/components/shared/fields';
import { Text } from '@/components/ui';
import { Control, FieldValues } from 'react-hook-form';
import { View } from 'react-native';

interface BasicInfoProps<T extends FieldValues> {
  control: Control<T>;
}

export function BasicInfo<T extends FieldValues>({
  control,
}: BasicInfoProps<T>) {
  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card/50 dark:bg-card/30 p-5 rounded-2xl backdrop-blur-sm">
        <Text className="font-title text-foreground">01. Basic Info</Text>
        <Text className="font-caption text-muted-foreground mt-1">
          Tell us about your brand
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-4">
        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="brandName"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Brand Name *
              </Text>
            }
            placeholder="Your brand name"
            required
          />
        </View>

        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="description"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Description
              </Text>
            }
            placeholder="Describe your brand..."
            message={
              <View className="mt-2 bg-primary/10 dark:bg-primary/20 p-3 rounded-xl">
                <Text className="font-caption text-muted-foreground">
                  💡 What makes your brand unique?
                </Text>
              </View>
            }
          />
        </View>

        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="workingFields"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Working Fields *
              </Text>
            }
            placeholder="Hair Salon, Barbershop, Spa"
            required
            message={
              <View className="mt-2 bg-warning/10 dark:bg-warning/20 p-3 rounded-xl">
                <Text className="font-caption text-muted-foreground">
                  ⚠️ Enter 3-5 keywords, separated by commas
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}
