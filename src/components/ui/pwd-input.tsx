import React, { useState } from 'react';

import { Input } from '@/components/ui/input';
import Icons from '@/lib/icons';
import { TextInputProps, TouchableOpacity, View } from 'react-native';

export function PasswordInput(props: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="relative">
      <Input secureTextEntry={!showPassword} {...props} />
      <TouchableOpacity
        className="absolute right-3 top-0 bottom-0 justify-center"
        onPress={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <Icons.EyeClosed size={20} className="text-muted-foreground" />
        ) : (
          <Icons.Eye size={20} className="text-muted-foreground" />
        )}
      </TouchableOpacity>
    </View>
  );
}
