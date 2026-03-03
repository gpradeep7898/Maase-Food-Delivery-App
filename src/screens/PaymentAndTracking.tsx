// ============================================================
// PaymentScreen.tsx
// ============================================================
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CartItem } from '../types';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
import { PrimaryButton } from '../components/ui';
import { calculateCart } from '../utils/cart';

type Props = NativeStackScreenProps<HomeStackParamList, 'Payment'> & {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
};

const UPI_APPS = [
  { id: 'gpay', label: 'Google Pay', emoji: '🟢' },
  { id: 'phonepe', label: 'PhonePe', emoji: '🟣' },
  { id: 'paytm', label: 'Paytm', emoji: '🔵' },
  { id: 'bhim', label: 'BHIM UPI', emoji: '🇮🇳' },
];

const PaymentScreen: React.FC<Props> = ({ navigation, cartItems, setCartItems }) => {
  const [selected, setSelected] = useState('gpay');
  const [paying, setPaying] = useState(false);
  const cart = calculateCart(cartItems);

  const handlePay = () => {
    setPaying(true);
    // TODO: Integrate real UPI payment SDK
    setTimeout(() => {
      setPaying(false);
      setCartItems([]);
      navigation.replace('OrderConfirmation', { orderId: 'MAS' + Date.now().toString().slice(-4) });
    }, 2000);
  };

  return (
    <SafeAreaView style={payStyles.container} edges={['top']}>
      <ScrollView contentContainerStyle={payStyles.scroll}>
        <View style={payStyles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={payStyles.back}>←</Text>
          </TouchableOpacity>
          <Text style={payStyles.title}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={payStyles.totalCard}>
          <Text style={payStyles.totalLabel}>Total to pay</Text>
          <Text style={payStyles.totalAmount}>₹{cart.total}</Text>
        </View>

        <Text style={payStyles.sectionTitle}>Pay via UPI</Text>
        {UPI_APPS.map(app => (
          <TouchableOpacity
            key={app.id}
            style={[payStyles.upiRow, selected === app.id && payStyles.upiRowSelected]}
            onPress={() => setSelected(app.id)}
            activeOpacity={0.8}
          >
            <Text style={payStyles.upiEmoji}>{app.emoji}</Text>
            <Text style={payStyles.upiLabel}>{app.label}</Text>
            <View style={[payStyles.radio, selected === app.id && payStyles.radioSelected]}>
              {selected === app.id && <View style={payStyles.radioDot} />}
            </View>
          </TouchableOpacity>
        ))}
        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={payStyles.bottomBar}>
        <PrimaryButton
          label={paying ? '⏳ Processing...' : `Pay ₹${cart.total} via ${UPI_APPS.find(a => a.id === selected)?.label}`}
          onPress={handlePay}
          loading={paying}
        />
      </View>
    </SafeAreaView>
  );
};

const payStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.lg },
  back: { fontSize: 24, color: Colors.text },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2, color: Colors.text },
  totalCard: { backgroundColor: Colors.mocha, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', marginBottom: Spacing.lg },
  totalLabel: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textMuted, marginBottom: 4 },
  totalAmount: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 40, color: Colors.turmeric },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.text, marginBottom: Spacing.sm },
  upiRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.md, padding: Spacing.md, marginBottom: Spacing.sm, borderWidth: 1.5, borderColor: Colors.border },
  upiRowSelected: { borderColor: Colors.turmeric },
  upiEmoji: { fontSize: 28 },
  upiLabel: { flex: 1, fontFamily: 'Poppins_600SemiBold', fontSize: Typography.body, color: Colors.text },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: Colors.turmeric, backgroundColor: Colors.turmeric },
  radioDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, padding: Spacing.md, paddingBottom: 24 },
});

export { PaymentScreen };


// ============================================================
// OrderConfirmationScreen.tsx
// ============================================================
import React from 'react';

