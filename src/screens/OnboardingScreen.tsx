import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import PrimaryButton from '../components/PrimaryButton';
import StepDots from '../components/StepDots';
import { colors } from '../lib/theme';

const { width: W } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '▦',
    title: 'Ваш профиль — это мозаика',
    text: 'Создавайте свою уникальную мозаику из фото, видео, проектов, музыки и любых других материалов.',
  },
  {
    icon: '⧉',
    title: 'Множество форматов в одном месте',
    text: 'Публикуйте всё, что создаёте: фото, видео, статьи, музыку, проекты, документы и другое.',
  },
  {
    icon: '🌐',
    title: 'Исследуйте мир',
    text: 'Находите интересные места, людей, события и проекты на карте. Весь мир в вашей мозаике.',
  },
  {
    icon: '💬',
    title: 'Общайтесь и создавайте вместе',
    text: 'Обсуждайте идеи, делитесь файлами, создавайте совместные проекты и находите единомышленников.',
  },
  {
    icon: '🔐',
    title: 'Ваши данные под защитой',
    text: 'Мы используем современные технологии для защиты ваших данных и конфиденциальности.',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList>(null);

  const next = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      navigation?.navigate?.('ProfileSetup');
    }
  };

  return (
    <ScreenWrapper scroll={false}>
      <View style={styles.topRow}>
        <Text style={styles.title}>03. Онбординг</Text>
        <TouchableOpacity onPress={() => navigation?.navigate?.('ProfileSetup')}>
          <Text style={styles.skip}>Пропустить всё</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, i) => String(i)}
        onMomentumScrollEnd={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / W);
          setIndex(i);
        }}
        style={{ flexGrow: 0 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width: W - 40 }]}>
            <Text style={styles.icon}>{item.icon}</Text>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideText}>{item.text}</Text>
          </View>
        )}
      />

      <StepDots total={SLIDES.length} active={index} />

      <PrimaryButton
        title={index === SLIDES.length - 1 ? 'Начать' : 'Далее'}
        onPress={next}
        style={{ width: '100%', maxWidth: 420 }}
      />
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: { color: colors.accentPrimary, fontSize: 18, fontWeight: '700' },
  skip: { color: colors.textSecondary, fontSize: 13 },
  slide: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  icon: { fontSize: 56, marginBottom: 20 },
  slideTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },
  slideText: { color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
});
