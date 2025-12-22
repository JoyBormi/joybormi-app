import FormField from '@/components/shared/form-field';
import { Input, Text } from '@/components/ui';
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
    <View className="gap-5">
      {/* Header */}
      <View className="bg-card/40 dark:bg-card/25 p-5 rounded-2xl border border-border/30">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-10 h-10 rounded-xl bg-primary/15 dark:bg-primary/25 items-center justify-center">
            <Icons.Shield className="text-primary" size={20} />
          </View>
          <Text className="text-lg font-bold text-foreground">
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
          label="Business Email"
          required
          className="gap-2"
          labelClassName="text-sm font-semibold text-foreground"
          message="This will be used for account verification and customer inquiries"
          render={({ field }) => (
            <Input
              placeholder="business@example.com"
              value={field.value as string}
              onChangeText={field.onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-12 text-base"
            />
          )}
        />

        <FormField
          control={control}
          name="phone"
          label="Business Phone"
          required
          className="gap-2"
          labelClassName="text-sm font-semibold text-foreground"
          message="Customers will use this to contact you"
          render={({ field }) => (
            <Input
              placeholder="+1 (555) 000-0000"
              value={field.value as string}
              onChangeText={field.onChange}
              keyboardType="phone-pad"
              className="h-12 text-base"
            />
          )}
        />

        <View className="h-px bg-border/30 my-2" />

        <FormField
          control={control}
          name="businessRegistrationNumber"
          label="Business Registration Number"
          required
          className="gap-2"
          labelClassName="text-sm font-semibold text-foreground"
          message="Your official business registration or tax ID number"
          render={({ field }) => (
            <Input
              placeholder="e.g., 123-45-6789"
              value={field.value as string}
              onChangeText={field.onChange}
              className="h-12 text-base"
            />
          )}
        />

        <FormField
          control={control}
          name="licenseDocument"
          label="Business License (Optional)"
          className="gap-2"
          labelClassName="text-sm font-semibold text-foreground"
          message="Upload your business license or operating permit (Coming soon)"
          render={({ field }) => (
            <View className="h-32 rounded-xl border-2 border-dashed border-border/50 bg-muted/20 items-center justify-center">
              <Icons.Upload className="text-muted-foreground mb-2" size={32} />
              <Text className="text-sm text-muted-foreground">
                Document upload coming soon
              </Text>
              <Text className="text-xs text-muted-foreground mt-1">
                You can add this later from settings
              </Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}
