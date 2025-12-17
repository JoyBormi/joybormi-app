import { Text } from '@/components/ui';
import { Control, FieldValues, useWatch } from 'react-hook-form';
import { View } from 'react-native';

interface ReviewProps<T extends FieldValues> {
  control: Control<T>;
}

interface DaySchedule {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
}

export function Review<T extends FieldValues>({ control }: ReviewProps<T>) {
  const formData = useWatch({ control });

  const workingDaysText =
    formData.workingDays
      ?.map((d: DaySchedule) => d.day.charAt(0).toUpperCase() + d.day.slice(1))
      .join(', ') || 'Not set';

  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card/50 dark:bg-card/30 p-5 rounded-2xl backdrop-blur-sm">
        <Text className="font-title text-foreground">05. Review</Text>
        <Text className="font-caption text-muted-foreground mt-1">
          Double-check everything before submitting
        </Text>
      </View>

      <View className="gap-4">
        {/* Basic Info Card */}
        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <Text className="font-subtitle text-foreground mb-3 pb-2 border-b border-border/30">
            📝 Basic Information
          </Text>

          <View className="gap-2">
            <View className="flex-row">
              <Text className="font-caption text-muted-foreground w-24">
                Name:
              </Text>
              <Text className="font-caption text-foreground font-medium flex-1">
                {formData.brandName || 'Not provided'}
              </Text>
            </View>

            {formData.description && (
              <View className="flex-row">
                <Text className="font-caption text-muted-foreground w-24">
                  Info:
                </Text>
                <Text className="font-caption text-foreground flex-1">
                  {formData.description}
                </Text>
              </View>
            )}

            {formData.workingFields && (
              <View className="flex-row">
                <Text className="font-caption text-muted-foreground w-24">
                  Fields:
                </Text>
                <Text className="font-caption text-foreground flex-1">
                  {formData.workingFields}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Location Card */}
        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <Text className="font-subtitle text-foreground mb-3 pb-2 border-b border-border/30">
            📍 Location
          </Text>

          <View className="gap-1">
            <Text className="font-caption text-foreground font-medium">
              {formData.street || 'Street not provided'}
            </Text>
            {formData.detailedAddress && (
              <Text className="font-caption text-muted-foreground">
                {formData.detailedAddress}
              </Text>
            )}
            <Text className="font-caption text-foreground">
              {[formData.city, formData.state, formData.postalCode]
                .filter(Boolean)
                .join(', ') || 'City/State not provided'}
            </Text>
            <Text className="font-caption text-foreground font-medium">
              {formData.country || 'Country not provided'}
            </Text>
          </View>
        </View>

        {/* Contact Card */}
        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <Text className="font-subtitle text-foreground mb-3 pb-2 border-b border-border/30">
            📞 Contact
          </Text>

          <View className="gap-2">
            <View className="flex-row">
              <Text className="font-caption text-muted-foreground w-20">
                Email:
              </Text>
              <Text className="font-caption text-foreground font-medium flex-1">
                {formData.email || 'Not provided'}
              </Text>
            </View>

            {formData.phone && (
              <View className="flex-row">
                <Text className="font-caption text-muted-foreground w-20">
                  Phone:
                </Text>
                <Text className="font-caption text-foreground font-medium flex-1">
                  {formData.phone}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Working Days Card */}
        <View className="bg-card/30 dark:bg-card/20 p-4 rounded-2xl">
          <Text className="font-subtitle text-foreground mb-3 pb-2 border-b border-border/30">
            📅 Schedule
          </Text>

          <View>
            <Text className="font-caption text-foreground font-medium">
              {workingDaysText}
            </Text>
            <Text className="font-caption text-muted-foreground mt-1">
              9:00 AM - 6:00 PM (Default)
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
