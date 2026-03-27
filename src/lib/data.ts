export type Design = {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  color: string;
  creator: string;
  creatorAvatar: string;
  price: number;
  sales: number;
  isPublic: boolean;
  country: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  credits: number;
  dailyGenerations: number;
  badges: string[];
  streak: number;
};

export const MOCK_DESIGNS: Design[] = [
  {
    id: "1",
    title: "Cosmic Waves",
    prompt: "A galaxy of swirling colors, minimalist linework",
    imageUrl: "https://picsum.photos/seed/wave1/400/400",
    color: "#1a1a2e",
    creator: "alex_creates",
    creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=alex",
    price: 24.99,
    sales: 47,
    isPublic: true,
    country: "US",
    createdAt: "2026-03-10",
  },
  {
    id: "2",
    title: "Tokyo Nights",
    prompt: "Neon city lights, Japanese aesthetic, minimal",
    imageUrl: "https://picsum.photos/seed/tokyo2/400/400",
    color: "#0f172a",
    creator: "mia_designs",
    creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=mia",
    price: 24.99,
    sales: 83,
    isPublic: true,
    country: "JP",
    createdAt: "2026-03-08",
  },
  {
    id: "3",
    title: "Desert Bloom",
    prompt: "Cactus flower in bloom, warm sunset tones, geometric",
    imageUrl: "https://picsum.photos/seed/desert3/400/400",
    color: "#fef3c7",
    creator: "sun_studio",
    creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=sun",
    price: 24.99,
    sales: 29,
    isPublic: true,
    country: "MX",
    createdAt: "2026-03-15",
  },
  {
    id: "4",
    title: "Deep Ocean",
    prompt: "Abstract ocean depth, bioluminescent creatures",
    imageUrl: "https://picsum.photos/seed/ocean4/400/400",
    color: "#0c4a6e",
    creator: "wave_lab",
    creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=wave",
    price: 24.99,
    sales: 62,
    isPublic: true,
    country: "AU",
    createdAt: "2026-03-12",
  },
  {
    id: "5",
    title: "Mountain Spirit",
    prompt: "Minimalist mountain range at dusk, single line",
    imageUrl: "https://picsum.photos/seed/mountain5/400/400",
    color: "#f8fafc",
    creator: "peak_art",
    creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=peak",
    price: 24.99,
    sales: 118,
    isPublic: true,
    country: "CA",
    createdAt: "2026-03-05",
  },
  {
    id: "6",
    title: "Forest Echo",
    prompt: "Ancient forest, geometric trees, morning mist",
    imageUrl: "https://picsum.photos/seed/forest6/400/400",
    color: "#14532d",
    creator: "green_mind",
    creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=green",
    price: 24.99,
    sales: 34,
    isPublic: true,
    country: "DE",
    createdAt: "2026-03-18",
  },
  {
    id: "7",
    title: "Urban Grid",
    prompt: "City blueprint, architectural lines, monochrome",
    imageUrl: "https://picsum.photos/seed/urban7/400/400",
    color: "#111827",
    creator: "arch_studio",
    creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=arch",
    price: 24.99,
    sales: 91,
    isPublic: true,
    country: "UK",
    createdAt: "2026-03-01",
  },
  {
    id: "8",
    title: "Flamingo Dream",
    prompt: "Single flamingo, watercolor style, pastel pink",
    imageUrl: "https://picsum.photos/seed/flamingo8/400/400",
    color: "#fce7f3",
    creator: "pink_lab",
    creatorAvatar: "https://api.dicebear.com/7.x/initials/svg?seed=pink",
    price: 24.99,
    sales: 156,
    isPublic: true,
    country: "BR",
    createdAt: "2026-02-28",
  },
];

export const MOCK_USER: User = {
  id: "u1",
  name: "Emre",
  email: "emre@example.com",
  credits: 12.00,
  dailyGenerations: 1,
  badges: ["🌱", "🔥"],
  streak: 3,
};

export const TSHIRT_COLORS = [
  { name: "Black", hex: "#0a0a0a" },
  { name: "White", hex: "#ffffff" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Forest", hex: "#1a4731" },
  { name: "Burgundy", hex: "#6b1a2a" },
  { name: "Sand", hex: "#c4a882" },
  { name: "Slate", hex: "#475569" },
  { name: "Coral", hex: "#f4705b" },
  { name: "Lavender", hex: "#a78bfa" },
  { name: "Sky", hex: "#38bdf8" },
  { name: "Mint", hex: "#6ee7b7" },
  { name: "Yellow", hex: "#fde047" },
  { name: "Orange", hex: "#fb923c" },
  { name: "Rose", hex: "#fb7185" },
  { name: "Olive", hex: "#84cc16" },
];

export const BADGES = [
  { id: "🌱", name: "First Drop", desc: "Published your first design" },
  { id: "🔥", name: "Hot Designer", desc: "Design sold 10 times" },
  { id: "💎", name: "Top Creator", desc: "Top seller this month" },
  { id: "🌍", name: "Global", desc: "Sold to 5 different countries" },
  { id: "👑", name: "Legend", desc: "100 total sales" },
];
