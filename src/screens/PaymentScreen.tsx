import React, { useState } from 'react';
import {
  ActivityIndicator, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CartItem } from '../types';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { Divider } from '../components/ui';
import { calculateCart } from '../utils/cart';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'> & {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
};

const UPI_OPTIONS = [
  { id: 'gpay',    label: 'Google Pay',  emoji: '🟢' },
  { id: 'phonepe', label: 'PhonePe',     emoji: '🟣' },
  { id: 'paytm',   label: 'Paytm',       emoji: '🔵' },
  { id: 'bhim',    label: 'BHIM UPI',    emoji: '🇮🇳' },
];

const PaymentScreen: React.FC<Props> = ({ navigation, cartItems, setCartItems }) => {
  const cart = calculateCart(cartItems);
  const [selected, setSelected] = useState('gpay');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedLabel = UPI_OPTIONS.find(o => o.id === selected)?.label ?? 'UPI';

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCartItems([]);
      const orderId = 'MAS' + Date.now().toString().slice(-4);
      navigation.replace('OrderConfirmation', { orderId });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Total card */}
      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>Total Amount</Text>
        <Text style={styles.totalAmount}>₹{cart.total}</Text>
      </View>

      {/* UPI options */}
      <Text style={styles.sectionLabel}>Pay via UPI</Text>
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

      <Divider style={styles.divider} />
      <Text style={styles.orLabel}>— or enter UPI ID —</Text>

      <TextInput
        style={styles.upiInput}
        value={upiId}
        onChangeText={setUpiId}
        placeholder="yourname@upi"
        placeholderTextColor={Colors.textMuted}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Pay button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.payBtn, loading && { opacity: 0.7 }]}
          onPress={handlePay}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color={Colors.mocha} />
          ) : (
            <Text style={styles.payBtnText}>Pay ₹{cart.total} via {selectedLabel}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.md,
    backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  backText: { fontSize: 24, color: Colors.text, width: 32 },
  headerTitle: { fontFamily: Typography.display, fontSize: Typography.h3, color: Colors.text },
  totalCard: {
    margin: Spacing.md, backgroundColor: Colors.mocha, borderRadius: Radius.xl,
    padding: Spacing.lg, alignItems: 'center',
  },
  totalLabel: { fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall, color: Colors.textMuted, marginBottom: 4 },
  totalAmount: { fontFamily: Typography.display, fontSize: 40, color: Colors.turmeric },
  sectionLabel: {
    fontFamily: Typography.bodyBold, fontSize: Typography.bodySmall, color: Colors.textMuted,
    paddingHorizontal: Spacing.md, marginBottom: Spacing.sm, letterSpacing: 0.5,
  },
  upiRow: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md, backgroundColor: Colors.surface,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  upiRowSelected: { backgroundColor: Colors.turmericLight },
  upiEmoji: { fontSize: 24, marginRight: Spacing.md },
  upiLabel: { flex: 1, fontFamily: Typography.bodySemiBold, fontSize: Typography.body, color: Colors.text },
  radio: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  radioSelected: { borderColor: Colors.turmeric },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.turmeric },
  divider: { marginVertical: Spacing.md },
  orLabel: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.caption,
    color: Colors.textMuted, textAlign: 'center', marginBottom: Spacing.md,
  },
  upiInput: {
    marginHorizontal: Spacing.md, height: 52, backgroundColor: Colors.surface,
    borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    fontFamily: Typography.bodyRegular, fontSize: Typography.body, color: Colors.text,
  },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.md, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  payBtn: {
    height: 52, backgroundColor: Colors.turmeric, borderRadius: Radius.md,
    alignItems: 'center', justifyContent: 'center',
    ...Shadows.button,
  },
  payBtnText: { fontFamily: Typography.bodyBold, fontSize: Typography.body, color: Colors.mocha },
});

export default PaymentScreen;
