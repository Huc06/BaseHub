"use client";
import type { Player, Cell, Coord } from "../types";
import GamePiece from "@/app/caro/components/game/GamePiece";

type Props = {
  board: Cell[][];
  winner: Player | null;
  winningLine: Coord[] | null;
  onClickCell: (r: number, c: number) => void;
  size: number; // 300 for mobile, 480 for desktop
};

export default function Board({ board, winner, winningLine, onClickCell, size }: Props) {
  const isWin = (r: number, c: number) => winningLine?.some((p) => p.r === r && p.c === c);
  const cellSize = size === 300 ? 20 : 30; // approximate for mobile/desktop

  return (
    <div className="bg-slate-800/60 rounded-xl p-1 md:rounded-2xl md:p-4 border border-slate-700/50">
      <div
        className="grid rounded-lg md:rounded-xl overflow-hidden"
        style={{ gridTemplateColumns: `repeat(${board.length}, 1fr)`, gap: "1px", width: `${size}px`, height: `${size}px` }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => (
            <button
              key={`${r}-${c}`}
              onClick={() => onClickCell(r, c)}
              className={`relative flex items-center justify-center bg-slate-700/40 ${size === 300 ? "active:bg-slate-600/70" : "hover:bg-slate-600/60 border border-slate-600/30"} transition-all duration-150 ${!cell && !winner ? (size === 300 ? "active:scale-95" : "hover:scale-[1.02] hover:shadow-lg hover:border-cyan-400/40") : ""} ${winner && !cell ? "cursor-not-allowed opacity-50" : ""} ${isWin(r, c) ? "bg-gradient-to-br from-cyan-400/40 to-amber-400/40" : ""}`}
              disabled={!!(winner || cell)}
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            >
              {cell === "X" && <GamePiece player="X" size={size === 300 ? 14 : 22} />}
              {cell === "O" && <GamePiece player="O" size={size === 300 ? 14 : 22} />}
            </button>
          ))
        )}
      </div>
    </div>
  );
}


