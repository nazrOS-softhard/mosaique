import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Switch } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import StepDots from '../components/StepDots';
import FormField from '../components/FormField';
import { colors } from '../lib/theme';

const INTERESTS = [
  'Архитектура', 'Дизайн', 'Фотография', 'Музыка', 'Путешествия', 'Технологии',
  'Искусство', 'Кино', 'Наука', 'Спорт', 'Образование', 'Игры',
];

const NOTIF_KEYS = [
  ['likes', 'Лайки и реакции'],
  ['comments', 'Комментарии'],
  ['followers', 'Подписчики'],
  ['messages', 'Сообщения'],
  ['mentions', 'Упоминания'],
  ['recs', 'События и рекомендации'],
] as const;

export default function ProfileSetupScreen({ navigation }: any) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('Иван Назаров');
  const [username, setUsername] = useState('ivan.nazr');
  const [bio, setBio] = useState('Архитектор. Люблю создавать пространства и делиться идеями. Путешествую и фотографирую.');
  const [sphere, setSphere] = useState('Архитектура');
  const [site, setSite] = useState('nazr-arch.ru');
  const [interests, setInterests] = useState<string[]>(['Дизайн', 'Путешествия']);
  const [country, setCountry] = useState('Россия');
  const [city, setCity] = useState('Москва');
  const [notif, setNotif] = useState<Record<string, boolean>>({
    likes: true, comments: true, followers: true, messages: true, mentions: true, recs: false,
  });

  const toggleInterest = (i: string) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));

  const steps = ['Аватар', 'Имя и описание', 'Интересы', 'Местоположение', 'Уведомления'];

  const goNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else navigation?.navigate?.('Home');
  };

  return (
    <ScreenWrapper>
      <Text style={styles.header}>04. Настройка профиля</Text>
      <Text style={styles.subheader}>Расскажите о себе, чтобы Мозаика стала вашей</Text>
      <StepDots total={steps.length} active={step} />

      <GlassCard style={{ width: '100%', maxWidth: 420 }}>
        <Text style={styles.stepTitle}>{step + 1}. {steps[step].toUpperCase()}</Text>

        {step === 0 && (
          <View style={{ alignItems: 'center' }}>
            <View style={styles.avatarBig}>
              <Text style={{ fontSize: 34 }}>📷</Text>
            </View>
            <Text style={styles.hint}>Добавьте фото профиля{'\n'}Это поможет друзьям узнать вас</Text>
            <PrimaryButton title="Загрузить фото" onPress={() => {}} style={{ width: '100%', marginTop: 16 }} />
            <PrimaryButton title="Выбрать аватар" onPress={() => {}} variant="outline" style={{ width: '100%', marginTop: 10 }} />
          </View>
        )}

        {step === 1 && (
          <View>
            <FormField label="Имя" value={name} onChangeText={setName} />
            <FormField label="Имя пользователя" value={username} onChangeText={setUsername} autoCapitalize="none" status={{ ok: true, text: 'свободно' }} />
            <Text style={styles.label}>О себе</Text>
            <TextInput
              style={styles.bioInput}
              value={bio}
              onChangeText={setBio}
              multiline
              maxLength={150}
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={styles.counter}>{bio.length}/150</Text>
            <FormField label="Сфера деятельности" value={sphere} onChangeText={setSphere} />
            <FormField label="Веб-сайт (необязательно)" value={site} onChangeText={setSite} autoCapitalize="none" />
          </View>
        )}

        {step === 2 && (
          <View>
            <Text style={styles.hint}>Выберите интересы (можно несколько)</Text>
            <View style={styles.chipsWrap}>
              {INTERESTS.map((i) => {
                const active = interests.includes(i);
                return (
                  <TouchableOpacity
                    key={i}
                    onPress={() => toggleInterest(i)}
                    style={[styles.chip, active && styles.chipActive]}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>
                      {i}{active ? ' ✓' : ''}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={[styles.hint, { marginTop: 12 }]}>Выбрано: {interests.length}</Text>
          </View>
        )}

        {step === 3 && (
          <View>
            <FormField label="Страна" value={country} onChangeText={setCountry} />
            <FormField label="Город" value={city} onChangeText={setCity} />
            <View style={styles.mapPlaceholder}>
              <Text style={{ color: colors.textSecondary }}>🗺  карта — {city}, {country}</Text>
            </View>
          </View>
        )}

        {step === 4 && (
          <View>
            <Text style={styles.hint}>Мы будем сообщать вам о важном</Text>
            {NOTIF_KEYS.map(([key, label]) => (
              <View key={key} style={styles.notifRow}>
                <Text style={{ color: colors.text }}>{label}</Text>
                <Switch
                  value={notif[key]}
                  onValueChange={(v) => setNotif((p) => ({ ...p, [key]: v }))}
                  trackColor={{ false: '#3a3f5c', true: colors.accentPrimary }}
                  thumbColor="#fff"
                />
              </View>
            ))}
          </View>
        )}

        <View style={styles.navRow}>
          {step > 0 ? (
            <PrimaryButton title="Назад" onPress={() => setStep(step - 1)} variant="outline" style={{ flex: 1, marginRight: 8 }} />
          ) : (
            <View style={{ flex: 1, marginRight: 8 }} />
          )}
          <PrimaryButton
            title={step === steps.length - 1 ? 'Готово' : 'Далее'}
            onPress={goNext}
            style={{ flex: 1, marginLeft: 8 }}
          />
        </View>
      </GlassCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { color: colors.accentPrimary, fontSize: 20, fontWeight: '700', alignSelf: 'flex-start' },
  subheader: { color: colors.textSecondary, alignSelf: 'flex-start', marginTop: 4, marginBottom: 4 },
  stepTitle: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 16, letterSpacing: 1 },
  label: { color: colors.textSecondary, fontSize: 12, marginBottom: 6 },
  hint: { color: colors.textSecondary, fontSize: 13, textAlign: 'center' },
  avatarBig: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(122,92,255,0.15)',
    borderWidth: 1,
    borderColor: colors.accentPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  bioInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.text,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 4,
  },
  counter: { color: colors.textSecondary, fontSize: 11, textAlign: 'right', marginBottom: 16 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipActive: { borderColor: colors.accentPrimary, backgroundColor: 'rgba(74,141,255,0.15)' },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: colors.accentPrimary, fontWeight: '600' },
  mapPlaceholder: {
    height: 140,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  notifRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  navRow: { flexDirection: 'row', marginTop: 20 },
});
