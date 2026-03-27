"use client";

interface Props {
  color: string;
  designUrl?: string;
  className?: string;
}

export default function TShirtMockup({ color, designUrl, className = "" }: Props) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 300 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-xl"
      >
        {/* T-shirt shape */}
        <path
          d="M80 20 L40 80 L80 90 L80 280 L220 280 L220 90 L260 80 L220 20 L185 40 C185 40 175 60 150 60 C125 60 115 40 115 40 Z"
          fill={color}
          stroke={color === "#ffffff" ? "#e5e7eb" : "none"}
          strokeWidth="1"
        />
        {/* Collar */}
        <path
          d="M115 40 C115 40 125 60 150 60 C175 60 185 40 185 40"
          fill="none"
          stroke={color === "#ffffff" ? "#d1d5db" : "rgba(0,0,0,0.15)"}
          strokeWidth="2"
        />
        {/* Sleeve lines */}
        <path d="M40 80 L80 90" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        <path d="M220 90 L260 80" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
        {/* Design area */}
        {designUrl && (
          <foreignObject x="100" y="100" width="100" height="100">
            <img
              src={designUrl}
              alt="Design"
              style={{ width: "100%", height: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
            />
          </foreignObject>
        )}
        {!designUrl && (
          <rect x="100" y="100" width="100" height="100" rx="4"
            fill="rgba(0,0,0,0.05)" strokeDasharray="4,4"
            stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
}
