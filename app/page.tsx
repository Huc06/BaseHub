"use client";

import { useEffect, useState } from "react";
import { useMiniKit, useAddFrame } from "@coinbase/onchainkit/minikit";
import Link from "next/link";

export default function App() {
  const { setFrameReady, isFrameReady, context } = useMiniKit();
  const addFrame = useAddFrame();
  const [currentSlide, setCurrentSlide] = useState(0);

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
      title: 'Caro Game',
      subtitle: 'Trò chơi cổ điển',
      description: 'Đặt 5 quân liên tiếp theo hàng ngang, dọc hoặc chéo để giành chiến thắng',
      colors: {
        primary: '#00E6FF',
        secondary: '#FFB020'
      },
      icon: '🎯',
      href: '/caro'
    },
    {
      id: 'word',
      title: 'Nối từ',
      subtitle: 'Thử thách từ vựng',
      description: 'Nhập từ bắt đầu bằng chữ cái cuối của từ trước đó',
      colors: {
        primary: '#9333EA',
        secondary: '#EC4899'
      },
      icon: '🔤',
      href: '/word-chain'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % games.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + games.length) % games.length);
  };

    return (
    <div className="min-h-screen overflow-hidden">
      {/* Caro-style Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1220] to-[#0B0F1A]" />
      <div 
        className="absolute inset-0"
        style={{
          background: "radial-gradient(40% 40% at 5% 5%, rgba(0,230,255,0.12) 0%, rgba(0,0,0,0) 65%), radial-gradient(35% 35% at 100% 100%, rgba(255,176,32,0.12) 0%, rgba(0,0,0,0) 60%)"
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">🎮</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">BaseHub Games</h1>
            <p className="text-white/60 text-sm">
              {context?.user?.displayName ? `Welcome back, ${context.user.displayName}!` : "Choose your game"}
            </p>
          </div>
        </div>
        
        {!context?.client?.added && (
          <button
            onClick={handleAddFrame}
            className="px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all duration-300"
          >
            💾 Save Frame
          </button>
        )}
      </header>

      {/* 3D Diagonal Carousel */}
      <div className="relative h-[75vh] flex items-center justify-center perspective-1000">
        <div className="relative w-full h-full flex items-center justify-center transform-gpu">
          {games.map((game, index) => {
            const offset = index - currentSlide;
            const isActive = offset === 0;
            
            return (
              <div
                key={game.id}
                className="absolute transition-all duration-1000 ease-out transform-gpu backface-hidden"
                style={{
                  transform: `
                    translateX(${offset * 450}px)
                    translateY(${offset * -150}px)
                    translateZ(${isActive ? 50 : -400}px)
                    rotateX(${offset * 15}deg)
                    rotateY(${offset * -30}deg)
                    rotateZ(${offset * 10}deg)
                    scale(${isActive ? 1 : 0.7})
                  `,
                  zIndex: isActive ? 20 : 5,
                  opacity: Math.abs(offset) > 1 ? 0 : 1,
                  filter: `blur(${Math.abs(offset) * 3}px) brightness(${isActive ? 1 : 0.6})`,
                }}
              >
                <div 
                  className="w-96 h-[500px] rounded-3xl backdrop-blur-md overflow-hidden group cursor-pointer transform-gpu shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${game.colors.primary}20, ${game.colors.secondary}20)`,
                    border: `2px solid ${isActive ? game.colors.primary : 'rgba(255,255,255,0.1)'}`,
                    boxShadow: isActive ? `0 0 50px ${game.colors.primary}30` : '0 10px 30px rgba(0,0,0,0.3)'
                  }}
                  onClick={() => setCurrentSlide(index)}
                >
                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-30">
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 20% 20%, ${game.colors.primary}40 0%, transparent 70%)`
                      }}
                    />
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 80% 80%, ${game.colors.secondary}40 0%, transparent 70%)`
                      }}
                    />
                  </div>
                  
                  {/* Card Content */}
                  <div className="relative h-full p-8 flex flex-col justify-between">
                    {/* Icon Section */}
                    <div className="flex justify-center">
                      <div 
                        className={`w-24 h-24 rounded-full flex items-center justify-center mb-8 transition-all duration-500 ${
                          isActive ? 'animate-float' : ''
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${game.colors.primary}30, ${game.colors.secondary}30)`,
                          border: `2px solid ${game.colors.primary}60`,
                          boxShadow: `0 0 30px ${game.colors.primary}40`
                        }}
                      >
                        <span className="text-5xl filter drop-shadow-lg">{game.icon}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-center flex-1">
                      <h3 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">{game.title}</h3>
                      <p className="text-white/90 text-xl mb-6 font-medium">{game.subtitle}</p>
                      <p className="text-white/70 text-sm leading-relaxed px-4">{game.description}</p>
                    </div>

                    {/* Action Button */}
                    <div className="mt-8">
                      {isActive ? (
                        <Link href={game.href}>
                          <button 
                            className="w-full py-4 rounded-2xl text-white font-bold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            style={{
                              background: `linear-gradient(135deg, ${game.colors.primary}, ${game.colors.secondary})`,
                              boxShadow: `0 10px 30px ${game.colors.primary}40`
                            }}
                          >
                            <span className="flex items-center justify-center gap-3 text-lg">
                              Play Now
                              <span className="transform transition-transform group-hover:translate-x-2">→</span>
                            </span>
                          </button>
                        </Link>
                      ) : (
                        <div className="w-full py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white/50 font-semibold text-center">
                          Play Now
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white text-xl hover:bg-white/20 transition-all duration-300 z-30"
        >
          ←
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-12 top-1/2 -translate-y-1/2 w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center text-white text-xl hover:bg-white/20 transition-all duration-300 z-30"
        >
          →
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="relative z-10 flex justify-center gap-4 mt-8">
        {games.map((game, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'scale-125' 
                : 'hover:scale-110'
            }`}
            style={{
              background: index === currentSlide ? game.colors.primary : 'rgba(255,255,255,0.3)',
              boxShadow: index === currentSlide ? `0 0 15px ${game.colors.primary}60` : 'none'
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-12 pb-8 text-center">
        <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
          <span>Built for Farcaster</span>
          <span>•</span>
          <span>Base Sepolia</span>
          <span>•</span>
          <span>Powered by OnchainKit</span>
        </div>
      </footer>
    </div>
  );
}
