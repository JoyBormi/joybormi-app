import React from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  KeyboardAvoidingViewProps,
  Platform,
  ScrollViewProps,
  TouchableWithoutFeedback,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function KeyboardAvoid({
  children,
  scrollConfig,
  iosHeight = 10,
  androidHeight = 20,
  ...props
}: {
  children: React.ReactNode;
  scrollConfig?: ScrollViewProps;
  iosHeight?: number;
  androidHeight?: number;
} & KeyboardAvoidingViewProps) {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'height' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? iosHeight : androidHeight}
      enabled={true}
      {...props}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

export default KeyboardAvoid;
