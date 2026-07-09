import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MosaicBackground from '../components/MosaicBackground';
import { colors, radius } from '../lib/theme';

type Msg = { id: string; text: string; mine: boolean; time: string };

const INITIAL: Msg[] = [
  { id: '1', text: 'Отличный проект! Давай поработаем вместе 👍', mine: false, time: '10:40' },
  { id: '2', text: 'Спасибо! Давай на неделе созвонимся', mine: true, time: '10:42' },
  { id: '3', text: 'Идёт, скину файлы к вечеру', mine: false, time: '10:45' },
];

export default function ChatScreen({ route, navigation }: any) {
  const { authorName } = route.params || {};
  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [text, setText] = useState('');

  const send = () => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { id: String(Date.now()), text, mine: true, time: 'сейчас' }]);
    setText('');
  };

  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{authorName}</Text>
          <View style={{ width: 20 }} />
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <FlatList
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: 16, gap: 10 }}
            renderItem={({ item }) => (
              <View style={[styles.bubble, item.mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={{ color: colors.text }}>{item.text}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            )}
          />

          <View style={styles.inputRow}>
            <TouchableOpacity style={styles.iconBtn}><Text>📎</Text></TouchableOpacity>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Сообщение..."
              placeholderTextColor={colors.textSecondary}
            />
            <TouchableOpacity style={styles.iconBtn}><Text>🎤</Text></TouchableOpacity>
            <TouchableOpacity style={styles.sendBtn} onPress={send}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>➤</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12,
  },
  title: { color: colors.text, fontSize: 16, fontWeight: '700' },
  bubble: { maxWidth: '78%', borderRadius: 16, padding: 12 },
  bubbleMine: { backgroundColor: 'rgba(74,141,255,0.25)', alignSelf: 'flex-end' },
  bubbleTheirs: { backgroundColor: 'rgba(255,255,255,0.06)', alignSelf: 'flex-start' },
  time: { color: colors.textSecondary, fontSize: 10, marginTop: 4, alignSelf: 'flex-end' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  iconBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1, color: colors.text, backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.input, paddingHorizontal: 14, paddingVertical: 10,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
});
