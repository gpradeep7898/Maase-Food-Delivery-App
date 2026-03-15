import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../hooks/useCart';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';
import { HomeStackParamList } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'>;

const UPI_OPTIONS = [
  { id: 'gpay', label: 'Google Pay', emoji: '🟢' },
  { id: 'phonepe', label: 'PhonePe', emoji: '🟣' },
  { id: 'paytm', label: 'Paytm', emoji: '🔵' },
  { id: 'bhim', label: 'BHIM UPI', emoji: '🇮🇳' },
];

export default function PaymentScreen({ navigation }: Props) {
  const { session } = useAuth();
  const { items, subtotal, platformFee, deliveryFee, gst, total, chefId, clearCart } = useCart();
  const { placeOrder } = useOrders(session?.user?.id);
  const [selected, setSelected] = useState('gpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedLabel = UPI_OPTIONS.find(o => o.id === selected)?.label ?? 'UPI';

  async function handlePay() {
    if (!session || !chefId || items.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const order = await placeOrder({
        chef_id: chefId,
        delivery_address_id: '',
        items: items.map(i => ({
          meal_id: i.meal.id,
          meal_name: i.meal.name,
          meal_price: i.meal.price,
          quantity: i.quantity,
          subtotal: i.meal.price * i.quantity,
        })),
        subtotal,
        platform_fee: platformFee,
        delivery_fee: deliveryFee,
        gst,
        total,
      });
      await clearCart();
      navigation.replace('OrderConfirmation', {
        orderId: order.id,
        orderNumber: order.order_number ?? `ORD-${Date.now().toString().slice(-6)}`,
        chefName: items[0]?.meal.chef?.kitchen_name ?? 'Your chef',
      });
    } catch (e: any) {
      setError(e.message ?? 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Total card */}
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalAmount}>₹{Math.round(total)}</Text>
        </View>

        <Text style={styles.sectionLabel}>PAY VIA UPI</Text>
        {UPI_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.id}
            style={[styles.upiRow, selected === opt.id && styles.upiRowSelected]}
            onPress={() => setSelected(opt.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.upiEmoji}>{opt.emoji}</Text>
            <Text style={styles.upiLabel}>{opt.label}</Text>
            <View style={[styles.radio, selected === opt.id && styles.radioSelected]}>
              {selected === opt.id && <View style={styles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}

        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.payBtn, loading && styles.payBtnDisabled]}
          onPress={handlePay}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={Colors.mocha} />
            : <Text style={styles.payBtnText}>Pay ₹{Math.round(total)} via {selectedLabel}</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backText: { fontSize: 24, color: Colors.text, width: 32 },
  headerTitle: { fontFamily: Typography.heading, fontSize: 20, color: Colors.text },
  totalCard: {
    margin: Spacing.md,
    backgroundColor: Colors.mocha,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  totalLabel: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 4,
  },
  totalAmount: { fontFamily: Typography.heading, fontSize: 40, color: Colors.turmeric },
  sectionLabel: {
    fontFamily: Typography.bold,
    fontSize: 11,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  upiRowSelected: { backgroundColor: Colors.turmericLight },
  upiEmoji: { fontSize: 24, marginRight: Spacing.md },
  upiLabel: {
    flex: 1,
    fontFamily: Typography.semiBold,
    fontSize: 15,
    color: Colors.text,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.turmeric },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.turmeric },
  errorText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
    margin: Spacing.md,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  payBtn: {
    height: 56,
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Shadows.button as object),
  },
  payBtnDisabled: { opacity: 0.6 },
  payBtnText: { fontFamily: Typography.bold, fontSize: 16, color: Colors.mocha },
});
