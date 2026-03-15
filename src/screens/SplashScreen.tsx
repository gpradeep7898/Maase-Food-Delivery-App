import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, StatusBar } from 'react-native';
import { Colors, Typography } from '../lib/theme';

const { width } = Dimensions.get('window');

export default function SplashScreen({ navigation }: { navigation: any }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(() => navigation.replace('Login'), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.ivory} />
      <View style={styles.blob} />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <Text style={styles.logo}>maase</Text>
        <Text style={styles.tagline}>One extra meal from ma</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.ivory, justifyContent: 'center', alignItems: 'center' },
  blob: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.turmeric,
    opacity: 0.1,
  },
  content: { alignItems: 'center' },
  logo: { fontFamily: Typography.heading, fontSize: 56, color: Colors.mocha, letterSpacing: -1 },
  tagline: { fontFamily: Typography.body, fontSize: 16, color: Colors.textSecondary, marginTop: 8 },
});
