"use client";

import { useEffect, useMemo, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";

type PlayedWord = {
  word: string;
  byUser: boolean;
};

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export default function WordChainPage() {
  const { context } = useMiniKit();
  const seedWords = useMemo(
    () => ["base", "onchain", "wallet", "token", "alpha", "mini", "frame", "cast", "voting", "chain"],
    []
  );

  const [currentWord, setCurrentWord] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<PlayedWord[]>([]);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const initial = seedWords[Math.floor(Math.random() * seedWords.length)];
    setCurrentWord(initial);
    setHistory([{ word: initial, byUser: false }]);
    setUsed(new Set([normalize(initial)]));
    setScore(0);
  }, [seedWords]);

  const lastChar = useMemo(() => {
    if (!currentWord) return "";
    const n = normalize(currentWord);
    return n[n.length - 1] ?? "";
  }, [currentWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const candidate = input.trim();
    if (!candidate) return;

    const normCandidate = normalize(candidate);
    if (used.has(normCandidate)) {
      setError("Từ đã được dùng rồi");
      return;
    }

    if (normalize(candidate)[0] !== lastChar) {
      setError(`Từ phải bắt đầu bằng chữ '${lastChar.toUpperCase()}'`);
      return;
    }

    setHistory((prev) => [...prev, { word: candidate, byUser: true }]);
    setUsed((prev) => new Set(prev).add(normCandidate));
    setScore((s) => s + 1);
    setCurrentWord(candidate);
    setInput("");
  };

  const resetGame = () => {
    const initial = seedWords[Math.floor(Math.random() * seedWords.length)];
    setCurrentWord(initial);
    setHistory([{ word: initial, byUser: false }]);
    setUsed(new Set([normalize(initial)]));
    setScore(0);
    setInput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              ← Back to Hub
            </Link>
            <h1 className="text-3xl font-bold text-white">Trò chơi nối từ</h1>
          </div>
          <div className="text-white/60 text-sm">
            Player: {context?.user?.displayName || context?.user?.username || "Guest"}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Game Info */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-white">Game Stats</h2>
                <button
                  onClick={resetGame}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
                >
                  🔄 Chơi lại
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Từ hiện tại</div>
                  <div className="text-white text-xl font-bold">{currentWord}</div>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <div className="text-white/60 text-sm">Điểm số</div>
                  <div className="text-white text-xl font-bold">{score}</div>
                </div>
              </div>

              {lastChar && (
                <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg">
                  <div className="text-white/80 text-sm mb-1">Chữ cái tiếp theo:</div>
                  <div className="text-white text-2xl font-bold">{lastChar.toUpperCase()}</div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={`Nhập từ bắt đầu bằng '${lastChar?.toUpperCase()}'`}
                    className="flex-1 px-4 py-3 rounded-lg border border-white/20 bg-white/10 text-white placeholder-white/50 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium transition-all"
                  >
                    Gửi
                  </button>
                </div>
                {error && (
                  <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    {error}
                  </div>
                )}
              </form>
            </div>

            {/* Game Rules */}
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Luật chơi</h3>
              <ul className="text-white/80 space-y-2 text-sm">
                <li>• Nhập từ bắt đầu bằng chữ cái cuối của từ trước đó</li>
                <li>• Không được lặp lại từ đã sử dụng</li>
                <li>• Mỗi từ hợp lệ sẽ được +1 điểm</li>
                <li>• Hãy cố gắng đạt điểm cao nhất có thể!</li>
              </ul>
            </div>
          </div>

          {/* Word History */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 h-full">
              <h3 className="text-lg font-semibold text-white mb-4">Lịch sử từ</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                {history.length === 0 && (
                  <div className="text-white/60 text-center py-8">Chưa có từ nào</div>
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
                      h.byUser 
                        ? 'bg-purple-500/30 text-purple-200' 
                        : 'bg-white/10 text-white/60'
                    }`}>
                      {h.byUser ? "Bạn" : "Bot"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
