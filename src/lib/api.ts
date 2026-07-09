import { supabase } from './supabase';
import type { DbPost, Profile, Comment, Moment, Connection, NotificationRow } from './database.types';

// ---------- POSTS / ЛЕНТА ----------
export async function fetchFeed(limit = 30): Promise<(DbPost & { profiles: Profile })[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false })
    .limit(limit);
  if (error) throw error;
  return (data as any) || [];
}

export async function fetchAuthorPosts(authorId: string): Promise<DbPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('author_id', authorId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createPost(post: Partial<DbPost>) {
  const { data, error } = await supabase.from('posts').insert(post).select().single();
  if (error) throw error;
  return data;
}

// ---------- LIKES / SAVES ----------
export async function toggleLike(postId: string, userId: string, isLiked: boolean) {
  if (isLiked) {
    await supabase.from('likes').delete().eq('post_id', postId).eq('user_id', userId);
  } else {
    await supabase.from('likes').insert({ post_id: postId, user_id: userId });
  }
}

export async function toggleSave(postId: string, userId: string, isSaved: boolean) {
  if (isSaved) {
    await supabase.from('saves').delete().eq('post_id', postId).eq('user_id', userId);
  } else {
    await supabase.from('saves').insert({ post_id: postId, user_id: userId });
  }
}

// ---------- COMMENTS ----------
export async function fetchComments(postId: string): Promise<Comment[]> {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('post_id', postId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function addComment(comment: Partial<Comment>) {
  const { data, error } = await supabase.from('comments').insert(comment).select().single();
  if (error) throw error;
  return data;
}

// ---------- PROFILE ----------
export async function fetchProfile(id: string): Promise<Profile | null> {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}

export async function updateProfile(id: string, patch: Partial<Profile>) {
  const { data, error } = await supabase.from('profiles').update(patch).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// ---------- CONNECTIONS ----------
export async function createConnection(followerId: string, followedId: string, relationType: Connection['relation_type'] = 'следит') {
  const { error } = await supabase
    .from('connections')
    .upsert({ follower_id: followerId, followed_id: followedId, relation_type: relationType });
  if (error) throw error;
}

export async function fetchConnectionsCount(profileId: string) {
  const { count: followers } = await supabase
    .from('connections')
    .select('*', { count: 'exact', head: true })
    .eq('followed_id', profileId);
  const { count: following } = await supabase
    .from('connections')
    .select('*', { count: 'exact', head: true })
    .eq('follower_id', profileId);
  return { followers: followers || 0, following: following || 0 };
}

// ---------- MOMENTS ----------
export async function fetchActiveMoments(): Promise<(Moment & { profiles: Profile })[]> {
  const { data, error } = await supabase
    .from('moments')
    .select('*, profiles(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as any) || [];
}

// ---------- NOTIFICATIONS ----------
export async function fetchNotifications(userId: string): Promise<NotificationRow[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function markNotificationRead(id: string) {
  await supabase.from('notifications').update({ read: true }).eq('id', id);
}

// ---------- COLLECTIONS ----------
export async function fetchCollections(ownerId: string) {
  const { data, error } = await supabase
    .from('collections')
    .select('*')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// ---------- SEARCH ----------
export async function searchAll(query: string) {
  const [{ data: posts }, { data: profiles }] = await Promise.all([
    supabase.from('posts').select('*').ilike('title', `%${query}%`).limit(20),
    supabase.from('profiles').select('*').ilike('name', `%${query}%`).limit(20),
  ]);
  return { posts: posts || [], profiles: profiles || [] };
}
