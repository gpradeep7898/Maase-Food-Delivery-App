import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { StatusBadge } from '../components/ui';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';

const OrdersScreen: React.FC = () => {
  const { user } = useAuth();
  const { orders, loading } = useOrders(user?.uid ?? null);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
        <Text style={styles.subtitle}>All your meals, all the love 🍱</Text>
      </View>

      {loading ? (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={Colors.turmeric} />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const firstItem = item.items[0];
            return (
              <View style={styles.card}>
                <View style={styles.cardTop}>
                  <Text style={styles.cardEmoji}>{firstItem?.meal?.emoji ?? '🍱'}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardMealName} numberOfLines={1}>
                      {item.items.map(i => i.meal.name).join(', ')}
                    </Text>
                    <Text style={styles.cardCook}>{item.cook.name}</Text>
                    <StatusBadge status={item.status} />
                  </View>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardMeta}>
                    {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ₹{item.total} · {item.orderId}
                  </Text>
                  {item.status === 'delivered' ? (
                    <TouchableOpacity style={styles.actionBtn}>
                      <Text style={styles.actionBtnText}>Reorder</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]}>
                      <Text style={[styles.actionBtnText, { color: Colors.mocha }]}>Track →</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📦</Text>
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptySubtitle}>Your first meal is just a tap away</Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  header: {
    paddingHorizontal: Spacing.md, paddingTop: Spacing.md, paddingBottom: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface,
  },
  title: { fontFamily: Typography.display, fontSize: Typography.h2, color: Colors.text },
  subtitle: { fontFamily: Typography.bodyRegular, fontSize: Typography.caption, color: Colors.textMuted, marginTop: 2 },
  list: { padding: Spacing.md },
  card: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    borderWidth: 1, borderColor: Colors.border,
    marginBottom: Spacing.md, overflow: 'hidden',
    ...Shadows.card,
  },
  cardTop: {
    flexDirection: 'row', alignItems: 'center',
    padding: Spacing.md, backgroundColor: Colors.ivory,
  },
  cardEmoji: { fontSize: 40, marginRight: Spacing.md },
  cardInfo: { flex: 1, gap: Spacing.xs },
  cardMealName: { fontFamily: Typography.bodySemiBold, fontSize: Typography.body, color: Colors.text },
  cardCook: { fontFamily: Typography.bodyRegular, fontSize: Typography.caption, color: Colors.textSecondary },
  cardBottom: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  cardMeta: { fontFamily: Typography.bodyRegular, fontSize: Typography.caption, color: Colors.textMuted },
  actionBtn: {
    borderRadius: Radius.full, borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: 14, paddingVertical: 6,
  },
  actionBtnPrimary: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  actionBtnText: { fontFamily: Typography.bodyBold, fontSize: Typography.caption, color: Colors.textSecondary },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyEmoji: { fontSize: 52, marginBottom: Spacing.md },
  emptyTitle: { fontFamily: Typography.display, fontSize: Typography.h3, color: Colors.text },
  emptySubtitle: { fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 6 },
});

export default OrdersScreen;
