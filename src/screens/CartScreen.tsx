import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCart } from '../hooks/useCart';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';
import { HomeStackParamList } from '../types';

type Props = NativeStackScreenProps<HomeStackParamList, 'Cart'>;

export default function CartScreen({ navigation }: Props) {
  const {
    items, subtotal, platformFee, deliveryFee, gst, total,
    addToCart, removeFromCart,
  } = useCart();

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Your Cart</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={styles.empty}>
          <Text style={{ fontSize: 64, marginBottom: Spacing.md }}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Add some delicious home-cooked meals</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.browseBtnText}>Browse meals</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={item => item.meal.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.addressCard}>
            <Text style={styles.addressLabel}>📍 DELIVERING TO</Text>
            <Text style={styles.addressText}>Your saved address</Text>
            <TouchableOpacity>
              <Text style={styles.changeLink}>Change →</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemEmoji}>🍲</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.meal.name}</Text>
              <Text style={styles.itemChef}>
                {item.meal.chef?.kitchen_name ?? 'Home kitchen'}
              </Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => removeFromCart(item.meal.id)}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, styles.qtyBtnAdd]}
                onPress={() => addToCart(item.meal)}
              >
                <Text style={[styles.qtyBtnText, { color: Colors.mocha }]}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemPrice}>₹{item.meal.price * item.quantity}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => (
          <View style={{ height: 1, backgroundColor: Colors.border, marginHorizontal: Spacing.md }} />
        )}
        ListFooterComponent={
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Price Details</Text>
            {[
              ['Subtotal', `₹${subtotal}`],
              ['Platform fee', `₹${platformFee}`],
              ['Delivery', `₹${deliveryFee}`],
              ['GST (5%)', `₹${Math.round(gst)}`],
            ].map(([label, value]) => (
              <View key={label} style={styles.billRow}>
                <Text style={styles.billLabel}>{label}</Text>
                <Text style={styles.billValue}>{value}</Text>
              </View>
            ))}
            <View style={{ height: 1, backgroundColor: Colors.border, marginVertical: Spacing.sm }} />
            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{Math.round(total)}</Text>
            </View>
          </View>
        }
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={() => navigation.navigate('Payment')}
          activeOpacity={0.85}
        >
          <Text style={styles.payBtnText}>Pay ₹{Math.round(total)} →</Text>
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
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
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  browseBtn: {
    height: 52,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseBtnText: { fontFamily: Typography.bold, fontSize: 15, color: Colors.mocha },
  list: { padding: Spacing.md, paddingBottom: 100 },
  addressCard: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  addressLabel: {
    fontFamily: Typography.bold,
    fontSize: 10,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  addressText: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.mocha,
  },
  changeLink: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.turmericDeep,
    marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  itemEmoji: { fontSize: 34, marginRight: Spacing.sm },
  itemInfo: { flex: 1, marginRight: Spacing.sm },
  itemName: { fontFamily: Typography.semiBold, fontSize: 14, color: Colors.text },
  itemChef: { fontFamily: Typography.body, fontSize: 11, color: Colors.textMuted },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginRight: Spacing.sm,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnAdd: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  qtyBtnText: {
    fontFamily: Typography.bold,
    fontSize: 16,
    color: Colors.textSecondary,
  },
  qty: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.text,
    minWidth: 18,
    textAlign: 'center',
  },
  itemPrice: { fontFamily: Typography.heading, fontSize: 15, color: Colors.mocha },
  billCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  billTitle: {
    fontFamily: Typography.heading,
    fontSize: 17,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  billLabel: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
  },
  billValue: { fontFamily: Typography.semiBold, fontSize: 13, color: Colors.text },
  totalLabel: { fontFamily: Typography.heading, fontSize: 16, color: Colors.text },
  totalValue: { fontFamily: Typography.heading, fontSize: 16, color: Colors.mocha },
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
  payBtnText: { fontFamily: Typography.bold, fontSize: 16, color: Colors.mocha },
});
