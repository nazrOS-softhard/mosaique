import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../lib/theme';

export default function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  rightNode,
  status,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences';
  rightNode?: React.ReactNode;
  status?: { ok: boolean; text: string };
}) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
        />
        {rightNode}
      </View>
      {status && (
        <Text style={{ color: status.ok ? '#22D3EE' : colors.error, fontSize: 12, marginTop: 4 }}>
          {status.ok ? '✓ ' : '• '}
          {status.text}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 18, width: '100%' },
  label: { color: colors.textSecondary, fontSize: 12, marginBottom: 6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.accentPrimary,
  },
  input: {
    flex: 1,
    color: colors.text,
    paddingVertical: 8,
    fontSize: 16,
  },
});
