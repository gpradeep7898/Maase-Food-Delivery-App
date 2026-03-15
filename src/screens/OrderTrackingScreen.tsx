import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { Colors, Typography, Spacing, Radius } from '../lib/theme';
import { HomeStackParamList, OrderStatus } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'OrderTracking'>;

const STEPS: { status: OrderStatus; label: string; emoji: string; color: string }[] = [
  { status: 'placed', label: 'Order Placed', emoji: '📋', color: Colors.turmeric },
  { status: 'accepted', label: 'Accepted by Chef', emoji: '👩‍🍳', color: Colors.turmeric },
  { status: 'preparing', label: 'Being Prepared', emoji: '🍳', color: Colors.turmeric },
  { status: 'out_for_delivery', label: 'Out for Delivery', emoji: '🛵', color: Colors.turmeric },
  { status: 'delivered', label: 'Delivered', emoji: '🎉', color: Colors.success },
];

const STATUS_MESSAGES: Record<string, string> = {
  placed: 'Your order has been placed!',
  accepted: 'Chef has accepted your order',
  preparing: 'Chef is cooking your meal',
  out_for_delivery: 'Your order is on the way',
  delivered: 'Enjoy your meal!',
};

export default function OrderTrackingScreen({ route, navigation }: Props) {
  const { orderId } = route.params;
  const { session } = useAuth();
  const { getOrderById } = useOrders(session?.user?.id);
  const [statusIndex, setStatusIndex] = useState(0);
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  // Simulate order progression for demo; real app would use Supabase realtime
  useEffect(() => {
    getOrderById(orderId).then(order => {
      if (order) {
        const idx = STEPS.findIndex(s => s.status === order.status);
        if (idx >= 0) setStatusIndex(idx);
      }
    });
  }, [orderId]);

  useEffect(() => {
    if (statusIndex >= STEPS.length - 1) return;
    const interval = setInterval(() => {
      setStatusIndex(prev => Math.min(prev + 1, STEPS.length - 1));
    }, 6000);
    return () => clearInterval(interval);
  }, [statusIndex]);

  // Pulse animation for active step
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    ).start();
  }, [statusIndex]);

  const currentStep = STEPS[statusIndex];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tracking Order</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status hero */}
        <View style={styles.statusHero}>
          <Text style={styles.statusEmoji}>{currentStep.emoji}</Text>
          <Text style={styles.statusLabel}>{currentStep.label}</Text>
          <Text style={styles.statusMessage}>{STATUS_MESSAGES[currentStep.status]}</Text>
          {currentStep.status !== 'delivered' && (
            <Text style={styles.eta}>ETA: ~25 mins</Text>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {STEPS.map((step, index) => {
            const isCompleted = index <= statusIndex;
            const isActive = index === statusIndex;
            const isLast = index === STEPS.length - 1;

            return (
              <View key={step.status} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <Animated.View style={[
                    styles.circle,
                    isCompleted && { backgroundColor: step.color, borderColor: step.color },
                    isActive && { transform: [{ scale: pulseAnim }] },
                  ]}>
                    <Text style={styles.circleEmoji}>{step.emoji}</Text>
                  </Animated.View>
                  {!isLast && (
                    <View style={[
                      styles.connector,
                      isCompleted && index < statusIndex && { backgroundColor: Colors.turmeric },
                    ]} />
                  )}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={[
                    styles.stepLabel,
                    isCompleted && { color: Colors.text, fontFamily: Typography.semiBold },
                  ]}>
                    {step.label}
                  </Text>
                  {isActive && (
                    <Text style={styles.activeNote}>In progress...</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Chef card */}
        <View style={styles.chefCard}>
          <View style={styles.chefAvatar}>
            <Text style={styles.chefInitials}>SA</Text>
          </View>
          <View style={styles.chefInfo}>
            <Text style={styles.chefName}>Sunita Aunty</Text>
            <Text style={styles.chefRating}>⭐ 4.9 · North Indian cuisine</Text>
          </View>
          <View style={styles.contactBtns}>
            <TouchableOpacity style={styles.contactBtn}>
              <Text style={{ fontSize: 18 }}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.contactBtn, { backgroundColor: '#E8F5E9' }]}>
              <Text style={{ fontSize: 18 }}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: Spacing.xxl }} />
      </ScrollView>
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
  statusHero: {
    backgroundColor: Colors.mocha,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  statusEmoji: { fontSize: 52, marginBottom: Spacing.sm },
  statusLabel: {
    fontFamily: Typography.heading,
    fontSize: 24,
    color: Colors.ivory,
    marginBottom: Spacing.xs,
  },
  statusMessage: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textMuted,
  },
  eta: {
    fontFamily: Typography.bold,
    fontSize: 20,
    color: Colors.turmeric,
    marginTop: Spacing.sm,
  },
  timeline: { padding: Spacing.lg },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', marginRight: Spacing.md },
  circle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleEmoji: { fontSize: 18 },
  connector: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
    minHeight: 28,
  },
  timelineRight: {
    flex: 1,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  stepLabel: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textMuted,
  },
  activeNote: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.turmericDeep,
    marginTop: 2,
  },
  chefCard: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: Spacing.md,
    padding: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chefAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chefInitials: { fontFamily: Typography.heading, fontSize: 18, color: Colors.mocha },
  chefInfo: { flex: 1, marginLeft: Spacing.md },
  chefName: { fontFamily: Typography.heading, fontSize: 16, color: Colors.text },
  chefRating: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  contactBtns: { flexDirection: 'row', gap: Spacing.sm },
  contactBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.turmericLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
