import { Stack } from 'expo-router';
import { Fragment } from 'react';

import { GlobalAlert } from '@/providers/alert';
import { ToastProvider } from '@/providers/toaster';

export default function AuthLayout() {
  return (
    <Fragment>
      <Stack screenOptions={{ headerShown: false }} />
      <GlobalAlert />
      <ToastProvider />
    </Fragment>
  );
}
