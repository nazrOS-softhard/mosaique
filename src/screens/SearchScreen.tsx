import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MosaicBackground from '../components/MosaicBackground';
import { colors, radius } from '../lib/theme';
import { searchAll } from '../lib/api';
import { FEED, MOCK_AUTHORS } from '../lib/mockData';

const FILTERS = ['Всё', 'Люди', 'Публикации', 'Хэштеги', 'Места'];

export default function SearchScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('Всё');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ posts: any[]; profiles: any[] }>({ posts: [], profiles: [] });

  const runSearch = async (q: string) => {
    setQuery(q);
    if (!q) {
      setResults({ posts: [], profiles: [] });
      return;
    }
    setLoading(true);
    try {
      const r = await searchAll(q);
      if (r.posts.length === 0 && r.profiles.length === 0) {
        // fallback на моки, если Supabase не настроен / пусто
        setResults({
          posts: FEED.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())),
          profiles: MOCK_AUTHORS.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())),
        });
      } else {
        setResults(r);
      }
    } catch {
      setResults({
        posts: FEED.filter((p) => p.title.toLowerCase().includes(q.toLowerCase())),
        profiles: MOCK_AUTHORS.filter((a) => a.name.toLowerCase().includes(q.toLowerCase())),
      });
    }
    setLoading(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Люди, места, музыка, проекты, хэштеги..."
            placeholderTextColor={colors.textSecondary}
            value={query}
            onChangeText={runSearch}
            autoFocus
          />
        </View>

        <View style={styles.filterRow}>
          {FILTERS.map((f) => (
            <TouchableOpacity key={f} style={[styles.filterChip, filter === f && styles.filterChipActive]} onPress={() => setFilter(f)}>
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accentPrimary} style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            data={[
              ...(filter !== 'Публикации' ? results.profiles.map((p) => ({ kind: 'profile', ...p })) : []),
              ...(filter !== 'Люди' ? results.posts.map((p) => ({ kind: 'post', ...p })) : []),
            ]}
            keyExtractor={(item, i) => `${item.kind}-${item.id || i}`}
            ListEmptyComponent={
              query ? <Text style={styles.empty}>Ничего не найдено</Text> : <Text style={styles.empty}>Начните вводить запрос</Text>
            }
            renderItem={({ item }) =>
              item.kind === 'profile' ? (
                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Profile', { userId: item.id })}>
                  <View style={styles.avatarSmall}><Text style={{ color: colors.text }}>{item.name?.[0]}</Text></View>
                  <View>
                    <Text style={{ color: colors.text }}>{item.name}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Профиль</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Comments', { postId: item.id, postTitle: item.title })}>
                  <View style={[styles.avatarSmall, { backgroundColor: item.color || colors.accentSecondary }]} />
                  <View>
                    <Text style={{ color: colors.text }}>{item.title}</Text>
                    <Text style={{ color: colors.textSecondary, fontSize: 12 }}>{item.type}</Text>
                  </View>
                </TouchableOpacity>
              )
            }
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 8 },
  input: {
    flex: 1, color: colors.text, backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.input, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15,
  },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginTop: 14, marginBottom: 8, flexWrap: 'wrap' },
  filterChip: { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingVertical: 6, paddingHorizontal: 12 },
  filterChipActive: { borderColor: colors.accentPrimary, backgroundColor: 'rgba(74,141,255,0.15)' },
  filterText: { color: colors.textSecondary, fontSize: 12 },
  filterTextActive: { color: colors.accentPrimary, fontWeight: '600' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  avatarSmall: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(122,92,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  empty: { color: colors.textSecondary, textAlign: 'center', marginTop: 30 },
});
