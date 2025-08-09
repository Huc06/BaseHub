"use client";

type Props = {
  currentWord: string;
  score: number;
  lastChar: string;
  isUserTurnLabel: string;
  timeLeft: number;
};

export default function StatsCard({ currentWord, score, lastChar, isUserTurnLabel, timeLeft }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm">Current word</div>
          <div className="text-white text-xl font-bold">{currentWord}</div>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <div className="text-white/60 text-sm">Score</div>
          <div className="text-white text-xl font-bold">{score}</div>
        </div>
      </div>
      {lastChar && (
        <div className="mb-2 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
          <div className="text-white/80 text-sm mb-1">Next letter:</div>
          <div className="text-white text-2xl font-bold flex items-center gap-3">
            {lastChar.toUpperCase()}
            <span className="text-xs text-white/70">{isUserTurnLabel}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-white/10 border border-white/20">{timeLeft}s</span>
          </div>
        </div>
      )}
    </div>
  );
}


