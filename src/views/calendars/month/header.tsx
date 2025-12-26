import { View } from 'react-native';

import { Text } from '@/components/ui/text';
import { useLocaleData } from '@/hooks/common/use-locale-data';

interface RenderHeaderProps {
  date: Date;
  locale: string;
}

export const RenderHeader = ({ date }: RenderHeaderProps) => {
  const { getMonthName } = useLocaleData();
  const monthIndex = date.getMonth();
  const monthName = getMonthName(monthIndex);

  return (
    <View className="flex-row items-start w-full">
      <Text className="font-subtitle">{monthName}</Text>
    </View>
  );
};
