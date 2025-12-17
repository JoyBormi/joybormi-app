import { FormField, FormFieldType } from '@/components/shared/fields';
import { Text } from '@/components/ui';
import { Control, FieldValues } from 'react-hook-form';
import { View } from 'react-native';

interface ContactInfoProps<T extends FieldValues> {
  control: Control<T>;
}

export function ContactInfo<T extends FieldValues>({
  control,
}: ContactInfoProps<T>) {
  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card/50 dark:bg-card/30 p-5 rounded-2xl backdrop-blur-sm">
        <Text className="font-title text-foreground">03. Contact</Text>
        <Text className="font-caption text-muted-foreground mt-1">
          How can customers reach you?
        </Text>
      </View>

      <View className="gap-4">
        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="email"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Email Address *
              </Text>
            }
            placeholder="your@email.com"
            keyboard="email-address"
            capitalize="none"
            required
            message={
              <View className="mt-2 bg-primary/10 dark:bg-primary/20 p-3 rounded-xl">
                <Text className="font-caption text-muted-foreground">
                  📧 We&apos;ll use this to verify your brand
                </Text>
              </View>
            }
          />
        </View>

        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="phone"
            fieldType={FormFieldType.INPUT}
            label={
              <Text className="font-caption text-foreground font-medium mb-2">
                Phone Number
              </Text>
            }
            placeholder="+1 (555) 000-0000"
            keyboard="phone-pad"
            message={
              <View className="mt-2 bg-success/10 dark:bg-success/20 p-3 rounded-xl">
                <Text className="font-caption text-muted-foreground">
                  📞 Customers will use this to contact you
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </View>
  );
}
