import { Stack } from 'expo-router';
import { Fragment } from 'react';

import { GlobalAlert } from '@/providers/alert';

export default function AuthLayout() {
  return (
    <Fragment>
      <Stack screenOptions={{ headerShown: false }} />
      <GlobalAlert />
    </Fragment>
  );
}
