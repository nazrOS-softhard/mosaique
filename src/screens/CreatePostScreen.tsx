import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import GlassCard from '../components/GlassCard';
import PrimaryButton from '../components/PrimaryButton';
import StepDots from '../components/StepDots';
import { colors } from '../lib/theme';
import { useSession } from '../lib/useSession';
import { createPost } from '../lib/api';

const TYPES = ['Фото', 'Видео', 'Музыка', 'Статья', 'Проект', 'Чертёж', 'Документ', 'Мероприятие'];
const STEPS = ['Тип', 'Файлы', 'Обложка', 'Описание', 'Теги', 'Место', 'Публикация'];

export default function CreatePostScreen({ navigation }: any) {
  const { userId } = useSession();
  const [step, setStep] = useState(0);
  const [type, setType] = useState('Фото');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [location, setLocation] = useState('');
  const [publishing, setPublishing] = useState(false);

  const publish = async () => {
    setPublishing(true);
    try {
      if (userId) {
        await createPost({
          author_id: userId,
          type: type as any,
          title: title || 'Без названия',
          description,
          location: location || null,
          tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
          tile_size: '1x1',
          comments_count: 0,
          saves_count: 0,
          likes_count: 0,
        });
      }
    } catch {
      // без backend — просто продолжаем, это демо-мастер
    }
    setPublishing(false);
    navigation.navigate('Home');
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else publish();
  };

  return (
    <ScreenWrapper>
      <Text style={styles.header}>Создание публикации</Text>
      <StepDots total={STEPS.length} active={step} />

      <GlassCard style={{ width: '100%', maxWidth: 420 }}>
        <Text style={styles.stepTitle}>{step + 1}. {STEPS[step].toUpperCase()}</Text>

        {step === 0 && (
          <View style={styles.chipsWrap}>
            {TYPES.map((t) => (
              <TouchableOpacity key={t} style={[styles.chip, type === t && styles.chipActive]} onPress={() => setType(t)}>
                <Text style={[styles.chipText, type === t && styles.chipTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {step === 1 && (
          <TouchableOpacity style={styles.dropZone}>
            <Text style={{ fontSize: 30 }}>📤</Text>
            <Text style={styles.hint}>Нажмите, чтобы добавить файлы</Text>
          </TouchableOpacity>
        )}

        {step === 2 && (
          <View style={styles.dropZone}>
            <Text style={{ fontSize: 30 }}>🖼️</Text>
            <Text style={styles.hint}>Выберите обложку публикации</Text>
          </View>
        )}

        {step === 3 && (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Название публикации"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[styles.input, styles.textarea]}
              placeholder="Описание"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </View>
        )}

        {step === 4 && (
          <TextInput
            style={styles.input}
            placeholder="Теги через запятую: архитектура, экспедиция"
            placeholderTextColor={colors.textSecondary}
            value={tagsInput}
            onChangeText={setTagsInput}
          />
        )}

        {step === 5 && (
          <TextInput
            style={styles.input}
            placeholder="Место (необязательно)"
            placeholderTextColor={colors.textSecondary}
            value={location}
            onChangeText={setLocation}
          />
        )}

        {step === 6 && (
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ fontSize: 40 }}>✅</Text>
            <Text style={styles.previewTitle}>{title || 'Без названия'}</Text>
            <Text style={styles.hint}>{type} · {location || 'без места'}</Text>
            <Text style={styles.hint}>{tagsInput || 'без тегов'}</Text>
          </View>
        )}

        <View style={styles.navRow}>
          {step > 0 && (
            <PrimaryButton title="Назад" onPress={() => setStep(step - 1)} variant="outline" style={{ flex: 1, marginRight: 8 }} />
          )}
          <PrimaryButton
            title={step === STEPS.length - 1 ? 'Опубликовать' : 'Далее'}
            onPress={next}
            loading={publishing}
            style={{ flex: 1, marginLeft: step > 0 ? 8 : 0 }}
          />
        </View>
      </GlassCard>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: { color: colors.accentPrimary, fontSize: 20, fontWeight: '700', alignSelf: 'flex-start' },
  stepTitle: { color: colors.text, fontSize: 14, fontWeight: '700', marginBottom: 16, letterSpacing: 1 },
  chipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 8, paddingHorizontal: 14 },
  chipActive: { borderColor: colors.accentPrimary, backgroundColor: 'rgba(74,141,255,0.15)' },
  chipText: { color: colors.textSecondary, fontSize: 13 },
  chipTextActive: { color: colors.accentPrimary, fontWeight: '600' },
  dropZone: {
    height: 140, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  hint: { color: colors.textSecondary, fontSize: 12 },
  input: {
    borderBottomWidth: 1, borderBottomColor: colors.accentPrimary, color: colors.text,
    paddingVertical: 10, fontSize: 15, marginBottom: 16,
  },
  textarea: { minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12 },
  previewTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginTop: 8, marginBottom: 6 },
  navRow: { flexDirection: 'row', marginTop: 20 },
});
