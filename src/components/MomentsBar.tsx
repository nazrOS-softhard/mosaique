import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../lib/theme';
import { MOCK_AUTHORS } from '../lib/mockData';

export default function MomentsBar({ onPress }: { onPress?: (authorId: string) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <View style={styles.item}>
        <View style={[styles.ring, styles.addRing]}>
          <Text style={{ color: colors.accentPrimary, fontSize: 20 }}>+</Text>
        </View>
        <Text style={styles.label} numberOfLines={1}>Ваш момент</Text>
      </View>
      {MOCK_AUTHORS.map((a) => (
        <TouchableOpacity key={a.id} style={styles.item} onPress={() => onPress?.(a.id)}>
          <View style={styles.ring}>
            <Text style={{ color: colors.text, fontWeight: '700' }}>{a.name[0]}</Text>
          </View>
          <Text style={styles.label} numberOfLines={1}>{a.name.split(' ')[0]}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, gap: 14, paddingBottom: 12 },
  item: { alignItems: 'center', width: 60 },
  ring: {
    width: 54, height: 54, borderRadius: 27,
    borderWidth: 2, borderColor: colors.accentPrimary,
    backgroundColor: 'rgba(122,92,255,0.15)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  addRing: { borderStyle: 'dashed', backgroundColor: 'transparent' },
  label: { color: colors.textSecondary, fontSize: 11 },
});
