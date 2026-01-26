import { View } from 'react-native';

import Icons from '@/components/icons';
import { Button, Text } from '@/components/ui';

export function SectionCard({
  title,
  onSeeAll,
}: {
  title: string;
  onSeeAll?: () => void;
}) {
  return (
    <View className="flex-row items-center justify-between mt-12 mb-4 pl-6">
      <Text className="font-title">{title}</Text>
      {onSeeAll && (
        <Button
          variant="ghost"
          size="sm"
          onPress={onSeeAll}
          className="flex flex-row items-center"
        >
          <Text className="text-caption text-primary mr-1">See All</Text>
          <Icons.ChevronRight size={18} className="text-primary" />
        </Button>
      )}
    </View>
  );
}
