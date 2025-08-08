"use client";

type GameKey = "caro" | "word";

export default function GameHub(props: { onSelect: (game: GameKey) => void }) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold mb-1">Game Hub</h2>
      <div className="grid grid-cols-1 gap-3">
        {/* Caro */}
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-base font-medium">Caro 2 người</p>
            <p className="text-sm text-[var(--app-foreground-muted)]">Đặt 5 quân liên tiếp để thắng</p>
          </div>
          <button
            onClick={() => props.onSelect("caro")}
            className="text-xs px-3 py-1.5 rounded-md bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white"
          >
            Chơi
          </button>
        </div>
        {/* Word Chain */}
        <div className="bg-[var(--app-card-bg)] border border-[var(--app-card-border)] rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-base font-medium">Nối từ</p>
            <p className="text-sm text-[var(--app-foreground-muted)]">Nhập từ bắt đầu bằng chữ cuối</p>
          </div>
          <button
            onClick={() => props.onSelect("word")}
            className="text-xs px-3 py-1.5 rounded-md bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-white"
          >
            Chơi
          </button>
        </div>
      </div>
    </div>
  );
} 