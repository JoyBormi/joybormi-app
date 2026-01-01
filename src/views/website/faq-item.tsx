import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

import { Text } from '@/components/ui';
import Icons from '@/lib/icons';

type FAQItemProps = {
  question: string;
  answer: string;
};

export const FAQItem = ({ question, answer }: FAQItemProps) => {
  const [open, setOpen] = useState(false);
  return (
    <View className="mb-4 border-b border-border pb-3">
      <Pressable
        onPress={() => setOpen(!open)}
        className="flex-row justify-between items-center"
      >
        <Text className="text-base font-medium flex-1 pr-2">{question}</Text>
        {open ? (
          <Icons.ChevronUp size={20} className="text-primary" />
        ) : (
          <Icons.ChevronDown size={20} className="text-primary" />
        )}
      </Pressable>
      {open && (
        <Text className="text-sm text-muted-foreground mt-2">{answer}</Text>
      )}
    </View>
  );
};
