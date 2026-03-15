import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { OrderStatusBadge } from '../components/OrderStatusBadge';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';
import { OrdersStackParamList, Order } from '../types';

type Props = NativeStackScreenProps<OrdersStackParamList, 'OrdersList'>;

const TABS = ['All', 'Active', 'Delivered'] as const;
type Tab = typeof TABS[number];

export default function OrdersScreen({ navigation }: Props) {
  const { session } = useAuth();
  const { orders, loading } = useOrders(session?.user?.id);
  const [tab, setTab] = useState<Tab>('All');

  const filtered = orders.filter(o => {
    if (tab === 'Active') return !['delivered', 'cancelled', 'refunded'].includes(o.status);
    if (tab === 'Delivered') return o.status === 'delivered';
    return true;
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
        <Text style={styles.subtitle}>All your meals, all the love 🍱</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={Colors.turmeric} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => <OrderCard order={item} onTrack={() => navigation.navigate('OrderTracking', { orderId: item.id })} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 52, marginBottom: Spacing.md }}>📦</Text>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySub}>Your first meal is just a tap away</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

function OrderCard({ order, onTrack }: { order: Order; onTrack: () => void }) {
  const isActive = !['delivered', 'cancelled', 'refunded'].includes(order.status);
  const items = order.order_items ?? [];
  const firstItemName = items[0]?.meal_name ?? 'Order';
  const itemsSummary = items.length > 1
    ? `${firstItemName} +${items.length - 1} more`
    : firstItemName;

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.cardEmoji}>🍱</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardMeals} numberOfLines={1}>{itemsSummary}</Text>
          <Text style={styles.cardChef}>{order.chef?.kitchen_name ?? 'Home kitchen'}</Text>
          <OrderStatusBadge status={order.status} />
        </View>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.cardMeta}>
          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          {' · '}₹{Math.round(order.total)}
          {' · '}{order.order_number ?? `#${order.id.slice(0, 6)}`}
        </Text>
        {isActive ? (
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={onTrack}>
            <Text style={[styles.actionBtnText, { color: Colors.mocha }]}>Track →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Reorder</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  title: { fontFamily: Typography.heading, fontSize: 24, color: Colors.text },
  subtitle: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  tab: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: Colors.turmeric },
  tabText: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.textMuted,
  },
  tabTextActive: { color: Colors.mocha },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    overflow: 'hidden',
    ...(Shadows.card as object),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.ivory,
    gap: Spacing.md,
  },
  cardEmoji: { fontSize: 40 },
  cardInfo: { flex: 1, gap: 4 },
  cardMeals: { fontFamily: Typography.semiBold, fontSize: 14, color: Colors.text },
  cardChef: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cardMeta: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textMuted,
  },
  actionBtn: {
    borderRadius: Radius.pill,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  actionBtnPrimary: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  actionBtnText: {
    fontFamily: Typography.bold,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.text,
    marginBottom: 4,
  },
  emptySub: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
