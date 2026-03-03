import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Typography, Radius, Spacing, Shadows } from '../constants/theme';
import { OrderStatus } from '../types';
import { ORDER_STATUS_CONFIG } from '../constants/mockData';

// ============================================================
// PRIMARY BUTTON
// ============================================================
interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
  loading,
  style,
}) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    activeOpacity={0.8}
    style={[
      styles.primaryBtn,
      (disabled || loading) && styles.primaryBtnDisabled,
      style,
    ]}
  >
    {loading ? (
      <ActivityIndicator color={Colors.mocha} size="small" />
    ) : (
      <Text style={styles.primaryBtnText}>{label}</Text>
    )}
  </TouchableOpacity>
);

// ============================================================
// SECONDARY BUTTON
// ============================================================
interface SecondaryButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ label, onPress, style }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.secondaryBtn, style]}
  >
    <Text style={styles.secondaryBtnText}>{label}</Text>
  </TouchableOpacity>
);

// ============================================================
// COOK AVATAR
// ============================================================
interface CookAvatarProps {
  initials: string;
  color: string;
  size?: number;
}

export const CookAvatar: React.FC<CookAvatarProps> = ({ initials, color, size = 40 }) => (
  <View
    style={[
      styles.avatar,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
      },
    ]}
  >
    <Text style={[styles.avatarText, { fontSize: size * 0.32 }]}>{initials}</Text>
  </View>
);

// ============================================================
// STATUS BADGE
// ============================================================
interface StatusBadgeProps {
  status: OrderStatus;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = ORDER_STATUS_CONFIG[status];
  return (
    <View style={[styles.badge, { backgroundColor: config.color + '22' }]}>
      <Text style={[styles.badgeText, { color: config.color }]}>
        {config.emoji} {config.label}
      </Text>
    </View>
  );
};

// ============================================================
// FILTER CHIP
// ============================================================
interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.7}
    style={[styles.chip, selected && styles.chipSelected]}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

// ============================================================
// SECTION HEADER
// ============================================================
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, action }) => (
  <View style={styles.sectionHeader}>
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
    {action && (
      <TouchableOpacity onPress={action.onPress}>
        <Text style={styles.sectionAction}>{action.label}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ============================================================
// DIVIDER
// ============================================================
export const Divider: React.FC<{ style?: ViewStyle }> = ({ style }) => (
  <View style={[styles.divider, style]} />
);

// ============================================================
// LIVE INDICATOR (unique to Maase)
// ============================================================
export const LiveIndicator: React.FC<{ label: string }> = ({ label }) => (
  <View style={styles.liveRow}>
    <View style={styles.liveDot} />
    <Text style={styles.liveText}>{label}</Text>
  </View>
);

// ============================================================
// STYLES
// ============================================================
const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: Colors.turmeric,
    height: 52,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.button,
  },
  primaryBtnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryBtnText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Typography.body,
    color: Colors.mocha,
  },
  secondaryBtn: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: Typography.body,
    color: Colors.textSecondary,
  },
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Typography.caption,
  },
  chip: {
    height: 36,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  chipSelected: {
    backgroundColor: Colors.turmeric,
    borderColor: Colors.turmeric,
  },
  chipText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
  },
  chipTextSelected: {
    color: Colors.mocha,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: Typography.h3,
    color: Colors.text,
  },
  sectionSubtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionAction: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: Typography.bodySmall,
    color: Colors.turmeric,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  liveText: {
    fontFamily: 'Poppins_700Bold',
    fontSize: Typography.caption,
    color: '#4CAF50',
  },
});
