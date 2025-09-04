import React, { useState } from "react";
import Brand from "./components/Brand";
import Tabs from "./components/Tabs";
import Reveal from "./components/Reveal";
import Settings from "./components/Settings";
import Card from "./components/Card";

export default function App() {
  const [tab, setTab] = useState<"motivation" | "joke" | "druski">("motivation"); // ⬅️ add "druski"
  const [name, setName] = useState<string | undefined>(undefined);
  const [celebrate, setCelebrate] = useState(false);

  return (
    <div className="max-w-screen-sm mx-auto px-4 py-5 sm:py-8">
      {/* Header */}
      <div className="mb-4">
        <Brand name={name} />
      </div>

      {/* Hero */}
      <Card className="mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              Let whatever you do today be enough.
            </h1>
            <p className="text-sm text-muted mt-1">
              Pick <span className="opacity-90 font-medium">Motivation</span> or{" "}
              <span className="opacity-90 font-medium">Joke</span> once per day.
              It refreshes at midnight.
            </p>
          </div>
          {/* <a
            className="btn btn-primary"
            href="javascript:void(0)"
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
          >
            Personalize
          </a> */}
        </div>
      </Card>

      {/* Tabs */}
      <div className="mb-3">
        <Tabs active={tab} onChange={setTab} />
      </div>

      {/* Reveal panel */}
      <div className="space-y-3">
        <Reveal mode={tab} name={name} onBothCleared={() => setCelebrate(true)} />
        
      </div>

      {/* Extras */}
      <div className="mt-6 grid gap-3">
        <Card>
          <div className="text-sm text-muted">
            Tip: Add to Home Screen for one-tap access.
          </div>
        </Card>

        <div id="settings">
          <Settings onChange={setName} />
        </div>
      </div>

      {/* Footer */}
      <div className="py-8 text-center text-xs text-muted">
        Built with ❤️ — you’re doing amazing.
      </div>
    </div>
  );
}
