import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  TextInputProps, ViewStyle,
} from 'react-native';
import { Colors, Typography, Radius, Spacing } from '../../lib/theme';

interface InputProps extends Omit<TextInputProps, 'onChangeText'> {
  label?: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  type?: 'text' | 'phone' | 'number' | 'email' | 'multiline';
  prefix?: string;
  maxLength?: number;
  containerStyle?: ViewStyle;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  type = 'text',
  prefix,
  maxLength,
  containerStyle,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const keyboardType = (() => {
    if (type === 'phone' || type === 'number') return 'number-pad';
    if (type === 'email') return 'email-address';
    return 'default';
  })();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => inputRef.current?.focus()}
        style={[
          styles.inputRow,
          focused && styles.inputFocused,
          !!error && styles.inputError,
          type === 'multiline' && styles.inputMultiline,
        ]}
      >
        {prefix && (
          <View style={styles.prefixBox}>
            <Text style={styles.prefixText}>{prefix}</Text>
          </View>
        )}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textMuted}
          keyboardType={keyboardType}
          multiline={type === 'multiline'}
          numberOfLines={type === 'multiline' ? 4 : 1}
          maxLength={maxLength}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            styles.input,
            type === 'multiline' && styles.textAreaInput,
          ]}
          {...rest}
        />
      </TouchableOpacity>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: {
    fontFamily: Typography.medium,
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    minHeight: 48,
    overflow: 'hidden',
  },
  inputFocused: {
    borderColor: Colors.turmeric,
    backgroundColor: Colors.turmericLight + '44',
  },
  inputError: { borderColor: Colors.error },
  inputMultiline: { alignItems: 'flex-start', minHeight: 96 },
  prefixBox: {
    paddingHorizontal: Spacing.md,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
    height: '100%',
    justifyContent: 'center',
    backgroundColor: Colors.ivory,
  },
  prefixText: {
    fontFamily: Typography.medium,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  input: {
    flex: 1,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.text,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  textAreaInput: {
    textAlignVertical: 'top',
    paddingTop: Spacing.md,
  },
  errorText: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.error,
    marginTop: 4,
  },
});
