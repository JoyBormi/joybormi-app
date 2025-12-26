import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { Suspense, useEffect } from 'react';
import { ActivityIndicator, Platform } from 'react-native';

import MontserratBold from '@/assets/fonts/Montserrat-Bold.ttf';
import MontserratMedium from '@/assets/fonts/Montserrat-Medium.ttf';
import MontserratRegular from '@/assets/fonts/Montserrat-Regular.ttf';
import { useColorScheme } from '@/hooks/common/use-color-scheme';

export const unstable_settings = {
  // Ensure that loading the initial screen does not block rendering of the app.
  initialRoute: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [loaded] = useFonts({
    regular: MontserratRegular,
    medium: MontserratMedium,
    bold: MontserratBold,
  });

  const { colorScheme } = useColorScheme();

  // Apply color scheme to document for web
  useEffect(() => {
    if (Platform.OS === 'web') {
      document.documentElement.classList.toggle('dark', colorScheme === 'dark');
      document.documentElement.classList.add('bg-background');
    }
  }, [colorScheme]);

  // Hide the splash screen once fonts are loaded
  useEffect(() => {
    if (loaded) SplashScreen.hideAsync();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <Suspense fallback={<ActivityIndicator className="text-primary size-14" />}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(website)" />
        <Stack.Screen name="(dynamic-brand)" />
        <Stack.Screen name="+not-found" />
        <Stack.Screen
          name="(auth)"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            statusBarAnimation: 'slide',
            keyboardHandlingEnabled: true,
          }}
        />
        <Stack.Screen
          name="(slide-screens)"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            statusBarAnimation: 'slide',
            keyboardHandlingEnabled: true,
          }}
        />
      </Stack>
    </Suspense>
  );
}
