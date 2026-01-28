import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { Header } from '@/components/shared/header';

export default function TermsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
      <Header
        title="Terms of Service"
        subtitle="Everything you need to know before using Reservefy."
        animate={false}
        className="px-2"
        variant="row"
      />
      <View className="flex-1 rounded-t-3xl overflow-hidden border-t border-border/60">
        <WebView source={{ uri: 'https://example.com/terms' }} />
      </View>
    </View>
  );
}
