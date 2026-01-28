import { Stack } from 'expo-router';
import { Fragment } from 'react';

import { GlobalAlert } from '@/providers/alert';

export default function SlideScreensLayout() {
  return (
    <Fragment>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="upsert-schedule"
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack>
      <GlobalAlert />
    </Fragment>
  );
}
