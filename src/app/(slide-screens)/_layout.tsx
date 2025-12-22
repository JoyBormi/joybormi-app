import { Stack } from 'expo-router';

export default function SlideScreensLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // animationDuration: 50,
        // presentation: Platform.OS === 'ios' ? 'modal' : 'card',
        // animation: 'slide_from_bottom',
        // keyboardHandlingEnabled: true,
        presentation: 'formSheet',
        gestureDirection: 'vertical',
        animation: 'slide_from_bottom',
        keyboardHandlingEnabled: true,
        sheetGrabberVisible: true,
        sheetInitialDetentIndex: 0,
        sheetAllowedDetents: [0.95, 0.99],
      }}
    />
  );
}
