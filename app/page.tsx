"use client";

import { useEffect } from "react";
import { useMiniKit, useAddFrame } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import Image from "next/image";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const addFrame = useAddFrame();

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

  const games = [
    {
      id: 'caro',
      title: 'Caro',
      subtitle: 'Five in a row',
      description: 'Classic 5-in-a-row',
      image: '/images/Caro.png',
      icon: '🎯',
      href: '/caro'
    },
    {
      id: 'word',
      title: 'Word Chain',
      subtitle: 'Vocabulary challenge',
      description: 'Connect words creatively',
      gradient: 'from-purple-400/40 to-pink-400/40',
      image: '/images/Word.png',
      icon: '🔤',
      href: '/word-chain'
    }
  ];

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
      {/* Mobile Gaming Header */}
      <div className="relative z-10">
        {/* Status Bar & Header */}
        <div className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-700/50 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white drop-shadow">🎮</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">BaseHub</h1>
                <p className="text-white/70 text-xs">Gaming Platform</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="w-8 h-8 bg-slate-800/60 border border-slate-700/60 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              {!context?.client?.added && (
                <button
                  onClick={handleAddFrame}
                  className="px-3 py-1 bg-slate-800/60 border border-slate-700/60 rounded-lg text-xs text-white"
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Games Grid (2 items) */}
        <div className="p-4">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(148px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {games.map((game) => (
              <Link key={game.id} href={game.href}>
                <div
                  className={`${game.image ? 'relative aspect-square rounded-3xl overflow-hidden shadow-xl active:scale-95 transition-transform' : 'relative aspect-square rounded-3xl p-4 bg-slate-800/60 border border-slate-700/60 backdrop-blur-md shadow-xl active:scale-95 transition-transform overflow-hidden'}`}
                >
                  {game.image ? (
                    <>
                      <Image src={game.image} alt={game.title} fill className="object-cover" priority />
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                        <div className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur-sm text-white text-xs font-semibold">
                          {game.title}
                        </div>
                        <div className="px-2 py-1 rounded-lg bg-white/20 text-white text-[11px] font-medium">
                          Play
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl" />
                        <div className="absolute bottom-0 left-0 w-20 h-20 bg-amber-400/20 rounded-full blur-xl" />
                      </div>
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        <span className="text-3xl drop-shadow">{game.icon}</span>
                        <div>
                          <h3 className="text-white font-bold text-lg">{game.title}</h3>
                          <p className="text-white/70 text-xs">{game.subtitle}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
