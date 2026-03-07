import React from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CartItem } from '../types';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { PrimaryButton, Divider } from '../components/ui';
import { calculateCart, updateQuantity, removeFromCart } from '../utils/cart';

type Props = NativeStackScreenProps<HomeStackParamList, 'Cart'> & {
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
};

const CartScreen: React.FC<Props> = ({ navigation, cartItems, setCartItems }) => {
  const cart = calculateCart(cartItems);

  if (cartItems.length === 0) {
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
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add some delicious home-cooked meals</Text>
          <PrimaryButton
            label="Browse meals"
            onPress={() => navigation.goBack()}
            style={{ marginTop: Spacing.xl, marginHorizontal: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <View style={{ width: 32 }} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.meal.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={() => (
          <View style={styles.addressCard}>
            <Text style={styles.addressLabel}>📍 DELIVERING TO</Text>
            <Text style={styles.addressText}>12, Green Park, Banjara Hills, Hyderabad</Text>
            <TouchableOpacity>
              <Text style={styles.changeLink}>Change</Text>
            </TouchableOpacity>
          </View>
        )}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemEmoji}>{item.meal.emoji}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.meal.name}</Text>
              <Text style={styles.itemCook}>{item.meal.cook.name}</Text>
            </View>
            <View style={styles.qtyRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setCartItems(updateQuantity(cartItems, item.meal.id, -1))}
              >
                <Text style={styles.qtyBtnText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.qty}>{item.quantity}</Text>
              <TouchableOpacity
                style={[styles.qtyBtn, styles.qtyBtnAdd]}
                onPress={() => setCartItems(updateQuantity(cartItems, item.meal.id, 1))}
              >
                <Text style={[styles.qtyBtnText, { color: Colors.mocha }]}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemPrice}>₹{item.meal.price * item.quantity}</Text>
          </View>
        )}
        ItemSeparatorComponent={() => <Divider style={{ marginHorizontal: Spacing.md }} />}
        ListFooterComponent={() => (
          <View style={styles.billCard}>
            <Text style={styles.billTitle}>Price Details</Text>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Subtotal</Text>
              <Text style={styles.billValue}>₹{cart.subtotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Platform fee</Text>
              <Text style={styles.billValue}>₹{cart.platformFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery</Text>
              <Text style={styles.billValue}>₹{cart.deliveryFee}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>GST (5%)</Text>
              <Text style={styles.billValue}>₹{cart.gst}</Text>
            </View>
            <Divider style={{ marginVertical: Spacing.sm }} />
            <View style={styles.billRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{cart.total}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.bottomBar}>
        <PrimaryButton
          label={`Pay ₹${cart.total} →`}
          onPress={() => navigation.navigate('Payment')}
        />
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
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing.lg },
  emptyEmoji: { fontSize: 64, marginBottom: Spacing.md },
  emptyTitle: { fontFamily: Typography.display, fontSize: Typography.h3, color: Colors.text },
  emptySubtitle: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall,
    color: Colors.textMuted, marginTop: 6, textAlign: 'center',
  },
  list: { padding: Spacing.md, paddingBottom: 100 },
  addressCard: {
    backgroundColor: Colors.turmericLight, borderRadius: Radius.lg,
    padding: Spacing.md, marginBottom: Spacing.md,
  },
  addressLabel: {
    fontFamily: Typography.bodyBold, fontSize: Typography.tiny,
    color: Colors.textMuted, letterSpacing: 0.5, marginBottom: 4,
  },
  addressText: { fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall, color: Colors.mocha },
  changeLink: {
    fontFamily: Typography.bodySemiBold, fontSize: Typography.caption,
    color: Colors.turmeric, marginTop: 4,
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  itemEmoji: { fontSize: 36, marginRight: Spacing.sm },
  itemInfo: { flex: 1, marginRight: Spacing.sm },
  itemName: { fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall, color: Colors.text },
  itemCook: { fontFamily: Typography.bodyRegular, fontSize: Typography.caption, color: Colors.textMuted },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginRight: Spacing.sm },
  qtyBtn: {
    width: 32, height: 32, borderRadius: 16,
    borderWidth: 1.5, borderColor: Colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnAdd: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  qtyBtnText: { fontFamily: Typography.bodyBold, fontSize: 18, color: Colors.textSecondary },
  qty: { fontFamily: Typography.bodyBold, fontSize: Typography.body, color: Colors.text, minWidth: 20, textAlign: 'center' },
  itemPrice: { fontFamily: Typography.display, fontSize: 16, color: Colors.mocha },
  billCard: {
    backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md,
    marginTop: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  billTitle: { fontFamily: Typography.display, fontSize: 17, color: Colors.text, marginBottom: Spacing.md },
  billRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  billLabel: { fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall, color: Colors.textSecondary },
  billValue: { fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall, color: Colors.text },
  totalLabel: { fontFamily: Typography.display, fontSize: Typography.body, color: Colors.text },
  totalValue: { fontFamily: Typography.display, fontSize: Typography.body, color: Colors.mocha },
  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    padding: Spacing.md, backgroundColor: Colors.surface,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
});

export default CartScreen;
