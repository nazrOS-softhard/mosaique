import React, { useRef, useState } from 'react';
import { Text, StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../lib/theme';

export default function TwoFactorScreen({ navigation }: any) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const refs = useRef<Array<TextInput | null>>([]);

  const setDigit = (i: number, v: string) => {
    const next = [...code];
    next[i] = v.replace(/\D/g, '').slice(-1);
    setCode(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };

  return (
    <ScreenWrapper>
      <Text style={styles.icon}>🛡️</Text>
      <Text style={styles.title}>Проверка безопасности</Text>
      <Text style={styles.subtitle}>Введите код из приложения или SMS</Text>

      <GlassCard style={{ width: '100%', maxWidth: 420, alignItems: 'center' }}>
        <View style={styles.codeRow}>
          {code.map((d, i) => (
            <TextInput
              key={i}
              ref={(r) => (refs.current[i] = r)}
              value={d}
              onChangeText={(v) => setDigit(i, v)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.codeBox}
            />
          ))}
        </View>
        <Text style={styles.hint}>Код отправлен на номер +7 999 123-45-67</Text>

        <PrimaryButton
          title="Подтвердить"
          onPress={() => navigation?.navigate?.('Onboarding')}
          style={{ marginTop: 20, width: '100%' }}
        />
        <TouchableOpacity>
          <Text style={styles.link}>Отправить код повторно (00:45)</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 40, marginTop: 40, marginBottom: 8 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { color: colors.textSecondary, textAlign: 'center', marginBottom: 24 },
  codeRow: { flexDirection: 'row', gap: 10 },
  codeBox: {
    width: 44,
    height: 54,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.accentPrimary,
    color: colors.text,
    textAlign: 'center',
    fontSize: 20,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  hint: { color: colors.textSecondary, fontSize: 12, marginTop: 16 },
  link: { color: colors.accentPrimary, textAlign: 'center', marginTop: 16 },
});
