// ============================================================
// OrdersScreen.tsx
// ============================================================
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../types';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
import { StatusBadge } from '../components/ui';
import { MOCK_ORDERS } from '../constants/mockData';

type Props = BottomTabScreenProps<MainTabParamList, 'OrdersTab'>;

const OrdersScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView style={ordStyles.container} edges={['top']}>
      <View style={ordStyles.header}>
        <Text style={ordStyles.title}>Your Orders</Text>
        <Text style={ordStyles.subtitle}>All your meals, all the love 🍱</Text>
      </View>
      <FlatList
        data={MOCK_ORDERS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={ordStyles.orderCard} activeOpacity={0.85}>
            <View style={ordStyles.cardTop}>
              <Text style={ordStyles.cardEmoji}>{item.meal.emoji}</Text>
              <View style={ordStyles.cardInfo}>
                <Text style={ordStyles.cardMeal} numberOfLines={1}>{item.meal.name}</Text>
                <Text style={ordStyles.cardCook}>{item.meal.cook.name}</Text>
              </View>
              <StatusBadge status={item.status} />
            </View>
            <View style={ordStyles.cardBottom}>
              <View>
                <Text style={ordStyles.cardDate}>{item.placedAt}</Text>
                <Text style={ordStyles.cardTotal}>₹{item.total} · #{item.id}</Text>
              </View>
              <TouchableOpacity style={ordStyles.reorderBtn}>
                <Text style={ordStyles.reorderText}>
                  {item.status === 'delivered' ? 'Reorder' : 'Track →'}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={ordStyles.empty}>
            <Text style={ordStyles.emptyEmoji}>📦</Text>
            <Text style={ordStyles.emptyTitle}>No orders yet</Text>
            <Text style={ordStyles.emptySubtitle}>Your first meal is just a tap away</Text>
          </View>
        )}
        contentContainerStyle={ordStyles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const ordStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  header: { padding: Spacing.md, paddingBottom: Spacing.sm },
  title: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h1, color: Colors.text },
  subtitle: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textMuted, marginTop: 4 },
  list: { padding: Spacing.md, paddingTop: 0 },
  orderCard: { backgroundColor: Colors.surface, borderRadius: Radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.md },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, backgroundColor: Colors.ivory, padding: Spacing.sm },
  cardEmoji: { fontSize: 32 },
  cardInfo: { flex: 1 },
  cardMeal: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.body, color: Colors.text },
  cardCook: { fontFamily: 'Poppins_400Regular', fontSize: Typography.caption, color: Colors.textSecondary },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.sm },
  cardDate: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textMuted },
  cardTotal: { fontFamily: 'Poppins_700Bold', fontSize: Typography.bodySmall, color: Colors.text },
  reorderBtn: { backgroundColor: Colors.turmericLight, borderRadius: Radius.sm, paddingHorizontal: 14, paddingVertical: 8 },
  reorderText: { fontFamily: 'Poppins_700Bold', fontSize: Typography.bodySmall, color: Colors.mocha },
  empty: { alignItems: 'center', paddingVertical: Spacing.xxl },
  emptyEmoji: { fontSize: 52, marginBottom: Spacing.md },
  emptyTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2, color: Colors.text },
  emptySubtitle: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textMuted, marginTop: 6 },
});

export { OrdersScreen };


// ============================================================
// ProfileScreen.tsx
// ============================================================
import React, { useState } from 'react';
import { Alert } from 'react-native';

type ProfileProps = BottomTabScreenProps<MainTabParamList, 'ProfileTab'>;

const DIET_OPTIONS = ['Vegetarian', 'Non-Vegetarian', 'Jain', 'No Onion-Garlic', 'Gluten Free'];
const MENU_ITEMS = [
  { icon: '📦', label: 'My Orders' },
  { icon: '📍', label: 'Saved Addresses' },
  { icon: '💳', label: 'Payment Methods' },
  { icon: '🔔', label: 'Notifications' },
  { icon: '❤️', label: 'Favourite Cooks' },
  { icon: '🙋', label: 'Help & Support' },
  { icon: '⭐', label: 'Rate the App' },
];

