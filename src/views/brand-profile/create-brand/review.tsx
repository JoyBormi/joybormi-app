import { Text } from '@/components/ui';
import Icons from '@/lib/icons';
import { Control, FieldValues, useWatch } from 'react-hook-form';
import { View } from 'react-native';

interface ReviewProps<T extends FieldValues> {
  control: Control<T>;
}

export function Review<T extends FieldValues>({ control }: ReviewProps<T>) {
  const formData = useWatch({ control });

  const InfoRow = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined;
  }) => (
    <View className="flex-row py-2 border-b border-border/20">
      <Text className="text-sm text-muted-foreground w-32">{label}</Text>
      <Text className="text-sm text-foreground font-medium flex-1">
        {value || 'Not provided'}
      </Text>
    </View>
  );

  return (
    <View className="gap-5">
      {/* Header */}
      <View className="bg-card/40 dark:bg-card/25 p-5 rounded-2xl border border-border/30">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-10 h-10 rounded-xl bg-primary/15 dark:bg-primary/25 items-center justify-center">
            <Icons.CheckCircle className="text-primary" size={20} />
          </View>
          <Text className="text-lg font-bold text-foreground">
            Review & Submit
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground leading-5">
          Please review all information before submitting your brand
          registration
        </Text>
      </View>

      <View className="gap-4">
        {/* Basic Info Card */}
        <View className="bg-card/40 dark:bg-card/25 rounded-2xl border border-border/30 overflow-hidden">
          <View className="bg-primary/10 dark:bg-primary/15 px-4 py-3 flex-row items-center gap-2">
            <Icons.FileText className="text-primary" size={18} />
            <Text className="text-base font-bold text-foreground">
              Basic Information
            </Text>
          </View>
          <View className="p-4">
            <InfoRow label="Brand Name" value={formData.brandName} />
            <InfoRow label="Category" value={formData.businessCategory} />
            <InfoRow label="Description" value={formData.description} />
          </View>
        </View>

        {/* Location Card */}
        <View className="bg-card/40 dark:bg-card/25 rounded-2xl border border-border/30 overflow-hidden">
          <View className="bg-primary/10 dark:bg-primary/15 px-4 py-3 flex-row items-center gap-2">
            <Icons.MapPin className="text-primary" size={18} />
            <Text className="text-base font-bold text-foreground">
              Location
            </Text>
          </View>
          <View className="p-4">
            <InfoRow label="Country" value={formData.country} />
            <InfoRow label="State" value={formData.state} />
            <InfoRow label="City" value={formData.city} />
            <InfoRow label="Street" value={formData.street} />
            <InfoRow label="Details" value={formData.detailedAddress} />
            <InfoRow label="Postal Code" value={formData.postalCode} />
          </View>
        </View>

        {/* Contacts Card */}
        <View className="bg-card/40 dark:bg-card/25 rounded-2xl border border-border/30 overflow-hidden">
          <View className="bg-primary/10 dark:bg-primary/15 px-4 py-3 flex-row items-center gap-2">
            <Icons.User className="text-primary" size={18} />
            <Text className="text-base font-bold text-foreground">
              Contact Information
            </Text>
          </View>
          <View className="p-4">
            <InfoRow label="Email" value={formData.email} />
            <InfoRow label="Phone" value={formData.phone} />
            <InfoRow label="First Name" value={formData.ownerFirstName} />
            <InfoRow label="Last Name" value={formData.ownerLastName} />
          </View>
        </View>

        {/* Important Notice */}
        <View className="bg-warning/10 dark:bg-warning/15 p-4 rounded-2xl border border-warning/30">
          <View className="flex-row items-start gap-3">
            <Icons.AlertCircle className="text-warning mt-0.5" size={20} />
            <View className="flex-1">
              <Text className="text-sm font-semibold text-foreground mb-1">
                Important
              </Text>
              <Text className="text-xs text-muted-foreground leading-5">
                Please ensure all information is accurate. Your brand will be
                reviewed by our team before activation. You&apos;ll receive a
                confirmation email once approved.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
