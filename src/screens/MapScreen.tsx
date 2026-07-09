import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MosaicBackground from '../components/MosaicBackground';
import { colors } from '../lib/theme';
import { FEED } from '../lib/mockData';

const WITH_PLACE = FEED.filter((p) => p.place);

export default function MapScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Карта</Text>
          <View style={{ width: 20 }} />
        </View>

        <View style={styles.mapPlaceholder}>
          <Text style={{ color: colors.textSecondary }}>🗺️  здесь будет интерактивная карта</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 11, marginTop: 4 }}>
            (react-native-maps + Google/Yandex Maps API ключ — подключается отдельно)
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Публикации на карте</Text>
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
          data={WITH_PLACE}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => navigation.navigate('Comments', { postId: item.id, postTitle: item.title })}
            >
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowMeta}>📍 {item.place} · {item.author}</Text>
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
  mapPlaceholder: {
    marginHorizontal: 20, height: 160, borderRadius: 16, borderWidth: 1, borderColor: colors.border,
    backgroundColor: 'rgba(255,255,255,0.03)', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  sectionTitle: { color: colors.text, fontWeight: '700', paddingHorizontal: 20, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  dot: { width: 14, height: 14, borderRadius: 7 },
  rowTitle: { color: colors.text, fontWeight: '600' },
  rowMeta: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
});
