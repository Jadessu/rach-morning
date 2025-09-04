import clsx from "clsx";

type TabKey = "motivation" | "joke" | "druski"; // ⬅️ add druski

export default function Tabs({
  active,
  onChange,
}: {
  active: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const tabs: { key: TabKey; label: string; emoji: string }[] = [
    { key: "motivation", label: "Motivation", emoji: "✨" },
    { key: "joke", label: "Joke", emoji: "😄" },
    { key: "druski", label: "Druski", emoji: "🎬" }, // ⬅️ new tab
  ];

  return (
    <div className="grid grid-cols-3 gap-2">{/* ⬅️ 2 -> 3 */}
      {tabs.map((t) => (
        <button
          key={t.key}
          className={clsx(
            "btn py-3 rounded-2xl",
            active === t.key ? "btn-primary" : "bg-white/5"
          )}
          onClick={() => onChange(t.key)}
        >
          <span className="text-lg">{t.emoji}</span>
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
