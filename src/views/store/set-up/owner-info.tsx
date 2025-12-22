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
    <View className="gap-5">
      {/* Header */}
      <View className="bg-card/40 dark:bg-card/25 p-5 rounded-2xl border border-border/30">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-10 h-10 rounded-xl bg-primary/15 dark:bg-primary/25 items-center justify-center">
            <Icons.User className="text-primary" size={20} />
          </View>
          <Text className="text-lg font-bold text-foreground">
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
          className="gap-2"
          labelClassName="text-sm font-semibold text-foreground"
          render={({ field }) => (
            <Input
              placeholder="John"
              value={field.value as string}
              onChangeText={field.onChange}
              className="h-12 text-base"
            />
          )}
        />

        <FormField
          control={control}
          name="ownerLastName"
          label="Last Name"
          required
          className="gap-2"
          labelClassName="text-sm font-semibold text-foreground"
          render={({ field }) => (
            <Input
              placeholder="Doe"
              value={field.value as string}
              onChangeText={field.onChange}
              className="h-12 text-base"
            />
          )}
        />

        <View className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl border border-primary/20">
          <View className="flex-row items-start gap-3">
            <Icons.Info className="text-primary mt-0.5" size={20} />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground mb-1">
                Why do we need this?
              </Text>
              <Text className="text-xs text-muted-foreground leading-5">
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