type ConfirmProps = NativeStackScreenProps<HomeStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen: React.FC<ConfirmProps> = ({ route, navigation }) => {
  const { orderId } = route.params;

  return (
    <SafeAreaView style={confStyles.container}>
      <View style={confStyles.content}>
        <View style={confStyles.successCircle}>
          <Text style={confStyles.successEmoji}>✅</Text>
        </View>
        <Text style={confStyles.title}>Order Placed! 🎉</Text>
        <Text style={confStyles.subtitle}>
          Sunita Aunty has received your order and will start preparing soon.
        </Text>

        <View style={confStyles.detailCard}>
          <Text style={confStyles.orderIdLabel}>ORDER ID</Text>
          <Text style={confStyles.orderId}>{orderId}</Text>
          <View style={confStyles.detailRow}>
            <View style={confStyles.detailItem}>
              <Text style={confStyles.detailLabel}>Estimated delivery</Text>
              <Text style={confStyles.detailVal}>~35 mins</Text>
            </View>
            <View style={confStyles.detailDivider} />
            <View style={confStyles.detailItem}>
              <Text style={confStyles.detailLabel}>Amount paid</Text>
              <Text style={confStyles.detailVal}>Paid ✓</Text>
            </View>
          </View>
        </View>

        <PrimaryButton
          label="Track My Order 📍"
          onPress={() => navigation.navigate('OrderTracking', { orderId })}
          style={confStyles.btn}
        />
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={confStyles.secondaryBtn}
        >
          <Text style={confStyles.secondaryText}>Browse more meals</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const confStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  successCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.successLight, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.lg },
  successEmoji: { fontSize: 52 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h1, color: Colors.text, marginBottom: Spacing.sm },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: Spacing.lg },
  detailCard: { backgroundColor: Colors.turmericLight, borderRadius: Radius.lg, padding: Spacing.md, width: '100%', alignItems: 'center', marginBottom: Spacing.lg },
  orderIdLabel: { fontFamily: 'Poppins_700Bold', fontSize: 10, color: Colors.textMuted, letterSpacing: 0.5 },
  orderId: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2, color: Colors.mocha, marginBottom: Spacing.md },
  detailRow: { flexDirection: 'row', width: '100%', justifyContent: 'center', gap: Spacing.lg },
  detailDivider: { width: 1, backgroundColor: Colors.border },
  detailItem: { alignItems: 'center' },
  detailLabel: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textMuted },
  detailVal: { fontFamily: 'Poppins_700Bold', fontSize: Typography.body, color: Colors.text },
  btn: { width: '100%', marginBottom: Spacing.sm },
  secondaryBtn: { width: '100%', height: 52, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontFamily: 'Poppins_600SemiBold', fontSize: Typography.body, color: Colors.textSecondary },
});

export { OrderConfirmationScreen };


// ============================================================
// OrderTrackingScreen.tsx
// ============================================================
import React, { useEffect, useState } from 'react';
import { OrderStatus } from '../types';
import { ORDER_STATUS_CONFIG } from '../constants/mockData';

type TrackProps = NativeStackScreenProps<HomeStackParamList, 'OrderTracking'>;

const STATUS_FLOW: OrderStatus[] = ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'];
const STATUS_TIMES = ['12:34 PM', '12:36 PM', '12:40 PM', '1:05 PM', '1:18 PM'];

