import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';
import { HomeStackParamList } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'OrderConfirmation'>;

export default function OrderConfirmationScreen({ route, navigation }: Props) {
  const { orderId, orderNumber, chefName } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />
      <View style={styles.content}>
        {/* Animated checkmark */}
        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.successEmoji}>✅</Text>
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={styles.title}>Order Placed!</Text>
          <Text style={styles.subtitle}>
            {chefName} has received your order and will start preparing soon.
          </Text>

          {/* Detail card */}
          <View style={styles.detailCard}>
            <Text style={styles.orderNumber}>{orderNumber}</Text>
            <View style={styles.detailRow}>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Estimated delivery</Text>
                <Text style={styles.detailValue}>~30 mins</Text>
              </View>
              <View style={[styles.detailCol, { alignItems: 'flex-end' }]}>
                <Text style={styles.detailLabel}>Payment</Text>
                <Text style={[styles.detailValue, { color: Colors.success }]}>Confirmed ✓</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('OrderTracking', { orderId })}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryBtnText}>Track My Order 📍</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={() => navigation.navigate('HomeMain')}
            activeOpacity={0.8}
          >
            <Text style={styles.secondaryBtnText}>Browse more meals</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  successEmoji: { fontSize: 52 },
  title: {
    fontFamily: Typography.heading,
    fontSize: 32,
    color: Colors.mocha,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  detailCard: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  orderNumber: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.mocha,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailCol: {},
  detailLabel: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textMuted,
  },
  detailValue: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.mocha,
    marginTop: 4,
  },
  primaryBtn: {
    height: 56,
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...(Shadows.button as object),
  },
  primaryBtnText: { fontFamily: Typography.bold, fontSize: 16, color: Colors.mocha },
  secondaryBtn: {
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontFamily: Typography.semiBold, fontSize: 15, color: Colors.text },
});
