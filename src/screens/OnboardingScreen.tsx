import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, StatusBar, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';
import { AuthStackParamList } from '../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Onboarding'>;

export default function OnboardingScreen({ navigation }: Props) {
  const { setRole } = useAuth();
  const [selected, setSelected] = useState<'customer' | 'chef' | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    try {
      await setRole(selected);
      if (selected === 'customer') {
        navigation.replace('Location', { fromOnboarding: true });
      } else {
        navigation.replace('ChefSignup');
      }
    } catch (e) {
      console.error('setRole error:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />
      <View style={styles.content}>
        <Text style={styles.heading}>You are here because…</Text>
        <Text style={styles.subheading}>Tell us how you want to use Maase</Text>

        <View style={styles.cards}>
          {/* Customer */}
          <TouchableOpacity
            style={[styles.card, selected === 'customer' && styles.cardSelected]}
            onPress={() => setSelected('customer')}
            activeOpacity={0.85}
          >
            <Text style={styles.cardEmoji}>🍽️</Text>
            <Text style={[styles.cardTitle, selected === 'customer' && styles.cardTitleSelected]}>
              I want to eat
            </Text>
            <Text style={[styles.cardSub, selected === 'customer' && styles.cardSubSelected]}>
              Order home-cooked meals from your neighbourhood
            </Text>
            {selected === 'customer' && (
              <View style={styles.checkBadge}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Chef */}
          <TouchableOpacity
            style={[styles.card, selected === 'chef' && styles.cardSelected]}
            onPress={() => setSelected('chef')}
            activeOpacity={0.85}
          >
            <Text style={styles.cardEmoji}>👩‍🍳</Text>
            <Text style={[styles.cardTitle, selected === 'chef' && styles.cardTitleSelected]}>
              I want to cook
            </Text>
            <Text style={[styles.cardSub, selected === 'chef' && styles.cardSubSelected]}>
              Share your home-cooking and earn from your kitchen
            </Text>
            {selected === 'chef' && (
              <View style={styles.checkBadge}>
                <Text style={styles.checkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.btn, (!selected || loading) && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!selected || loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={Colors.mocha} />
            : <Text style={styles.btnText}>Continue →</Text>
          }
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  heading: {
    fontFamily: Typography.heading,
    fontSize: 32,
    color: Colors.mocha,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subheading: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  cards: { gap: Spacing.md, marginBottom: Spacing.xl },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    padding: Spacing.lg,
    alignItems: 'center',
    position: 'relative',
    ...(Shadows.card as object),
  },
  cardSelected: {
    borderColor: Colors.turmeric,
    backgroundColor: Colors.turmericLight,
  },
  cardEmoji: { fontSize: 48, marginBottom: Spacing.md },
  cardTitle: {
    fontFamily: Typography.heading,
    fontSize: 20,
    color: Colors.mocha,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  cardTitleSelected: { color: Colors.mocha },
  cardSub: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  cardSubSelected: { color: Colors.mochaSoft },
  checkBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { fontFamily: Typography.bold, fontSize: 14, color: Colors.mocha },
  btn: {
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    ...(Shadows.button as object),
  },
  btnDisabled: { opacity: 0.4 },
  btnText: { fontFamily: Typography.bold, fontSize: 16, color: Colors.mocha },
});
