import type { DbPost, Profile } from './database.types';
import type { FeedPost } from './mockData';
import { FEED } from './mockData';
import { fetchFeed, fetchAuthorPosts } from './api';

const PALETTE = ['#2E3A6B', '#3A2E6B', '#1F3A5C', '#22314F', '#2A2A4E', '#243256', '#31284E', '#2B3F6E', '#352A5A'];

function hashColor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export function dbPostToFeedPost(row: DbPost & { profiles?: Profile }): FeedPost {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    author: row.profiles?.name || 'Автор',
    authorId: row.author_id,
    color: hashColor(row.id),
    time: new Date(row.created_at).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    place: row.location || undefined,
    tags: row.tags || [],
    comments: row.comments_count,
    saves: row.saves_count,
  };
}

// Безопасная загрузка ленты: если Supabase не настроен / таблица пустая — используем моки.
// Это позволяет открыть приложение сразу, ещё до того как вставлены ключи Supabase.
export async function fetchFeedSafe(): Promise<FeedPost[]> {
  try {
    const rows = await fetchFeed();
    if (!rows || rows.length === 0) return FEED;
    return rows.map(dbPostToFeedPost);
  } catch {
    return FEED;
  }
}

export async function fetchAuthorPostsSafe(authorId: string): Promise<FeedPost[]> {
  try {
    const rows = await fetchAuthorPosts(authorId);
    if (!rows || rows.length === 0) return FEED.filter((p) => p.authorId === authorId);
    // у fetchAuthorPosts нет join на profiles — подставляем имя из первой публикации FEED, либо authorId
    return rows.map((r) => dbPostToFeedPost({ ...r, profiles: undefined } as any));
  } catch {
    return FEED.filter((p) => p.authorId === authorId);
  }
}
