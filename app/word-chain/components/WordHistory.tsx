"use client";
import { PlayedWord } from "../types";

type Props = {
  history: PlayedWord[];
};

export default function WordHistory({ history }: Props) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 h-full">
      <h3 className="text-lg font-semibold text-white mb-4">Word History</h3>
      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
        {history.length === 0 && (
          <div className="text-white/60 text-center py-8">No words yet</div>
        )}
        {history.map((h, idx) => (
          <div
            key={`${h.word}-${idx}`}
            className={`flex items-center justify-between p-3 rounded-lg ${
              h.byUser ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm w-6">{idx + 1}.</span>
              <span className="text-white font-medium">{h.word}</span>
            </div>
            <span className={`text-xs px-2 py-1 rounded ${
              h.byUser ? 'bg-purple-500/30 text-purple-200' : 'bg-white/10 text-white/60'
            }`}>
              {h.byUser ? 'You' : 'Bot'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}


