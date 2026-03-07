import React, { useState } from 'react';
import {
  Alert, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Location from 'expo-location';
import { RootStackParamList } from '../types';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { PrimaryButton, SecondaryButton } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

const LocationScreen: React.FC<Props> = ({ navigation }) => {
  const [mode, setMode] = useState<'prompt' | 'manual'>('prompt');
  const [line1, setLine1] = useState('');
  const [area, setArea] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUseLocation = async () => {
    setLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission denied',
          'Location access is needed to find cooks near you. You can enter your address manually.',
          [{ text: 'Enter manually', onPress: () => setMode('manual') }, { text: 'OK' }]
        );
        setLoading(false);
        return;
      }
      await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      navigation.replace('MainTabs');
    } catch (_) {
      navigation.replace('MainTabs');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmManual = () => {
    if (!line1.trim() || !area.trim()) return;
    navigation.replace('MainTabs');
  };

  if (mode === 'manual') {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.content}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setMode('prompt')}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Enter your address</Text>
          <Text style={styles.subtitle}>We'll find home cooks within 3km of you</Text>

          <TextInput
            style={styles.input}
            value={line1}
            onChangeText={setLine1}
            placeholder="Flat / Building / Street"
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={[styles.input, { marginTop: Spacing.sm }]}
            value={area}
            onChangeText={setArea}
            placeholder="Area / City"
            placeholderTextColor={Colors.textMuted}
          />

          <PrimaryButton
            label="Confirm Location"
            onPress={handleConfirmManual}
            disabled={!line1.trim() || !area.trim()}
            style={{ marginTop: Spacing.lg }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.pinEmoji}>📍</Text>
        <Text style={styles.title}>Find meals near you</Text>
        <Text style={styles.subtitle}>
          Maase connects you with home cooks within 3km. Allow location for the best experience.
        </Text>

        <PrimaryButton
          label="📍 Use My Location"
          onPress={handleUseLocation}
          loading={loading}
          style={{ marginBottom: Spacing.md }}
        />

        <SecondaryButton
          label="Enter address manually"
          onPress={() => setMode('manual')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: { flex: 1, padding: Spacing.lg, justifyContent: 'center' },
  pinEmoji: { fontSize: 64, textAlign: 'center', marginBottom: Spacing.lg },
  title: {
    fontFamily: Typography.display, fontSize: Typography.h2,
    color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall,
    color: Colors.textSecondary, textAlign: 'center', lineHeight: 22,
    marginBottom: Spacing.xl,
  },
  backBtn: { marginBottom: Spacing.lg },
  backText: { fontFamily: Typography.bodySemiBold, fontSize: Typography.bodySmall, color: Colors.textSecondary },
  input: {
    height: 52, backgroundColor: Colors.surface, borderRadius: Radius.md,
    borderWidth: 1.5, borderColor: Colors.border,
    paddingHorizontal: Spacing.md,
    fontFamily: Typography.bodyRegular, fontSize: Typography.body, color: Colors.text,
  },
});

export default LocationScreen;