const ProfileScreen: React.FC<ProfileProps> = () => {
  const [dietPrefs, setDietPrefs] = useState<string[]>(['Vegetarian']);

  const toggleDiet = (pref: string) => {
    setDietPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  };

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => {} },
    ]);
  };

  return (
    <SafeAreaView style={profStyles.container} edges={['top']}>
      <FlatList
        data={MENU_ITEMS}
        keyExtractor={item => item.label}
        ListHeaderComponent={() => (
          <>
            {/* Profile header */}
            <View style={profStyles.profileHeader}>
              <View style={profStyles.avatar}>
                <Text style={profStyles.avatarEmoji}>👤</Text>
              </View>
              <Text style={profStyles.name}>Rahul Sharma</Text>
              <Text style={profStyles.phone}>+91 98765 43210</Text>
              <View style={profStyles.statsRow}>
                {[['12', 'Orders'], ['4', 'Cooks'], ['4.8★', 'Avg rating']].map(([val, label]) => (
                  <View key={label} style={profStyles.stat}>
                    <Text style={profStyles.statVal}>{val}</Text>
                    <Text style={profStyles.statLabel}>{label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Diet Memory — unique Maase feature */}
            <View style={profStyles.dietCard}>
              <Text style={profStyles.dietTitle}>🥗 Diet Memory</Text>
              <Text style={profStyles.dietSubtitle}>We'll automatically filter meals to match your preferences.</Text>
              <View style={profStyles.dietChips}>
                {DIET_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    onPress={() => toggleDiet(opt)}
                    style={[profStyles.dietChip, dietPrefs.includes(opt) && profStyles.dietChipActive]}
                  >
                    <Text style={[profStyles.dietChipText, dietPrefs.includes(opt) && profStyles.dietChipTextActive]}>
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={profStyles.sectionTitle}>Account</Text>
          </>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity style={profStyles.menuItem} activeOpacity={0.7}>
            <Text style={profStyles.menuIcon}>{item.icon}</Text>
            <Text style={profStyles.menuLabel}>{item.label}</Text>
            <Text style={profStyles.menuChevron}>›</Text>
          </TouchableOpacity>
        )}
        ListFooterComponent={() => (
          <View style={profStyles.footer}>
            <TouchableOpacity style={profStyles.logoutBtn} onPress={handleLogout}>
              <Text style={profStyles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
            <Text style={profStyles.version}>Maase v1.0.0 · Made with ❤️ for home cooking</Text>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const profStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  profileHeader: { backgroundColor: Colors.mocha, padding: Spacing.lg, alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.turmeric, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.sm, borderWidth: 4, borderColor: 'rgba(255,255,255,0.2)' },
  avatarEmoji: { fontSize: 36 },
  name: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2, color: Colors.ivory, marginBottom: 4 },
  phone: { fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall, color: Colors.textMuted },
  statsRow: { flexDirection: 'row', gap: Spacing.xl, marginTop: Spacing.md },
  stat: { alignItems: 'center' },
  statVal: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h3, color: Colors.turmeric },
  statLabel: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textMuted },
  dietCard: { margin: Spacing.md, backgroundColor: Colors.turmericLight, borderRadius: Radius.lg, padding: Spacing.md },
  dietTitle: { fontFamily: 'Poppins_700Bold', fontSize: Typography.body, color: Colors.mocha, marginBottom: 4 },
  dietSubtitle: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary, marginBottom: Spacing.sm },
  dietChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dietChip: { backgroundColor: Colors.surface, borderRadius: Radius.full, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1.5, borderColor: Colors.border },
  dietChipActive: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  dietChipText: { fontFamily: 'Poppins_600SemiBold', fontSize: Typography.caption, color: Colors.textSecondary },
  dietChipTextActive: { color: Colors.mocha },
  sectionTitle: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: 17, color: Colors.text, paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.border, backgroundColor: Colors.surface },
  menuIcon: { fontSize: 22, width: 32 },
  menuLabel: { flex: 1, fontFamily: 'Poppins_500Medium', fontSize: Typography.body, color: Colors.text },
  menuChevron: { fontSize: 20, color: Colors.textMuted },
  footer: { padding: Spacing.md, paddingTop: Spacing.lg },
  logoutBtn: { height: 52, borderRadius: Radius.md, borderWidth: 1.5, borderColor: Colors.error, alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  logoutText: { fontFamily: 'Poppins_700Bold', fontSize: Typography.body, color: Colors.error },
  version: { fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textMuted, textAlign: 'center' },
});

export { ProfileScreen };
