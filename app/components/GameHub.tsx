"use client";

import Link from "next/link";

export default function GameHub() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-[var(--app-foreground)] mb-2">Game Hub</h1>
        <p className="text-[var(--app-foreground-muted)]">Chọn game bạn muốn chơi</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Caro Game */}
        <Link href="/caro" className="group">
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-xl p-6 hover:border-[var(--app-accent)] transition-all duration-200 group-hover:scale-[1.02]">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--app-foreground)] mb-2">Caro Game</h3>
              <p className="text-[var(--app-foreground-muted)] text-sm mb-4">
                Đặt 5 quân liên tiếp theo hàng ngang, dọc hoặc chéo để thắng
              </p>
              <div className="flex items-center gap-2 text-xs text-[var(--app-foreground-muted)]">
                <span className="bg-[var(--app-gray)] px-2 py-1 rounded">2 Player</span>
                <span className="bg-[var(--app-gray)] px-2 py-1 rounded">Strategy</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--app-accent)] font-medium">Play Now →</span>
              <div className="w-8 h-8 bg-[var(--app-accent)] rounded-lg flex items-center justify-center group-hover:bg-[var(--app-accent-hover)] transition-colors">
                <span className="text-white text-sm">▶</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Word Chain Game */}
        <Link href="/word-chain" className="group">
          <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-xl p-6 hover:border-[var(--app-accent)] transition-all duration-200 group-hover:scale-[1.02]">
            <div className="mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <span className="text-2xl">🔤</span>
              </div>
              <h3 className="text-xl font-bold text-[var(--app-foreground)] mb-2">Nối từ</h3>
              <p className="text-[var(--app-foreground-muted)] text-sm mb-4">
                Nhập từ bắt đầu bằng chữ cái cuối của từ trước đó
              </p>
              <div className="flex items-center gap-2 text-xs text-[var(--app-foreground-muted)]">
                <span className="bg-[var(--app-gray)] px-2 py-1 rounded">Solo</span>
                <span className="bg-[var(--app-gray)] px-2 py-1 rounded">Word Game</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[var(--app-accent)] font-medium">Play Now →</span>
              <div className="w-8 h-8 bg-[var(--app-accent)] rounded-lg flex items-center justify-center group-hover:bg-[var(--app-accent-hover)] transition-colors">
                <span className="text-white text-sm">▶</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4 mt-8">
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--app-accent)]">2</div>
          <div className="text-sm text-[var(--app-foreground-muted)]">Games Available</div>
        </div>
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--app-accent)]">∞</div>
          <div className="text-sm text-[var(--app-foreground-muted)]">Play Sessions</div>
        </div>
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-[var(--app-accent)]">🎮</div>
          <div className="text-sm text-[var(--app-foreground-muted)]">Fun Guaranteed</div>
        </div>
      </div>
    </div>
  );
} 