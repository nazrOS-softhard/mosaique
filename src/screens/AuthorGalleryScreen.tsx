import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  PanResponder,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../lib/theme';
import { FeedPost } from '../lib/mockData';
import { fetchAuthorPostsSafe } from '../lib/feedAdapter';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const ITEM_W = SCREEN_W * 0.92;
const SIDE_GAP = (SCREEN_W - ITEM_W) / 2;

export default function AuthorGalleryScreen({ route, navigation }: any) {
  const { authorId, authorName, initialId } = route.params || {};
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuthorPostsSafe(authorId).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [authorId]);

  const initialIndex = Math.max(0, posts.findIndex((p) => p.id === initialId));
  const displayName = authorName || posts[0]?.author || 'Автор';

  const translateY = useRef(new Animated.Value(0)).current;
  const dimOpacity = translateY.interpolate({
    inputRange: [0, SCREEN_H * 0.5],
    outputRange: [1, 0.4],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) translateY.setValue(g.dy);
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > 120) {
          navigation.goBack();
        } else {
          Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View
      style={[styles.root, { opacity: dimOpacity, transform: [{ translateY }] }]}
      {...panResponder.panHandlers}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <View>
            <Text style={styles.author}>{displayName}</Text>
            <Text style={styles.hint}>← публикации автора →</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={{ color: colors.text, fontSize: 18 }}>✕</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.accentPrimary} />
          </View>
        ) : (
          <FlatList
            data={posts}
            horizontal
            keyExtractor={(p) => p.id}
            initialScrollIndex={initialIndex >= 0 ? initialIndex : 0}
            getItemLayout={(_, i) => ({ length: ITEM_W, offset: ITEM_W * i, index: i })}
            snapToInterval={ITEM_W}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SIDE_GAP }}
            renderItem={({ item }) => <GalleryCard post={item} />}
          />
        )}

        <Text style={styles.swipeHint}>свайп вниз, чтобы закрыть</Text>
      </SafeAreaView>
    </Animated.View>
  );
}

function GalleryCard({ post }: { post: FeedPost }) {
  return (
    <View style={[styles.card, { width: ITEM_W, backgroundColor: post.color }]}>
      <View style={styles.cardOverlay}>
        <Text style={styles.type}>{post.type}</Text>
        <Text style={styles.title}>{post.title}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.meta}>🕐 {post.time}</Text>
          {post.place && <Text style={styles.meta}>📍 {post.place}</Text>}
        </View>
        <View style={styles.tagsRow}>
          {post.tags.map((t) => (
            <Text key={t} style={styles.tag}>#{t}</Text>
          ))}
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>💬 {post.comments}</Text>
          <Text style={styles.stat}>🔖 {post.saves}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  author: { color: colors.text, fontSize: 18, fontWeight: '700' },
  hint: { color: colors.textSecondary, fontSize: 12, marginTop: 2 },
  closeBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center', justifyContent: 'center',
  },
  card: {
    height: SCREEN_H * 0.62,
    borderRadius: 24,
    marginHorizontal: 4,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  cardOverlay: { padding: 20, backgroundColor: 'rgba(9,11,24,0.4)' },
  type: { color: colors.accentPrimary, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 20, fontWeight: '700', marginTop: 6 },
  metaRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  meta: { color: colors.textSecondary, fontSize: 12 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  tag: { color: colors.accentSecondary, fontSize: 12 },
  statsRow: { flexDirection: 'row', gap: 16, marginTop: 12 },
  stat: { color: colors.text, fontSize: 13 },
  swipeHint: { color: colors.textSecondary, fontSize: 11, textAlign: 'center', marginTop: 10 },
});
