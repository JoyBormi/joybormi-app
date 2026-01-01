import { Control, FieldValues, Path, UseFormSetFocus } from 'react-hook-form';
import { View } from 'react-native';

import FormField from '@/components/shared/form-field';
import { Input, PhoneInput, Text } from '@/components/ui';
import Icons from '@/lib/icons';

interface ContactsInfoProps<T extends FieldValues> {
  control: Control<T>;
  setFocus: UseFormSetFocus<T>;
}

export function ContactsInfo<T extends FieldValues>({
  control,
  setFocus,
}: ContactsInfoProps<T>) {
  return (
    <View className="gap-6 flex-1">
      {/* Header */}
      <View className="bg-card p-6 rounded-2xl border border-border">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Icons.User className="text-primary" size={22} />
          </View>
          <Text className="text-xl font-bold text-foreground">
            Contact Information
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground leading-5">
          Provide business contact details and owner information
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-5 flex-1">
        {/* Business Contact Section */}
        <View className="gap-1 mb-2">
          <Text className="text-base font-semibold text-foreground">
            Business Contact
          </Text>
          <Text className="text-sm text-muted-foreground">
            How customers can reach your business
          </Text>
        </View>

        <FormField
          control={control}
          name="email"
          label="Business Email (Optional)"
          message="This will be used for account verification and customer inquiries"
          render={({ field }) => (
            <Input
              placeholder="business@example.com"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => setFocus('phone' as Path<T>)}
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
          render={({ field }) => (
            <PhoneInput
              {...field}
              returnKeyType="next"
              onSubmitEditing={() => setFocus('ownerFirstName' as Path<T>)}
            />
          )}
        />

        {/* Divider */}
        <View className="h-px bg-border my-2" />

        {/* Owner Information Section */}
        <View className="gap-1 mb-2">
          <Text className="text-base font-semibold text-foreground">
            Owner Information
          </Text>
          <Text className="text-sm text-muted-foreground">
            Primary contact person for the business
          </Text>
        </View>

        <FormField
          control={control}
          name="ownerFirstName"
          label="First Name"
          required
          render={({ field }) => (
            <Input
              placeholder="John"
              {...field}
              returnKeyType="next"
              onSubmitEditing={() => setFocus('ownerLastName' as Path<T>)}
            />
          )}
        />

        <FormField
          control={control}
          name="ownerLastName"
          label="Last Name"
          required
          render={({ field }) => (
            <Input placeholder="Doe" {...field} returnKeyType="done" />
          )}
        />

        <View className="bg-primary/10 p-5 rounded-xl border border-primary/30">
          <View className="flex-row items-start gap-3">
            <Icons.Info className="text-primary mt-0.5" size={22} />
            <View className="flex-1">
              <Text className="text-base font-semibold text-foreground mb-2">
                Why do we need this?
              </Text>
              <Text className="text-sm text-muted-foreground leading-5">
                Owner information is required for account verification and legal
                compliance. This information will be kept private and secure.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
