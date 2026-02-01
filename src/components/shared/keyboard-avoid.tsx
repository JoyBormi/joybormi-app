import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollViewProps,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function KeyboardAvoid({
  children,
  scrollConfig,
  scrollEnabled = true,
  ...props
}: {
  children: React.ReactNode;
  scrollConfig?: ScrollViewProps;
  scrollEnabled?: boolean;
} & KeyboardAvoidingViewProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      enabled={true}
      {...props}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        {scrollEnabled ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            showsVerticalScrollIndicator={false}
            className="bg-background"
            decelerationRate="fast"
            {...scrollConfig}
          >
            {children}
          </ScrollView>
        ) : (
          <View className="flex-1">{children}</View>
        )}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default KeyboardAvoid;
