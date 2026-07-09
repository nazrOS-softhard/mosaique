import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MosaicBackground from '../components/MosaicBackground';
import { colors } from '../lib/theme';

const NOTIFS = [
  { id: '1', icon: '❤️', text: 'Мария К. лайкнула вашу публикацию «Демо-трек»', time: '5 мин назад' },
  { id: '2', icon: '💬', text: 'nazrOS оставил комментарий: «Класс, давай встроим в /lab»', time: '1 ч назад' },
  { id: '3', icon: '👤', text: 'Анна Петрова теперь следит за вами', time: '3 ч назад' },
  { id: '4', icon: '📅', text: 'Событие «Хакатон CyberEden» начнётся завтра', time: 'вчера' },
  { id: '5', icon: '📡', text: 'CyberEden начал стрим', time: 'вчера' },
];

export default function NotificationsScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Уведомления</Text>
          <View style={{ width: 20 }} />
        </View>

        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          data={NOTIFS}
          keyExtractor={(n) => n.id}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.text}>{item.text}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
            </View>
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
    flexDirection: 'row', alignItems: 'center', paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  text: { color: colors.text, fontSize: 13, lineHeight: 18 },
  time: { color: colors.textSecondary, fontSize: 11, marginTop: 4 },
});
