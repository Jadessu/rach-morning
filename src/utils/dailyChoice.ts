// src/utils/dailyChoice.ts
type Category = "motivation" | "joke";
const CHOICE_KEY = "daily-choice-v1";

type ChoiceStore = { [date: string]: Partial<Record<Category, number>> };

export function loadChoice(): ChoiceStore {
  try {
    const raw = localStorage.getItem(CHOICE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function saveChoice(c: ChoiceStore) {
  localStorage.setItem(CHOICE_KEY, JSON.stringify(c));
}

export function getChoice(date: string, category: Category) {
  return loadChoice()[date]?.[category];
}

export function setChoice(date: string, category: Category, index: number) {
  const c = loadChoice();
  c[date] = { ...(c[date] || {}), [category]: index };
  saveChoice(c);
}
