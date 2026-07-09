import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MosaicBackground from '../components/MosaicBackground';
import { colors, radius } from '../lib/theme';
import { useSession } from '../lib/useSession';
import { fetchComments, addComment } from '../lib/api';
import type { Comment } from '../lib/database.types';

type TreeComment = Comment & { children: TreeComment[]; authorName?: string };

const MOCK_COMMENTS: TreeComment[] = [
  {
    id: 'm1', post_id: '', author_id: 'mock-nazr', parent_id: null, content: 'Класс, давай встроим в /lab', attachment_url: null,
    created_at: new Date().toISOString(), authorName: 'nazrOS', children: [
      { id: 'm2', post_id: '', author_id: 'mock-ivan', parent_id: 'm1', content: 'Согласен, скину макет', attachment_url: null, created_at: new Date().toISOString(), authorName: 'Иван Назаров', children: [] },
    ],
  },
  { id: 'm3', post_id: '', author_id: 'mock-anna', parent_id: null, content: 'Очень крутая работа!', attachment_url: null, created_at: new Date().toISOString(), authorName: 'Анна Петрова', children: [] },
];

function buildTree(flat: Comment[]): TreeComment[] {
  const map: Record<string, TreeComment> = {};
  flat.forEach((c) => (map[c.id] = { ...c, children: [] }));
  const roots: TreeComment[] = [];
  flat.forEach((c) => {
    if (c.parent_id && map[c.parent_id]) map[c.parent_id].children.push(map[c.id]);
    else roots.push(map[c.id]);
  });
  return roots;
}

function CommentNode({ node, depth = 0, onReply }: { node: TreeComment; depth?: number; onReply: (id: string) => void }) {
  return (
    <View style={{ marginLeft: depth * 18, marginTop: 10 }}>
      <View style={styles.commentRow}>
        <View style={styles.avatar}><Text style={{ color: colors.text, fontSize: 12 }}>{(node.authorName || 'A')[0]}</Text></View>
        <View style={{ flex: 1 }}>
          <Text style={styles.author}>{node.authorName || 'Пользователь'}</Text>
          <Text style={styles.content}>{node.content}</Text>
          <TouchableOpacity onPress={() => onReply(node.id)}>
            <Text style={styles.reply}>Ответить</Text>
          </TouchableOpacity>
        </View>
      </View>
      {node.children.map((c) => (
        <CommentNode key={c.id} node={c} depth={depth + 1} onReply={onReply} />
      ))}
    </View>
  );
}

export default function CommentsScreen({ route, navigation }: any) {
  const { postId, postTitle } = route.params || {};
  const { userId } = useSession();
  const [tree, setTree] = useState<TreeComment[]>(MOCK_COMMENTS);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const flat = await fetchComments(postId);
        if (flat.length > 0) setTree(buildTree(flat));
      } catch {}
      setLoading(false);
    })();
  }, [postId]);

  const send = async () => {
    if (!text.trim()) return;
    const localNode: TreeComment = {
      id: String(Date.now()), post_id: postId, author_id: userId || 'me', parent_id: replyTo,
      content: text, attachment_url: null, created_at: new Date().toISOString(), authorName: 'Вы', children: [],
    };
    setTree((prev) => {
      if (!replyTo) return [...prev, localNode];
      const insert = (nodes: TreeComment[]): TreeComment[] =>
        nodes.map((n) => (n.id === replyTo ? { ...n, children: [...n.children, localNode] } : { ...n, children: insert(n.children) }));
      return insert(prev);
    });
    setText('');
    setReplyTo(null);
    if (userId) {
      try {
        await addComment({ post_id: postId, author_id: userId, parent_id: replyTo, content: localNode.content });
      } catch {}
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <MosaicBackground />
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.text, fontSize: 20 }}>←</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={1}>{postTitle || 'Обсуждение'}</Text>
          <View style={{ width: 20 }} />
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {loading ? (
            <ActivityIndicator color={colors.accentPrimary} style={{ marginTop: 20 }} />
          ) : (
            <FlatList
              data={tree}
              keyExtractor={(n) => n.id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
              renderItem={({ item }) => <CommentNode node={item} onReply={setReplyTo} />}
            />
          )}

          {replyTo && (
            <View style={styles.replyBar}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>Ответ на комментарий</Text>
              <TouchableOpacity onPress={() => setReplyTo(null)}><Text style={{ color: colors.accentPrimary }}>отменить</Text></TouchableOpacity>
            </View>
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Написать комментарий..."
              placeholderTextColor={colors.textSecondary}
            />
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
  title: { color: colors.text, fontSize: 16, fontWeight: '700', maxWidth: '75%' },
  commentRow: { flexDirection: 'row', gap: 10 },
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(122,92,255,0.25)', alignItems: 'center', justifyContent: 'center' },
  author: { color: colors.text, fontSize: 13, fontWeight: '600' },
  content: { color: colors.textSecondary, fontSize: 13, marginTop: 2 },
  reply: { color: colors.accentPrimary, fontSize: 12, marginTop: 4 },
  replyBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.06)',
  },
  input: {
    flex: 1, color: colors.text, backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: radius.input, paddingHorizontal: 14, paddingVertical: 10,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.accentPrimary, alignItems: 'center', justifyContent: 'center' },
});
