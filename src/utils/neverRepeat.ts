import { hashString } from "./hash";

const USED_KEY = "daily-used-v1";
export type Category = "motivation" | "joke" | "druski";
type UsedStore = Record<Category, number[]>;

function loadUsed(): UsedStore {
  try {
    const raw = localStorage.getItem(USED_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (
      parsed &&
      typeof parsed === "object" &&
      Array.isArray(parsed.motivation) &&
      Array.isArray(parsed.joke) &&
      Array.isArray(parsed.druski)
    ) {
      return parsed as UsedStore;
    }
  } catch {}
  return { motivation: [], joke: [], druski: [] };
}

function saveUsed(s: UsedStore) {
  localStorage.setItem(USED_KEY, JSON.stringify(s));
}

function gcd(a: number, b: number): number {
  while (b) [a, b] = [b, a % b];
  return Math.abs(a);
}

function sanitizeUsed(arr: number[], n: number) {
  return arr.filter((i) => Number.isInteger(i) && i >= 0 && i < n);
}

export function isExhausted(listLength: number, category: Category) {
  if (listLength <= 0) return true;
  const clean = sanitizeUsed(loadUsed()[category] ?? [], listLength);
  return clean.length >= listLength;
}

/** Return an unused index; -1 if exhausted. */
export function pickUniqueIndex(
  listLength: number,
  category: Category,
  seedString: string
): number {
  if (listLength <= 0) return -1;

  const store = loadUsed();
  // clean & persist if needed
  const clean = sanitizeUsed(store[category] ?? [], listLength);
  if (clean.length !== (store[category]?.length ?? 0)) {
    store[category] = clean;
    saveUsed(store);
  }
  if (clean.length >= listLength) return -1;

  const used = new Set(clean);

  const seed = Math.abs(hashString(seedString)) >>> 0;
  const start = listLength === 1 ? 0 : seed % listLength;

  // choose a stride that’s coprime to listLength so we visit every slot
  let step = listLength === 1 ? 1 : 1 + (seed % (listLength - 1));
  while (gcd(step, listLength) !== 1) {
    step = (step % (listLength - 1)) + 1; // cycle 1..(n-1)
  }

  for (let k = 0; k < listLength; k++) {
    const idx = (start + k * step) % listLength;
    if (!used.has(idx)) {
      store[category] = [...clean, idx];
      saveUsed(store);
      return idx;
    }
  }
  return -1; // should be unreachable unless list changed mid-loop
}
