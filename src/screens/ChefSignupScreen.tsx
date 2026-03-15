import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  StatusBar, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';
import { AuthStackParamList } from '../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'ChefSignup'>;

const CUISINES = [
  'North Indian', 'South Indian', 'Bengali', 'Gujarati',
  'Punjabi', 'Maharashtrian', 'Rajasthani', 'Street Food',
];

export default function ChefSignupScreen({ navigation }: Props) {
  const { session } = useAuth();
  const [kitchenName, setKitchenName] = useState('');
  const [bio, setBio] = useState('');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('');
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function toggleCuisine(c: string) {
    setSelectedCuisines(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    );
  }

  async function handleSubmit() {
    if (!kitchenName.trim()) { setError('Kitchen name is required'); return; }
    if (!area.trim()) { setError('Area is required'); return; }
    if (!city.trim()) { setError('City is required'); return; }
    if (selectedCuisines.length === 0) { setError('Select at least one cuisine'); return; }
    if (!session) return;

    setError('');
    setLoading(true);
    try {
      const { error: err } = await supabase.from('chefs').insert({
        profile_id: session.user.id,
        kitchen_name: kitchenName.trim(),
        bio: bio.trim() || null,
        area: area.trim(),
        city: city.trim(),
        speciality: selectedCuisines,
        address_line: `${area.trim()}, ${city.trim()}`,
        lat: 0,
        lng: 0,
        is_open: false,
        is_verified: false,
        rating: 0,
        total_reviews: 0,
        total_orders: 0,
      });
      if (err) throw err;
      navigation.replace('Location', {});
    } catch (e: any) {
      setError(e.message ?? 'Failed to create kitchen profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.heading}>Set up your kitchen</Text>
          <Text style={styles.subheading}>Tell us about your home kitchen</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Kitchen name *</Text>
            <TextInput
              style={styles.input}
              value={kitchenName}
              onChangeText={t => { setKitchenName(t); setError(''); }}
              placeholder="e.g. Sunita's Kitchen"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>About your kitchen</Text>
            <TextInput
              style={[styles.input, styles.inputMultiline]}
              value={bio}
              onChangeText={setBio}
              placeholder="Tell customers about your cooking style..."
              placeholderTextColor={Colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Area *</Text>
              <TextInput
                style={styles.input}
                value={area}
                onChangeText={t => { setArea(t); setError(''); }}
                placeholder="Banjara Hills"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={t => { setCity(t); setError(''); }}
                placeholder="Hyderabad"
                placeholderTextColor={Colors.textMuted}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Cuisine speciality *</Text>
            <View style={styles.cuisineGrid}>
              {CUISINES.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.cuisineChip,
                    selectedCuisines.includes(c) && styles.cuisineChipSelected,
                  ]}
                  onPress={() => { toggleCuisine(c); setError(''); }}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.cuisineChipText,
                    selectedCuisines.includes(c) && styles.cuisineChipTextSelected,
                  ]}>
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading
              ? <ActivityIndicator color={Colors.mocha} />
              : <Text style={styles.btnText}>Create My Kitchen</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  scroll: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  heading: {
    fontFamily: Typography.heading,
    fontSize: 28,
    color: Colors.mocha,
    marginBottom: Spacing.sm,
  },
  subheading: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  field: { marginBottom: Spacing.md },
  row: { flexDirection: 'row', gap: Spacing.md },
  label: {
    fontFamily: Typography.semiBold,
    fontSize: 13,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    fontFamily: Typography.body,
    fontSize: 15,
    color: Colors.text,
  },
  inputMultiline: { height: 90, paddingTop: 14 },
  cuisineGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  cuisineChip: {
    borderRadius: Radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  cuisineChipSelected: { backgroundColor: Colors.turmeric, borderColor: Colors.turmeric },
  cuisineChipText: {
    fontFamily: Typography.semiBold,
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cuisineChipTextSelected: { color: Colors.mocha },
  errorText: {
    fontFamily: Typography.body,
    fontSize: 13,
    color: Colors.error,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  btn: {
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.sm,
    ...(Shadows.button as object),
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: Typography.bold, fontSize: 16, color: Colors.mocha },
});
