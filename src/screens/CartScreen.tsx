import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeStackParamList, CartItem } from '../types';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
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
      <SafeAreaView style={styles.container}>
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Find something delicious nearby</Text>
          <PrimaryButton
            label="Browse Meals"
            onPress={() => navigation.goBack()}
            style={styles.browseBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  const feeRows = [
    ['Subtotal', cart.subtotal],
    ['Platform fee', cart.platformFee],
    ['Delivery fee', cart.deliveryFee],
    [`GST (5%)`, cart.gst],
  ] as [string, number][];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={cartItems}
        keyExtractor={item => item.meal.id}
        ListHeaderComponent={() => (
          <>
            <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={styles.back}>←</Text>
              </TouchableOpacity>
              <Text style={styles.title}>Your Cart</Text>
              <View style={{ width: 24 }} />
            </View>

            {/* Delivery address */}
            <View style={styles.addressCard}>
              <Text style={styles.addressEmoji}>📍</Text>
              <View style={styles.addressInfo}>
                <Text style={styles.addressLabel}>DELIVERING TO</Text>
                <Text style={styles.addressText}>Banjara Hills, Hyderabad</Text>
              </View>
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionTitle}>Order Items</Text>
          </>
        )}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Text style={styles.itemEmoji}>{item.meal.emoji}</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.meal.name}</Text>
              <Text style={styles.itemCook}>{item.meal.cook.name} · ₹{item.meal.price} each</Text>
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
                style={[styles.qtyBtn, styles.qtyBtnPlus]}
                onPress={() => setCartItems(updateQuantity(cartItems, item.meal.id, 1))}
              >
                <Text style={[styles.qtyBtnText, { color: Colors.mocha }]}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemTotal}>₹{item.meal.price * item.quantity}</Text>
          </View>
        )}
        ListFooterComponent={() => (
          <View style={styles.breakdown}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            {feeRows.map(([label, val]) => (
              <View key={label} style={styles.feeRow}>
                <Text style={styles.feeLabel}>{label}</Text>
                <Text style={styles.feeVal}>₹{val}</Text>
              </View>
            ))}
            <Divider style={{ marginVertical: Spacing.sm }} />
            <View style={styles.feeRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalVal}>₹{cart.total}</Text>
            </View>
            <View style={{ height: 100 }} />
          </View>
        )}
        contentContainerStyle={styles.list}
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
  list: { padding: Spacing.md, paddingBottom: 0 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing.sm },
  emptyEmoji: { fontSize: 64 },
  emptyTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2, color: Colors.text },
  emptySubtitle: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textMuted },
  browseBtn: { width: 200, marginTop: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.md },
  back: { fontSize: 24, color: Colors.text, width: 24 },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2, color: Colors.text },
  addressCard: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.turmericLight, borderRadius: Radius.lg, padding: Spacing.md, marginBottom: Spacing.md,
  },
  addressEmoji: { fontSize: 22 },
  addressInfo: { flex: 1 },
  addressLabel: { fontFamily: 'Poppins_700Bold', fontSize: 10, color: Colors.textMuted },
  addressText: { fontFamily: 'Poppins_600SemiBold', fontSize: Typography.bodySmall, color: Colors.text },
  changeText: { fontFamily: 'Poppins_700Bold', fontSize: Typography.bodySmall, color: Colors.turmeric },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.text, marginBottom: Spacing.sm },
  cartItem: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
    backgroundColor: Colors.surface, borderRadius: Radius.lg,
    padding: Spacing.sm, marginBottom: Spacing.sm, borderWidth: 1, borderColor: Colors.border,
  },
  itemEmoji: { fontSize: 36 },
  itemInfo: { flex: 1 },
  itemName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.bodySmall, color: Colors.text },
  itemCook: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textSecondary },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  qtyBtn: {
    width: 28, height: 28, borderRadius: 14, borderWidth: 1.5,
    borderColor: Colors.border, alignItems: 'center', justifyContent: 'center',
  },
  qtyBtnPlus: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  qtyBtnText: { fontFamily: 'Poppins_700Bold', fontSize: 16, color: Colors.mocha },
  qty: { fontFamily: 'Poppins_700Bold', fontSize: Typography.body, color: Colors.text, minWidth: 16, textAlign: 'center' },
  itemTotal: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 15, color: Colors.mocha, minWidth: 44, textAlign: 'right' },
  breakdown: { backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.md, borderWidth: 1, borderColor: Colors.border },
  feeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
  feeLabel: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textSecondary },
  feeVal: { fontFamily: 'Poppins_600SemiBold', fontSize: Typography.bodySmall, color: Colors.text },
  totalLabel: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.text },
  totalVal: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.mocha },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.border, padding: Spacing.md, paddingBottom: 24 },
});

export default CartScreen;
