export type FeedPost = {
  id: string;
  type: string;
  title: string;
  author: string;
  authorId: string;
  color: string;
  time: string;
  place?: string;
  tags: string[];
  comments: number;
  saves: number;
};

// оставляем алиас для обратной совместимости
export type Post = FeedPost;

export const FEED: FeedPost[] = [
  {
    id: '1', type: 'Фото', title: 'Архитектурная экспедиция', author: 'Иван Назаров', authorId: 'mock-ivan',
    color: '#2E3A6B', time: '12 мая 2026', place: 'Кольский полуостров',
    tags: ['архитектура', 'экспедиция'], comments: 14, saves: 32,
  },
  {
    id: '2', type: 'Проект', title: 'cloN — device v2', author: 'nazrOS', authorId: 'mock-nazr',
    color: '#3A2E6B', time: '3 июня 2026', place: 'CyberEden Lab',
    tags: ['devices', 'hardware'], comments: 22, saves: 58,
  },
  {
    id: '3', type: 'Музыка', title: 'Демо-трек', author: 'Мария К.', authorId: 'mock-maria',
    color: '#1F3A5C', time: '28 мая 2026', tags: ['музыка', 'демо'],
    comments: 6, saves: 11,
  },
  {
    id: '4', type: 'Видео', title: 'СИГНАЛ: голосовой чат', author: 'CyberEden', authorId: 'mock-cybereden',
    color: '#22314F', time: '1 июля 2026', place: 'cybereden.ru',
    tags: ['webrtc', 'voice'], comments: 40, saves: 90,
  },
  {
    id: '5', type: 'Статья', title: 'Журнал: рейтинг доверия', author: 'Анна Петрова', authorId: 'mock-anna',
    color: '#2A2A4E', time: '20 июня 2026', tags: ['журнал'], comments: 9, saves: 17,
  },
  {
    id: '6', type: 'Коллекция', title: 'Техно', author: 'Иван Назаров', authorId: 'mock-ivan',
    color: '#243256', time: '15 апреля 2026', tags: ['техно', 'коллекция'],
    comments: 3, saves: 25,
  },
  {
    id: '7', type: 'Чертёж', title: 'GRAM: карточка v3', author: 'nazrOS', authorId: 'mock-nazr',
    color: '#31284E', time: '30 июня 2026', place: 'CyberEden Lab',
    tags: ['gram', 'карточки'], comments: 17, saves: 41,
  },
  {
    id: '8', type: 'Фото', title: 'Ночная съёмка', author: 'Иван Назаров', authorId: 'mock-ivan',
    color: '#2B3F6E', time: '18 мая 2026', place: 'Москва',
    tags: ['фото', 'ночь'], comments: 5, saves: 19,
  },
  {
    id: '9', type: 'Проект', title: '/lab — интерактивная комната', author: 'nazrOS', authorId: 'mock-nazr',
    color: '#352A5A', time: '25 июня 2026', tags: ['lab', 'ux'],
    comments: 12, saves: 27,
  },
];

export const MOCK_AUTHORS = [
  { id: 'mock-ivan', name: 'Иван Назаров' },
  { id: 'mock-nazr', name: 'nazrOS' },
  { id: 'mock-maria', name: 'Мария К.' },
  { id: 'mock-cybereden', name: 'CyberEden' },
  { id: 'mock-anna', name: 'Анна Петрова' },
];
