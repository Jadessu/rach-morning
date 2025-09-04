import { hashString } from "./hash";

const USED_KEY = "daily-used-v1";
export type Category = "motivation" | "joke" | "druski"; // ⬅️ add druski
type UsedStore = Record<Category, number[]>;

function loadUsed(): UsedStore {
  try {
    const raw = localStorage.getItem(USED_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { motivation: [], joke: [], druski: [] }; // ⬅️ include druski
}

function saveUsed(s: UsedStore) {
  localStorage.setItem(USED_KEY, JSON.stringify(s));
}

export function isExhausted(listLength: number, category: Category) {
  const used = loadUsed()[category];
  return used.length >= listLength;
}

/** Return an unused index; -1 if exhausted. */
export function pickUniqueIndex(
  listLength: number,
  category: Category,
  seedString: string
): number {
  const store = loadUsed();
  const used = new Set(store[category]);
  if (used.size >= listLength) return -1;

  const seed = hashString(seedString);
  let start = seed % listLength;
  const step = 1 + (seed % Math.max(1, Math.min(7, Math.floor(listLength / 3))));

  for (let i = 0; i < listLength; i++) {
    const idx = (start + i * step) % listLength;
    if (!used.has(idx)) {
      store[category].push(idx);
      saveUsed(store);
      return idx;
    }
  }
  return -1;
}
