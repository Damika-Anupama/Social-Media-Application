export type User = {
  id: string;
  handle: string;
  name: string;
  avatar: string;
  verified?: boolean;
  bio?: string;
  followers?: number;
  following?: number;
  location?: string;
  joined?: string;
  link?: string;
};

export type Story = {
  id: string;
  user: User;
  thumbnail: string;
  isLive?: boolean;
  viewed?: boolean;
  caption?: string;
};

export type PostCategory = 'foryou' | 'following' | 'longform' | 'live';

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
  category?: PostCategory;
  readTime?: string;
  live?: { topic: string; listeners: number };
};

export type TrendingTopic = {
  category: string;
  title: string;
  posts: string;
  highlight?: boolean;
  slug: string;
};

export type ConversationPreview = {
  id: string;
  user: User;
  lastMessage: string;
  time: string;
  unread?: number;
  online?: boolean;
};

export type ChatMessage = {
  from: 'me' | 'them';
  time: string;
  text: string;
};

export type Notification = {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'mention' | 'milestone';
  user?: User;
  text: string;
  time: string;
  unread?: boolean;
  postId?: string;
};

export type Community = {
  id: string;
  name: string;
  slug: string;
  members: number;
  online: number;
  cover: string;
  description: string;
  topic: string;
  joined?: boolean;
};

const av = (seed: string) =>
  `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear&backgroundColor=6435ff,3ddbb3,ff6b6b,4cc9f0,ffd166`;

