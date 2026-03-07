import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Colors, Typography } from '../constants/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoEmoji}>🍱</Text>
      </View>
      <Text style={styles.title}>Maase</Text>
      <Text style={styles.tagline}>One extra meal from ma</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.turmeric,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBox: {
    width: 100,
    height: 100,
    backgroundColor: Colors.mocha,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.mocha,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: { fontSize: 52 },
  title: {
    fontFamily: Typography.display,
    fontSize: 48,
    color: Colors.mocha,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: Typography.bodyRegular,
    fontSize: 14,
    color: Colors.mocha,
    opacity: 0.8,
  },
});

export default SplashScreen;
