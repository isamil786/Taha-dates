import fs from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "items.json");

export type Item = {
  id: number;
  barcode: string;
  name: string;
  uom: string;
  category: string;
  category_slug: string;
  cost_price: number;
  mrp: number;
  price: number;
  hsn_code: string;
  gst_group: string;
};

export type Category = {
  name: string;
  slug: string;
  item_count: number;
  icon: string;
  accent: string;
  sort_order: number;
  min_price: number;
  max_price: number;
};

const CATEGORY_META: Record<
  string,
  { label: string; icon: string; accent: string }
> = {
  Dates: { label: "Premium Dates", icon: "🌴", accent: "from-amber-500 to-orange-600" },
  "Dry Fruits & Nuts": {
    label: "Nuts & Dry Fruits",
    icon: "🥜",
    accent: "from-amber-700 to-yellow-800",
  },
  "Dry Fruits": { label: "Dry Fruits", icon: "🍇", accent: "from-purple-500 to-violet-700" },
  "Berries & Dehydrated Fruits": {
    label: "Berries & Fruits",
    icon: "🫐",
    accent: "from-blue-500 to-indigo-600",
  },
  Honey: { label: "Honey", icon: "🍯", accent: "from-yellow-400 to-amber-500" },
  "Healthy Foods & Drinks": {
    label: "Healthy Delights",
    icon: "🌿",
    accent: "from-emerald-500 to-green-700",
  },
  Chocolates: {
    label: "Imported Chocolates",
    icon: "🍫",
    accent: "from-rose-700 to-red-900",
  },
  "Spices/Masala": {
    label: "Spices & Masala",
    icon: "🌶️",
    accent: "from-red-500 to-orange-700",
  },
  Seeds: { label: "Seeds", icon: "🌱", accent: "from-lime-500 to-green-600" },
  "Biscuits & Cookies": {
    label: "Biscuits & Cookies",
    icon: "🍪",
    accent: "from-orange-400 to-amber-600",
  },
  "Basmati Rice": { label: "Basmati Rice", icon: "🍚", accent: "from-stone-400 to-stone-600" },
  "Non Alocoholic wine": {
    label: "Non-Alcoholic Wine",
    icon: "🍷",
    accent: "from-fuchsia-600 to-purple-800",
  },
  chips: { label: "Chips & Snacks", icon: "🥔", accent: "from-yellow-500 to-orange-500" },
  Oils: { label: "Oils", icon: "🫒", accent: "from-green-500 to-emerald-700" },
  Other: { label: "Other Items", icon: "📦", accent: "from-slate-400 to-slate-600" },
};

/** Custom display order requested by the shop owner */
export const CATEGORY_ORDER = [
  "Dates",
  "Dry Fruits & Nuts",
  "Dry Fruits",
  "Berries & Dehydrated Fruits",
  "Honey",
  "Healthy Foods & Drinks",
  "Chocolates",
  "Spices/Masala",
  "Seeds",
  "Biscuits & Cookies",
  "Basmati Rice",
  "Non Alocoholic wine",
  "chips",
  "Oils",
  "Other",
];

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function getCategoryLabel(name: string): string {
  return CATEGORY_META[name]?.label ?? name;
}

export function getCategoryIcon(name: string): string {
  return CATEGORY_META[name]?.icon ?? "📦";
}

export function getCategoryAccent(name: string): string {
  return CATEGORY_META[name]?.accent ?? "from-brand-tan to-brand-orange";
}

export function getCategorySortIndex(category: string): number {
  const index = CATEGORY_ORDER.indexOf(category);
  return index === -1 ? CATEGORY_ORDER.length + 1 : index;
}

function sortByPriceLowToHigh(a: Item, b: Item): number {
  return a.price - b.price || a.name.localeCompare(b.name);
}

function sortByCategoryOrder(a: Item, b: Item): number {
  const orderDiff = getCategorySortIndex(a.category) - getCategorySortIndex(b.category);
  return orderDiff || sortByPriceLowToHigh(a, b);
}

function readItems(): Item[] {
  if (!fs.existsSync(DATA_PATH)) {
    return [];
  }
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Item[];
}

function writeItems(items: Item[]): void {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));
}

export function getCategories(): Category[] {
  const items = readItems().filter((i) => i.price > 0);
  const map = new Map<
    string,
    { category: string; count: number; min: number; max: number }
  >();

  for (const item of items) {
    const existing = map.get(item.category_slug);
    if (existing) {
      existing.count++;
      existing.min = Math.min(existing.min, item.price);
      existing.max = Math.max(existing.max, item.price);
    } else {
      map.set(item.category_slug, {
        category: item.category,
        count: 1,
        min: item.price,
        max: item.price,
      });
    }
  }

  return [...map.entries()]
    .map(([slug, { category, count, min, max }]) => ({
      name: getCategoryLabel(category),
      slug,
      item_count: count,
      icon: getCategoryIcon(category),
      accent: getCategoryAccent(category),
      sort_order: getCategorySortIndex(category),
      min_price: min,
      max_price: max,
    }))
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name));
}

export function getItemsByCategory(slug: string): Item[] {
  return readItems()
    .filter((i) => i.category_slug === slug && i.price > 0)
    .sort(sortByPriceLowToHigh);
}

export function getAllItems(): Item[] {
  return readItems().sort(sortByCategoryOrder);
}

export function updateItemPrice(id: number, price: number): boolean {
  const items = readItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return false;
  items[index].price = price;
  writeItems(items);
  return true;
}

export function getItemCount(): number {
  return readItems().filter((i) => i.price > 0).length;
}

export function saveAllItems(items: Item[]): void {
  writeItems(items);
}

export { CATEGORY_META };
