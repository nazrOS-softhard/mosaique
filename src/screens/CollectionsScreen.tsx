import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MosaicBackground from '../components/MosaicBackground';
import { colors } from '../lib/theme';
import { fetchCollections } from '../lib/api';

const MOCK_COLLECTIONS = [
  { id: 'c1', title: 'Арктика', color: '#22314F' },
  { id: 'c2', title: 'Техно', color: '#3A2E6B' },
  { id: 'c3', title: 'Архитектура', color: '#2E3A6B' },
  { id: 'c4', title: 'Музыка', color: '#1F3A5C' },
  { id: 'c5', title: 'Проекты', color: '#31284E' },
];

export default function CollectionsScreen({ route, navigation }: any) {
  const { userId } = route.params || {};
  const [collections, setCollections] = useState(MOCK_COLLECTIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (userId) {
        try {
          const data = await fetchCollections(userId);
          if (data && data.length > 0) {
            setCollections(data.map((c: any, i: number) => ({ id: c.id, title: c.title, color: MOCK_COLLECTIONS[i % MOCK_COLLECTIONS.length].color })));
          }
        } catch {}
      }
      setLoading(false);
    })();
  }, [userId]);

  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Коллекции</Text>
          <View style={{ width: 20 }} />
        </View>

        {loading ? (
          <ActivityIndicator color={colors.accentPrimary} style={{ marginTop: 30 }} />
        ) : (
          <FlatList
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
            data={collections}
            numColumns={2}
            columnWrapperStyle={{ gap: 12 }}
            keyExtractor={(c) => c.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.card, { backgroundColor: item.color }]}>
                <Text style={styles.cardTitle}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />
        )}
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
  card: { flex: 1, height: 120, borderRadius: 16, marginBottom: 12, alignItems: 'center', justifyContent: 'center' },
  cardTitle: { color: colors.text, fontWeight: '700' },
});
