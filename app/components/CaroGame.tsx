"use client";

import { useMemo, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

type Player = "X" | "O";
type Cell = Player | null;
type Coord = { r: number; c: number };

const BOARD_SIZE = 15;

export default function CaroGame() {
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

  const isDraw = !winner && moves === BOARD_SIZE * BOARD_SIZE;

  const reset = () => {
    setBoard(initialBoard.map((row) => row.slice()));
    setCurrent("X");
    setWinner(null);
    setWinningLine(null);
    setMoves(0);
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
      [0, 1], // ngang
      [1, 0], // dọc
      [1, 1], // chéo xuống phải
      [1, -1], // chéo xuống trái
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

    const line = checkWin(r, c, current);
    if (line) {
      setWinner(current);
      setWinningLine(line);
      return;
    }

    setCurrent((p) => (p === "X" ? "O" : "X"));
  }

  return (
    <div className="space-y-4">
      <div className="bg-[var(--app-card-bg)] p-4 rounded-lg border border-[var(--app-card-border)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Caro 2 người</h2>
          <button
            onClick={reset}
            className="text-xs px-3 py-1 rounded-md bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)]"
          >
            Chơi lại
          </button>
        </div>
        <div className="text-sm text-[var(--app-foreground-muted)]">
          {context?.user?.displayName ? `Người chơi: ${context.user.displayName}` : "Chế độ cục bộ"}
        </div>

        <div className="mt-2 flex items-center justify-between text-sm">
          <div>
            {winner ? (
              <span>
                Kết quả: <span className="font-semibold">{winner} thắng</span>
              </span>
            ) : isDraw ? (
              <span className="font-semibold">Hòa!</span>
            ) : (
              <span>
                Lượt: <span className="font-semibold">{current}</span>
              </span>
            )}
          </div>
          <div className="text-[var(--app-foreground-muted)]">Nước đi: {moves}</div>
        </div>
      </div>

      <div className="bg-[var(--app-card-bg)] p-2 rounded-lg border border-[var(--app-card-border)]">
        <div
          className="grid gap-[1px]"
          style={{ gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))` }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isWinCell = winningLine?.some((p) => p.r === r && p.c === c);
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => handleClick(r, c)}
                  className={`aspect-square flex items-center justify-center text-base md:text-lg font-semibold select-none
                    bg-[var(--app-background)] hover:bg-[var(--app-gray)]
                    ${cell === "X" ? "text-[var(--app-accent)]" : cell === "O" ? "text-[var(--app-foreground)]" : "text-[var(--app-foreground-muted)]"}
                    ${isWinCell ? "ring-2 ring-[var(--app-accent)]" : ""}
                  `}
                >
                  {cell ?? ""}
                </button>
              );
            })
          )}
        </div>
      </div>

      <p className="text-center text-xs text-[var(--app-foreground-muted)]">
        Mục tiêu: 5 quân liên tiếp ngang/dọc/chéo. Hai người chơi lần lượt X và O trên cùng thiết bị.
      </p>
    </div>
  );
} 