const img = (id: string, w = 1600, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

/**
 * Stories now open in a full-screen viewer, so their source has to be a crisp
 * portrait — a 200×320 thumbnail looked fine in the rail and upscaled to mush at
 * 88vh. A 9:16, 1080×1920, q=85 crop stays sharp on a retina phone; next/image
 * still downsizes it to 112px for the rail from this one source.
 */
const storyImg = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1080&h=1920&q=85`;

export const currentUser: User = {
  id: 'u_me',
  handle: 'demo',
  name: 'Damika Anupama',
  avatar: av('damika-pulse'),
  verified: true,
  bio: 'Designing humane software · Building Pulse · Colombo → SF',
  followers: 12480,
  following: 318,
  location: 'Colombo · San Francisco',
  joined: 'March 2024',
  link: 'damika.dev',
};

export const users: User[] = [
  { id: 'u_1', handle: 'nadia', name: 'Nadia Pereira', avatar: av('nadia'), verified: true, bio: 'Creative director @ Halftone Studio', followers: 88200, following: 412, location: 'Lisbon', joined: 'Jan 2023', link: 'halftone.studio' },
  { id: 'u_2', handle: 'kenji', name: 'Kenji Mori', avatar: av('kenji'), bio: 'Photographer · slow travel · film grain', followers: 4310, following: 380, location: 'Tokyo', joined: 'Sep 2023', link: 'kenji.photos' },
  { id: 'u_3', handle: 'sasha', name: 'Sasha Reyes', avatar: av('sasha'), verified: true, bio: 'Independent journalist · climate, AI, policy', followers: 56110, following: 502, location: 'New York', joined: 'Apr 2023', link: 'sasha.press' },
  { id: 'u_4', handle: 'amaru', name: 'Amaru Quispe', avatar: av('amaru'), bio: 'Backend @ Nucleus · Rust, distributed systems', followers: 9201, following: 244, location: 'Lima', joined: 'Feb 2023', link: 'amaru.dev' },
  { id: 'u_5', handle: 'lina', name: 'Lina Okafor', avatar: av('lina'), verified: true, bio: 'Founder @ Coastline — sustainable apparel', followers: 24700, following: 188, location: 'Lagos', joined: 'May 2023', link: 'coastline.co' },
  { id: 'u_6', handle: 'theo', name: 'Theo Lindqvist', avatar: av('theo'), bio: 'Indie game dev · pixel + procedural worlds', followers: 6890, following: 510, location: 'Stockholm', joined: 'Oct 2023', link: 'theo.games' },
  { id: 'u_7', handle: 'priya', name: 'Priya Iyer', avatar: av('priya'), verified: true, bio: 'Researcher @ Open Climate Lab', followers: 31040, following: 219, location: 'Bangalore', joined: 'Mar 2023', link: 'openclimate.org' },
  { id: 'u_8', handle: 'marcos', name: 'Marcos Andrade', avatar: av('marcos'), bio: 'Cyclist · long roads, slow coffee', followers: 2140, following: 198, location: 'Lisbon', joined: 'Nov 2023', link: 'marcos.cc' },
  { id: 'u_9', handle: 'aiko', name: 'Aiko Tanaka', avatar: av('aiko'), verified: true, bio: 'Type designer · letterforms · Latin & CJK', followers: 18200, following: 290, location: 'Kyoto', joined: 'Jun 2023', link: 'aiko.type' },
  { id: 'u_10', handle: 'felix', name: 'Felix Romano', avatar: av('felix'), bio: 'Furniture maker · solid wood · Lisbon studio', followers: 5610, following: 142, location: 'Lisbon', joined: 'Aug 2023', link: 'felix.studio' },
  { id: 'u_11', handle: 'mei', name: 'Mei Ling Chen', avatar: av('mei'), verified: true, bio: 'Astronomer · imaging the universe with citizen scientists', followers: 41200, following: 380, location: 'Hilo, HI', joined: 'Jul 2023', link: 'meiling.space' },
  { id: 'u_12', handle: 'jamal', name: 'Jamal Brooks', avatar: av('jamal'), bio: 'Producer · jazz / electronic / generative', followers: 12410, following: 410, location: 'New Orleans', joined: 'Feb 2024', link: 'jamal.fm' },
  { id: 'u_13', handle: 'sofia', name: 'Sofia Mendez', avatar: av('sofia'), verified: true, bio: 'Architect · adaptive reuse, public space', followers: 27800, following: 312, location: 'Mexico City', joined: 'Apr 2023', link: 'sofia.archi' },
  { id: 'u_14', handle: 'evan', name: 'Evan Park', avatar: av('evan'), bio: 'Frontend engineer · accessibility advocate', followers: 8740, following: 522, location: 'Seoul', joined: 'Dec 2023', link: 'evan.dev' },
  { id: 'u_15', handle: 'leila', name: 'Leila Hassan', avatar: av('leila'), verified: true, bio: 'Documentary filmmaker · everyday lives, slow stories', followers: 33510, following: 240, location: 'Cairo', joined: 'Mar 2023', link: 'leila.film' },
  { id: 'u_16', handle: 'omar', name: 'Omar Khalil', avatar: av('omar'), bio: 'Bookbinder · letterpress · paper lover', followers: 4180, following: 188, location: 'Beirut', joined: 'Sep 2023', link: 'omar.press' },
  { id: 'u_17', handle: 'yuki', name: 'Yuki Saito', avatar: av('yuki'), bio: 'Chef · seasonal, foraged, small-table tasting menus', followers: 6210, following: 144, location: 'Osaka', joined: 'May 2023', link: 'yuki.table' },
  { id: 'u_18', handle: 'iris', name: 'Iris Nordin', avatar: av('iris'), verified: true, bio: 'ML researcher · interpretability, alignment', followers: 22800, following: 401, location: 'Oslo', joined: 'Aug 2023', link: 'iris.ai' },
  { id: 'u_19', handle: 'rohan', name: 'Rohan Mehta', avatar: av('rohan'), bio: 'Cyclist · adventure rides · espresso fan', followers: 3120, following: 245, location: 'Pune', joined: 'Oct 2023', link: 'rohan.rides' },
  { id: 'u_20', handle: 'eva', name: 'Eva Lindberg', avatar: av('eva'), verified: true, bio: 'Editor-in-chief · Slow Read magazine', followers: 19800, following: 290, location: 'Copenhagen', joined: 'Jun 2023', link: 'slowread.co' },
];

const byHandle = (h: string) => users.find((u) => u.handle === h)!;

export const stories: Story[] = [
  { id: 's0', user: currentUser, thumbnail: storyImg('1495474472287-4d71bcdd2085'), caption: 'Studio morning · making coffee, reviewing the new identity work.' },
  { id: 's1', user: byHandle('nadia'), thumbnail: storyImg('1542038784456-1ea8e935640e'), isLive: true, caption: 'Live from the Halftone studio — type pairing walkthrough.' },
  { id: 's2', user: byHandle('kenji'), thumbnail: storyImg('1499678329028-101435549a4e'), caption: 'Three frames from this morning, Portra 400.' },
  { id: 's3', user: byHandle('sasha'), thumbnail: storyImg('1469854523086-cc02fe5d8800'), caption: 'On the road to Phoenix for part two of the cluster series.' },
  { id: 's4', user: byHandle('amaru'), thumbnail: storyImg('1451187580459-43490279c0fa'), viewed: true, caption: 'Cluster dashboards are green again.' },
  { id: 's5', user: byHandle('lina'), thumbnail: storyImg('1513104890138-7c749659a591'), caption: 'The new dye lot just came in — naturally indigo.' },
  { id: 's6', user: byHandle('theo'), thumbnail: storyImg('1470071459604-3b5ec3a7fe05'), caption: 'Procgen town · seed 4729.' },
  { id: 's7', user: byHandle('priya'), thumbnail: storyImg('1469474968028-56623f02e42e'), viewed: true, caption: 'Field day in the highlands.' },
  { id: 's8', user: byHandle('marcos'), thumbnail: storyImg('1476480862126-209bfaa8edc8'), caption: '180km · negative split · espresso to celebrate.' },
  { id: 's9', user: byHandle('aiko'), thumbnail: storyImg('1473163928189-364b2c4e1135'), caption: 'Sketching new italic forms today.' },
  { id: 's10', user: byHandle('mei'), thumbnail: storyImg('1419242902214-272b3f66ee7a'), isLive: true, caption: 'Live from the observatory — Andromeda over Mauna Kea.' },
  { id: 's11', user: byHandle('jamal'), thumbnail: storyImg('1470225620780-dba8ba36b745'), caption: 'New track in the works — drums first.' },
];

const corePosts: Post[] = [
  {
    id: 'p1',
    author: byHandle('nadia'),
    postedAt: '12m',
    body:
      'Spent the weekend in our studio rethinking type pairing for the new identity. The longer I work with this Söhne / Tiempos combo, the more it feels like a quiet conversation between two voices.\n\nBoth refined. Neither trying to win.',
    media: { type: 'image', src: img('1504384308090-c894fdcc538d'), aspect: 'wide' },
    metrics: { likes: 2148, comments: 187, shares: 64, bookmarks: 412 },
    liked: true,
    tags: ['design', 'typography', 'studio-notes'],
    location: 'Halftone Studio · Lisbon',
    topComment: { user: byHandle('kenji'), text: 'That second spread is doing so much with so little. The kerning is gorgeous.' },
    category: 'foryou',
  },
  {
    id: 'p2',
    author: byHandle('sasha'),
    postedAt: '38m',
    body:
      'New piece is up. We tracked the supply chain behind three major AI inference clusters and what their water + power draw actually costs the towns hosting them. Five months of reporting. Sources cited in-line.',
    metrics: { likes: 8702, comments: 1240, shares: 2104, bookmarks: 5188 },
    tags: ['climate', 'ai', 'longform'],
    topComment: { user: byHandle('priya'), text: 'The Phoenix section completely changed how I think about siting these things.' },
    category: 'longform',
    readTime: '18 min read',
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
    category: 'following',
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
    category: 'foryou',
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
    topComment: { user: byHandle('nadia'), text: 'The dye work on the third look is incredible. Please tell me there is a press kit.' },
    category: 'following',
  },
  {
    id: 'p6',
    author: byHandle('theo'),
    postedAt: '5h',
    body: 'Procedural town generator — first pass at letting roads negotiate around the river instead of cutting through it. Still rough. Each frame is a real seed, no curation.',
    media: { type: 'image', src: img('1542751371-adc38448a05e'), aspect: 'square' },
    metrics: { likes: 2210, comments: 161, shares: 312, bookmarks: 870 },
    tags: ['gamedev', 'procgen'],
    category: 'foryou',
  },
  {
    id: 'p7',
    author: byHandle('priya'),
    postedAt: '6h',
    body:
      'Fieldwork update from the Western Ghats: we placed seven new soil moisture sensors along the new transect this week. Three weeks of data already and the picture is more textured than the satellite product suggests.\n\nWriting up the methodology now — first time we are open-sourcing every step.',
    media: { type: 'image', src: img('1469474968028-56623f02e42e'), aspect: 'wide' },
    metrics: { likes: 1820, comments: 142, shares: 96, bookmarks: 511 },
    tags: ['climate', 'fieldnotes', 'opendata'],
    location: 'Western Ghats · India',
    category: 'longform',
    readTime: '12 min read',
  },
  {
    id: 'p8',
    author: byHandle('aiko'),
    postedAt: '7h',
    body:
      'Italic forms I have been drawing this morning. The third one is starting to talk back, which is usually when I know it has a chance.',
    media: { type: 'image', src: img('1473163928189-364b2c4e1135'), aspect: 'wide' },
    metrics: { likes: 3290, comments: 218, shares: 41, bookmarks: 612 },
    tags: ['type', 'sketch'],
    location: 'Kyoto',
    category: 'foryou',
  },
  {
    id: 'p9',
    author: byHandle('mei'),
    postedAt: '8h',
    body:
      'Live tonight from Mauna Kea: I will be walking through five recent Andromeda captures from our citizen-science network and answering questions about why amateur scopes are doing science professionals used to need a satellite for.\n\nLive room opens 10pm UTC.',
    metrics: { likes: 982, comments: 64, shares: 38, bookmarks: 214 },
    tags: ['astronomy', 'liveroom'],
    category: 'live',
    live: { topic: 'Andromeda nights — what amateurs are discovering', listeners: 318 },
  },
  {
    id: 'p10',
    author: byHandle('jamal'),
    postedAt: '9h',
    body:
      'Spent the last two hours writing four bars and rewriting the same kick pattern. The drums make or break the song, and I do not think anyone really tells you that until you have ruined a couple of tracks yourself.',
    media: { type: 'image', src: img('1470225620780-dba8ba36b745'), aspect: 'wide' },
    metrics: { likes: 1410, comments: 89, shares: 24, bookmarks: 198 },
    tags: ['music', 'production'],
    category: 'following',
  },
  {
    id: 'p11',
    author: byHandle('sofia'),
    postedAt: '11h',
    body:
      'A short essay on adaptive reuse: why the most sustainable building is almost always the one already standing. Five projects in five cities — Mexico City, Lisbon, Lagos, Berlin, Detroit — and what they each got right.',
    metrics: { likes: 5810, comments: 412, shares: 902, bookmarks: 2104 },
    tags: ['architecture', 'longform', 'sustainability'],
    category: 'longform',
    readTime: '22 min read',
  },
  {
    id: 'p12',
    author: byHandle('iris'),
    postedAt: '12h',
    body:
      'A small alignment paper landed today that I think more practitioners should read. The TL;DR: a 7B model fine-tuned with three rounds of well-curated preference data outperformed a 70B model with default RLHF on every single test in our internal eval.\n\nData quality is still the unlock.',
    metrics: { likes: 7104, comments: 612, shares: 1841, bookmarks: 3204 },
    tags: ['ml', 'alignment', 'paper'],
    category: 'longform',
    readTime: '6 min read',
  },
  {
    id: 'p13',
    author: byHandle('felix'),
    postedAt: '14h',
    body:
      'Finished the walnut chair this morning. Eleven sketches, three prototypes, fourteen weeks. Sitting in it for the first time felt like the chair did most of the work.',
    media: { type: 'image', src: img('1505691938895-1758d7feb511'), aspect: 'square' },
    metrics: { likes: 2840, comments: 198, shares: 64, bookmarks: 488 },
    tags: ['woodworking', 'design'],
    location: 'Felix Studio · Lisbon',
    category: 'foryou',
  },
  {
    id: 'p14',
    author: byHandle('leila'),
    postedAt: '15h',
    body:
      'Premiering a new short next Friday in Cairo — five minutes of an old neighbourhood I grew up walking. No narration. Just the city before everyone is awake.',
    metrics: { likes: 3210, comments: 142, shares: 88, bookmarks: 312 },
    tags: ['film', 'doc', 'cairo'],
    category: 'live',
    live: { topic: 'Q&A: Documenting a city without narration', listeners: 142 },
  },
  {
    id: 'p15',
    author: byHandle('evan'),
    postedAt: '16h',
    body:
      'The accessibility tree audit on our marketing site found 41 missing labels, 18 redundant ARIA attributes, and 6 places where keyboard nav silently broke. We fixed all of them in two afternoons. Audits are cheap. Pretending you do not have problems is what gets expensive.',
    metrics: { likes: 1840, comments: 211, shares: 88, bookmarks: 412 },
    tags: ['a11y', 'frontend'],
    category: 'foryou',
  },
  {
    id: 'p16',
    author: byHandle('yuki'),
    postedAt: '18h',
    body:
      'Tonight: cold dashi, lightly cured mackerel, charred negi, and a sauce I am genuinely proud of. Twelve seats. Three sittings. Booking is open Thursday.',
    media: { type: 'image', src: img('1504674900247-0877df9cc836'), aspect: 'wide' },
    metrics: { likes: 1280, comments: 84, shares: 22, bookmarks: 211 },
    tags: ['food', 'osaka'],
    location: 'Yuki · Osaka',
    category: 'following',
  },
  {
    id: 'p17',
    author: byHandle('omar'),
    postedAt: '19h',
    body:
      'A reader sent me a 1924 edition of a Mahmoud Darwish anthology with a binding I had never seen before. I have been studying it for three days. I will share what I find as I take it apart and put it back together.',
    media: { type: 'image', src: img('1457369804613-52c61a468e7d'), aspect: 'portrait' },
    metrics: { likes: 980, comments: 64, shares: 18, bookmarks: 188 },
    tags: ['books', 'craft'],
    location: 'Beirut',
    category: 'foryou',
  },
  {
    id: 'p18',
    author: byHandle('eva'),
    postedAt: '20h',
    body:
      'Issue 14 of Slow Read goes to print on Wednesday. Six features, two photo essays, a long interview with a glacier guide who has spent thirty winters reading the same ice.',
    metrics: { likes: 1640, comments: 92, shares: 41, bookmarks: 312 },
    tags: ['magazine', 'longform'],
    category: 'longform',
    readTime: '4 min preview',
  },
  {
    id: 'p19',
    author: byHandle('marcos'),
    postedAt: '21h',
    body:
      'Did 180km along the coast yesterday. The second half felt better than the first, which is a small miracle. Negative split. Bottle of espresso to celebrate.',
    media: { type: 'image', src: img('1488646953014-85cb44e25828'), aspect: 'wide' },
    metrics: { likes: 740, comments: 38, shares: 14, bookmarks: 92 },
    tags: ['cycling', 'long-ride'],
    location: 'Atlantic coast · PT',
    category: 'following',
  },
  {
    id: 'p20',
    author: byHandle('rohan'),
    postedAt: '23h',
    body:
      'Climbed to 2100m yesterday. The road quality was nothing to write home about but the silence at the top was worth every meter. Going back next month with a tent.',
    metrics: { likes: 410, comments: 28, shares: 6, bookmarks: 64 },
    tags: ['cycling', 'adventure'],
    category: 'following',
  },
];

const liveTopics = [
  { topic: 'The case for slow software', listeners: 412 },
  { topic: 'Designing for slow time', listeners: 318 },
  { topic: 'Open hardware for citizen science', listeners: 214 },
  { topic: 'Music & maths — generative tools live', listeners: 188 },
  { topic: 'Filmmaking without a script', listeners: 142 },
  { topic: 'Postgres deep-dive: replication slots', listeners: 96 },
];

const longformSnippets = [
  'A long read on how cities can recover quiet without losing density. Five neighbourhoods, three before-and-afters.',
  'Why the bus driver of your childhood probably had a better commute than you do now — a 4000-word answer.',
  'The dataset behind our last piece — open, annotated, and ready for replication.',
  'Notes from two weeks teaching a workshop on adaptive reuse to first-year architecture students.',
];

const foryouSnippets = [
  'The most surprising thing about shipping software in a small team is how much your floor sets your ceiling. Care is contagious.',
  'I keep coming back to this quote: "the joy of work is in the work itself." Whoever wrote it never had a five-hour meeting day, but the idea is durable anyway.',
  'A reminder for myself, mostly: nobody else can give your work the time it deserves. That is the entire job.',
  'Spent the afternoon switching three production systems off, replacing them with something a tenth the size, and watching the dashboards stay green. Best kind of Thursday.',
  'A small thread on the difference between fast feedback and good feedback. They sound similar. They are not.',
];

const followingSnippets = [
  'New playlist up, three tracks I cannot stop listening to. All from people in this network.',
  'Studio update: the new chair is finished, the second prototype became firewood, the third made me cry a little.',
  'Field notes from this week, including a deer that judged me from the treeline.',
  'A short walk through the harbour at dawn. Best 45 minutes of the week so far.',
];

const mediaPool = [
  img('1500382017468-9049fed747ef'),
  img('1500051638674-ff996a0ec29e'),
  img('1520962880247-cfaf541c8724'),
  img('1518770660439-4636190af475'),
  img('1473163928189-364b2c4e1135'),
  img('1542038784456-1ea8e935640e'),
  img('1504384308090-c894fdcc538d'),
  img('1469474968028-56623f02e42e'),
  img('1488646953014-85cb44e25828'),
  img('1542751371-adc38448a05e'),
  img('1502691876148-a84978e59af8'),
  img('1505691938895-1758d7feb511'),
  img('1457369804613-52c61a468e7d'),
  img('1504674900247-0877df9cc836'),
  img('1483985988355-763728e1935b'),
  img('1502134249126-9f3755a50d78'),
  img('1470225620780-dba8ba36b745'),
];

let postCounter = 0;
const seedRand = (n: number) => {
  const x = Math.sin(n * 9319.231) * 10000;
  return x - Math.floor(x);
};

const tagPool: Record<PostCategory, string[]> = {
  foryou: ['craft', 'thoughts', 'notes', 'making', 'work', 'studio'],
  following: ['friends', 'studio', 'field', 'music', 'photo', 'film'],
  longform: ['essay', 'reporting', 'data', 'methodology', 'research'],
  live: ['liveroom', 'live', 'now'],
};

export function generatePost(category: PostCategory, index: number): Post {
  postCounter += 1;
  const seed = category.charCodeAt(0) * 1000 + index + postCounter;
  const r = seedRand(seed);
  const author = users[Math.floor(r * users.length)];

  let body: string;
  let media: Post['media'] | undefined;
  let live: Post['live'] | undefined;
  let readTime: string | undefined;

  if (category === 'longform') {
    body = longformSnippets[Math.floor(seedRand(seed + 1) * longformSnippets.length)];
    readTime = `${5 + Math.floor(seedRand(seed + 2) * 18)} min read`;
  } else if (category === 'live') {
    const lt = liveTopics[Math.floor(seedRand(seed + 1) * liveTopics.length)];
    body = `Joining live in 30 minutes — ${lt.topic.toLowerCase()}. Bring a question.`;
    live = lt;
  } else if (category === 'following') {
    body = followingSnippets[Math.floor(seedRand(seed + 1) * followingSnippets.length)];
    if (seedRand(seed + 3) > 0.5) {
      media = { type: 'image', src: mediaPool[Math.floor(seedRand(seed + 4) * mediaPool.length)], aspect: 'wide' };
    }
  } else {
    body = foryouSnippets[Math.floor(seedRand(seed + 1) * foryouSnippets.length)];
    if (seedRand(seed + 3) > 0.6) {
      media = { type: 'image', src: mediaPool[Math.floor(seedRand(seed + 4) * mediaPool.length)], aspect: 'wide' };
    }
  }

  const likes = Math.floor(seedRand(seed + 5) * 9000) + 80;
  const tags = tagPool[category].slice(0, 1 + Math.floor(seedRand(seed + 6) * 3));

  return {
    id: `gen-${category}-${index}-${postCounter}`,
    author,
    postedAt: `${1 + Math.floor(seedRand(seed + 7) * 23)}h`,
    body,
    media,
    metrics: {
      likes,
      comments: Math.floor(likes * (0.04 + seedRand(seed + 8) * 0.1)),
      shares: Math.floor(likes * (0.01 + seedRand(seed + 9) * 0.04)),
      bookmarks: Math.floor(likes * (0.05 + seedRand(seed + 10) * 0.15)),
    },
    tags,
    category,
    readTime,
    live,
  };
}

export function postsForCategory(category: PostCategory): Post[] {
  if (category === 'foryou') return corePosts;
  return corePosts.filter((p) => p.category === category);
}

export const posts = corePosts;

export const trending: TrendingTopic[] = [
  { category: 'Technology · Trending', title: 'WebGPU 1.0', posts: '128K posts', highlight: true, slug: 'webgpu' },
  { category: 'Sports', title: 'Champions League draw', posts: '94.2K posts', slug: 'ucl' },
  { category: 'Climate', title: 'Atlantic hurricane season', posts: '41.8K posts', slug: 'hurricane' },
  { category: 'Music · Now', title: '"Halflight" by Jamila Woods', posts: '22.6K posts', slug: 'halflight' },
  { category: 'Design', title: 'Bauhaus 106', posts: '11.1K posts', slug: 'bauhaus' },
  { category: 'Books', title: 'Slow Read issue 14', posts: '8.4K posts', slug: 'slow-read' },
  { category: 'Film', title: 'Cannes shortlist leak', posts: '6.9K posts', slug: 'cannes' },
  { category: 'Politics', title: 'EU climate vote', posts: '5.3K posts', slug: 'eu-climate' },
];

export const suggestions: User[] = [
  byHandle('priya'),
  byHandle('marcos'),
  byHandle('theo'),
  byHandle('aiko'),
  byHandle('mei'),
  byHandle('felix'),
  byHandle('iris'),
  byHandle('jamal'),
];

const sampleConversations: { handle: string; lastMessage: string; time: string; unread?: number; online?: boolean }[] = [
  { handle: 'nadia', lastMessage: 'Sending the press kit over tonight — Lina is in.', time: '2m', unread: 2, online: true },
  { handle: 'sasha', lastMessage: 'Can you fact-check the cooling section before 6?', time: '14m', unread: 1, online: true },
  { handle: 'kenji', lastMessage: 'Roll 12 looks even better than I hoped.', time: '1h', online: false },
  { handle: 'amaru', lastMessage: 'Pushed the migration script to the staging cluster.', time: '3h' },
  { handle: 'lina', lastMessage: 'Studio tour confirmed for Saturday — bring Theo.', time: 'yesterday' },
  { handle: 'priya', lastMessage: 'Thanks for the intro! Setting up the call for Tuesday.', time: '2d' },
  { handle: 'aiko', lastMessage: 'Final glyphs ready — sending the .otf in the morning.', time: '2d' },
  { handle: 'mei', lastMessage: 'The new capture from Mauna Kea is unreal. Sharing soon.', time: '3d' },
  { handle: 'jamal', lastMessage: 'Rough mix is in your inbox. No rush, just whenever.', time: '3d' },
  { handle: 'sofia', lastMessage: 'Sent the floor plans — let me know what you think.', time: '4d' },
  { handle: 'evan', lastMessage: 'A11y audit results are wild. Most of it is a one-day fix.', time: '5d' },
  { handle: 'leila', lastMessage: 'Edit is locked. Premiere on the 14th.', time: '6d' },
];

export const conversations: ConversationPreview[] = sampleConversations.map((c, i) => ({
  id: `c${i + 1}`,
  user: byHandle(c.handle),
  lastMessage: c.lastMessage,
  time: c.time,
  unread: c.unread,
  online: c.online,
}));

export const threadsByConversation: Record<string, ChatMessage[]> = {
  c1: [
    { from: 'them', time: '10:12', text: 'Sending the press kit over tonight — Lina is in.' },
    { from: 'them', time: '10:12', text: "Also: the studio tour on Saturday is moving to 6pm. Theo's flight changes." },
    { from: 'me', time: '10:18', text: 'Perfect. I will push the new time to the events feed.' },
    { from: 'me', time: '10:18', text: 'If you want, I can write the announcement copy this afternoon — just send me the dye-process line.' },
    { from: 'them', time: '10:21', text: 'Yes please. I will email the full sourcing doc as soon as Coastline signs off on it.' },
  ],
  c2: [
    { from: 'them', time: '09:40', text: 'Got a draft of the cooling section.' },
    { from: 'them', time: '09:41', text: 'Can you fact-check the cooling section before 6?' },
    { from: 'me', time: '09:55', text: 'Yeah. Sending notes inline by 5.' },
  ],
  c3: [
    { from: 'them', time: 'Mon', text: 'Roll 11 was nothing. Trying roll 12 this morning.' },
    { from: 'them', time: 'Mon', text: 'Roll 12 looks even better than I hoped.' },
    { from: 'me', time: 'Mon', text: 'The fog on frame 4 is unreal. Print that one.' },
  ],
  c4: [
    { from: 'them', time: 'Sun', text: 'Pushed the migration script to the staging cluster.' },
    { from: 'me', time: 'Sun', text: 'Running it. Will send the timing numbers.' },
  ],
  c5: [
    { from: 'them', time: 'Sat', text: 'Studio tour confirmed for Saturday — bring Theo.' },
    { from: 'me', time: 'Sat', text: 'On it. He owes me a beer for the intro anyway.' },
  ],
  c6: [
    { from: 'them', time: '2d', text: 'Thanks for the intro! Setting up the call for Tuesday.' },
    { from: 'me', time: '2d', text: 'Anytime. Priya is great.' },
  ],
  c7: [
    { from: 'them', time: '2d', text: 'Final glyphs ready — sending the .otf in the morning.' },
    { from: 'me', time: '2d', text: 'Cannot wait. The italics last week were incredible.' },
  ],
  c8: [
    { from: 'them', time: '3d', text: 'The new capture from Mauna Kea is unreal. Sharing soon.' },
  ],
  c9: [
    { from: 'them', time: '3d', text: 'Rough mix is in your inbox. No rush, just whenever.' },
  ],
  c10: [
    { from: 'them', time: '4d', text: 'Sent the floor plans — let me know what you think.' },
  ],
  c11: [
    { from: 'them', time: '5d', text: 'A11y audit results are wild. Most of it is a one-day fix.' },
  ],
  c12: [
    { from: 'them', time: '6d', text: 'Edit is locked. Premiere on the 14th.' },
    { from: 'me', time: '6d', text: 'Counting down. Save me a seat.' },
  ],
};

export const notifications: Notification[] = [
  { id: 'n1', type: 'like', user: byHandle('nadia'), text: 'liked your post "Notes on type pairing"', time: '4m', unread: true, postId: 'p1' },
  { id: 'n2', type: 'comment', user: byHandle('sasha'), text: 'replied to your comment: "Sending you the dataset now."', time: '22m', unread: true, postId: 'p2' },
  { id: 'n3', type: 'follow', user: byHandle('priya'), text: 'started following you', time: '1h', unread: true },
  { id: 'n4', type: 'mention', user: byHandle('amaru'), text: 'mentioned you in a thread about Postgres 17', time: '3h', postId: 'p4' },
  { id: 'n5', type: 'milestone', text: 'Your post crossed 10K impressions in 24 hours.', time: '8h', postId: 'p1' },
  { id: 'n6', type: 'follow', user: byHandle('theo'), text: 'started following you', time: 'yesterday' },
  { id: 'n7', type: 'like', user: byHandle('lina'), text: 'liked 3 of your replies', time: 'yesterday' },
  { id: 'n8', type: 'comment', user: byHandle('aiko'), text: 'replied to your post on type sketches', time: '2d', postId: 'p8' },
  { id: 'n9', type: 'mention', user: byHandle('mei'), text: 'invited you to a live room: Andromeda nights', time: '2d', postId: 'p9' },
  { id: 'n10', type: 'milestone', text: 'You crossed 12K followers — quietly. Nice work.', time: '3d' },
  { id: 'n11', type: 'follow', user: byHandle('iris'), text: 'started following you', time: '3d' },
  { id: 'n12', type: 'like', user: byHandle('felix'), text: 'liked your reply on the walnut chair thread', time: '4d', postId: 'p13' },
  { id: 'n13', type: 'comment', user: byHandle('evan'), text: 'replied: "We added the same audit step in our pipeline this week"', time: '5d', postId: 'p15' },
  { id: 'n14', type: 'follow', user: byHandle('yuki'), text: 'started following you', time: '5d' },
  { id: 'n15', type: 'mention', user: byHandle('eva'), text: 'mentioned you in Slow Read issue 14', time: '6d' },
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
  img('1473163928189-364b2c4e1135', 800, 900),
  img('1542751371-adc38448a05e', 800, 1000),
  img('1520962880247-cfaf541c8724', 800, 700),
  img('1488646953014-85cb44e25828', 800, 1100),
  img('1457369804613-52c61a468e7d', 800, 1000),
  img('1502691876148-a84978e59af8', 800, 800),
  img('1505691938895-1758d7feb511', 800, 1000),
  img('1504674900247-0877df9cc836', 800, 900),
  img('1483985988355-763728e1935b', 800, 700),
  img('1502134249126-9f3755a50d78', 800, 1100),
  img('1470225620780-dba8ba36b745', 800, 900),
  img('1504384308090-c894fdcc538d', 800, 1000),
  img('1500051638674-ff996a0ec29e', 800, 800),
  img('1500382017468-9049fed747ef', 800, 1100),
];

const moreImages = [
  img('1441974231531-c6227db76b6e', 800, 1100),
  img('1500530855697-b586d89ba3ee', 800, 700),
  img('1542038784456-1ea8e935640e', 800, 900),
  img('1500382017468-9049fed747ef', 800, 1000),
  img('1457369804613-52c61a468e7d', 800, 800),
];

export function generateExploreImage(index: number): string {
  const pool = [...exploreImages, ...moreImages];
  return pool[index % pool.length];
}

export const communities: Community[] = [
  { id: 'cm1', name: 'Slow Web Society', slug: 'slow-web', members: 12400, online: 318, cover: img('1500530855697-b586d89ba3ee', 1200, 600), description: 'For people building software that respects attention.', topic: 'Calm tech', joined: true },
  { id: 'cm2', name: 'Open Climate Lab', slug: 'open-climate', members: 8100, online: 96, cover: img('1469474968028-56623f02e42e', 1200, 600), description: 'Field notes, datasets, and methods from climate researchers.', topic: 'Science', joined: true },
  { id: 'cm3', name: 'Halftone', slug: 'halftone', members: 24000, online: 540, cover: img('1504384308090-c894fdcc538d', 1200, 600), description: 'Design studios talking shop about type, identity, and craft.', topic: 'Design', joined: true },
  { id: 'cm4', name: 'Roastery', slug: 'roastery', members: 3210, online: 84, cover: img('1504674900247-0877df9cc836', 1200, 600), description: 'A small room for specialty coffee nerds.', topic: 'Coffee' },
  { id: 'cm5', name: 'Pixel Diaries', slug: 'pixel-diaries', members: 6810, online: 122, cover: img('1542751371-adc38448a05e', 1200, 600), description: 'Indie game devs sharing daily progress.', topic: 'Gamedev' },
  { id: 'cm6', name: 'Long-form Cycling', slug: 'long-form-cycling', members: 2140, online: 28, cover: img('1488646953014-85cb44e25828', 1200, 600), description: 'Endurance riding, slow travel, and good coffee at the top.', topic: 'Cycling' },
  { id: 'cm7', name: 'Postgres Wizards', slug: 'postgres-wizards', members: 5640, online: 188, cover: img('1518770660439-4636190af475', 1200, 600), description: 'Database deep-dives at scale.', topic: 'Databases' },
  { id: 'cm8', name: 'Field Notes', slug: 'field-notes', members: 4120, online: 64, cover: img('1441974231531-c6227db76b6e', 1200, 600), description: 'Naturalists, illustrators, and the practice of looking carefully.', topic: 'Nature' },
  { id: 'cm9', name: 'Type Foundry', slug: 'type-foundry', members: 9210, online: 218, cover: img('1473163928189-364b2c4e1135', 1200, 600), description: 'Letterforms, kerning fights, and the joy of italics.', topic: 'Type' },
  { id: 'cm10', name: 'Adaptive Reuse', slug: 'adaptive-reuse', members: 3810, online: 41, cover: img('1502691876148-a84978e59af8', 1200, 600), description: 'Architects making the most of what is already standing.', topic: 'Architecture' },
];

export const formatCount = (n: number) => {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
};

export type Comment = {
  id: string;
  user: User;
  body: string;
  time: string;
  likes: number;
  replies?: Comment[];
};

const commentsByPost: Record<string, Comment[]> = {
  p1: [
    {
      id: 'p1c1',
      user: byHandle('kenji'),
      body: 'That second spread is doing so much with so little. The kerning is gorgeous.',
      time: '8m',
      likes: 42,
      replies: [
        { id: 'p1c1r1', user: byHandle('nadia'), body: 'Thank you. We re-spaced it five times. The capital T was the boss fight.', time: '6m', likes: 11 },
      ],
    },
    { id: 'p1c2', user: byHandle('lina'), body: 'I am stealing the bottom right pairing for the Coastline lookbook. Crediting you obviously.', time: '4m', likes: 28 },
    { id: 'p1c3', user: byHandle('theo'), body: 'Always learning from your studio notes. Bookmarking.', time: '2m', likes: 9 },
    { id: 'p1c4', user: byHandle('aiko'), body: 'The pairing reminds me of the Söhne/Lyon spreads from last year. Very good company.', time: '1m', likes: 17 },
  ],
  p2: [
    { id: 'p2c1', user: byHandle('priya'), body: 'The Phoenix section completely changed how I think about siting these things.', time: '20m', likes: 188 },
    { id: 'p2c2', user: byHandle('amaru'), body: 'Numbers in figure 3 match what we are seeing internally. Solid reporting.', time: '14m', likes: 96 },
    { id: 'p2c3', user: byHandle('iris'), body: 'Sharing this with our team. The methodology section alone is a masterclass.', time: '10m', likes: 71 },
  ],
  p3: [
    { id: 'p3c1', user: byHandle('nadia'), body: 'The light here is heartbreaking.', time: '45m', likes: 33 },
    { id: 'p3c2', user: byHandle('marcos'), body: 'What lens? Looks like a 35.', time: '30m', likes: 6 },
    { id: 'p3c3', user: byHandle('kenji'), body: 'Yes, 35 1.4 on the Nikon. Nothing fancy.', time: '25m', likes: 9 },
  ],
  p4: [
    { id: 'p4c1', user: byHandle('sasha'), body: 'Looking forward to the thread. Postgres 17 has been quietly amazing.', time: '1h', likes: 22 },
    { id: 'p4c2', user: byHandle('evan'), body: 'We are about to switch over next week. Any gotchas you ran into?', time: '50m', likes: 8 },
  ],
  p5: [
    {
      id: 'p5c1',
      user: byHandle('nadia'),
      body: 'The dye work on the third look is incredible. Please tell me there is a press kit.',
      time: '2h',
      likes: 67,
      replies: [{ id: 'p5c1r1', user: byHandle('lina'), body: 'Sending the press kit over tonight — Halftone is already in.', time: '1h', likes: 18 }],
    },
  ],
  p6: [
    { id: 'p6c1', user: byHandle('amaru'), body: 'Procedural roads that respect water — finally. Real systems thinking.', time: '4h', likes: 41 },
  ],
  p7: [
    { id: 'p7c1', user: byHandle('sasha'), body: 'This is exactly the kind of methodology I wish more groups would publish.', time: '5h', likes: 28 },
  ],
  p8: [
    { id: 'p8c1', user: byHandle('omar'), body: 'The third italic is incredible. Feels like a conversation.', time: '6h', likes: 18 },
  ],
};

export const findPost = (id: string) => posts.find((p) => p.id === id);
export const findUser = (handle: string) =>
  users.find((u) => u.handle === handle) ?? (handle === currentUser.handle ? currentUser : undefined);
export const findCommunity = (slug: string) => communities.find((c) => c.slug === slug);
export const postsByUser = (userId: string) => posts.filter((p) => p.author.id === userId);
export const commentsFor = (postId: string): Comment[] => commentsByPost[postId] ?? [];
export const allHandles = () => [currentUser.handle, ...users.map((u) => u.handle)];
