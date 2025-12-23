import { Stack } from 'expo-router';

export default function DynamicBrandLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        keyboardHandlingEnabled: true,
      }}
    />
  );
}
