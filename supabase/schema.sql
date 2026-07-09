-- ============================================================
-- МОЗАИКА — базовая схема Supabase (Postgres)
-- Выполнять в Supabase Dashboard -> SQL Editor -> New query
-- ============================================================

-- расширения
create extension if not exists "uuid-ossp";

-- ============================================================
-- PROFILES
-- ============================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  username text unique,
  bio text default '',
  sphere text default '',
  website text default '',
  country text default '',
  city text default '',
  avatar_url text,
  interests text[] default '{}',
  rank text default 'НАБЛЮДАТЕЛЬ' check (rank in (
    'НАБЛЮДАТЕЛЬ', 'ОПЕРАТОР', 'АРХИТЕКТОР ЯДРА', 'ГЛАВНЫЙ РАЗРАБОТЧИК'
  )),
  trust_rating numeric default 0,
  verified boolean default false,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles are publicly readable"
  on public.profiles for select
  using (true);

create policy "users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- авто-создание профиля при регистрации
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'username', null)
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- POSTS (плитки мозаики)
-- ============================================================
create table if not exists public.posts (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in (
    'Фото','Видео','Музыка','Статья','Подборка','Коллекция','Проект',
    'Чертёж','3D','Документ','Презентация','Плейлист','Мероприятие','Новость'
  )),
  title text not null,
  description text default '',
  cover_url text,
  location text,
  tags text[] default '{}',
  tile_size text default '1x1', -- '1x1' | '2x2' | '3x2' | '4x3' для мозаичной сетки
  comments_count integer default 0,
  saves_count integer default 0,
  likes_count integer default 0,
  created_at timestamptz default now()
);

create index if not exists posts_author_idx on public.posts(author_id);
create index if not exists posts_created_idx on public.posts(created_at desc);

alter table public.posts enable row level security;

create policy "posts are publicly readable"
  on public.posts for select
  using (true);

create policy "authors can insert their own posts"
  on public.posts for insert
  with check (auth.uid() = author_id);

create policy "authors can update their own posts"
  on public.posts for update
  using (auth.uid() = author_id);

create policy "authors can delete their own posts"
  on public.posts for delete
  using (auth.uid() = author_id);

-- ============================================================
-- COLLECTIONS
-- ============================================================
create table if not exists public.collections (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  cover_url text,
  created_at timestamptz default now()
);

create table if not exists public.collection_posts (
  collection_id uuid references public.collections(id) on delete cascade,
  post_id uuid references public.posts(id) on delete cascade,
  primary key (collection_id, post_id)
);

alter table public.collections enable row level security;
alter table public.collection_posts enable row level security;

create policy "collections are publicly readable"
  on public.collections for select using (true);
create policy "owners manage their collections"
  on public.collections for all using (auth.uid() = owner_id);

create policy "collection_posts are publicly readable"
  on public.collection_posts for select using (true);
create policy "owners manage their collection_posts"
  on public.collection_posts for all
  using (
    exists (
      select 1 from public.collections c
      where c.id = collection_id and c.owner_id = auth.uid()
    )
  );

-- ============================================================
-- MOMENTS (истории, исчезают через сутки)
-- ============================================================
create table if not exists public.moments (
  id uuid primary key default uuid_generate_v4(),
  author_id uuid not null references public.profiles(id) on delete cascade,
  media_url text not null,
  pinned boolean default false,
  created_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '24 hours')
);

alter table public.moments enable row level security;

create policy "moments are publicly readable while active"
  on public.moments for select
  using (pinned = true or expires_at > now());

create policy "authors manage their own moments"
  on public.moments for all
  using (auth.uid() = author_id);

-- ============================================================
-- COMMENTS (древовидные обсуждения)
-- ============================================================
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  attachment_url text,
  created_at timestamptz default now()
);

create index if not exists comments_post_idx on public.comments(post_id);

alter table public.comments enable row level security;

create policy "comments are publicly readable"
  on public.comments for select using (true);
create policy "users can insert their own comments"
  on public.comments for insert with check (auth.uid() = author_id);
create policy "users can delete their own comments"
  on public.comments for delete using (auth.uid() = author_id);

-- ============================================================
-- LIKES / SAVES
-- ============================================================
create table if not exists public.likes (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

create table if not exists public.saves (
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (post_id, user_id)
);

alter table public.likes enable row level security;
alter table public.saves enable row level security;

create policy "likes are publicly readable" on public.likes for select using (true);
create policy "users manage their own likes" on public.likes for all using (auth.uid() = user_id);

create policy "saves are publicly readable" on public.saves for select using (true);
create policy "users manage their own saves" on public.saves for all using (auth.uid() = user_id);

-- ============================================================
-- CONNECTIONS (Связи / Коллеги / Команда / Поддерживают / Следят)
-- ============================================================
create table if not exists public.connections (
  id uuid primary key default uuid_generate_v4(),
  follower_id uuid not null references public.profiles(id) on delete cascade,
  followed_id uuid not null references public.profiles(id) on delete cascade,
  relation_type text default 'следит' check (relation_type in (
    'связь','коллега','команда','поддерживает','следит'
  )),
  created_at timestamptz default now(),
  unique (follower_id, followed_id)
);

alter table public.connections enable row level security;

create policy "connections are publicly readable"
  on public.connections for select using (true);
create policy "users manage their own outgoing connections"
  on public.connections for all using (auth.uid() = follower_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null check (type in (
    'like','comment','follow','message','mention','event','stream_live'
  )),
  payload jsonb default '{}',
  read boolean default false,
  created_at timestamptz default now()
);

alter table public.notifications enable row level security;

create policy "users read their own notifications"
  on public.notifications for select using (auth.uid() = user_id);
create policy "users update their own notifications"
  on public.notifications for update using (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKETS (выполнить один раз)
-- ============================================================
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('post-media', 'post-media', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('moments-media', 'moments-media', true)
on conflict (id) do nothing;

-- публичное чтение файлов, запись — только авторизованным
create policy "public read avatars"
  on storage.objects for select using (bucket_id = 'avatars');
create policy "authenticated upload avatars"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.role() = 'authenticated');

create policy "public read post-media"
  on storage.objects for select using (bucket_id = 'post-media');
create policy "authenticated upload post-media"
  on storage.objects for insert
  with check (bucket_id = 'post-media' and auth.role() = 'authenticated');

create policy "public read moments-media"
  on storage.objects for select using (bucket_id = 'moments-media');
create policy "authenticated upload moments-media"
  on storage.objects for insert
  with check (bucket_id = 'moments-media' and auth.role() = 'authenticated');
