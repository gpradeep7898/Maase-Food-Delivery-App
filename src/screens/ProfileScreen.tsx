import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { Colors, Typography, Spacing, Radius } from '../lib/theme';

type DietPref = 'Vegetarian' | 'Non-Vegetarian' | 'Jain' | 'No Onion-Garlic' | 'Gluten Free';
const DIET_OPTIONS: DietPref[] = ['Vegetarian', 'Non-Vegetarian', 'Jain', 'No Onion-Garlic', 'Gluten Free'];

const MENU_ITEMS = [
  { emoji: '📍', label: 'Saved Addresses' },
  { emoji: '💳', label: 'Payment Methods' },
  { emoji: '🔔', label: 'Notifications' },
  { emoji: '❤️', label: 'Favourite Chefs' },
  { emoji: '🆘', label: 'Help & Support' },
  { emoji: '⭐', label: 'Rate the App' },
];

export default function ProfileScreen() {
  const { profile, session, signOut } = useAuth();
  const { orders } = useOrders(session?.user?.id);
  const [dietPrefs, setDietPrefs] = useState<DietPref[]>(['Vegetarian']);

  const phone = session?.user?.phone ?? '';
  const displayName = profile?.full_name ?? phone ?? 'Maase User';
  const initials = displayName
    .split(' ')
    .map((n: string) => n[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase() || '👤';

  const deliveredCount = orders.filter(o => o.status === 'delivered').length;

  function toggleDiet(pref: DietPref) {
    setDietPrefs(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  }

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.mocha} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{displayName}</Text>
          {!!phone && <Text style={styles.userPhone}>+91 {phone.replace('+91', '')}</Text>}

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{deliveredCount}</Text>
              <Text style={styles.statLabel}>Delivered</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{profile?.role === 'chef' ? '👩‍🍳' : '🍽️'}</Text>
              <Text style={styles.statLabel}>{profile?.role ?? 'Customer'}</Text>
            </View>
          </View>
        </View>

        {/* Diet Memory */}
        <View style={styles.dietCard}>
          <Text style={styles.dietTitle}>🥗 Diet Memory</Text>
          <Text style={styles.dietSubtitle}>
            We'll automatically filter meals matching your preferences
          </Text>
          <View style={styles.dietChips}>
            {DIET_OPTIONS.map(pref => (
              <TouchableOpacity
                key={pref}
                style={[styles.dietChip, dietPrefs.includes(pref) && styles.dietChipActive]}
                onPress={() => toggleDiet(pref)}
                activeOpacity={0.8}
              >
                <Text style={[
                  styles.dietChipText,
                  dietPrefs.includes(pref) && styles.dietChipTextActive,
                ]}>
                  {pref}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Account menu */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <React.Fragment key={item.label}>
              <TouchableOpacity style={styles.menuRow} activeOpacity={0.7}>
                <Text style={styles.menuEmoji}>{item.emoji}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuChevron}>›</Text>
              </TouchableOpacity>
              {index < MENU_ITEMS.length - 1 && (
                <View style={{ height: 1, backgroundColor: Colors.border, marginLeft: 56 }} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.85}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.footer}>Maase v1.0.0 · Made with ❤️ for home cooking</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  profileHeader: {
    backgroundColor: Colors.mocha,
    padding: Spacing.lg,
    alignItems: 'center',
    paddingBottom: Spacing.xl,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontFamily: Typography.bold, fontSize: 28, color: Colors.mocha },
  userName: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.ivory,
    marginBottom: 4,
  },
  userPhone: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textMuted,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    alignSelf: 'stretch',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.turmeric,
  },
  statLabel: {
    fontFamily: Typography.body,
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' },
  dietCard: {
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.lg,
    margin: Spacing.md,
    padding: Spacing.md,
  },
  dietTitle: {
    fontFamily: Typography.bold,
    fontSize: 15,
    color: Colors.mocha,
    marginBottom: 4,
  },
  dietSubtitle: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  dietChips: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  dietChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  dietChipActive: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  dietChipText: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dietChipTextActive: { color: Colors.mocha },
  sectionLabel: {
    fontFamily: Typography.bold,
    fontSize: 11,
    color: Colors.textMuted,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    letterSpacing: 0.5,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
  },
  menuEmoji: { fontSize: 20, width: 32 },
  menuLabel: {
    flex: 1,
    fontFamily: Typography.semiBold,
    fontSize: 15,
    color: Colors.text,
  },
  menuChevron: { fontSize: 20, color: Colors.textMuted },
  signOutBtn: {
    margin: Spacing.md,
    height: 52,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: { fontFamily: Typography.bold, fontSize: 15, color: Colors.error },
  footer: {
    fontFamily: Typography.body,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    paddingBottom: Spacing.xl,
    marginTop: Spacing.sm,
  },
});
