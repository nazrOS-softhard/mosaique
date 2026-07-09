import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MosaicBackground from '../components/MosaicBackground';
import PrimaryButton from '../components/PrimaryButton';
import { colors, radius } from '../lib/theme';
import { useSession } from '../lib/useSession';
import { fetchProfile, fetchConnectionsCount, createConnection } from '../lib/api';
import type { Profile } from '../lib/database.types';
import { fetchAuthorPostsSafe } from '../lib/feedAdapter';
import { FeedPost, MOCK_AUTHORS } from '../lib/mockData';

const FALLBACK_PROFILE: Profile = {
  id: 'mock-ivan',
  name: 'Иван Назаров',
  username: 'ivan_nazr',
  bio: 'Архитектор. Люблю создавать пространства и делиться идеями. Путешествую и фотографирую.',
  sphere: 'Архитектура',
  website: 'nazr-arch.ru',
  country: 'Россия',
  city: 'Москва',
  avatar_url: null,
  interests: ['Дизайн', 'Путешествия'],
  rank: 'ОПЕРАТОР',
  trust_rating: 87,
  verified: true,
  created_at: new Date().toISOString(),
};

export default function ProfileScreen({ route, navigation }: any) {
  const { userId } = route.params || {};
  const { userId: myId } = useSession();
  const targetId = userId === 'me' ? myId : userId;
  const isOwn = !targetId || targetId === myId;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    (async () => {
      let p: Profile | null = null;
      if (targetId) p = await fetchProfile(targetId);
      setProfile(p || FALLBACK_PROFILE);

      const effectiveId = targetId || FALLBACK_PROFILE.id;
      const [postsData, connections] = await Promise.all([
        fetchAuthorPostsSafe(effectiveId),
        targetId ? fetchConnectionsCount(effectiveId) : Promise.resolve({ followers: 128, following: 42 }),
      ]);
      setPosts(postsData);
      setCounts(connections);
      setLoading(false);
    })();
  }, [targetId]);

  const toggleFollow = async () => {
    if (!myId || !targetId) return;
    setFollowing((f) => !f);
    try {
      await createConnection(myId, targetId, 'следит');
    } catch {}
  };

  if (loading || !profile) {
    return (
      <View style={{ flex: 1 }}>
        <MosaicBackground />
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.accentPrimary} />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          {isOwn && (
            <TouchableOpacity onPress={() => navigation.navigate('ProfileSetup')}>
              <Text style={{ color: colors.accentPrimary }}>Редактировать</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 60, alignItems: 'center' }}>
          <View style={styles.avatar}>
            <Text style={{ fontSize: 32, color: colors.text }}>{profile.name?.[0] || '?'}</Text>
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{profile.name}</Text>
            {profile.verified && <Text style={{ color: colors.accentPrimary }}> ✓</Text>}
          </View>
          <Text style={styles.username}>@{profile.username || 'без_имени'}</Text>
          <Text style={styles.rank}>{profile.rank}</Text>

          <Text style={styles.bio}>{profile.bio}</Text>

          <View style={styles.statsRow}>
            <Stat label="Публикаций" value={posts.length} />
            <Stat label="Подписчики" value={counts.followers} />
            <Stat label="Связи" value={counts.following} />
            <Stat label="Доверие" value={Math.round(profile.trust_rating)} />
          </View>

          {!isOwn && (
            <PrimaryButton
              title={following ? 'Вы подписаны' : 'Следить'}
              onPress={toggleFollow}
              variant={following ? 'outline' : 'filled'}
              style={{ width: '100%', maxWidth: 300, marginTop: 8 }}
            />
          )}

          <View style={styles.linksRow}>
            {profile.city ? <Text style={styles.linkText}>📍 {profile.city}, {profile.country}</Text> : null}
            {profile.website ? <Text style={styles.linkText}>🔗 {profile.website}</Text> : null}
            {profile.sphere ? <Text style={styles.linkText}>🛠 {profile.sphere}</Text> : null}
          </View>

          <TouchableOpacity
            style={styles.collectionsBtn}
            onPress={() => navigation.navigate('Collections', { userId: targetId })}
          >
            <Text style={{ color: colors.text }}>📁 Коллекции</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Мозаика</Text>
          <View style={styles.mosaicGrid}>
            {posts.map((p) => (
              <View key={p.id} style={[styles.mosaicTile, { backgroundColor: p.color }]}>
                <Text style={styles.mosaicTileType}>{p.type}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 16 }}>{value}</Text>
      <Text style={{ color: colors.textSecondary, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8 },
  avatar: {
    width: 96, height: 96, borderRadius: 48, marginTop: 12,
    backgroundColor: 'rgba(122,92,255,0.2)', borderWidth: 2, borderColor: colors.accentPrimary,
    alignItems: 'center', justifyContent: 'center',
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
  name: { color: colors.text, fontSize: 20, fontWeight: '700' },
  username: { color: colors.textSecondary, marginTop: 2 },
  rank: { color: colors.accentSecondary, fontSize: 11, marginTop: 6, textTransform: 'uppercase', letterSpacing: 1 },
  bio: { color: colors.textSecondary, textAlign: 'center', marginTop: 12, maxWidth: 320, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 28, marginTop: 20 },
  linksRow: { marginTop: 16, gap: 4, alignItems: 'center' },
  linkText: { color: colors.textSecondary, fontSize: 12 },
  collectionsBtn: {
    marginTop: 18, paddingVertical: 10, paddingHorizontal: 18,
    borderRadius: radius.button, borderWidth: 1, borderColor: colors.border,
  },
  sectionTitle: { color: colors.text, fontSize: 16, fontWeight: '700', alignSelf: 'flex-start', marginTop: 28, marginBottom: 10 },
  mosaicGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, width: '100%' },
  mosaicTile: { width: '31.5%', height: 90, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  mosaicTileType: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
});
