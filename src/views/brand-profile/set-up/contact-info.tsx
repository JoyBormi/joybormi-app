import FormField from '@/components/shared/form-field';
import { Input, Text } from '@/components/ui';
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
            required
            render={(field) => (
              <Input
                {...field}
                placeholder="your@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            )}
            message="📧 We'll use this to verify your brand"
          />
        </View>

        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <FormField
            control={control}
            name="phone"
            required
            render={(field) => (
              <Input
                {...field}
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                autoCapitalize="none"
              />
            )}
            message="📞 Customers will use this to contact you"
          />
        </View>
      </View>
    </View>
  );
}
