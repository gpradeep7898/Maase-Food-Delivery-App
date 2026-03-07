import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList } from '../types';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { PrimaryButton, SecondaryButton } from '../components/ui';

type Props = NativeStackScreenProps<HomeStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen: React.FC<Props> = ({ route, navigation }) => {
  const { orderId } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        {/* Success circle */}
        <View style={styles.successCircle}>
          <Text style={styles.successEmoji}>✅</Text>
        </View>

        <Text style={styles.title}>Order Placed! 🎉</Text>
        <Text style={styles.subtitle}>
          Sunita Aunty has received your order and will start preparing soon.
        </Text>

        {/* Detail card */}
        <View style={styles.detailCard}>
          <Text style={styles.orderId}>{orderId}</Text>
          <View style={styles.detailRow}>
            <View style={styles.detailCol}>
              <Text style={styles.detailLabel}>Estimated delivery</Text>
              <Text style={styles.detailValue}>~30 mins</Text>
            </View>
            <View style={[styles.detailCol, { alignItems: 'flex-end' }]}>
              <Text style={styles.detailLabel}>Amount paid ✓</Text>
              <Text style={styles.detailValue}>Confirmed</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <PrimaryButton
          label="Track My Order 📍"
          onPress={() => navigation.navigate('OrderTracking', { orderId })}
          style={{ marginBottom: Spacing.md }}
        />
        <SecondaryButton
          label="Browse more meals"
          onPress={() => navigation.navigate('Home')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { flex: 1, padding: Spacing.lg, justifyContent: 'center' },
  successCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: Colors.successLight,
    alignItems: 'center', justifyContent: 'center',
    alignSelf: 'center', marginBottom: Spacing.lg,
  },
  successEmoji: { fontSize: 52 },
  title: {
    fontFamily: Typography.display, fontSize: Typography.h1,
    color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall,
    color: Colors.textSecondary, textAlign: 'center',
    lineHeight: 22, marginBottom: Spacing.xl,
  },
  detailCard: {
    backgroundColor: Colors.turmericLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.xl,
  },
  orderId: {
    fontFamily: Typography.display, fontSize: Typography.h2,
    color: Colors.mocha, textAlign: 'center', marginBottom: Spacing.md,
  },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailCol: {},
  detailLabel: { fontFamily: Typography.bodyRegular, fontSize: Typography.caption, color: Colors.textMuted },
  detailValue: { fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall, color: Colors.mocha, marginTop: 4 },
});

export default OrderConfirmationScreen;
