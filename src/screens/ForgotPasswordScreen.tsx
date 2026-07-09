import React, { useState } from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../lib/theme';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [emailOrPhone, setEmailOrPhone] = useState('');

  return (
    <ScreenWrapper>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>Восстановление пароля</Text>
      <Text style={styles.subtitle}>
        Введите email или телефон, чтобы получить инструкции по восстановлению
      </Text>

      <GlassCard style={{ width: '100%', maxWidth: 420 }}>
        <FormField
          label="Email или телефон"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          autoCapitalize="none"
        />
        <PrimaryButton
          title="Отправить инструкции"
          onPress={() => navigation?.navigate?.('Login')}
          style={{ marginTop: 12 }}
        />
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Text style={styles.link}>Вернуться к входу</Text>
        </TouchableOpacity>
      </GlassCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  icon: { fontSize: 40, marginTop: 40, marginBottom: 8 },
  title: { color: colors.text, fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 320,
  },
  link: { color: colors.accentPrimary, textAlign: 'center', marginTop: 16 },
});
