import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TextInput, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Icons from '@/components/icons';
import { TFieldValue } from '@/components/shared/form-field';
import { PressableBounce, Select } from '@/components/ui';
import { Major } from '@/constants/enum';
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
  const [visible, setVisible] = useState(false);
  const [searchTarget, setSearchTarget] = useState<TFieldValue>('services');

  // animation values
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  const currentType = MAJORS[index];
  const searchOptions = useMemo(
    () => [
      { label: 'Services', value: 'services' },
      { label: 'Brands', value: 'brands' },
    ],
    [],
  );

  const animatedPlaceholderStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const handleSearch = () => {
    const trimmedSearch = search.trim();

    router.push({
      pathname: '/(category)/[category]',
      params: {
        category: 'all',
        searchTarget: searchTarget as string,
        ...(trimmedSearch ? { query: trimmedSearch } : {}),
      },
    });

    setSearch('');
    setVisible(false);
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
      <View className="flex-row items-center gap-2">
        <PressableBounce className="flex-1 flex-row items-center px-4 bg-card/80 rounded-full border border-border">
          <View className="flex-1 justify-center">
            {/* Animated placeholder */}
            {!search && searchTarget === 'services' ? (
              <Animated.Text
                pointerEvents="none"
                style={animatedPlaceholderStyle}
                className="absolute left-3 text-muted-foreground font-body"
              >
                {t('common.labels.searchFor', {
                  type: t(`major.${currentType}`),
                })}
              </Animated.Text>
            ) : null}
            {!search && searchTarget === 'brands' ? (
              <Animated.Text
                pointerEvents="none"
                className="absolute left-3 text-muted-foreground font-body"
              >
                Search for brands
              </Animated.Text>
            ) : null}

            <TextInput
              value={search}
              onChangeText={setSearch}
              onSubmitEditing={handleSearch}
              maxLength={30}
              className="font-body text-foreground flex-1 h-14 native:leading-[1.25] px-3"
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

        <Select
          options={searchOptions}
          value={searchTarget}
          onChangeText={setSearchTarget}
          title="Search in"
        >
          <View className="px-4 h-14 flex items-center justify-center bg-card/80 rounded-full border border-border">
            {searchTarget === 'services' ? (
              <Icons.HandPlatter size={20} className="text-muted-foreground" />
            ) : (
              <Icons.Store size={20} className="text-muted-foreground" />
            )}
          </View>
        </Select>
      </View>
    </MotiView>
  );
}
