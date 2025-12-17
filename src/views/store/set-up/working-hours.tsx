import { Text } from '@/components/ui';
import { Feedback } from '@/lib/haptics';
import {
  Control,
  FieldValues,
  Path,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { Pressable, View } from 'react-native';

interface WorkingHoursProps<T extends FieldValues> {
  control: Control<T>;
  setValue: UseFormSetValue<T>;
}

const DAYS_OF_WEEK = [
  { label: 'Monday', value: 'monday' },
  { label: 'Tuesday', value: 'tuesday' },
  { label: 'Wednesday', value: 'wednesday' },
  { label: 'Thursday', value: 'thursday' },
  { label: 'Friday', value: 'friday' },
  { label: 'Saturday', value: 'saturday' },
  { label: 'Sunday', value: 'sunday' },
];

interface DaySchedule {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export function WorkingHours<T extends FieldValues>({
  control,
  setValue,
}: WorkingHoursProps<T>) {
  const workingDays = (useWatch({
    control,
    name: 'workingDays' as Path<T>,
  }) || []) as DaySchedule[];

  const toggleDay = (dayValue: string) => {
    Feedback.light();
    const currentDays = workingDays;
    const dayExists = currentDays.find((d) => d.day === dayValue);

    if (dayExists) {
      setValue(
        'workingDays' as never,
        currentDays.filter((d) => d.day !== dayValue) as never,
      );
    } else {
      setValue(
        'workingDays' as never,
        [
          ...currentDays,
          {
            day: dayValue,
            isOpen: true,
            startTime: '09:00',
            endTime: '18:00',
          },
        ] as never,
      );
    }
  };

  const isDaySelected = (dayValue: string) => {
    return workingDays.some((d) => d.day === dayValue);
  };

  return (
    <View className="gap-6">
      {/* Header */}
      <View className="bg-card/50 dark:bg-card/30 p-5 rounded-2xl backdrop-blur-sm">
        <Text className="font-title text-foreground">04. Schedule</Text>
        <Text className="font-caption text-muted-foreground mt-1">
          When is your brand open?
        </Text>
      </View>

      <View className="gap-3">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = isDaySelected(day.value);
          return (
            <Pressable
              key={day.value}
              onPress={() => toggleDay(day.value)}
              className={`p-4 rounded-2xl flex-row items-center justify-between ${
                isSelected
                  ? 'bg-primary/20 dark:bg-primary/30'
                  : 'bg-card/30 dark:bg-card/20'
              }`}
            >
              <Text
                className={`font-subtitle ${
                  isSelected ? 'text-primary font-bold' : 'text-foreground'
                }`}
              >
                {day.label}
              </Text>
              <View
                className={`w-7 h-7 rounded-lg items-center justify-center ${
                  isSelected ? 'bg-primary' : 'bg-muted/30'
                }`}
              >
                {isSelected && (
                  <Text className="text-primary-foreground font-bold text-base">
                    ✓
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}
      </View>

      <View className="bg-warning/10 dark:bg-warning/20 p-4 rounded-2xl">
        <Text className="font-caption text-foreground font-medium">
          ⏰ Default Hours: 9:00 AM - 6:00 PM
        </Text>
        <Text className="font-caption text-muted-foreground mt-1">
          You can customize hours for each day later
        </Text>
      </View>
    </View>
  );
}
