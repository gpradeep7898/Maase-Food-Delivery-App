import React, { useRef, useState, useEffect } from 'react';
import {
  Animated, Modal, StyleSheet, Text,
  TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';
import { Colors, Typography, Spacing, Radius } from '../constants/theme';
import { Meal } from '../types';
import { PrimaryButton } from './ui';

interface Props {
  meal: Meal;
  visible: boolean;
  onClose: () => void;
}

const FeedANeighbour: React.FC<Props> = ({ meal, visible, onClose }) => {
  const [success, setSuccess] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setSuccess(false);
      Animated.spring(slideAnim, {
        toValue: 1,
        tension: 70,
        friction: 12,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handleConfirm = () => {
    setSuccess(true);
    setTimeout(() => {
      onClose();
      setSuccess(false);
    }, 2500);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.sheet, {
        transform: [{
          translateY: slideAnim.interpolate({ inputRange: [0,1], outputRange: [400, 0] }),
        }],
      }]}>
        {/* Handle */}
        <View style={styles.handle} />

        {!success ? (
          <>
            {/* Illustration */}
            <View style={styles.illustrationRow}>
              <Text style={styles.illustrationEmoji}>🏠</Text>
              <Text style={styles.arrow}>→</Text>
              <Text style={styles.illustrationEmoji}>🍱</Text>
              <Text style={styles.arrow}>→</Text>
              <Text style={styles.illustrationEmoji}>🏠</Text>
            </View>

            <Text style={styles.title}>Feed someone nearby</Text>
            <Text style={styles.body}>
              Pay ₹{meal.price} to feed a neighbour — anonymously.{'\n'}
              They'll never know who, but they'll feel it.
            </Text>

            <View style={styles.mealChip}>
              <Text style={styles.mealEmoji}>{meal.emoji}</Text>
              <Text style={styles.mealChipName}>{meal.name}</Text>
              <Text style={styles.mealChipPrice}>₹{meal.price}</Text>
            </View>

            <Text style={styles.anonNote}>
              🔒 Your identity stays completely anonymous.
            </Text>

            <PrimaryButton label={`Yes, feed a neighbour 🤲`} onPress={handleConfirm} />

            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Maybe next time</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.successContainer}>
            <Text style={styles.successEmoji}>🙏</Text>
            <Text style={styles.successTitle}>You just made{'\n'}someone's day!</Text>
            <Text style={styles.successBody}>A warm meal is heading to a neighbour.</Text>
            <View style={styles.karmaChip}>
              <Text style={styles.karmaText}>+1 Karma · Thank you ❤️</Text>
            </View>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: Colors.ivory,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: Spacing.lg,
    paddingBottom: 40,
  },
  handle: {
    width: 40, height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  illustrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  illustrationEmoji: { fontSize: 36 },
  arrow: { fontFamily: Typography.bodyBold, fontSize: 20, color: Colors.turmeric },
  title: {
    fontFamily: Typography.display,
    fontSize: 22,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  body: {
    fontFamily: Typography.bodyRegular,
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  mealChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.turmericLight,
    borderRadius: Radius.lg,
    padding: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  mealEmoji: { fontSize: 28 },
  mealChipName: {
    flex: 1,
    fontFamily: Typography.bodySemiBold,
    fontSize: Typography.bodySmall,
    color: Colors.mocha,
  },
  mealChipPrice: { fontFamily: Typography.display, fontSize: 17, color: Colors.mocha },
  anonNote: {
    fontFamily: Typography.bodyRegular,
    fontSize: 12,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  cancelBtn: { height: 44, alignItems: 'center', justifyContent: 'center', marginTop: Spacing.xs },
  cancelText: { fontFamily: Typography.bodyRegular, fontSize: Typography.bodySmall, color: Colors.textMuted },
  successContainer: { alignItems: 'center', paddingTop: Spacing.sm },
  successEmoji: { fontSize: 64, marginBottom: Spacing.md },
  successTitle: {
    fontFamily: Typography.display,
    fontSize: Typography.h1,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: Spacing.sm,
  },
  successBody: {
    fontFamily: Typography.bodyRegular,
    fontSize: Typography.bodySmall,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  karmaChip: {
    backgroundColor: Colors.successLight,
    borderRadius: Radius.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  karmaText: { fontFamily: Typography.bodyBold, fontSize: Typography.bodySmall, color: Colors.success },
});

export default FeedANeighbour;
