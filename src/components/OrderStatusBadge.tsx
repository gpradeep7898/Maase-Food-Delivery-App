import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Typography, Radius, Spacing } from '../lib/theme';
import { OrderStatus } from '../types';

const STATUS_MAP: Record<OrderStatus, { bg: string; text: string; label: string }> = {
  placed:           { bg: '#EEF2FF', text: '#4F46E5', label: 'Order Placed' },
  accepted:         { bg: '#DBEAFE', text: '#1D4ED8', label: 'Accepted' },
  preparing:        { bg: '#FEF3C7', text: '#D97706', label: 'Preparing' },
  ready_for_pickup: { bg: '#F3E8FF', text: '#7E22CE', label: 'Ready' },
  out_for_delivery: { bg: '#EDE9FE', text: '#6D28D9', label: 'Out for Delivery' },
  delivered:        { bg: '#DCFCE7', text: '#16A34A', label: 'Delivered' },
  cancelled:        { bg: '#FEE2E2', text: '#DC2626', label: 'Cancelled' },
  refunded:         { bg: '#F3F4F6', text: '#6B7280', label: 'Refunded' },
};

interface Props { status: OrderStatus }

export function OrderStatusBadge({ status }: Props) {
  const { bg, text, label } = STATUS_MAP[status] ?? STATUS_MAP.placed;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radius.pill,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: { fontFamily: Typography.semiBold, fontSize: 12 },
});
