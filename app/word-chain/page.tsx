"use client";

import { useEffect, useMemo, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import IntroOverlay from "./components/IntroOverlay";
import StatsCard from "./components/StatsCard";
import InputControls from "./components/InputControls";
import WordHistory from "./components/WordHistory";
import type { PlayedWord } from "./types";

// (type imported from ./types)

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

  // Lightweight dictionary (can be replaced by server/API later)
  // API validation flags
  const [isValidating, setIsValidating] = useState<boolean>(false);

  const [currentWord, setCurrentWord] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [history, setHistory] = useState<PlayedWord[]>([]);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string>("");

  // Extensions: bot, turns, timer, winner
  const [isBotEnabled, setIsBotEnabled] = useState<boolean>(false);
  const [isUserTurn, setIsUserTurn] = useState<boolean>(true);
  const TURN_LIMIT_SECONDS = 12;
  const [timeLeft, setTimeLeft] = useState<number>(TURN_LIMIT_SECONDS);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [winner, setWinner] = useState<"You" | "Bot" | null>(null);
  const [showRules, setShowRules] = useState<boolean>(true);
  const [rulesCountdown, setRulesCountdown] = useState<number>(10);
  const botActive = isBotEnabled && !showRules;

  useEffect(() => {
    const initial = seedWords[Math.floor(Math.random() * seedWords.length)];
    setCurrentWord(initial);
    setHistory([{ word: initial, byUser: false }]);
    setUsed(new Set([normalize(initial)]));
    setScore(0);
    setIsUserTurn(true);
    setTimeLeft(TURN_LIMIT_SECONDS);
    setGameOver(false);
    setWinner(null);
    setShowRules(true);
    setRulesCountdown(10);
  }, [seedWords]);

  // Countdown to hide rules
  useEffect(() => {
    if (!showRules) return;
    const t = setInterval(() => {
      setRulesCountdown((s) => {
        if (s <= 1) {
          clearInterval(t);
          setShowRules(false);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [showRules]);

  const lastChar = useMemo(() => {
    if (!currentWord) return "";
    const n = normalize(currentWord);
    return n[n.length - 1] ?? "";
  }, [currentWord]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (gameOver) return;
    if (showRules) return; // pause during intro rules
    if (!isUserTurn && isBotEnabled) return; // wait for bot
    const candidate = input.trim();
    if (!candidate) return;

    const normCandidate = normalize(candidate);
    if (used.has(normCandidate)) {
      setError("Word already used");
      return;
    }

    if (normalize(candidate)[0] !== lastChar) {
      setError(`Word must start with '${lastChar.toUpperCase()}'`);
      return;
    }

    // Dictionary check via API proxy
    try {
      setIsValidating(true);
      const resp = await fetch(`/api/dictionary?word=${encodeURIComponent(candidate)}`);
      const json = await resp.json();
      if (!json?.valid) {
        setError("Word not found in dictionary");
        setIsValidating(false);
        return;
      }
    } catch {
      setError("Dictionary lookup failed");
      setIsValidating(false);
      return;
    } finally {
      setIsValidating(false);
    }

    setHistory((prev) => [...prev, { word: candidate, byUser: true }]);
    setUsed((prev) => new Set(prev).add(normCandidate));
    setScore((s) => s + 1);
    setCurrentWord(candidate);
    setInput("");
    setIsUserTurn(false);
    setTimeLeft(TURN_LIMIT_SECONDS);
  };

  const resetGame = () => {
    const initial = seedWords[Math.floor(Math.random() * seedWords.length)];
    setCurrentWord(initial);
    setHistory([{ word: initial, byUser: false }]);
    setUsed(new Set([normalize(initial)]));
    setScore(0);
    setInput("");
    setError("");
    setIsUserTurn(true);
    setTimeLeft(TURN_LIMIT_SECONDS);
    setGameOver(false);
    setWinner(null);
  };

  // Turn timer
  useEffect(() => {
    if (gameOver || showRules) return; // pause while rules visible
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timer);
          setGameOver(true);
          setWinner(isUserTurn ? "Bot" : "You");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isUserTurn, gameOver, showRules]);

  // Bot move when enabled and it's bot's turn — uses our proxy for candidate list
  useEffect(() => {
    if (!botActive || isUserTurn || gameOver) return;
    const think = setTimeout(async () => {
      const needed = lastChar; // last char of currentWord
      try {
        const resp = await fetch(`/api/dictionary?start=${encodeURIComponent(needed)}&max=120`);
        const json: { words?: Array<{ word: string; freq?: number }> } = await resp.json();
        const candidates = (json.words || [])
          .map((it) => ({ word: normalize(it.word), freq: it.freq || 0 }))
          .filter((w) => w.word[0] === needed && !used.has(w.word))
          // Prefer more common words to feel natural
          .sort((a, b) => (b.freq - a.freq))
          .slice(0, 40)
          .map((w) => w.word);
        if (candidates.length === 0) {
          setGameOver(true);
          setWinner("You");
          return;
        }
        const botWord = candidates[Math.floor(Math.random() * candidates.length)];
        setHistory((prev) => [...prev, { word: botWord, byUser: false }]);
        setUsed((prev) => new Set(prev).add(normalize(botWord)));
        setCurrentWord(botWord);
        setIsUserTurn(true);
        setTimeLeft(TURN_LIMIT_SECONDS);
      } catch {
        // If API fails, concede to player
        setGameOver(true);
        setWinner("You");
      }
    }, 700);
    return () => clearTimeout(think);
  }, [botActive, isUserTurn, lastChar, used, gameOver]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] to-[#0B0F1A]" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(40% 40% at 5% 5%, rgba(0,230,255,0.12) 0%, rgba(0,0,0,0) 65%), radial-gradient(35% 35% at 100% 100%, rgba(255,176,32,0.12) 0%, rgba(0,0,0,0) 60%)",
        }}
      />
      {/* Intro Rules Overlay */}
      {showRules && (<IntroOverlay countdown={rulesCountdown} onSkip={() => setShowRules(false)} />)}
      <div className="container relative z-10 mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              ← Back to Hub
            </Link>
            <h1 className="text-3xl font-bold text-white">Word Chain</h1>
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
                  🔄 Reset
                </button>
              </div>
              
              <StatsCard
                currentWord={currentWord}
                score={score}
                lastChar={lastChar}
                isUserTurnLabel={isBotEnabled ? (isUserTurn ? 'Your turn' : 'Bot thinking…') : 'Your turn'}
                timeLeft={timeLeft}
              />
              <InputControls
                value={input}
                onChange={(v) => setInput(v)}
                placeholder={`Type a word starting with '${lastChar?.toUpperCase()}'`}
                onSubmit={handleSubmit}
                isValidating={isValidating}
                botEnabled={isBotEnabled}
                toggleBot={() => setIsBotEnabled((v) => !v)}
              />
              {error && (<div className="mt-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>)}
              {gameOver && (<div className="mt-2 text-center text-sm text-white/80 bg-white/10 border border-white/20 rounded-lg p-3">Game over — Winner: <span className="font-semibold">{winner ?? '—'}</span></div>)}
            </div>
          </div>

          {/* Word History */}
          <div className="lg:col-span-1"><WordHistory history={history} /></div>
        </div>
      </div>
    </div>
  );
}
