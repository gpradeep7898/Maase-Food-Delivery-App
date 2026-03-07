import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Typography, Spacing, Radius, Shadows } from '../constants/theme';
import { CookAvatar } from './ui';
import { MOCK_MEALS } from '../constants/mockData';

const TomorrowSection: React.FC = () => {
  const [reserved, setReserved] = useState<string[]>([]);
  const tomorrowMeals = MOCK_MEALS.slice(0, 3);

  const handleReserve = (mealId: string, mealName: string, cookName: string) => {
    if (reserved.includes(mealId)) return;
    Alert.alert(
      'Reserve for Tomorrow?',
      `Lock in 1 portion of ${mealName} from ${cookName}. They'll cook it fresh tomorrow.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reserve My Portion 🔒',
          onPress: () => {
            setReserved(prev => [...prev, mealId]);
            Alert.alert('Locked in! 🎉', `${cookName} will cook your ${mealName} tomorrow. You'll get a reminder at 9 AM. 🍛`, [{ text: 'Awesome!' }]);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Book for Tomorrow 📅</Text>
        <Text style={styles.subtitle}>Reserve before cooks stop accepting</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {tomorrowMeals.map(meal => {
          const isReserved = reserved.includes(meal.id);
          return (
            <View key={meal.id} style={styles.card}>
              <View style={styles.emojiArea}>
                <Text style={styles.emoji}>{meal.emoji}</Text>
                <View style={styles.tmrwBadge}>
                  <Text style={styles.tmrwText}>📅 tmrw</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.mealName} numberOfLines={2}>{meal.name}</Text>
                <View style={styles.cookRow}>
                  <CookAvatar initials={meal.cook.initials} color={meal.cook.avatarColor} size={22} />
                  <Text style={styles.cookName}>{meal.cook.name}</Text>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.price}>₹{meal.price}</Text>
                  <TouchableOpacity
                    style={[styles.btn, isReserved && styles.btnReserved]}
                    onPress={() => handleReserve(meal.id, meal.name, meal.cook.name)}
                    disabled={isReserved}
                  >
                    <Text style={[styles.btnText, isReserved && styles.btnTextReserved]}>
                      {isReserved ? 'Reserved ✓' : 'Reserve →'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  header: { paddingHorizontal: Spacing.md, marginBottom: Spacing.sm },
  title: { fontFamily: Typography.display, fontSize: Typography.h3, color: Colors.text },
  subtitle: { fontFamily: Typography.bodyRegular, fontSize: Typography.caption, color: Colors.textMuted, marginTop: 2 },
  scroll: { paddingHorizontal: Spacing.md, gap: Spacing.sm },
  card: {
    width: 200,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  emojiArea: {
    height: 90,
    backgroundColor: Colors.turmericLight,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: { fontSize: 44 },
  tmrwBadge: {
    position: 'absolute',
    bottom: 6,
    right: 8,
    backgroundColor: Colors.mocha,
    borderRadius: Radius.full,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  tmrwText: { fontFamily: Typography.bodyBold, fontSize: 9, color: Colors.turmeric },
  cardBody: { padding: Spacing.sm },
  mealName: {
    fontFamily: Typography.display,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
    marginBottom: 6,
  },
  cookRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  cookName: { fontFamily: Typography.bodyMedium, fontSize: Typography.caption, color: Colors.textSecondary },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontFamily: Typography.display, fontSize: 16, color: Colors.mocha },
  btn: {
    backgroundColor: Colors.turmeric,
    borderRadius: Radius.md,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  btnReserved: { backgroundColor: Colors.successLight },
  btnText: { fontFamily: Typography.bodyBold, fontSize: 11, color: Colors.mocha },
  btnTextReserved: { color: Colors.success },
});

export default TomorrowSection;
