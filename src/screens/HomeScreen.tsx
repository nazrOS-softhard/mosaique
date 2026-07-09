import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import MosaicBackground from '../components/MosaicBackground';
import MomentsBar from '../components/MomentsBar';
import { colors, radius } from '../lib/theme';
import { FeedPost } from '../lib/mockData';
import { fetchFeedSafe } from '../lib/feedAdapter';

function Tile({ post, style, navigation }: { post: FeedPost; style: any; navigation: any }) {
  const openGallery = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    navigation.navigate('AuthorGallery', {
      authorId: post.authorId,
      authorName: post.author,
      initialId: post.id,
    });
  };

  return (
    <TouchableOpacity
      style={[styles.tile, { backgroundColor: post.color }, style]}
      activeOpacity={0.85}
      delayLongPress={350}
      onLongPress={openGallery}
      onPress={() => navigation.navigate('Comments', { postId: post.id, postTitle: post.title })}
    >
      <View style={styles.tileOverlay}>
        <Text style={styles.tileType}>{post.type}</Text>
        <Text style={styles.tileTitle} numberOfLines={2}>{post.title}</Text>
        <Text style={styles.tileAuthor}>{post.author}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function HomeScreen({ navigation }: any) {
  const [feed, setFeed] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    const data = await fetchFeedSafe();
    setFeed(data);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const get = (i: number): FeedPost | undefined => feed[i];

  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', { userId: 'me' })}>
            <Text style={styles.logo}>МОЗАИКА</Text>
          </TouchableOpacity>
          <View style={styles.topIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.icon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Map')}>
              <Text style={styles.icon}>🗺️</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
              <Text style={styles.icon}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.icon}>🔔</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
              <Text style={styles.icon}>➕</Text>
            </TouchableOpacity>
          </View>
        </View>

        <MomentsBar onPress={(authorId) => navigation.navigate('AuthorGallery', { authorId, authorName: '', initialId: '' })} />

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.accentPrimary} />
          </View>
        ) : (
          <ScrollView
            contentContainerStyle={styles.grid}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.accentPrimary} />}
          >
            <View style={styles.row}>
              {get(0) && <Tile post={get(0)!} navigation={navigation} style={{ flex: 2, height: 220 }} />}
              <View style={{ flex: 1, marginLeft: 8, gap: 8 }}>
                {get(1) && <Tile post={get(1)!} navigation={navigation} style={{ height: 106 }} />}
                {get(2) && <Tile post={get(2)!} navigation={navigation} style={{ height: 106 }} />}
              </View>
            </View>

            <View style={[styles.row, { marginTop: 8 }]}>
              {get(3) && <Tile post={get(3)!} navigation={navigation} style={{ flex: 1, height: 120 }} />}
              {get(4) && <Tile post={get(4)!} navigation={navigation} style={{ flex: 1, height: 120, marginLeft: 8 }} />}
              {get(5) && <Tile post={get(5)!} navigation={navigation} style={{ flex: 1, height: 120, marginLeft: 8 }} />}
            </View>

            {get(6) && (
              <View style={[styles.row, { marginTop: 8 }]}>
                <Tile post={get(6)!} navigation={navigation} style={{ flex: 1, height: 180 }} />
              </View>
            )}

            <View style={[styles.row, { marginTop: 8 }]}>
              {get(7) && <Tile post={get(7)!} navigation={navigation} style={{ flex: 1, height: 130 }} />}
              {get(8) && <Tile post={get(8)!} navigation={navigation} style={{ flex: 1, height: 130, marginLeft: 8 }} />}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  logo: { color: colors.text, fontSize: 20, fontWeight: '700', letterSpacing: 1 },
  topIcons: { flexDirection: 'row', gap: 16 },
  icon: { fontSize: 16 },
  grid: { paddingHorizontal: 16, paddingBottom: 100 },
  row: { flexDirection: 'row' },
  tile: {
    borderRadius: radius.input,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  tileOverlay: {
    padding: 10,
    backgroundColor: 'rgba(9,11,24,0.35)',
  },
  tileType: { color: colors.accentPrimary, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  tileTitle: { color: colors.text, fontSize: 13, fontWeight: '600', marginTop: 2 },
  tileAuthor: { color: colors.textSecondary, fontSize: 11, marginTop: 2 },
});
