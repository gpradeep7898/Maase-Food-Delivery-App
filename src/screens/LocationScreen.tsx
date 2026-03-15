import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useLocation } from '../hooks/useLocation';
import { Colors, Typography, Spacing, Radius, Shadows } from '../lib/theme';
import { AuthStackParamList } from '../types';

type Props = NativeStackScreenProps<AuthStackParamList, 'Location'>;

export default function LocationScreen({ navigation }: Props) {
  const { requestLocation, saveLocation } = useLocation();
  const [mode, setMode] = useState<'prompt' | 'manual'>('prompt');
  const [area, setArea] = useState('');
  const [city, setCity] = useState('Hyderabad');
  const [loading, setLoading] = useState(false);

  async function handleUseLocation() {
    setLoading(true);
    const loc = await requestLocation();
    setLoading(false);
    if (!loc) {
      Alert.alert(
        'Permission denied',
        'Allow location access to find nearby cooks, or enter your area manually.',
        [
          { text: 'Enter manually', onPress: () => setMode('manual') },
          { text: 'OK' },
        ]
      );
    }
    // On success, location is saved — AppNavigator auto-navigates to Main
  }

  async function handleManualConfirm() {
    if (!area.trim()) return;
    await saveLocation({
      lat: 0,
      lng: 0,
      area: area.trim(),
      city: city.trim() || 'Hyderabad',
    });
    // AppNavigator watches location state and switches to MainNavigator automatically
  }

  if (mode === 'manual') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />
        <View style={styles.content}>
          <TouchableOpacity onPress={() => setMode('prompt')} style={styles.backRow}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Text style={styles.heading}>Enter your area</Text>
          <Text style={styles.subheading}>We'll find home cooks within 3km of you</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Area / Locality *</Text>
            <TextInput
              style={styles.input}
              value={area}
              onChangeText={setArea}
              placeholder="e.g. Banjara Hills"
              placeholderTextColor={Colors.textMuted}
              autoFocus
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={city}
              onChangeText={setCity}
              placeholder="Hyderabad"
              placeholderTextColor={Colors.textMuted}
            />
          </View>

          <TouchableOpacity
            style={[styles.btn, !area.trim() && styles.btnDisabled]}
            onPress={handleManualConfirm}
            disabled={!area.trim()}
            activeOpacity={0.85}
          >
            <Text style={styles.btnText}>Confirm Location</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />
      <View style={styles.content}>
        <Text style={styles.pinEmoji}>📍</Text>
        <Text style={styles.heading}>Find meals near you</Text>
        <Text style={styles.subheading}>
          Maase connects you with home cooks within 3km. Allow location for the best experience.
        </Text>

        <TouchableOpacity
          style={[styles.btn, loading && styles.btnDisabled]}
          onPress={handleUseLocation}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading
            ? <ActivityIndicator color={Colors.mocha} />
            : <Text style={styles.btnText}>📍 Use My Location</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => setMode('manual')}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryBtnText}>Enter address manually</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { flex: 1, padding: Spacing.xl, justifyContent: 'center' },
  backRow: { marginBottom: Spacing.xl },
  backText: {
    fontFamily: Typography.semiBold,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  pinEmoji: { fontSize: 64, textAlign: 'center', marginBottom: Spacing.lg },
  heading: {
    fontFamily: Typography.heading,
    fontSize: 28,
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
  field: { marginBottom: Spacing.md },
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
  btn: {
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...(Shadows.button as object),
  },
  btnDisabled: { opacity: 0.5 },
  btnText: { fontFamily: Typography.bold, fontSize: 16, color: Colors.mocha },
  secondaryBtn: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  secondaryBtnText: {
    fontFamily: Typography.semiBold,
    fontSize: 15,
    color: Colors.text,
  },
});