const OrderTrackingScreen: React.FC<TrackProps> = ({ route, navigation }) => {
  const [statusIdx, setStatusIdx] = useState(2); // start at 'preparing'
  const currentStatus = STATUS_FLOW[statusIdx];
  const config = ORDER_STATUS_CONFIG[currentStatus];

  useEffect(() => {
    if (statusIdx >= STATUS_FLOW.length - 1) return;
    const timer = setTimeout(() => setStatusIdx(i => i + 1), 5000);
    return () => clearTimeout(timer);
  }, [statusIdx]);

  return (
    <SafeAreaView style={trackStyles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={trackStyles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')}>
            <Text style={trackStyles.back}>←</Text>
          </TouchableOpacity>
          <Text style={trackStyles.title}>Order Tracking</Text>
          <Text style={trackStyles.orderId}>#{route.params.orderId}</Text>
        </View>

        {/* Status hero */}
        <View style={trackStyles.hero}>
          <Text style={trackStyles.heroEmoji}>{config.emoji}</Text>
          <Text style={trackStyles.heroStatus}>{config.label}</Text>
          {currentStatus === 'preparing' && (
            <Text style={trackStyles.heroSub}>Sunita Aunty is cooking your Dal Makhani 🍛</Text>
          )}
          {currentStatus !== 'delivered' && (
            <Text style={trackStyles.heroEta}>
              Estimated: {35 - statusIdx * 8} mins away
            </Text>
          )}
        </View>

        {/* Timeline */}
        <View style={trackStyles.timeline}>
          <Text style={trackStyles.sectionTitle}>Live Updates</Text>
          {STATUS_FLOW.map((s, i) => {
            const done = i <= statusIdx;
            const active = i === statusIdx;
            const cfg = ORDER_STATUS_CONFIG[s];
            return (
              <View key={s} style={trackStyles.timelineItem}>
                <View style={trackStyles.timelineLeft}>
                  <View style={[
                    trackStyles.dot,
                    done && { backgroundColor: cfg.color },
                    active && { shadowColor: cfg.color, shadowOpacity: 0.4, shadowRadius: 6, shadowOffset: { width: 0, height: 0 }, elevation: 4 },
                  ]}>
                    <Text style={trackStyles.dotEmoji}>{cfg.emoji}</Text>
                  </View>
                  {i < STATUS_FLOW.length - 1 && (
                    <View style={[trackStyles.line, { backgroundColor: i < statusIdx ? Colors.turmeric : Colors.border }]} />
                  )}
                </View>
                <View style={trackStyles.timelineContent}>
                  <Text style={[trackStyles.stepLabel, done && { fontFamily: 'Poppins_700Bold', color: Colors.text }]}>
                    {cfg.label}
                  </Text>
                  {done && <Text style={trackStyles.stepTime}>{STATUS_TIMES[i]}</Text>}
                </View>
              </View>
            );
          })}
        </View>

        {/* Cook contact */}
        <View style={trackStyles.cookCard}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E8825A', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'Poppins_700Bold' }}>SA</Text>
          </View>
          <View style={trackStyles.cookInfo}>
            <Text style={trackStyles.cookName}>Sunita Aunty</Text>
            <Text style={trackStyles.cookSub}>Your cook today · ⭐ 4.9</Text>
          </View>
          <TouchableOpacity style={trackStyles.contactBtn}><Text>📞</Text></TouchableOpacity>
          <TouchableOpacity style={[trackStyles.contactBtn, { backgroundColor: '#DCF8C6' }]}><Text>💬</Text></TouchableOpacity>
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const trackStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border },
  back: { fontSize: 24, color: Colors.text, marginRight: Spacing.sm },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h3, color: Colors.text, flex: 1 },
  orderId: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textMuted },
  hero: { backgroundColor: Colors.mocha, padding: Spacing.lg, alignItems: 'center' },
  heroEmoji: { fontSize: 52, marginBottom: Spacing.sm },
  heroStatus: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2, color: Colors.ivory, marginBottom: 4 },
  heroSub: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textMuted },
  heroEta: { fontFamily: 'Poppins_700Bold', fontSize: Typography.bodySmall, color: Colors.turmeric, marginTop: 6 },
  timeline: { padding: Spacing.md },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.text, marginBottom: Spacing.md },
  timelineItem: { flexDirection: 'row', gap: Spacing.md },
  timelineLeft: { alignItems: 'center' },
  dot: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  dotEmoji: { fontSize: 18 },
  line: { width: 2, flex: 1, minHeight: 32, marginVertical: 4 },
  timelineContent: { flex: 1, paddingBottom: Spacing.md, paddingTop: 8 },
  stepLabel: { fontFamily: 'Poppins_400Regular', fontSize: Typography.body, color: Colors.textMuted },
  stepTime: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textMuted, marginTop: 2 },
  cookCard: { margin: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, borderWidth: 1, borderColor: Colors.border },
  cookInfo: { flex: 1 },
  cookName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 16, color: Colors.text },
  cookSub: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textSecondary },
  contactBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.turmericLight, alignItems: 'center', justifyContent: 'center' },
});

export { OrderTrackingScreen };
