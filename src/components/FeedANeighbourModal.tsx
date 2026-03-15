import React, { useState } from 'react';
import {
  Modal, View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Colors, Typography, Radius, Spacing, Shadows } from '../lib/theme';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (message: string) => void;
}

export function FeedANeighbourModal({ visible, onClose, onConfirm }: Props) {
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    onConfirm(message);
    setMessage('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.sheetWrapper}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.emoji}>🤝</Text>
          <Text style={styles.title}>Feed a Neighbour</Text>
          <Text style={styles.description}>
            Add ₹15 to your order to help us feed someone who needs a meal today.
            Your kindness stays anonymous.
          </Text>
          <Input
            label="Leave a message (optional)"
            value={message}
            onChangeText={setMessage}
            placeholder="Warm thoughts from a neighbour..."
            type="multiline"
            maxLength={120}
          />
          <Button
            label="Yes, feed a neighbour 🤝"
            onPress={handleConfirm}
            variant="primary"
            size="lg"
            fullWidth
            style={styles.confirmBtn}
          />
          <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>Maybe later</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.overlay,
  },
  sheetWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  sheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : Spacing.xl,
    ...(Shadows.modal as object),
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.lg,
  },
  emoji: { fontSize: 56, textAlign: 'center', marginBottom: Spacing.md },
  title: {
    fontFamily: Typography.heading,
    fontSize: 22,
    color: Colors.mocha,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  description: {
    fontFamily: Typography.body,
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  confirmBtn: { marginBottom: Spacing.sm },
  cancelBtn: { paddingVertical: Spacing.sm, alignItems: 'center' },
  cancelText: { fontFamily: Typography.medium, fontSize: 14, color: Colors.textMuted },
});
