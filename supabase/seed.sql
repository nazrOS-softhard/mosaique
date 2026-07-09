-- ============================================================
-- МОЗАИКА — тестовые данные
-- Выполнять ПОСЛЕ schema.sql, и после того как у тебя есть хотя бы
-- один зарегистрированный пользователь (auth.users), т.к. posts.author_id
-- ссылается на profiles(id), а profiles(id) ссылается на auth.users(id).
--
-- Проще всего: зарегистрируйся в приложении один раз (через экран
-- Register), затем найди свой id в Supabase Dashboard -> Authentication
-- -> Users, скопируй его и вставь вместо MY_USER_ID ниже.
-- ============================================================

-- пример (замени MY_USER_ID на реальный uuid своего пользователя):
-- update public.profiles set username = 'nazr_ivan', sphere = 'Архитектура'
-- where id = 'MY_USER_ID';

-- insert into public.posts (author_id, type, title, description, location, tags, tile_size, comments_count, saves_count, likes_count)
-- values
--   ('MY_USER_ID', 'Фото', 'Архитектурная экспедиция', 'Кольский полуостров', 'Кольский полуостров', array['архитектура','экспедиция'], '2x2', 14, 32, 51),
--   ('MY_USER_ID', 'Проект', 'cloN — device v2', 'Сборка устройства', 'CyberEden Lab', array['devices','hardware'], '1x1', 22, 58, 70),
--   ('MY_USER_ID', 'Музыка', 'Демо-трек', '', null, array['музыка','демо'], '1x1', 6, 11, 9),
--   ('MY_USER_ID', 'Видео', 'СИГНАЛ: голосовой чат', 'WebRTC P2P', 'cybereden.ru', array['webrtc','voice'], '3x2', 40, 90, 120),
--   ('MY_USER_ID', 'Статья', 'Журнал: рейтинг доверия', '', null, array['журнал'], '1x1', 9, 17, 14),
--   ('MY_USER_ID', 'Чертёж', 'GRAM: карточка v3', '', 'CyberEden Lab', array['gram','карточки'], '1x1', 17, 41, 33);

-- Раскомментируй блок выше и подставь свой id, чтобы наполнить ленту.
-- Дальше это будет проще делать прямо из приложения через экран
-- "Создание публикации" (CreatePostScreen), когда он подключён к
-- supabase.from('posts').insert(...).
