"use client";

import { XIcon, OIcon } from "../icons";

interface GamePieceProps {
  player: "X" | "O";
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export default function GamePiece({ player, size = 20, showLabel = false, className = "" }: GamePieceProps) {
  const colors = {
    X: "#06b6d4", // cyan-500
    O: "#facc15"  // yellow-400
  };

  const Icon = player === "X" ? XIcon : OIcon;
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon size={size} color={colors[player]} />
      {showLabel && (
        <span className="font-bold text-white/90">
          {player}
        </span>
      )}
    </div>
  );
}
