"use client";

import { useEffect, useMemo, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

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

export default function WordChainGame() {
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
    <div className="space-y-4">
      <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Trò chơi nối từ</h2>
          <button
            onClick={resetGame}
            className="text-xs px-3 py-1 rounded-md bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)]"
          >
            Chơi lại
          </button>
        </div>
        <p className="text-sm text-[var(--app-foreground-muted)]">
          Người chơi: {context?.user?.displayName || context?.user?.username || "Khách"}
        </p>
        <p className="mt-2">
          Từ hiện tại: <span className="font-semibold">{currentWord}</span>
          {lastChar && (
            <span className="text-[var(--app-foreground-muted)] text-sm ml-2">(Chữ bắt đầu tiếp theo: {lastChar.toUpperCase()})</span>
          )}
        </p>
        <p className="mt-1">Điểm: <span className="font-semibold">{score}</span></p>
        <form onSubmit={handleSubmit} className="mt-3 flex items-center space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Nhập từ bắt đầu bằng '${lastChar?.toUpperCase()}'`}
            className="flex-1 px-3 py-2 rounded-md border border-[var(--app-card-border)] bg-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white"
          >
            Gửi
          </button>
        </form>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
      </div>

      <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
        <h3 className="font-semibold mb-2">Lịch sử</h3>
        <ul className="space-y-1 text-sm">
          {history.map((h, idx) => (
            <li key={`${h.word}-${idx}`} className="flex items-center justify-between">
              <span className={h.byUser ? "" : "text-[var(--app-foreground-muted)]"}>{h.word}</span>
              <span className="text-[var(--app-foreground-muted)]">{h.byUser ? "Bạn" : "Bot"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 