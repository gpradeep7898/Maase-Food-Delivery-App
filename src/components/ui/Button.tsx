import React, { useRef } from 'react';
import {
  TouchableOpacity, Text, StyleSheet, ActivityIndicator,
  Animated, ViewStyle, TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Radius, Shadows, Spacing } from '../../lib/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  icon?: string;
  fullWidth?: boolean;
  style?: ViewStyle;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  const variantStyles: Record<Variant, { container: ViewStyle; text: TextStyle }> = {
    primary: {
      container: { backgroundColor: Colors.turmeric, ...(Shadows.button as ViewStyle) },
      text: { color: Colors.mocha },
    },
    secondary: {
      container: { backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.turmeric },
      text: { color: Colors.turmericDeep },
    },
    ghost: {
      container: { backgroundColor: 'transparent' },
      text: { color: Colors.textSecondary },
    },
    danger: {
      container: { backgroundColor: Colors.error },
      text: { color: Colors.surface },
    },
  };

  const sizeStyles: Record<Size, { container: ViewStyle; text: TextStyle }> = {
    sm: { container: { paddingHorizontal: Spacing.md, height: 36 }, text: { fontSize: 13 } },
    md: { container: { paddingHorizontal: Spacing.lg, height: 48 }, text: { fontSize: 15 } },
    lg: { container: { paddingHorizontal: Spacing.xl, height: 56 }, text: { fontSize: 16 } },
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View style={[fullWidth && { width: '100%' }, { transform: [{ scale }] }]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          styles.base,
          variantStyles[variant].container,
          sizeStyles[size].container,
          fullWidth && { width: '100%' },
          isDisabled && styles.disabled,
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === 'primary' ? Colors.mocha : Colors.turmeric}
          />
        ) : (
          <>
            {icon && (
              <Ionicons
                name={icon as never}
                size={size === 'sm' ? 16 : 18}
                color={(variantStyles[variant].text as TextStyle).color as string}
                style={{ marginRight: 6 }}
              />
            )}
            <Text style={[styles.label, variantStyles[variant].text, sizeStyles[size].text]}>
              {label}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
  },
  label: {
    fontFamily: Typography.bold,
    letterSpacing: 0.1,
  },
  disabled: { opacity: 0.5 },
});
