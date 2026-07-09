export type Profile = {
  id: string;
  name: string;
  username: string | null;
  bio: string;
  sphere: string;
  website: string;
  country: string;
  city: string;
  avatar_url: string | null;
  interests: string[];
  rank: 'НАБЛЮДАТЕЛЬ' | 'ОПЕРАТОР' | 'АРХИТЕКТОР ЯДРА' | 'ГЛАВНЫЙ РАЗРАБОТЧИК';
  trust_rating: number;
  verified: boolean;
  created_at: string;
};

export type PostType =
  | 'Фото' | 'Видео' | 'Музыка' | 'Статья' | 'Подборка' | 'Коллекция'
  | 'Проект' | 'Чертёж' | '3D' | 'Документ' | 'Презентация' | 'Плейлист'
  | 'Мероприятие' | 'Новость';

export type DbPost = {
  id: string;
  author_id: string;
  type: PostType;
  title: string;
  description: string;
  cover_url: string | null;
  location: string | null;
  tags: string[];
  tile_size: '1x1' | '2x2' | '3x2' | '4x3';
  comments_count: number;
  saves_count: number;
  likes_count: number;
  created_at: string;
};

export type Collection = {
  id: string;
  owner_id: string;
  title: string;
  cover_url: string | null;
  created_at: string;
};

export type Moment = {
  id: string;
  author_id: string;
  media_url: string;
  pinned: boolean;
  created_at: string;
  expires_at: string;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string;
  parent_id: string | null;
  content: string;
  attachment_url: string | null;
  created_at: string;
};

export type Connection = {
  id: string;
  follower_id: string;
  followed_id: string;
  relation_type: 'связь' | 'коллега' | 'команда' | 'поддерживает' | 'следит';
  created_at: string;
};

export type NotificationRow = {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'message' | 'mention' | 'event' | 'stream_live';
  payload: Record<string, unknown>;
  read: boolean;
  created_at: string;
};
