import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../lib/theme';
import { supabase } from '../lib/supabase';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return;
    navigation?.navigate?.('TwoFactor');
  };

  return (
    <ScreenWrapper>
      <Text style={styles.logo}>МОЗАИКА</Text>
      <Text style={styles.subtitle}>Рады видеть вас снова</Text>

      <GlassCard style={{ width: '100%', maxWidth: 420 }}>
        <FormField
          label="Email или телефон"
          value={email}
          onChangeText={setEmail}
          placeholder="ivan.nazr@mail.ru"
          autoCapitalize="none"
        />
        <FormField label="Пароль" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />

        <TouchableOpacity onPress={() => navigation?.navigate?.('ForgotPassword')}>
          <Text style={[styles.link, { textAlign: 'right', marginTop: 0 }]}>Забыли пароль?</Text>
        </TouchableOpacity>

        <PrimaryButton title="Войти" onPress={handleLogin} loading={loading} style={{ marginTop: 20 }} />

        <View style={styles.socialRow}>
          {['VK', 'MAX', 'G'].map((s) => (
            <TouchableOpacity key={s} style={styles.socialBtn}>
              <Text style={{ color: colors.text }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={() => navigation?.navigate?.('Register')}>
          <Text style={styles.link}>
            Нет аккаунта? <Text style={styles.linkAccent}>Зарегистрироваться</Text>
          </Text>
        </TouchableOpacity>
      </GlassCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  logo: { color: colors.text, fontSize: 32, fontWeight: '700', letterSpacing: 2 },
  subtitle: { color: colors.textSecondary, marginTop: 6, marginBottom: 24 },
  link: { color: colors.textSecondary, textAlign: 'center', marginTop: 16, fontSize: 13 },
  linkAccent: { color: colors.accentPrimary, fontWeight: '600' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 20 },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
