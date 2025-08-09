"use client";

type Props = {
  countdown: number;
  onSkip: () => void;
};

export default function IntroOverlay({ countdown, onSkip }: Props) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto bg-slate-900/80 border border-white/20 backdrop-blur-md rounded-2xl p-6 text-white shadow-2xl">
        <h2 className="text-xl font-bold mb-3 text-center">How to Play</h2>
        <ul className="text-white/80 space-y-2 text-sm mb-4">
          <li>• Type a word that starts with the last letter of the previous word</li>
          <li>• Do not repeat any used word</li>
          <li>• Each valid word gives you +1 point</li>
          <li>• Optional: turn on the Bot to play against</li>
        </ul>
        <div className="flex items-center justify-between">
          <span className="text-white/70 text-sm">Starting in {countdown}s…</span>
          <button
            onClick={onSkip}
            className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-sm"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}


