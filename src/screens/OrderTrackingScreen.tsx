import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, OrderStatus } from '../types';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { CookAvatar } from '../components/ui';
import { ORDER_STATUS_CONFIG } from '../constants/mockData';

type Props = NativeStackScreenProps<HomeStackParamList, 'OrderTracking'>;

const STEPS: OrderStatus[] = ['placed', 'accepted', 'preparing', 'out_for_delivery', 'delivered'];

const STEP_TIMES: Record<OrderStatus, string> = {
  placed: '12:00 PM',
  accepted: '12:02 PM',
  preparing: '12:05 PM',
  out_for_delivery: '12:25 PM',
  delivered: '12:35 PM',
  cancelled: '',
};

const OrderTrackingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;
  const [statusIndex, setStatusIndex] = useState(0);

  const currentStatus = STEPS[statusIndex] ?? 'placed';
  const config = ORDER_STATUS_CONFIG[currentStatus];

  useEffect(() => {
    if (statusIndex >= STEPS.length - 1) return;
    const interval = setInterval(() => {
      setStatusIndex(prev => Math.min(prev + 1, STEPS.length - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [statusIndex]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <Text style={styles.orderId}>#{orderId}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Status hero */}
        <View style={styles.statusHero}>
          <Text style={styles.statusEmoji}>{config?.emoji ?? '📋'}</Text>
          <Text style={styles.statusLabel}>{config?.label ?? 'Order Placed'}</Text>
          <Text style={styles.statusSubtitle}>
            {currentStatus === 'delivered' ? 'Enjoy your meal! 🍱' : 'ETA: ~25 mins'}
          </Text>
          {currentStatus !== 'delivered' && (
            <Text style={styles.etaText}>25 mins</Text>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {STEPS.map((status, index) => {
            const stepConfig = ORDER_STATUS_CONFIG[status];
            const isCompleted = index <= statusIndex;
            const isActive = index === statusIndex;
            const isLast = index === STEPS.length - 1;

            return (
              <View key={status} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[
                    styles.circle,
                    isCompleted && { backgroundColor: stepConfig?.color, borderColor: stepConfig?.color },
                    isActive && { shadowColor: stepConfig?.color, shadowOpacity: 0.5, shadowRadius: 6, elevation: 4 },
                  ]}>
                    <Text style={styles.circleEmoji}>{stepConfig?.emoji ?? '•'}</Text>
                  </View>
                  {!isLast && (
                    <View style={[
                      styles.connector,
                      isCompleted && index < statusIndex && { backgroundColor: Colors.turmeric },
                    ]} />
                  )}
                </View>
                <View style={styles.timelineRight}>
                  <Text style={[styles.stepLabel, isCompleted && { color: Colors.text }]}>
                    {stepConfig?.label}
                  </Text>
                  {isCompleted && (
                    <Text style={styles.stepTime}>{STEP_TIMES[status]}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* Cook card */}
        <View style={styles.cookCard}>
          <CookAvatar initials="SA" color="#E8825A" size={48} />
          <View style={styles.cookInfo}>
            <Text style={styles.cookName}>Sunita Aunty</Text>
            <Text style={styles.cookRating}>⭐ 4.9 · Punjabi cuisine</Text>
          </View>
          <View style={styles.contactBtns}>
            <TouchableOpacity style={styles.callBtn}>
              <Text style={styles.callBtnText}>📞</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.waBtn}>
              <Text style={styles.waBtnText}>💬</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  orderId: { fontFamily: Typography.bodySemiBold, fontSize: Typography.caption, color: Colors.textMuted },
  statusHero: {
    backgroundColor: Colors.mocha, padding: Spacing.xl,
    alignItems: 'center',
  },
  statusEmoji: { fontSize: 52, marginBottom: Spacing.sm },
  statusLabel: {
    fontFamily: Typography.display, fontSize: Typography.h2,
    color: Colors.ivory, marginBottom: Spacing.xs,
  },
  statusSubtitle: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall,
    color: Colors.textMuted,
  },
  etaText: {
    fontFamily: Typography.bodyBold, fontSize: Typography.h3,
    color: Colors.turmeric, marginTop: Spacing.sm,
  },
  timeline: { padding: Spacing.lg },
  timelineItem: { flexDirection: 'row', marginBottom: 0 },
  timelineLeft: { alignItems: 'center', marginRight: Spacing.md },
  circle: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 2, borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  circleEmoji: { fontSize: 18 },
  connector: {
    width: 2, flex: 1, backgroundColor: Colors.border,
    marginVertical: 4, minHeight: 28,
  },
  timelineRight: { flex: 1, paddingTop: Spacing.sm, paddingBottom: Spacing.lg },
  stepLabel: {
    fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall,
    color: Colors.textMuted,
  },
  stepTime: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.caption,
    color: Colors.textMuted, marginTop: 2,
  },
  cookCard: {
    flexDirection: 'row', alignItems: 'center',
    margin: Spacing.md, padding: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
  },
  cookInfo: { flex: 1, marginLeft: Spacing.md },
  cookName: { fontFamily: Typography.display, fontSize: 16, color: Colors.text },
  cookRating: { fontFamily: Typography.bodyRegular, fontSize: Typography.caption, color: Colors.textSecondary },
  contactBtns: { flexDirection: 'row', gap: Spacing.sm },
  callBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.turmericLight,
    alignItems: 'center', justifyContent: 'center',
  },
  callBtnText: { fontSize: 18 },
  waBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.successLight,
    alignItems: 'center', justifyContent: 'center',
  },
  waBtnText: { fontSize: 18 },
});

export default OrderTrackingScreen;
