import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Typography, Radius, Spacing } from '../constants/theme';
import { PrimaryButton, SecondaryButton } from '../components/ui';

type Props = NativeStackScreenProps<RootStackParamList, 'Location'>;

const LocationScreen: React.FC<Props> = ({ navigation }) => {
  const [mode, setMode] = useState<'prompt' | 'manual'>('prompt');
  const [line1, setLine1] = useState('');
  const [area, setArea] = useState('');

  const handleAutoLocation = async () => {
    // TODO: Use expo-location to get coordinates
    // const { status } = await Location.requestForegroundPermissionsAsync();
    // if (status === 'granted') {
    //   const loc = await Location.getCurrentPositionAsync({});
    //   navigate to main tabs with location
    // }
    navigation.replace('MainTabs');
  };

  const handleManualSubmit = () => {
    if (!line1 || !area) return;
    navigation.replace('MainTabs');
  };

  return (
    <SafeAreaView style={styles.container}>
      {mode === 'prompt' ? (
        <View style={styles.content}>
          <Text style={styles.emoji}>📍</Text>
          <Text style={styles.title}>Where are you?</Text>
          <Text style={styles.subtitle}>
            We'll find home cooks within 3km of you — fresh meals, just around the corner.
          </Text>
          <PrimaryButton
            label="📍  Use My Location"
            onPress={handleAutoLocation}
            style={styles.btn}
          />
          <SecondaryButton
            label="Enter address manually"
            onPress={() => setMode('manual')}
            style={styles.btn}
          />
        </View>
      ) : (
        <View style={styles.manualContent}>
          <TouchableOpacity onPress={() => setMode('prompt')} style={styles.back}>
            <Text style={styles.backText}>←  Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Enter your address</Text>
          <Text style={styles.subtitle}>So we can find cooks near you</Text>

          <TextInput
            style={styles.input}
            value={line1}
            onChangeText={setLine1}
            placeholder="Flat no, building, street..."
            placeholderTextColor={Colors.textMuted}
          />
          <TextInput
            style={[styles.input, { marginBottom: Spacing.lg }]}
            value={area}
            onChangeText={setArea}
            placeholder="Area, city (e.g. Banjara Hills, Hyderabad)"
            placeholderTextColor={Colors.textMuted}
          />
          <PrimaryButton
            label="Confirm Location"
            onPress={handleManualSubmit}
            disabled={!line1 || !area}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory },
  content: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    padding: Spacing.lg,
  },
  manualContent: {
    flex: 1, padding: Spacing.lg, paddingTop: Spacing.md,
  },
  emoji: { fontSize: 72, marginBottom: Spacing.lg },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold', fontSize: Typography.h2,
    color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular', fontSize: Typography.bodySmall,
    color: Colors.textSecondary, textAlign: 'center', lineHeight: 22,
    marginBottom: Spacing.xl, maxWidth: 280,
  },
  btn: { width: '100%', marginBottom: Spacing.sm },
  back: { marginBottom: Spacing.lg },
  backText: { fontFamily: 'Poppins_600SemiBold', fontSize: Typography.body, color: Colors.textSecondary },
  input: {
    height: 52, borderWidth: 1.5, borderColor: Colors.border,
    borderRadius: Radius.md, paddingHorizontal: Spacing.md,
    fontFamily: 'Poppins_400Regular', fontSize: Typography.body,
    color: Colors.text, backgroundColor: Colors.surface, marginBottom: Spacing.sm,
  },
});

export default LocationScreen;
