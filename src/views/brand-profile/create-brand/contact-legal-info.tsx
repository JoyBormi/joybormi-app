import FormField from '@/components/shared/form-field';
import { Input, PhoneInput, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { Control, FieldValues } from 'react-hook-form';
import { View } from 'react-native';

interface ContactLegalInfoProps<T extends FieldValues> {
  control: Control<T>;
}

export function ContactLegalInfo<T extends FieldValues>({
  control,
}: ContactLegalInfoProps<T>) {
  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card p-6 rounded-2xl border-border-border">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Icons.Shield className="text-primary" size={22} />
          </View>
          <Text className="text-xl font-bold text-foreground">
            Contact & Legal
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground leading-5">
          Provide contact information and business registration details
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-5">
        <FormField
          control={control}
          name="email"
          label="Business Email (Optional)"
          message="This will be used for account verification and customer inquiries"
          render={({ field }) => (
            <Input
              placeholder="business@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              {...field}
            />
          )}
        />

        <FormField
          control={control}
          name="phone"
          label="Business Phone"
          required
          message="Customers will use this to contact you"
          render={({ field }) => <PhoneInput {...field} />}
        />
      </View>
    </View>
  );
}
