import FormField from '@/components/shared/form-field';
import { Input, Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { Control, FieldValues } from 'react-hook-form';
import { View } from 'react-native';

interface OwnerInfoProps<T extends FieldValues> {
  control: Control<T>;
}

export function OwnerInfo<T extends FieldValues>({
  control,
}: OwnerInfoProps<T>) {
  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card p-6 rounded-2xl border-border border">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Icons.User className="text-primary" size={22} />
          </View>
          <Text className="text-xl font-bold text-foreground">
            Owner Information
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground leading-5">
          Tell us about the business owner or primary contact person
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-5">
        <FormField
          control={control}
          name="ownerFirstName"
          label="First Name"
          required
          render={({ field }) => <Input placeholder="John" {...field} />}
        />

        <FormField
          control={control}
          name="ownerLastName"
          label="Last Name"
          required
          render={({ field }) => <Input placeholder="Doe" {...field} />}
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
