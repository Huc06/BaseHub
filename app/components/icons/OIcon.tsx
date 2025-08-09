"use client";

interface OIconProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function OIcon({ size = 24, color = "#facc15", className = "" }: OIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={`${className} drop-shadow-sm`}
      style={{ color }}
    >
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className="animate-scale-in"
        style={{ 
          transformOrigin: "center",
          animationDuration: "0.4s"
        }}
      />
      {/* Glow effect */}
      <circle
        cx="12"
        cy="12"
        r="8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.3"
      />
      {/* Inner highlight */}
      <circle
        cx="12"
        cy="12"
        r="6"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.5"
        opacity="0.2"
      />
    </svg>
  );
}
