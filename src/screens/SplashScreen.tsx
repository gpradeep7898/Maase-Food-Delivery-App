import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Typography } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Login'), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoBox}>
          <Text style={styles.logoEmoji}>🍱</Text>
        </View>
        <Text style={styles.appName}>Maase</Text>
        <Text style={styles.tagline}>One extra meal from ma</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.turmeric,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: Colors.mocha,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.mocha,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 52,
  },
  appName: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 48,
    color: Colors.mocha,
    lineHeight: 56,
  },
  tagline: {
    fontFamily: 'Poppins_400Regular',
    fontSize: Typography.bodySmall,
    color: Colors.mocha,
    opacity: 0.8,
  },
});

export default SplashScreen;
