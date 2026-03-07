import React, { useRef, useState, useEffect } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';

interface Props {
  onPress?: () => void;
}

const MaaOnlineBanner: React.FC<Props> = ({ onPress }) => {
  const [visible, setVisible] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Pulse animation for live dot
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.3, duration: 750, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 750, useNativeDriver: true }),
      ])
    ).start();

    // Slide-in animation
    Animated.spring(slideAnim, {
      toValue: 1,
      tension: 70,
      friction: 12,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!visible) return null;

  return (
    <Animated.View style={[
      styles.banner,
      { transform: [{ scaleY: slideAnim }, { translateY: slideAnim.interpolate({ inputRange: [0,1], outputRange: [-20, 0] }) }] }
    ]}>
      <TouchableOpacity style={styles.inner} onPress={onPress} activeOpacity={0.9}>
        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.liveRow}>
            <Animated.View style={[styles.greenDot, { opacity: pulseAnim }]} />
            <Text style={styles.liveText}>3 COOKS COOKING NOW</Text>
          </View>
          <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Quote */}
        <Text style={styles.quote}>
          "Sunita Aunty started cooking{'\n'}Dal Makhani at 11:30 AM" 🔥
        </Text>

        {/* Subtext */}
        <Text style={styles.subtext}>Order now · Ready in ~25 mins</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: Radius.xl,
    overflow: 'hidden',
  },
  inner: {
    backgroundColor: Colors.mocha,
    padding: Spacing.md,
    borderRadius: Radius.xl,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  liveText: {
    fontFamily: Typography.bodyBold,
    fontSize: 11,
    color: '#4CAF50',
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontFamily: Typography.bodyRegular,
    fontSize: 14,
    color: Colors.textMuted,
  },
  quote: {
    fontFamily: Typography.display,
    fontSize: 17,
    color: Colors.ivory,
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },
  subtext: {
    fontFamily: Typography.bodyRegular,
    fontSize: Typography.caption,
    color: Colors.textMuted,
  },
});

export default MaaOnlineBanner;
