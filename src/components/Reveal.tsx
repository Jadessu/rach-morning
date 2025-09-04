import React, { useMemo, useState, useEffect } from "react";
import Card from "./Card";
import confetti from "canvas-confetti";
import { MOTIVATIONS } from "../data/motivation";
import { JOKES, type Joke } from "../data/jokes";
import { DRUSKI_VIDEOS } from "../data/druski";
import { msUntilMidnight, todayKey } from "../utils/date";
import { pickUniqueIndex, isExhausted, type Category } from "../utils/neverRepeat";

type Mode = "motivation" | "joke" | "druski";

const STORAGE_KEY = "daily-start-state-v1";

type SavedState = {
  name?: string;
  theme?: "violetPink" | "tealCyan";
  revealed: Record<
    string, // YYYY-MM-DD
    { motivation?: boolean; joke?: boolean; druski?: boolean }
  >;
};

// Safer watch->embed helper (returns "" if invalid)
function toEmbed(url?: string) {
  if (!url) return "";
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com") && u.searchParams.get("v")) {
      return `https://www.youtube.com/embed/${u.searchParams.get("v")}`;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube.com/embed${u.pathname}`;
    }
  } catch {}
  return "";
}

function loadState(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { revealed: {} };
}

function saveState(s: SavedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export default function Reveal({
  mode,
  name,
  onBothCleared,
}: {
  mode: Mode;
  name?: string;
  onBothCleared?: () => void;
}) {
  const [state, setState] = useState<SavedState>(() => loadState());
  const key = todayKey();
  const already = state.revealed[key]?.[mode] ?? false;

  // Single index for all modes
  const [chosen, setChosen] = useState<number | null>(null);

  // Load today's stored pick if already revealed (with bounds checks)
  useEffect(() => {
    if (!already) return;

    const stored = localStorage.getItem(`${mode}-today-${key}`);
    if (!stored) return;

    const max =
      mode === "motivation"
        ? MOTIVATIONS.length
        : mode === "joke"
        ? JOKES.length
        : DRUSKI_VIDEOS.length;

    let parsedNum: number | null = null;

    try {
      const parsed = JSON.parse(stored);
      if (typeof parsed === "number") parsedNum = parsed;
    } catch {
      const asNum = Number(stored);
      if (Number.isFinite(asNum)) parsedNum = asNum;
    }

    if (parsedNum == null || parsedNum < 0 || parsedNum >= max) {
      // Clear bad/legacy indices so we don't crash
      setChosen(null);
      localStorage.removeItem(`${mode}-today-${key}`);
    } else {
      setChosen(parsedNum);
    }
  }, [already, key, mode]);

  const content = useMemo(() => {
    if (chosen == null) {
      return {
        title:
          mode === "motivation"
            ? "Today's Motivation"
            : mode === "joke"
            ? "Today's Joke"
            : "Today's Druski Clip",
      } as const;
    }

    if (mode === "motivation") {
      const msg = MOTIVATIONS[chosen];
      if (!msg) return { title: "Today's Motivation" } as const;
      return { title: "Today's Motivation", motivation: msg } as const;
    }

    if (mode === "joke") {
      const j: Joke | undefined = JOKES[chosen];
      if (!j) return { title: "Today's Joke" } as const;
      return {
        title: j.tag === "neuro" ? "Neuro Joke" : "Med Joke",
        joke: `${j.setup}${j.punch ? " — " + j.punch : ""}`,
      } as const;
    }

    // druski (single clip)
    const link = DRUSKI_VIDEOS[chosen];
    if (!link) return { title: "Today's Druski Clip" } as const;
    return { title: "Today's Druski Clip", druski: link } as const;
  }, [chosen, mode]);

  const reveal = () => {
    let nextChosen: number | null = null;

    if (mode === "motivation") {
      if (!isExhausted(MOTIVATIONS.length, "motivation" as Category)) {
        const idx = pickUniqueIndex(
          MOTIVATIONS.length,
          "motivation" as Category,
          `${key}|motivation|${name ?? ""}`
        );
        nextChosen = idx >= 0 ? idx : null;
      }
    } else if (mode === "joke") {
      if (!isExhausted(JOKES.length, "joke" as Category)) {
        const idx = pickUniqueIndex(
          JOKES.length,
          "joke" as Category,
          `${key}|joke|${name ?? ""}`
        );
        nextChosen = idx >= 0 ? idx : null;
      }
    } else {
      // druski: one clip per day
      if (!isExhausted(DRUSKI_VIDEOS.length, "druski" as Category)) {
        const idx = pickUniqueIndex(
          DRUSKI_VIDEOS.length,
          "druski" as Category,
          `${key}|druski|${name ?? ""}`
        );
        nextChosen = idx >= 0 ? idx : null;
      }
    }

    setChosen(nextChosen);

    if (nextChosen == null) {
      localStorage.removeItem(`${mode}-today-${key}`);
    } else {
      localStorage.setItem(`${mode}-today-${key}`, JSON.stringify(nextChosen));
    }

    // Mark revealed for the day
    const next: SavedState = {
      ...state,
      revealed: {
        ...state.revealed,
        [key]: {
          motivation: state.revealed[key]?.motivation ?? false,
          joke: state.revealed[key]?.joke ?? false,
          druski: state.revealed[key]?.druski ?? false,
          [mode]: true,
        },
      },
    };
    setState(next);
    saveState(next);

    const both = next.revealed[key]?.motivation && next.revealed[key]?.joke;
    if (both) {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.7 } });
      onBothCleared?.();
    }
  };

  // Soft theme switch
  useEffect(() => {
    const theme = state.theme ?? "violetPink";
    if (theme === "tealCyan") {
      document.documentElement.style.setProperty("--tw-gradient-from", "#46de97");
      document.documentElement.style.setProperty("--tw-gradient-to", "#27c6c9");
    } else {
      document.documentElement.style.setProperty("--tw-gradient-from", "#8f7bff");
      document.documentElement.style.setProperty("--tw-gradient-to", "#ff7ab6");
    }
  }, [state.theme]);

  const timeLeftMs = msUntilMidnight();
  const hours = Math.floor(timeLeftMs / 3_600_000);
  const mins = Math.floor((timeLeftMs % 3_600_000) / 60_000);

  const druskiEmbed = (content as any).druski ? toEmbed((content as any).druski) : "";

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{content.title}</h3>
        <div className="text-xs text-muted">resets in {hours}h {mins}m</div>
      </div>

      <div className="text-base leading-relaxed">
        {already ? (
          <>
            {mode === "motivation" && (content as any).motivation && (
              <p className="opacity-90">{(content as any).motivation}</p>
            )}
            {mode === "joke" && (content as any).joke && (
              <p className="opacity-90">{(content as any).joke}</p>
            )}
            {mode === "druski" && druskiEmbed && (
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/50">
                <iframe
                  className="w-full h-full"
                  src={druskiEmbed}
                  title="Druski video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            )}
            {/* Exhausted / invalid fallback */}
            {((mode === "motivation" && !(content as any).motivation) ||
              (mode === "joke" && !(content as any).joke) ||
              (mode === "druski" && !druskiEmbed)) && (
              <p className="opacity-90">
                You’ve seen every {mode}! I’ll queue up more soon — love your consistency ✨
              </p>
            )}
          </>
        ) : (
          <p className="opacity-70">
            Tap reveal to see today’s {mode === "druski" ? "clip 🎬" : `${mode}.`}
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          className="btn btn-primary w-full"
          onClick={reveal}
          disabled={already}
        >
          {already
            ? "Revealed"
            : mode === "druski"
              ? "Reveal today’s Druski clip 🎬"
              : `Reveal today’s ${mode === "motivation" ? "motivation ✨" : "joke 😄"}`}
        </button>
      </div>

      {already && (
        <div className="text-xs text-muted">
          Come back tomorrow for a fresh {mode}.
        </div>
      )}
    </Card>
  );
}
