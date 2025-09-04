import React from "react";
import Card from "./Card";

export default function Settings() {
  return (
    <Card className="space-y-3">
      <h3 className="text-lg font-semibold">A Note For You</h3>

      <div
        className="
          relative rounded-xl border border-white/10 bg-white/5
          p-4 leading-relaxed text-sm md:text-base
          max-h-52 overflow-y-auto
        "
      >
        <div className="whitespace-pre-line">
{`Hey love, if you ever just need someone to remind you how extraordinary you are, someone to tell you they’re proud of you and that you’re capable of absolutely anything... I’m only a phone call, or a few miles away.

I miss you, and I just want you to know… no matter what, you’ll never have to face anything alone.

I hope this brings you a bit of peace and reminds you that you are truly seen.`}
        </div>

        {/* subtle fade effect to show scrollability */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-[rgba(0,0,0,0.25)] to-transparent rounded-t-xl" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[rgba(0,0,0,0.25)] to-transparent rounded-b-xl" />
      </div>
    </Card>
  );
}
