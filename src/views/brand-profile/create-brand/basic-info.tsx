import FormField from '@/components/shared/form-field';
import {
  Input,
  Select,
  SelectValue,
  Text,
  Textarea,
  UploadField,
} from '@/components/ui';
import { Major } from '@/constants/enum';
import { Feedback } from '@/lib/haptics';
import Icons from '@/lib/icons';
import * as ImagePicker from 'expo-image-picker';
import { useCallback } from 'react';
import { Control, FieldValues } from 'react-hook-form';
import { View } from 'react-native';

interface BasicInfoProps<T extends FieldValues> {
  control: Control<T>;
}

export function BasicInfo<T extends FieldValues>({
  control,
}: BasicInfoProps<T>) {
  const pickImage = useCallback(async (onChange: (value: string) => void) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
      selectionLimit: 1,
    });

    if (!result.canceled && result.assets[0]) {
      Feedback.light();
      onChange(result.assets[0].uri);
    }
  }, []);

  return (
    <View className="gap-6 flex-1">
      {/* Header */}
      <View className="bg-card p-6 rounded-2xl border border-border">
        <View className="flex-row items-center gap-3 mb-2">
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Icons.FileText className="text-primary" size={22} />
          </View>
          <Text className="text-xl font-bold text-foreground">
            Basic Information
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground leading-5">
          Tell us about your brand and what services you offer
        </Text>
      </View>

      {/* Form Fields */}
      <View className="gap-5 flex-1">
        <FormField
          control={control}
          name="brandName"
          label="Brand Name"
          required
          message="The name customers will see"
          render={({ field }) => (
            <Input placeholder="e.g., Elite Hair Studio" {...field} />
          )}
        />

        <FormField
          control={control}
          name="businessName"
          label="Legal Business Name"
          required
          message="Official registered business name"
          render={({ field }) => (
            <Input placeholder="e.g., Elite Hair Studio LLC" {...field} />
          )}
        />

        <FormField
          control={control}
          name="businessNumber"
          label="Business Registration Number"
          required
          message="Your official business registration or tax ID"
          render={({ field }) => (
            <Input placeholder="e.g., 123-45-6789" {...field} />
          )}
        />

        <FormField
          control={control}
          name="businessCertUrl"
          label="Business Certificate URL"
          message="Upload your business license or operating permit"
          render={({ field }) => (
            <UploadField value={field.value} onChange={field.onChangeText} />
          )}
        />

        <FormField
          control={control}
          name="businessCategory"
          label="Business Category"
          required
          message="Select the primary category that best describes your business"
          render={({ field }) => (
            <Select
              value={field.value}
              onChangeText={field.onChangeText as (value: SelectValue) => void}
              options={Object.values(Major).map((category) => ({
                label: category,
                value: category,
              }))}
            />
          )}
        />

        <FormField
          control={control}
          name="description"
          label="Description (Optional)"
          className="min-h-[120px]"
          message="Briefly describe what makes your brand unique"
          render={({ field }) => (
            <Textarea
              placeholder="Tell customers about your brand..."
              {...field}
            />
          )}
        />
      </View>
    </View>
  );
}
