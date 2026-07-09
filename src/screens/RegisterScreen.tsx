import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, Pressable, Image } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import FormField from '../components/FormField';
import PrimaryButton from '../components/PrimaryButton';
import { colors } from '../lib/theme';
import { supabase } from '../lib/supabase';

const COUNTRIES = ['Россия', 'Беларусь', 'Казахстан', 'Украина', 'Узбекистан', 'США', 'Германия', 'Франция', 'Турция', 'Япония'];

export default function RegisterScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [country, setCountry] = useState('Россия');
  const [countryModal, setCountryModal] = useState(false);
  const [birthDate, setBirthDate] = useState('12 марта 1998');
  const [username, setUsername] = useState('ivan_nazr');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const usernameStatus = useMemo(() => {
    if (!username) return undefined;
    const taken = ['admin', 'mosaika', 'test'];
    return taken.includes(username)
      ? { ok: false, text: 'занято' }
      : { ok: true, text: 'свободно' };
  }, [username]);

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    if (password !== confirmPassword) return;
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, username, country, birth_date: birthDate } },
    });
    setLoading(false);
    if (!error) navigation?.navigate?.('Onboarding');
  };

  return (
    <ScreenWrapper>
      <Text style={styles.logo}>МОЗАИКА</Text>
      <Text style={styles.subtitle}>Соберите свою цифровую историю</Text>

      <GlassCard style={{ width: '100%', maxWidth: 420 }}>
        <FormField label="Имя" value={name} onChangeText={setName} placeholder="Иван Назаров" />
        <FormField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="ivan.nazr@mail.ru"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormField label="Пароль" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
        <FormField
          label="Повторите пароль"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          secureTextEntry
        />

        <Text style={styles.label}>Страна</Text>
        <TouchableOpacity style={styles.selector} onPress={() => setCountryModal(true)}>
          <Text style={styles.selectorText}>🌐  {country}</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 16 }]}>Дата рождения</Text>
        <TouchableOpacity style={styles.selector}>
          <Text style={styles.selectorText}>📅  {birthDate}</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 16 }}>
          <FormField
            label="Имя пользователя"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            status={usernameStatus}
          />
        </View>

        <View style={styles.avatarRow}>
          <TouchableOpacity style={styles.avatarCircle}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImg} />
            ) : (
              <Text style={{ fontSize: 22 }}>📷</Text>
            )}
          </TouchableOpacity>
          <Text style={{ color: colors.textSecondary, flex: 1, marginLeft: 12, fontSize: 12 }}>
            Добавьте фото профиля или пропустите этот шаг
          </Text>
        </View>

        <PrimaryButton title="Создать профиль" onPress={handleRegister} loading={loading} style={{ marginTop: 20 }} />

        <TouchableOpacity onPress={() => navigation?.navigate?.('Login')}>
          <Text style={styles.link}>
            Уже есть аккаунт? <Text style={styles.linkAccent}>Войти</Text>
          </Text>
        </TouchableOpacity>
      </GlassCard>

      <Text style={styles.footnote}>
        Продолжая регистрацию, вы принимаете условия использования и политику конфиденциальности.
      </Text>

      <Modal visible={countryModal} transparent animationType="fade">
        <Pressable style={styles.modalBg} onPress={() => setCountryModal(false)}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Выбор страны</Text>
            <FlatList
              data={COUNTRIES}
              keyExtractor={(i) => i}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.countryRow}
                  onPress={() => {
                    setCountry(item);
                    setCountryModal(false);
                  }}
                >
                  <Text style={{ color: colors.text }}>{item}</Text>
                  {item === country && <Text style={{ color: colors.accentPrimary }}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  logo: { color: colors.text, fontSize: 32, fontWeight: '700', letterSpacing: 2 },
  subtitle: { color: colors.textSecondary, marginTop: 6, marginBottom: 24 },
  label: { color: colors.textSecondary, fontSize: 12, marginBottom: 6 },
  selector: {
    borderBottomWidth: 1,
    borderBottomColor: colors.accentPrimary,
    paddingVertical: 10,
  },
  selectorText: { color: colors.text, fontSize: 16 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(122,92,255,0.15)',
    borderWidth: 1,
    borderColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: '100%', height: '100%' },
  link: { color: colors.textSecondary, textAlign: 'center', marginTop: 18 },
  linkAccent: { color: colors.accentPrimary, fontWeight: '600' },
  footnote: {
    color: colors.textSecondary,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    maxWidth: 320,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(9,11,24,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: '#12142a',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  modalTitle: { color: colors.text, fontSize: 16, fontWeight: '600', marginBottom: 12 },
  countryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
});
