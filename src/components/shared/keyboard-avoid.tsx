import React from 'react';
import { ScrollViewProps } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

function KeyboardAvoid({ ...props }: ScrollViewProps) {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      automaticallyAdjustKeyboardInsets
      className="bg-background"
      decelerationRate="fast"
      {...props}
    />
  );
}

export default KeyboardAvoid;
