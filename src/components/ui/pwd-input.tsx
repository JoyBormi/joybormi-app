import Icons from '@/lib/icons';
import React, { useState } from 'react';
import { TextInputProps, TouchableOpacity, View } from 'react-native';
import { Input } from './input';

export function PasswordInput(props: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="relative">
      <Input
        {...props}
        key={showPassword ? 'text' : 'password'}
        value={props.value}
        onChangeText={props.onChangeText}
        secureTextEntry={!showPassword}
      />

      <TouchableOpacity
        className="absolute right-3 top-0 bottom-0 w-10 items-center justify-center"
        onPress={() => setShowPassword((prev) => !prev)}
        activeOpacity={0.7}
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
