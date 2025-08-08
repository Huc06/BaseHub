"use client";

import { useEffect, useState } from "react";
import { useMiniKit, useAddFrame } from "@coinbase/onchainkit/minikit";
import CaroGame from "./components/CaroGame";
import WordChainGame from "./components/WordChainGame";
import GameHub from "./components/GameHub";

type GameKey = "hub" | "caro" | "word";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const addFrame = useAddFrame();
  const [active, setActive] = useState<GameKey>("hub");

  useEffect(() => {
    if (!isFrameReady) setFrameReady();
  }, [isFrameReady, setFrameReady]);

  const handleAddFrame = async () => {
    try {
      await addFrame();
    } catch {
      // no-op
    }
  };

  return (
    <div className="flex flex-col min-h-screen font-sans text-[var(--app-foreground)] mini-app-theme from-[var(--app-background)] to-[var(--app-gray)]">
      <div className="w-full max-w-md mx-auto px-4 py-3">
        <header className="flex items-center justify-between h-11 mb-3">
          <h1 className="text-base font-semibold">
            {active === "hub" ? "Game Hub" : active === "caro" ? "Caro" : "Nối từ"}
          </h1>
          <div className="flex items-center gap-2">
            {active !== "hub" && (
              <button
                onClick={() => setActive("hub")}
                className="text-xs px-3 py-1.5 rounded-md border border-[var(--app-card-border)] hover:bg-[var(--app-gray)]"
              >
                Hub
              </button>
            )}
            {!context?.client?.added && (
              <button
                onClick={handleAddFrame}
                className="text-xs px-3 py-1.5 rounded-md border border-[var(--app-accent)] text-[var(--app-accent)] hover:bg-[var(--app-accent-light)]"
              >
                Save Frame
              </button>
            )}
          </div>
        </header>

        <main className="flex-1">
          {active === "hub" && <GameHub onSelect={(g) => setActive(g)} />}
          {active === "caro" && <CaroGame />}
          {active === "word" && <WordChainGame />}
        </main>

        <footer className="mt-2 pt-2 pb-1 text-center">
          <p className="text-[var(--app-foreground-muted)] text-[11px]">
            Built for Farcaster • Base Sepolia
          </p>
        </footer>
      </div>
    </div>
  );
}
