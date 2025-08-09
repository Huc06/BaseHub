"use client";
import GamePiece from "@/app/caro/components/game/GamePiece";
import type { Player } from "../types";

type Props = { label: string; piece: Player; active?: boolean; mobile?: boolean };

export default function PlayerCard({ label, piece, active, mobile }: Props) {
  const isX = piece === "X";
  const playerColor = isX ? "#00E6FF" : "#FFB020";

  if (mobile) {
    return (
      <div
        className={`bg-slate-900/80 backdrop-blur-lg rounded-xl border p-3 shadow-xl transition-all duration-300 ${
          active ? "border-cyan-400/50 ring-1 ring-cyan-400/20 bg-slate-900/90" : "border-slate-700/40"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: active ? `linear-gradient(135deg, ${playerColor}20, ${playerColor}40)` : "rgba(71, 85, 105, 0.4)",
              border: `2px solid ${active ? playerColor : "rgba(148, 163, 184, 0.3)"}`,
            }}
          >
            <GamePiece player={piece} size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-sm truncate">{label}</h3>
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded-full"
              style={{ background: `${playerColor}20`, color: playerColor }}
            >
              {piece}
            </span>
          </div>
        </div>
        {active && (
          <div className="flex items-center gap-1 justify-center">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: playerColor }} />
            <span className="text-xs font-medium" style={{ color: playerColor }}>
              Your turn
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-slate-900/80 backdrop-blur-lg rounded-2xl border p-5 shadow-2xl transition-all duration-300 ${
        active ? "border-cyan-400/50 ring-2 ring-cyan-400/20 bg-slate-900/90" : "border-slate-700/40"
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: active ? `linear-gradient(135deg, ${playerColor}20, ${playerColor}40)` : "rgba(71, 85, 105, 0.4)",
            border: `2px solid ${active ? playerColor : "rgba(148, 163, 184, 0.3)"}`,
          }}
        >
          <GamePiece player={piece} size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-bold text-lg truncate">{label}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs font-semibold px-2 py-1 rounded-full" style={{ background: `${playerColor}20`, color: playerColor }}>
              Piece {piece}
            </span>
            {active && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: playerColor }} />
                <span className="text-xs font-medium" style={{ color: playerColor }}>
                  Your turn
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      {active && (
        <div className="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full animate-pulse transition-all duration-1000"
            style={{ background: `linear-gradient(90deg, ${playerColor}, ${playerColor}80)`, width: "100%" }}
          />
        </div>
      )}
    </div>
  );
}


