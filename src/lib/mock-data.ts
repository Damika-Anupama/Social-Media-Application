export type User = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  verified?: boolean;
  bio?: string;
  followers?: number;
  following?: number;
};

export type Story = {
  id: string;
  user: User;
  thumbnail: string;
  isLive?: boolean;
  viewed?: boolean;
};

export type Post = {
  id: string;
  author: User;
  postedAt: string;
  body: string;
  media?: { type: 'image' | 'video' | 'gallery'; src: string | string[]; aspect?: 'square' | 'wide' | 'portrait' };
  metrics: { likes: number; comments: number; shares: number; bookmarks: number };
  liked?: boolean;
  bookmarked?: boolean;
  tags?: string[];
  location?: string;
  topComment?: { user: User; text: string };
};

export type TrendingTopic = {
  category: string;
  title: string;
  posts: string;
  highlight?: boolean;
};

export type ConversationPreview = {
  id: string;
  user: User;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
};

export type Notification = {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'mention' | 'milestone';
  user?: User;
  text: string;
  time: string;
  unread?: boolean;
};

const av = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&backgroundColor=6435ff,3ddbb3,ff6b6b,4cc9f0,ffd166`;

export const currentUser: User = {
  id: 'u_me',
  handle: 'demo',
  name: 'Damika Anupama',
  avatar: av('damika-pulse'),
  verified: true,
  bio: 'Designing humane software · Building Pulse · Colombo → SF',
  followers: 12480,
  following: 318,
};

export const users: User[] = [
  {
    id: 'u_1',
    handle: 'nadia',
    name: 'Nadia Pereira',
    avatar: av('nadia'),
    verified: true,
    bio: 'Creative director @ Halftone Studio',
    followers: 88200,
    following: 412,
  },
  {
    id: 'u_2',
    handle: 'kenji',
    name: 'Kenji Mori',
    avatar: av('kenji'),
    verified: false,
    bio: 'Photographer · slow travel · film grain',
    followers: 4310,
    following: 380,
  },
  {
    id: 'u_3',
    handle: 'sasha',
    name: 'Sasha Reyes',
    avatar: av('sasha'),
    verified: true,
    bio: 'Independent journalist · climate, AI, policy',
    followers: 56110,
    following: 502,
  },
  {
    id: 'u_4',
    handle: 'amaru',
    name: 'Amaru Quispe',
    avatar: av('amaru'),
    verified: false,
    bio: 'Backend @ Nucleus · Rust, distributed systems',
    followers: 9201,
    following: 244,
  },
  {
    id: 'u_5',
    handle: 'lina',
    name: 'Lina Okafor',
    avatar: av('lina'),
    verified: true,
    bio: 'Founder @ Coastline — sustainable apparel',
    followers: 24700,
    following: 188,
  },
  {
    id: 'u_6',
    handle: 'theo',
    name: 'Theo Lindqvist',
    avatar: av('theo'),
    verified: false,
    bio: 'Indie game dev · pixel + procedural worlds',
    followers: 6890,
    following: 510,
  },
  {
    id: 'u_7',
    handle: 'priya',
    name: 'Priya Iyer',
    avatar: av('priya'),
    verified: true,
    bio: 'Researcher @ Open Climate Lab',
    followers: 31040,
    following: 219,
  },
  {
    id: 'u_8',
    handle: 'marcos',
    name: 'Marcos Andrade',
    avatar: av('marcos'),
    verified: false,
    bio: 'Cyclist · long roads, slow coffee',
    followers: 2140,
    following: 198,
  },
];

const byHandle = (h: string) => users.find((u) => u.handle === h)!;

const img = (id: string, w = 1600, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const stories: Story[] = [
  { id: 's0', user: currentUser, thumbnail: img('1500530855697-b586d89ba3ee', 200, 320) },
  { id: 's1', user: byHandle('nadia'), thumbnail: img('1542038784456-1ea8e935640e', 200, 320), isLive: true },
  { id: 's2', user: byHandle('kenji'), thumbnail: img('1499678329028-101435549a4e', 200, 320) },
  { id: 's3', user: byHandle('sasha'), thumbnail: img('1517242027094-631f8c218a0f', 200, 320) },
  { id: 's4', user: byHandle('amaru'), thumbnail: img('1486325212027-8081e485255e', 200, 320), viewed: true },
  { id: 's5', user: byHandle('lina'), thumbnail: img('1513104890138-7c749659a591', 200, 320) },
  { id: 's6', user: byHandle('theo'), thumbnail: img('1542751371-adc38448a05e', 200, 320) },
  { id: 's7', user: byHandle('priya'), thumbnail: img('1469474968028-56623f02e42e', 200, 320), viewed: true },
  { id: 's8', user: byHandle('marcos'), thumbnail: img('1488646953014-85cb44e25828', 200, 320) },
];

export const posts: Post[] = [
  {
    id: 'p1',
    author: byHandle('nadia'),
    postedAt: '12m',
    body:
      'Spent the weekend in our studio rethinking type pairing for the new identity. The longer I work with this Söhne / Tiempos combo, the more it feels like a quiet conversation between two voices.\n\nBoth refined. Neither trying to win.',
    media: { type: 'image', src: img('1561070791-2526d30994b8'), aspect: 'wide' },
    metrics: { likes: 2148, comments: 187, shares: 64, bookmarks: 412 },
    liked: true,
    tags: ['design', 'typography', 'studio-notes'],
    location: 'Halftone Studio · Lisbon',
    topComment: {
      user: byHandle('kenji'),
      text: 'That second spread is doing so much with so little. The kerning is gorgeous.',
    },
  },
  {
    id: 'p2',
    author: byHandle('sasha'),
    postedAt: '38m',
    body:
      'New piece is up. We tracked the supply chain behind three major AI inference clusters and what their water + power draw actually costs the towns hosting them. Five months of reporting. Sources cited in-line.',
    metrics: { likes: 8702, comments: 1240, shares: 2104, bookmarks: 5188 },
    tags: ['climate', 'ai', 'longform'],
    topComment: {
      user: byHandle('priya'),
      text: 'The Phoenix section completely changed how I think about siting these things. Saving for the lab meeting.',
    },
  },
  {
    id: 'p3',
    author: byHandle('kenji'),
    postedAt: '1h',
    body: 'Morning fog on the coast road. Shot on Portra 400, pushed one stop. No edits.',
    media: {
      type: 'gallery',
      src: [
        img('1500382017468-9049fed747ef', 1200, 1200),
        img('1500051638674-ff996a0ec29e', 1200, 1200),
        img('1520962880247-cfaf541c8724', 1200, 1200),
      ],
      aspect: 'square',
    },
    metrics: { likes: 942, comments: 58, shares: 21, bookmarks: 198 },
    tags: ['film', 'landscape'],
    location: 'Cape Reinga · Aotearoa',
  },
  {
    id: 'p4',
    author: byHandle('amaru'),
    postedAt: '2h',
    body:
      "TIL: postgres' new logical replication slot improvements in 17 are quietly the best thing that happened to my disaster recovery story this year. Cut our cutover window from 14 minutes to under 90 seconds.\n\nGoing to write a longer thread tomorrow. For now, vibes:",
    media: { type: 'image', src: img('1518770660439-4636190af475'), aspect: 'wide' },
    metrics: { likes: 612, comments: 88, shares: 142, bookmarks: 489 },
    bookmarked: true,
    tags: ['postgres', 'infra'],
  },
  {
    id: 'p5',
    author: byHandle('lina'),
    postedAt: '3h',
    body:
      'We just shipped 11 styles in our smallest run yet — only 200 units total. Everything traceable to the farm, every dye plant-based, every seam stitched within a 40km radius of the studio.\n\nIf you want to see how it actually gets made, the studio is open this Saturday in Lagos.',
    media: { type: 'image', src: img('1483985988355-763728e1935b'), aspect: 'wide' },
    metrics: { likes: 4081, comments: 312, shares: 188, bookmarks: 920 },
    tags: ['coastline', 'made-here'],
    location: 'Coastline · Lagos',
    topComment: {
      user: byHandle('nadia'),
      text: 'The dye work on the third look is incredible. Please tell me there is a press kit.',
    },
  },
  {
    id: 'p6',
    author: byHandle('theo'),
    postedAt: '5h',
    body:
      'Procedural town generator — first pass at letting roads negotiate around the river instead of cutting through it. Still rough. Each frame is a real seed, no curation.',
    media: { type: 'image', src: img('1542751371-adc38448a05e'), aspect: 'square' },
    metrics: { likes: 2210, comments: 161, shares: 312, bookmarks: 870 },
    tags: ['gamedev', 'procgen'],
  },
];

export const trending: TrendingTopic[] = [
  { category: 'Technology · Trending', title: 'WebGPU 1.0', posts: '128K posts', highlight: true },
  { category: 'Sports', title: 'Champions League draw', posts: '94.2K posts' },
  { category: 'Climate', title: 'Atlantic hurricane season', posts: '41.8K posts' },
  { category: 'Music · Now', title: '"Halflight" by Jamila Woods', posts: '22.6K posts' },
  { category: 'Design', title: 'Bauhaus 106', posts: '11.1K posts' },
];

export const suggestions: User[] = [byHandle('priya'), byHandle('marcos'), byHandle('theo')];

export const conversations: ConversationPreview[] = [
  {
    id: 'c1',
    user: byHandle('nadia'),
    lastMessage: 'Sending the press kit over tonight — Lina is in.',
    time: '2m',
    unread: 2,
    online: true,
  },
  {
    id: 'c2',
    user: byHandle('sasha'),
    lastMessage: 'Can you fact-check the cooling section before 6?',
    time: '14m',
    unread: 1,
    online: true,
  },
  { id: 'c3', user: byHandle('kenji'), lastMessage: 'Roll 12 looks even better than I hoped.', time: '1h', online: false },
  { id: 'c4', user: byHandle('amaru'), lastMessage: 'Pushed the migration script to the staging cluster.', time: '3h' },
  { id: 'c5', user: byHandle('lina'), lastMessage: 'Studio tour confirmed for Saturday — bring Theo.', time: 'yesterday' },
  { id: 'c6', user: byHandle('priya'), lastMessage: 'Thanks for the intro!', time: '2d' },
];

export const notifications: Notification[] = [
  { id: 'n1', type: 'like', user: byHandle('nadia'), text: 'liked your post "Notes on type pairing"', time: '4m', unread: true },
  {
    id: 'n2',
    type: 'comment',
    user: byHandle('sasha'),
    text: 'replied to your comment: "Sending you the dataset now."',
    time: '22m',
    unread: true,
  },
  { id: 'n3', type: 'follow', user: byHandle('priya'), text: 'started following you', time: '1h', unread: true },
  { id: 'n4', type: 'mention', user: byHandle('amaru'), text: 'mentioned you in a thread about Postgres 17', time: '3h' },
  { id: 'n5', type: 'milestone', text: 'Your post crossed 10K impressions in 24 hours.', time: '8h' },
  { id: 'n6', type: 'follow', user: byHandle('theo'), text: 'started following you', time: 'yesterday' },
];

export const exploreImages = [
  img('1469474968028-56623f02e42e', 800, 1000),
  img('1500530855697-b586d89ba3ee', 800, 600),
  img('1518770660439-4636190af475', 800, 800),
  img('1542038784456-1ea8e935640e', 800, 1100),
  img('1517242027094-631f8c218a0f', 800, 900),
  img('1499678329028-101435549a4e', 800, 700),
  img('1486325212027-8081e485255e', 800, 1200),
  img('1513104890138-7c749659a591', 800, 800),
  img('1469474968028-56623f02e42e', 800, 900),
  img('1542751371-adc38448a05e', 800, 1000),
  img('1520962880247-cfaf541c8724', 800, 700),
  img('1488646953014-85cb44e25828', 800, 1100),
];

export const formatCount = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
};
