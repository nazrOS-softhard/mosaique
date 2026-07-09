import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../lib/theme';

export default function StepDots({ total, active }: { total: number; active: number }) {
  return (
    <View style={styles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === active
              ? { backgroundColor: colors.accentPrimary, width: 22 }
              : { backgroundColor: colors.textSecondary, opacity: 0.4 },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 6, marginVertical: 16 },
  dot: { height: 6, width: 6, borderRadius: 3 },
});
