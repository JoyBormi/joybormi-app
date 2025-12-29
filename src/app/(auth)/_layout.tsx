import { GlobalAlert } from '@/providers/alert';
import { Stack } from 'expo-router';
import { Fragment } from 'react';

export default function AuthLayout() {
  return (
    <Fragment>
      <Stack screenOptions={{ headerShown: false }} />
      <GlobalAlert />
    </Fragment>
  );
}
