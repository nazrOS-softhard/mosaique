import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MosaicBackground from '../components/MosaicBackground';
import { colors } from '../lib/theme';
import { MOCK_AUTHORS } from '../lib/mockData';

const CONVERSATIONS = MOCK_AUTHORS.map((a, i) => ({
  id: a.id,
  name: a.name,
  lastMessage: [
    'Отличный проект! Давай поработаем вместе 👍',
    'Вот файлы для презентации',
    '🎵 Голосовое сообщение · 0:28',
    'Когда сможешь глянуть чертёж?',
    'Спасибо за фидбек!',
  ][i % 5],
  time: ['10:45', '09:12', 'вчера', 'вчера', 'пн'][i % 5],
  unread: i % 2 === 0,
}));

export default function MessagesScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Сообщения</Text>
          <View style={{ width: 20 }} />
        </View>

        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          data={CONVERSATIONS}
          keyExtractor={(c) => c.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('Chat', { authorId: item.id, authorName: item.name })}
            >
              <View style={styles.avatar}>
                <Text style={{ color: colors.text, fontWeight: '700' }}>{item.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.lastMsg} numberOfLines={1}>{item.lastMessage}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.time}>{item.time}</Text>
                {item.unread && <View style={styles.dot} />}
              </View>
            </TouchableOpacity>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  title: { color: colors.text, fontSize: 18, fontWeight: '700' },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  avatar: {
    width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(122,92,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  name: { color: colors.text, fontWeight: '600' },
  lastMsg: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  time: { color: colors.textSecondary, fontSize: 11 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accentPrimary, marginTop: 4 },
});
