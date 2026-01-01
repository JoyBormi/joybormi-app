import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Input, PressableBounce } from '@/components/ui';
import { Major } from '@/constants/enum';
import Icons from '@/lib/icons';
import { cn } from '@/lib/utils';

interface Props {
  className?: string;
}

const MAJORS = Object.values(Major);

const SLIDE_DISTANCE = 12;

export function SearchBar({ className }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  const [index, setIndex] = useState(0);
  const [search, setSearch] = useState('');

  // animation values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const currentType = MAJORS[index];

  const animatedPlaceholderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleSearch = () => {
    if (!search.trim()) return;

    router.push({
      pathname: '/(category)/[category]',
      params: {
        category: 'all',
        query: search,
      },
    });
  };

  // rotate majors with slide animation
  useEffect(() => {
    const interval = setInterval(() => {
      // slide out (up)
      translateY.value = withTiming(-SLIDE_DISTANCE, { duration: 180 });
      opacity.value = withTiming(0, { duration: 120 });

      setTimeout(() => {
        // update text
        setIndex((prev) => (prev + 1) % MAJORS.length);

        // reset below
        translateY.value = SLIDE_DISTANCE;
        opacity.value = 0;

        // slide in (from bottom)
        translateY.value = withTiming(0, { duration: 220 });
        opacity.value = withTiming(1, { duration: 160 });
      }, 180);
    }, 3000);

    return () => clearInterval(interval);
  }, [opacity, translateY]);

  return (
    <MotiView
      from={{ opacity: 0, translateY: 10 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      className={cn('px-4 mt-10', className)}
    >
      <PressableBounce className="flex-row items-center px-4 bg-card/50 rounded-full border border-border">
        <View className="flex-1 justify-center">
          {/* Animated placeholder */}
          {!search && (
            <Animated.Text
              pointerEvents="none"
              style={animatedPlaceholderStyle}
              className="absolute left-3 text-muted-foreground font-body"
            >
              {t('common.labels.searchFor', {
                type: t(`major.${currentType}`),
              })}
            </Animated.Text>
          )}

          <Input
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            onBlur={() => setSearch('')}
            className="border-0 h-auto bg-transparent focus:bg-transparent font-body"
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <Icons.Search
          onPress={handleSearch}
          size={22}
          className="text-muted-foreground"
        />
      </PressableBounce>
    </MotiView>
  );
}
