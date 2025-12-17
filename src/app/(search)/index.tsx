import { Text } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useGlobalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ISearchProps {}

const Search: React.FC<ISearchProps> = (props) => {
  const insets = useSafeAreaInsets();
  const params = useGlobalSearchParams();
  useEffect(() => {
    console.log(` params:`, params);
  }, [params]);
  console.log(`pt-[${insets.top}px]`);
  return (
    <ScrollView className={cn('main-area gap-6', `pt-[${insets.top}px]`)}>
      <Text>1</Text>
      <Text>2</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
      <Text>Search</Text>
    </ScrollView>
  );
};

export default Search;
