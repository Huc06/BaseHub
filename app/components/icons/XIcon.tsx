"use client";

interface XIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function XIcon({ size = 24, color = "#06b6d4", className = "" }: XIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`${className} drop-shadow-sm`}
      style={{ color }}
    >
      <g fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <line 
          x1="6" y1="6" x2="18" y2="18"
          className="animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        />
        <line 
          x1="18" y1="6" x2="6" y2="18"
          className="animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        />
      </g>
      {/* Glow effect */}
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" opacity="0.3">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </g>
    </svg>
  );
}
