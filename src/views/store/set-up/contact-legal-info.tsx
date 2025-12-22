import FormField from '@/components/shared/form-field';
import { Input, PhoneInput, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { Control, FieldValues } from 'react-hook-form';
import { Pressable, View } from 'react-native';

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
          label="Business Email"
          required
          className="gap-2"
          labelClassName="text-base font-semibold text-foreground"
          message="This will be used for account verification and customer inquiries"
          render={({ field }) => (
            <Input
              placeholder="business@example.com"
              value={field.value as string}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              keyboardType="email-address"
              autoCapitalize="none"
              className="h-14 text-base border-2"
            />
          )}
        />

        <FormField
          control={control}
          name="phone"
          label="Business Phone"
          required
          className="gap-2"
          labelClassName="text-base font-semibold text-foreground"
          message="Customers will use this to contact you"
          render={({ field }) => (
            <PhoneInput
              placeholder="+1 (555) 000-0000"
              value={field.value as string}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              className="h-14 text-base border-2"
            />
          )}
        />

        <View className="h-px bg-border my-2" />

        <FormField
          control={control}
          name="businessRegistrationNumber"
          label="Business Registration Number"
          required
          className="gap-2"
          labelClassName="text-base font-semibold text-foreground"
          message="Your official business registration or tax ID number"
          render={({ field }) => (
            <Input
              placeholder="e.g., 123-45-6789"
              value={field.value as string}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              className="h-14 text-base border-2"
            />
          )}
        />

        <FormField
          control={control}
          name="licenseDocument"
          label="Business License (Optional)"
          className="gap-2"
          labelClassName="text-base font-semibold text-foreground"
          message="Upload your business license or operating permit"
          render={({ field }) => (
            <Pressable className="h-40 rounded-xl border-2 border-dashed border-border bg-muted/30 items-center justify-center">
              <Icons.Upload className="text-muted-foreground mb-3" size={36} />
              <Text className="text-base font-medium text-foreground mb-1">
                Upload Document
              </Text>
              <Text className="text-sm text-muted-foreground">
                PDF, JPG, or PNG (Max 5MB)
              </Text>
              <Text className="text-xs text-muted-foreground mt-2">
                Coming soon - You can add this later from settings
              </Text>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
