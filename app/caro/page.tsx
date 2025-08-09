"use client";

import { useMemo, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import Link from "next/link";
import Image from "next/image";

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
    <div className="min-h-screen relative">
      <div className="relative w-full h-full p-4">
        {/* Background image */}
        <div className="fixed inset-0 -z-10">
          <Image
            src="/images/bg-caro.png"
            alt="Caro game background"
            fill
            className="object-cover"
            priority
          />
          {/* Optional overlay for better readability */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

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

                 {/* Mobile Layout */}
         <div className="block lg:hidden">
           {/* Mobile Players Row */}
           <div className="grid grid-cols-2 gap-3 mb-6">
              <PlayerCard label="You" piece="X" active={current === "X" && !winner} mobile />
              <PlayerCard label="Opponent" piece="O" active={current === "O" && !winner} mobile />
           </div>

           {/* Mobile Game Board */}
           <div className="mb-6">
             <div className="bg-slate-900/80 backdrop-blur-sm rounded-2xl border border-cyan-500/20 p-3 shadow-2xl">
               {/* Mobile Header */}
               <div className="text-center mb-3">
                 <div className="text-white/60 text-xs mb-1">ELO 1320</div>
                 {winner ? (
                   <div 
                     className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white text-sm"
                     style={{
                       background: "linear-gradient(90deg, #00E6FF 0%, #FFB020 100%)",
                       boxShadow: "0 0 16px rgba(0,230,255,.3)",
                     }}
                   >
                      🎉 Victory!
                   </div>
                 ) : isDraw ? (
                    <div className="text-white/80 font-medium text-sm">Draw</div>
                 ) : (
                   <div className="text-white/80 font-medium text-sm">
                      Turn: {current === "X" ? "You" : "Opponent"}
                   </div>
                 )}
               </div>

               {/* Mobile Board */}
               <div className="flex justify-center mb-4">
                 <div className="relative">
                   <div className="bg-slate-800/60 rounded-xl p-1 border border-slate-700/50">
                     <div
                       className="grid rounded-lg overflow-hidden"
                       style={{ 
                         gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                         gap: '1px',
                         width: '300px',
                         height: '300px'
                       }}
                     >
                       {board.map((row, r) =>
                         row.map((cell, c) => {
                           const isWinCell = winningLine?.some((p) => p.r === r && p.c === c);
                           return (
                             <button
                               key={`${r}-${c}`}
                               onClick={() => handleClick(r, c)}
                               className={`
                                 relative flex items-center justify-center
                                 bg-slate-700/40 active:bg-slate-600/70
                                 border-0 transition-all duration-150
                                 ${!cell && !winner ? "active:scale-95" : ""}
                                 ${winner && !cell ? "cursor-not-allowed opacity-50" : ""}
                                 ${isWinCell ? "bg-gradient-to-br from-cyan-400/40 to-amber-400/40" : ""}
                               `}
                               disabled={!!(winner || cell)}
                               style={{
                                 width: '20px',
                                 height: '20px'
                               }}
                             >
                               {cell === "X" && <GamePiece player="X" size={14} />}
                               {cell === "O" && <GamePiece player="O" size={14} />}
                               
                               {!cell && !winner && (
                                 <div className="absolute inset-0 opacity-0 active:opacity-30 bg-white/20 transition-opacity duration-100" />
                               )}
                             </button>
                           );
                         })
                       )}
                     </div>
                   </div>

                   {/* Mobile Victory Overlay */}
                   {winner && (
                     <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-xl flex items-center justify-center">
                       <div className="text-center px-4">
                         <div className="text-3xl mb-2">🎉</div>
                         <div 
                           className="px-4 py-2 rounded-lg text-white text-sm font-bold"
                           style={{
                             background: "linear-gradient(135deg, #00E6FF 0%, #FFB020 100%)",
                           }}
                         >
                            {winner === "X" ? "You win!" : "Opponent wins!"}
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               </div>

               {/* Mobile Actions */}
               <div className="flex gap-2">
                 <button
                   onClick={reset}
                   className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg font-medium text-white text-sm transition-all duration-200"
                   style={{
                     background: "linear-gradient(135deg, #00E6FF 0%, #0099CC 100%)",
                   }}
                 >
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                    Play Again
                 </button>
                 <button className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg font-medium text-white/90 bg-slate-800/60 border border-slate-600/50 text-sm transition-all duration-200">
                   <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                   </svg>
                    Resign
                 </button>
               </div>
             </div>
           </div>

           {/* Mobile Move History */}
           <div>
             <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-cyan-500/20 p-4 shadow-2xl">
               <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                 <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                 </svg>
                  Move History
               </h3>
               <div className="space-y-2 max-h-40 overflow-y-auto">
                 {moveHistory.length === 0 ? (
                   <div className="text-center py-6">
                     <div className="text-2xl mb-2 opacity-50">📝</div>
                     <div className="text-white/60 text-xs">Chưa có nước đi nào</div>
                   </div>
                 ) : (
                   moveHistory.map((m, i) => (
                     <div 
                       key={i} 
                       className="flex items-center justify-between p-2 rounded-lg bg-slate-800/40 text-xs"
                     >
                       <div className="flex items-center gap-2">
                         <span className="text-cyan-400 font-mono font-bold w-6">
                           {i + 1}
                         </span>
                         <GamePiece player={m.player} size={12} />
                         <span className="text-white font-medium">{m.move}</span>
                       </div>
                       <span 
                         className="text-xs font-semibold px-1.5 py-0.5 rounded-full"
                         style={{
                           background: m.player === 'X' ? 'rgba(0,230,255,0.2)' : 'rgba(255,176,32,0.2)',
                           color: m.player === 'X' ? '#00E6FF' : '#FFB020'
                         }}
                       >
                         {m.player}
                       </span>
                     </div>
                   ))
                 )}
               </div>
             </div>
           </div>
         </div>

         {/* Desktop Layout */}
         <div className="hidden lg:grid grid-cols-12 gap-4">
           {/* Left: Players */}
           <div className="col-span-12 md:col-span-3 space-y-4">
              <PlayerCard label="You" piece="X" active={current === "X" && !winner} />
              <PlayerCard label="Opponent" piece="O" active={current === "O" && !winner} />
           </div>

           {/* Center: Board */}
           <div className="col-span-12 md:col-span-6">
             <div className="bg-slate-900/80 backdrop-blur-sm rounded-3xl border border-cyan-500/20 p-6 shadow-2xl">
               {/* Header */}
               <div className="text-center mb-6">
                 <div className="text-white/60 text-sm mb-1">ELO 1320</div>
                 {winner ? (
                   <div 
                     className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl font-bold text-white"
                     style={{
                       background: "linear-gradient(135deg, #00E6FF 0%, #FFB020 100%)",
                       boxShadow: "0 0 40px rgba(0,230,255,0.4)"
                     }}
                   >
                      <span>🎉 Victory!</span>
                   </div>
                 ) : isDraw ? (
                   <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-white bg-white/20">
                      <span>Draw</span>
                   </div>
                 ) : (
                   <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-medium text-white bg-white/10">
                     <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
                      <span>Turn: {current === "X" ? "You" : "Opponent"}</span>
                   </div>
                 )}
               </div>

               {/* Desktop Board */}
               <div className="flex justify-center">
                 <div className="relative">
                   <div className="bg-slate-800/60 rounded-2xl p-4 border border-slate-700/50">
                     <div
                       className="grid rounded-xl overflow-hidden"
                       style={{ 
                         gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                         gap: '1px',
                         width: '480px',
                         height: '480px'
                       }}
                     >
                       {board.map((row, r) =>
                         row.map((cell, c) => {
                           const isWinCell = winningLine?.some((p) => p.r === r && p.c === c);
                           return (
                             <button
                               key={`${r}-${c}`}
                               onClick={() => handleClick(r, c)}
                               className={`
                                 relative flex items-center justify-center
                                 bg-slate-700/40 hover:bg-slate-600/60
                                 border border-slate-600/30
                                 transition-all duration-200
                                 ${!cell && !winner ? "hover:scale-[1.02] hover:shadow-lg hover:border-cyan-400/40" : ""}
                                 ${winner && !cell ? "cursor-not-allowed opacity-50" : ""}
                                 ${isWinCell ? "bg-gradient-to-br from-cyan-400/30 to-amber-400/30 ring-2 ring-amber-400/60 shadow-lg" : ""}
                               `}
                               disabled={!!(winner || cell)}
                               style={{
                                 minWidth: '30px',
                                 minHeight: '30px',
                                 maxWidth: '32px',
                                 maxHeight: '32px'
                               }}
                             >
                               {cell === "X" && (
                                 <div className="flex items-center justify-center w-full h-full">
                                   <GamePiece player="X" size={22} />
                                 </div>
                               )}
                               {cell === "O" && (
                                 <div className="flex items-center justify-center w-full h-full">
                                   <GamePiece player="O" size={22} />
                                 </div>
                               )}
                               
                               {!cell && !winner && (
                                 <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-gradient-to-br from-cyan-400/20 to-amber-400/20 rounded transition-opacity duration-200" />
                               )}

                               {!cell && !winner && (
                                 <div className="absolute inset-0 opacity-0 active:opacity-50 bg-white/20 rounded transition-opacity duration-75" />
                               )}
                             </button>
                           );
                         })
                       )}
                     </div>
                   </div>

                   {/* Desktop Victory Overlay */}
                   {winner && (
                     <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                       <div className="text-center">
                         <div className="text-6xl mb-4">🎉</div>
                         <div 
                           className="px-8 py-4 rounded-2xl text-white text-xl font-bold shadow-2xl"
                           style={{
                             background: "linear-gradient(135deg, #00E6FF 0%, #FFB020 100%)",
                             boxShadow: "0 0 40px rgba(0,230,255,0.4)"
                           }}
                         >
                            {winner === "X" ? "🎯 You win!" : "🎯 Opponent wins!"}
                         </div>
                         <div className="text-white/80 text-sm mt-3">
                            Congratulations!
                         </div>
                       </div>
                     </div>
                   )}
                 </div>
               </div>

               {/* Desktop Actions */}
               <div className="flex justify-center gap-4 mt-8">
                 <button
                   onClick={reset}
                   className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                   style={{
                     background: "linear-gradient(135deg, #00E6FF 0%, #0099CC 100%)",
                     boxShadow: "0 4px 20px rgba(0,230,255,0.3)"
                   }}
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                   </svg>
                    Play Again
                 </button>
                 <button 
                   className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white/90 bg-slate-800/60 hover:bg-slate-700/80 border border-slate-600/50 hover:border-slate-500/70 transition-all duration-200 transform hover:scale-105 shadow-lg backdrop-blur-sm"
                 >
                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                   </svg>
                    Resign
                 </button>
               </div>
             </div>
           </div>

           {/* Right: Move history */}
           <div className="col-span-12 md:col-span-3">
             <div className="bg-slate-900/80 backdrop-blur-lg rounded-2xl border border-cyan-500/20 p-6 shadow-2xl">
               <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Move History
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
                {moveHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3 opacity-50">📝</div>
                    <div className="text-white/60 text-sm">No moves yet</div>
                    <div className="text-white/40 text-xs mt-1">Start playing to see history</div>
                  </div>
                ) : (
                  moveHistory.map((m, i) => (
                    <div 
                      key={i} 
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-800/40 hover:bg-slate-700/50 transition-colors border border-slate-700/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 text-sm font-mono font-bold w-8 text-center">
                          {i + 1}
                        </span>
                        <div className="w-6 h-6 flex items-center justify-center">
                          <GamePiece player={m.player} size={16} />
                        </div>
                        <span className="text-white font-medium">{m.move}</span>
                      </div>
                      <span 
                        className="text-xs font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: m.player === 'X' ? 'rgba(0,230,255,0.2)' : 'rgba(255,176,32,0.2)',
                          color: m.player === 'X' ? '#00E6FF' : '#FFB020'
                        }}
                      >
                        {m.player}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// UI Components
function PlayerCard({ label, piece, active, mobile }: { label: string; piece: Player; active?: boolean; mobile?: boolean }) {
  const isX = piece === "X";
  const playerColor = isX ? "#00E6FF" : "#FFB020";
  
  if (mobile) {
    return (
      <div 
        className={`bg-slate-900/80 backdrop-blur-lg rounded-xl border p-3 shadow-xl transition-all duration-300 ${
          active 
            ? 'border-cyan-400/50 ring-1 ring-cyan-400/20 bg-slate-900/90' 
            : 'border-slate-700/40'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center shadow-lg"
            style={{
              background: active 
                ? `linear-gradient(135deg, ${playerColor}20, ${playerColor}40)`
                : 'rgba(71, 85, 105, 0.4)',
              border: `2px solid ${active ? playerColor : 'rgba(148, 163, 184, 0.3)'}`
            }}
          >
            <GamePiece player={piece} size={16} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-semibold text-sm truncate">{label}</h3>
            <span 
              className="text-xs font-medium px-1.5 py-0.5 rounded-full"
              style={{
                background: `${playerColor}20`,
                color: playerColor
              }}
            >
              {piece}
            </span>
          </div>
        </div>
        
        {active && (
          <div className="flex items-center gap-1 justify-center">
            <div 
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: playerColor }}
            />
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
        active 
          ? 'border-cyan-400/50 ring-2 ring-cyan-400/20 bg-slate-900/90' 
          : 'border-slate-700/40'
      }`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div 
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
          style={{
            background: active 
              ? `linear-gradient(135deg, ${playerColor}20, ${playerColor}40)`
              : 'rgba(71, 85, 105, 0.4)',
            border: `2px solid ${active ? playerColor : 'rgba(148, 163, 184, 0.3)'}`
          }}
        >
          <GamePiece player={piece} size={24} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-bold text-lg truncate">{label}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span 
              className="text-xs font-semibold px-2 py-1 rounded-full"
              style={{
                background: `${playerColor}20`,
                color: playerColor
              }}
            >
              Piece {piece}
            </span>
            {active && (
              <div className="flex items-center gap-1">
                <div 
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: playerColor }}
                />
                <span className="text-xs font-medium" style={{ color: playerColor }}>
                  Your turn
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Active Progress Bar */}
      {active && (
        <div className="w-full h-2 bg-slate-800/60 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full animate-pulse transition-all duration-1000"
            style={{ 
              background: `linear-gradient(90deg, ${playerColor}, ${playerColor}80)`,
              width: "100%"
            }} 
          />
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

