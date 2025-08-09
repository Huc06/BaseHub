"use client";

import { useMemo, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";

type Player = "X" | "O";
type Cell = Player | null;
type Coord = { r: number; c: number };

const BOARD_SIZE = 15;
const COLORS = {
  X: "#00E6FF", // neon cyan
  O: "#FFB020", // neon amber
};

export default function CaroPage() {
  const { context } = useMiniKit();

  const initialBoard = useMemo<Cell[][]>(
    () => Array.from({ length: BOARD_SIZE }, () => Array<Cell>(BOARD_SIZE).fill(null)),
    []
  );

  const [board, setBoard] = useState<Cell[][]>(initialBoard);
  const [current, setCurrent] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<Coord[] | null>(null);
  const [moves, setMoves] = useState<number>(0);
  const [moveHistory, setMoveHistory] = useState<Array<{ move: string; player: Player }>>([]);

  const isDraw = !winner && moves === BOARD_SIZE * BOARD_SIZE;

  const reset = () => {
    setBoard(initialBoard.map((row) => row.slice()));
    setCurrent("X");
    setWinner(null);
    setWinningLine(null);
    setMoves(0);
    setMoveHistory([]);
  };

  function inBounds(r: number, c: number) {
    return r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE;
  }

  function collectLine(r: number, c: number, dr: number, dc: number, player: Player): Coord[] {
    const out: Coord[] = [];
    let rr = r + dr;
    let cc = c + dc;
    while (inBounds(rr, cc) && board[rr][cc] === player) {
      out.push({ r: rr, c: cc });
      rr += dr;
      cc += dc;
    }
    return out;
  }

  function checkWin(r: number, c: number, player: Player): Coord[] | null {
    const dirs: [number, number][] = [
      [0, 1], // horizontal
      [1, 0], // vertical
      [1, 1], // diag ↘
      [1, -1], // diag ↙
    ];

    for (const [dr, dc] of dirs) {
      const forward = collectLine(r, c, dr, dc, player);
      const backward = collectLine(r, c, -dr, -dc, player);
      const line = [{ r, c }, ...forward, ...backward];
      if (line.length >= 5) return line;
    }
    return null;
  }

  function handleClick(r: number, c: number) {
    if (winner || board[r][c]) return;

    setBoard((prev) => {
      const next = prev.map((row) => row.slice());
      next[r][c] = current;
      return next;
    });

    const nextMoves = moves + 1;
    setMoves(nextMoves);

    const moveNotation = `${String.fromCharCode(65 + c)}${r + 1}`;
    setMoveHistory((prev) => [...prev, { move: moveNotation, player: current }]);

    const line = checkWin(r, c, current);
    if (line) {
      setWinner(current);
      setWinningLine(line);
      return;
    }

    setCurrent((p) => (p === "X" ? "O" : "X"));
  }

  return (
    <div className="caro-game-background min-h-screen">
      <div className="relative w-full h-full p-4">
        {/* Background neon corners */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(40% 40% at 5% 5%, rgba(0,230,255,0.12) 0%, rgba(0,0,0,0) 65%), radial-gradient(35% 35% at 100% 100%, rgba(255,176,32,0.12) 0%, rgba(0,0,0,0) 60%), linear-gradient(180deg, #0B1220 0%, #0B0F1A 100%)",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="text-white/80 hover:text-white transition-colors"
            >
              ← Back to Hub
            </Link>
            <h1 className="text-2xl font-bold text-white">Caro Game</h1>
          </div>
          <div className="text-white/60 text-sm">
            Player: {context?.user?.displayName || "Guest"}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Left: Players */}
          <div className="col-span-12 md:col-span-3 space-y-4">
            <PlayerCard label="Bạn" piece="X" active={current === "X" && !winner} />
            <PlayerCard label="Đối thủ" piece="O" active={current === "O" && !winner} />
          </div>

          {/* Center: Board */}
          <div className="col-span-12 md:col-span-6">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 relative">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="text-white/60 text-sm mb-1">ELO 1320</div>
                {winner ? (
                  <div className="inline-flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-slate-950"
                       style={{
                         background: "linear-gradient(90deg, #00E6FF 0%, #FFB020 100%)",
                         boxShadow: "0 0 24px rgba(0,230,255,.3)",
                       }}>
                    Victory
                  </div>
                ) : isDraw ? (
                  <div className="text-white/80 font-medium">Hòa</div>
                ) : (
                  <div className="text-white/80 font-medium">Đang chơi…</div>
                )}
              </div>

              {/* Board */}
              <div className="relative mx-auto w-fit">
                <div
                  className="p-1 rounded-xl"
                  style={{
                    background:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 24px), repeating-linear-gradient(90deg, rgba(255,255,255,0.08) 0 1px, transparent 1px 24px)",
                  }}
                >
                  <div
                    className="grid rounded-lg bg-black/40"
                    style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, 24px)` }}
                  >
                    {board.map((row, r) =>
                      row.map((cell, c) => {
                        const isWinCell = winningLine?.some((p) => p.r === r && p.c === c);
                        return (
                          <button
                            key={`${r}-${c}`}
                            onClick={() => handleClick(r, c)}
                            className={`w-6 h-6 flex items-center justify-center select-none transition-all duration-150 ${
                              !cell ? "hover:scale-110" : ""
                            } ${winner && !cell ? "cursor-not-allowed opacity-60" : ""} ${
                              isWinCell ? "ring-1 ring-amber-400/80" : ""
                            }`}
                            disabled={!!(winner || cell)}
                          >
                            {cell === "X" && <GamePiece player="X" size={18} />}
                            {cell === "O" && <GamePiece player="O" size={18} />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Victory overlay */}
                {winner && (
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      className="px-4 py-1.5 rounded-lg text-white text-sm border border-white/10 bg-black/40"
                      style={{ boxShadow: "0 0 24px rgba(255,176,32,.25)" }}
                    >
                      {winner === "X" ? "X thắng!" : "O thắng!"}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-3 mt-6">
                <button
                  onClick={reset}
                  className="px-4 py-2 rounded-lg font-medium bg-white text-slate-900 hover:bg-white/90 transition"
                >
                  Chơi mới
                </button>
                <button className="px-4 py-2 rounded-lg font-medium text-white/90 bg-white/10 hover:bg-white/15 border border-white/10 transition">
                  Đầu hàng
                </button>
              </div>
            </div>
          </div>

          {/* Right: Move history */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4 h-full">
              <h3 className="text-white font-semibold mb-3">Lịch sử nước đi</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {moveHistory.length === 0 && (
                  <div className="text-white/60 text-sm text-center py-8">Chưa có nước đi nào</div>
                )}
                {moveHistory.map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-white/50 w-6">{i + 1}.</span>
                      <GamePiece player={m.player} size={12} />
                      <span className="text-white/80">{m.move}</span>
                    </div>
                    <span className="text-white/40">{m.player}</span>
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

// UI Components
function PlayerCard({ label, piece, active }: { label: string; piece: Player; active?: boolean }) {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-white/10 rounded-full grid place-items-center">
          <span className="text-2xl">👤</span>
        </div>
        <div className="min-w-0">
          <h3 className="text-white font-semibold truncate">{label}</h3>
          <div className="flex items-center gap-2">
            <GamePiece player={piece} size={16} />
            <span className="text-white/60 text-xs">{active ? "Đến lượt" : ""}</span>
          </div>
        </div>
      </div>
      {active && (
        <div className="w-full h-1 bg-white/10 rounded">
          <div className="h-full rounded bg-white/60 animate-pulse" style={{ width: "60%" }} />
        </div>
      )}
    </div>
  );
}

function GamePiece({ player, size = 20 }: { player: Player; size?: number }) {
  const c = player === "X" ? COLORS.X : COLORS.O;
  const glow = `drop-shadow(0 0 4px ${c}) drop-shadow(0 0 10px ${c}) drop-shadow(0 0 18px ${c})`;

  if (player === "X") {
    const s = size;
    return (
      <svg
        width={s}
        height={s}
        viewBox="0 0 100 100"
        style={{ filter: glow }}
        aria-hidden
      >
        <path
          d="M20 20 L80 80 M80 20 L20 80"
          stroke={c}
          strokeWidth={26}
          strokeLinecap="round"
        />
        <path
          d="M20 20 L80 80 M80 20 L20 80"
          stroke={c}
          strokeWidth={14}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  const s = size;
  return (
    <svg width={s} height={s} viewBox="0 0 100 100" style={{ filter: glow }} aria-hidden>
      <circle cx="50" cy="50" r="32" fill="none" stroke={c} strokeWidth={12} />
    </svg>
  );
}
